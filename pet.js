/**
 * 桌面宠物 - 全状态动画版
 * 每个动作都有独立帧组，不再使用 setIgnoreMouseEvents
 * 用 CSS pointer-events 控制穿透
 */
class DesktopPet {
  constructor() {
    this.pet = document.getElementById('pet');
    this.petInner = document.getElementById('pet-inner');
    this.canvas = document.getElementById('pet-canvas');
    this.overlay = document.getElementById('overlay');
    this.speechBubble = document.getElementById('speech-bubble');
    this.bubbleText = document.getElementById('bubble-text');
    this.contextMenu = document.getElementById('context-menu');

    this.state = 'idle';
    this.direction = -1;
    this.walkSpeed = 1.5;
    // 工作区坐标（含任务栏偏移）
    this.workArea = { x: 0, y: 0, width: 1920, height: 1080 };
    this.windowX = 0;
    this.windowY = 0;

    this.WIN_W = 400;
    this.WIN_H = 350;

    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.walkTimer = null;
    this.stateTimer = null;
    this.bubbleTimer = null;
    this.menuVisible = false;

    this.frames = {};
    this.animFrameIndex = 0;
    this.animFrameTimer = null;
    this.ctx = this.canvas.getContext('2d');

    this.idleMessages = [
      '喵~ 你好呀！', '今天也要加油哦！', '摸摸我嘛~',
      '嘿嘿，在干嘛？', '好无聊啊...', '(｡◕‿◕｡)',
      '想吃小鱼干~', '陪我玩嘛！', '你是最棒的！✨', '喵呜~♪',
    ];

    this.init();
  }

  async init() {
    // === 加载全部帧 ===
    // 站立/待机
    this.frames.front = await this.loadAndRemoveGreen('./assets/cat-main.png');

    // 向左走 4 帧
    this.frames.walkLeft = [
      await this.loadAndRemoveGreen('./assets/cat-walk-1.png'),
      await this.loadAndRemoveGreen('./assets/cat-walk-2.png'),
      await this.loadAndRemoveGreen('./assets/cat-walk-3.png'),
      await this.loadAndRemoveGreen('./assets/cat-walk-4.png'),
    ];
    // 向右走 = 左走镜像
    this.frames.walkRight = this.frames.walkLeft.map(f => this.mirrorFrame(f));

    // 开心/摸摸头
    this.frames.happy = await this.loadAndRemoveGreen('./assets/cat-happy.png');

    // 吃东西 2 帧
    this.frames.eating = [
      await this.loadAndRemoveGreen('./assets/cat-eat-1.png'),
      await this.loadAndRemoveGreen('./assets/cat-eat-2.png'),
    ];

    // 睡觉 2 帧
    this.frames.sleeping = [
      await this.loadAndRemoveGreen('./assets/cat-sleep-1.png'),
      await this.loadAndRemoveGreen('./assets/cat-sleep-2.png'),
    ];

    // 跳舞 3 帧
    this.frames.dancing = [
      await this.loadAndRemoveGreen('./assets/cat-dance-1.png'),
      await this.loadAndRemoveGreen('./assets/cat-dance-2.png'),
      await this.loadAndRemoveGreen('./assets/cat-dance-3.png'),
    ];

    // 玩耍 4 帧
    this.frames.playing = [
      await this.loadAndRemoveGreen('./assets/cat-play-1.png'),
      await this.loadAndRemoveGreen('./assets/cat-play-2.png'),
      await this.loadAndRemoveGreen('./assets/cat-play-3.png'),
      await this.loadAndRemoveGreen('./assets/cat-play-4.png'),
    ];

    // 被拖拽
    this.frames.dragging = await this.loadAndRemoveGreen('./assets/cat-drag.png');

    this.showFrame(this.frames.front);

    const screenInfo = await window.electronAPI.getScreenInfo();
    this.workArea = screenInfo.workArea;
    const pos = await window.electronAPI.getWindowPosition();
    this.windowX = pos.x;
    this.windowY = pos.y;

    window.electronAPI.onScreenInfo((d) => {
      this.workArea = d.workArea;
      // 屏幕信息更新后立即检查边界
      this.ensureInBounds();
    });
    window.electronAPI.onResetPosition(() => {
      this.windowX = Math.floor(this.workArea.x + this.workArea.width / 2 - this.WIN_W / 2);
      this.windowY = this.workArea.y + this.workArea.height - this.WIN_H;
      window.electronAPI.setWindowPosition(this.windowX, this.windowY);
      this.setState('idle');
    });

    this.bindEvents();
    this.setState('idle');
    this.startBehaviorLoop();
    this.startSafetyCheck(); // 安全边界检查
    setTimeout(() => this.showBubble('喵~ 我来啦！🐱'), 800);
  }

  loadAndRemoveGreen(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        const id = cx.getImageData(0, 0, img.width, img.height);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i+1], b = d[i+2];
          if (g > 100 && g > r * 1.3 && g > b * 1.3) {
            const gn = (g - Math.max(r, b)) / g;
            if (gn > 0.15) {
              const a = Math.max(0, 1 - gn * 2.2);
              d[i+3] = Math.round(a * 255);
              if (a > 0) {
                d[i]   = Math.min(255, Math.round(r / Math.max(a, 0.3)));
                d[i+2] = Math.min(255, Math.round(b / Math.max(a, 0.3)));
              }
            }
          }
        }
        for (let y = 1; y < img.height-1; y++) {
          for (let x = 1; x < img.width-1; x++) {
            const idx = (y*img.width+x)*4;
            if (d[idx+3] > 0 && d[idx+3] < 230) {
              let s=0, n=0;
              for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
                s += d[((y+dy)*img.width+(x+dx))*4+3]; n++;
              }
              d[idx+3] = Math.round(s/n);
            }
          }
        }
        cx.putImageData(id, 0, 0);
        resolve({ canvas: c, w: img.width, h: img.height });
      };
      img.src = src;
    });
  }

  mirrorFrame(frame) {
    const c = document.createElement('canvas');
    c.width = frame.w; c.height = frame.h;
    const cx = c.getContext('2d');
    cx.translate(frame.w, 0);
    cx.scale(-1, 1);
    cx.drawImage(frame.canvas, 0, 0);
    return { canvas: c, w: frame.w, h: frame.h };
  }

  showFrame(frame) {
    this.canvas.width = frame.w;
    this.canvas.height = frame.h;
    this.ctx.clearRect(0, 0, frame.w, frame.h);
    this.ctx.drawImage(frame.canvas, 0, 0);
  }

  getWalkFrames() {
    return this.direction === -1 ? this.frames.walkLeft : this.frames.walkRight;
  }

  bindEvents() {
    this.pet.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.startDrag(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.onDrag(e);
    });
    document.addEventListener('mouseup', () => {
      if (this.isDragging) this.endDrag();
    });
    this.pet.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });
    document.addEventListener('click', (e) => {
      if (this.menuVisible && !this.contextMenu.contains(e.target)) {
        this.hideContextMenu();
      }
    });
    this.contextMenu.querySelectorAll('.menu-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.hideContextMenu();
        this.handleAction(item.dataset.action);
      });
    });
    this.pet.addEventListener('dblclick', () => {
      this.showBubble(this.idleMessages[Math.floor(Math.random()*this.idleMessages.length)]);
    });
  }

  setState(newState) {
    this.pet.classList.remove('idle','walking','sleeping','happy','eating','dancing','playing','dragging');
    this.stopAnimFrames();
    this.stopWalking();
    this.clearOverlay();
    this.state = newState;
    this.pet.classList.add(newState);

    switch (newState) {
      case 'walking':
        this.startWalking();
        this.startAnimLoop(this.getWalkFrames(), 200);
        break;
      case 'sleeping':
        this.startAnimLoop(this.frames.sleeping, 800); // 慢呼吸节奏
        break;
      case 'happy':
        this.showFrame(this.frames.happy);
        break;
      case 'eating':
        this.startAnimLoop(this.frames.eating, 400);
        break;
      case 'dancing':
        this.startAnimLoop(this.frames.dancing, 300);
        break;
      case 'playing':
        this.startAnimLoop(this.frames.playing, 500);
        break;
      case 'dragging':
        this.showFrame(this.frames.dragging);
        break;
      default: // idle
        this.showFrame(this.frames.front);
        break;
    }
  }

  // 通用帧动画循环
  startAnimLoop(frameArray, interval) {
    this.animFrameIndex = 0;
    this.showFrame(frameArray[0]);
    this.animFrameTimer = setInterval(() => {
      this.animFrameIndex = (this.animFrameIndex + 1) % frameArray.length;
      this.showFrame(frameArray[this.animFrameIndex]);
    }, interval);
  }
  stopAnimFrames() {
    if (this.animFrameTimer) { clearInterval(this.animFrameTimer); this.animFrameTimer = null; }
  }

  clearOverlay() { this.overlay.innerHTML = ''; }

  spawnParticle(emoji, cls) {
    const el = document.createElement('span');
    el.className = `particle ${cls}`;
    el.textContent = emoji;
    el.style.left = `${50+(Math.random()-0.5)*80}px`;
    el.style.top = `${10+Math.random()*40}px`;
    el.style.fontSize = `${16+Math.random()*8}px`;
    this.pet.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
  spawnMulti(emoji, cls, n, gap=180) {
    for (let i = 0; i < n; i++) setTimeout(() => this.spawnParticle(emoji, cls), i*gap);
  }

  startBehaviorLoop() { this.scheduleNext(); }
  scheduleNext() {
    if (this.stateTimer) clearTimeout(this.stateTimer);
    this.stateTimer = setTimeout(() => {
      if (this.state === 'dragging') { this.scheduleNext(); return; }
      const pool = this.state === 'idle' ? ['walk','walk','walk','talk','sleep','idle']
        : this.state === 'walking' ? ['idle','idle','talk']
        : ['idle','walk'];
      const next = pool[Math.floor(Math.random()*pool.length)];

      if (next === 'walk') {
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.setState('walking');
        setTimeout(() => { if (this.state === 'walking') this.setState('idle'); }, 5000+Math.random()*8000);
      } else if (next === 'sleep') {
        this.setState('sleeping'); this.showBubble('困了...💤');
        setTimeout(() => { if (this.state === 'sleeping') { this.setState('idle'); this.showBubble('睡醒啦！☀️'); } }, 12000+Math.random()*8000);
      } else if (next === 'talk') {
        this.showBubble(this.idleMessages[Math.floor(Math.random()*this.idleMessages.length)]);
      } else { this.setState('idle'); }
      this.scheduleNext();
    }, 5000+Math.random()*8000);
  }

  // 工作区边界计算
  get minX() { return this.workArea.x; }
  get maxX() { return this.workArea.x + this.workArea.width - this.WIN_W; }
  get minY() { return this.workArea.y; }
  get maxY() { return this.workArea.y + this.workArea.height - this.WIN_H; }
  get groundY() { return this.maxY; } // 地面 = 工作区底部

  // 安全边界检查：确保宠物始终在屏幕内
  ensureInBounds() {
    let changed = false;
    if (this.windowX < this.minX) { this.windowX = this.minX; changed = true; }
    if (this.windowX > this.maxX) { this.windowX = this.maxX; changed = true; }
    if (this.windowY < this.minY) { this.windowY = this.minY; changed = true; }
    if (this.windowY > this.maxY) { this.windowY = this.maxY; changed = true; }
    if (changed) window.electronAPI.setWindowPosition(this.windowX, this.windowY);
    return changed;
  }

  // 每5秒检查一次宠物是否在屏幕内
  startSafetyCheck() {
    setInterval(() => {
      if (this.isDragging) return;
      if (this.ensureInBounds() && this.state !== 'idle') {
        this.setState('idle');
        this.showBubble('差点走丢了！😮‍💨', 2000);
      }
    }, 5000);
  }

  startWalking() {
    this.stopWalking();
    this.walkTimer = setInterval(() => {
      if (this.state !== 'walking') { this.stopWalking(); return; }
      this.windowX += this.walkSpeed * this.direction;

      if (this.windowX <= this.minX) {
        this.windowX = this.minX; this.direction = 1;
        this.stopAnimFrames(); this.startAnimLoop(this.getWalkFrames(), 200);
      } else if (this.windowX >= this.maxX) {
        this.windowX = this.maxX; this.direction = -1;
        this.stopAnimFrames(); this.startAnimLoop(this.getWalkFrames(), 200);
      }
      window.electronAPI.setWindowPosition(this.windowX, this.windowY);
    }, 16);
  }
  stopWalking() { if (this.walkTimer) { clearInterval(this.walkTimer); this.walkTimer = null; } }

  startDrag(e) {
    this.isDragging = true;
    this.lastMouseX = e.screenX; this.lastMouseY = e.screenY;
    this.setState('dragging'); this.showBubble('哇啊啊！🙀');
  }
  onDrag(e) {
    const dx = e.screenX-this.lastMouseX, dy = e.screenY-this.lastMouseY;
    this.lastMouseX = e.screenX; this.lastMouseY = e.screenY;
    this.windowX += dx; this.windowY += dy;
    // 拖拽时限制在工作区内
    this.windowX = Math.max(this.minX, Math.min(this.windowX, this.maxX));
    this.windowY = Math.max(this.minY, Math.min(this.windowY, this.maxY));
    window.electronAPI.setWindowPosition(this.windowX, this.windowY);
  }
  endDrag() {
    this.isDragging = false; this.hideBubble();
    if (this.windowY < this.groundY) this.animateFall(this.groundY);
    else { this.setState('idle'); this.showBubble('好险...😮‍💨', 2000); }
  }
  animateFall(ty) {
    let v = 0;
    let frames = 0;
    const maxFrames = 300; // 安全保护：最多5秒（60fps×5s）
    const fall = () => {
      frames++;
      v += 0.8;
      v = Math.min(v, 20); // 最大速度限制
      this.windowY += v;
      if (this.windowY >= ty || frames >= maxFrames) {
        this.windowY = Math.min(this.windowY, ty); // 确保不超过地面
        if (Math.abs(v) > 2 && frames < maxFrames) {
          v *= -0.4;
          window.electronAPI.setWindowPosition(this.windowX, this.windowY);
          requestAnimationFrame(fall);
          return;
        }
        this.windowY = ty;
        window.electronAPI.setWindowPosition(this.windowX, this.windowY);
        this.setState('idle'); this.showBubble('落地啦！😵‍💫', 2000); return;
      }
      window.electronAPI.setWindowPosition(this.windowX, this.windowY);
      requestAnimationFrame(fall);
    };
    requestAnimationFrame(fall);
  }

  handleAction(a) {
    const acts = {
      pet: () => {
        this.setState('happy');
        this.showBubble('好舒服喵~ ❤️');
        this.spawnMulti('❤️','heart',5);
        setTimeout(() => { if (this.state==='happy') this.setState('idle'); }, 6000);
      },
      feed: () => {
        this.setState('eating');
        this.showBubble('好好吃！🐟');
        this.spawnMulti('🐟','fish',3,250);
        setTimeout(() => {
          if (this.state==='eating') {
            this.setState('idle');
            this.showBubble('吃饱啦~ 😋', 2000);
          }
        }, 6000);
      },
      play: () => {
        this.setState('playing');
        this.showBubble('玩毛线球！🧶');
        this.spawnMulti('🧶','yarn',3,400);
        setTimeout(() => {
          if (this.state==='playing') {
            this.setState('idle');
            this.showBubble('好累啊...被缠住了😸', 2000);
          }
        }, 10000);
      },
      sleep: () => {
        this.setState('sleeping');
        this.showBubble('晚安~ 💤', 3000);
        setTimeout(() => {
          if (this.state==='sleeping') {
            this.setState('idle');
            this.showBubble('睡醒啦！✨', 2000);
          }
        }, 15000);
      },
      dance: () => {
        this.setState('dancing');
        this.showBubble('♪ ♫ ♬ 跳舞啦！💃');
        this.spawnMulti('♪','note',6,350);
        setTimeout(() => {
          if (this.state==='dancing') {
            this.setState('idle');
            this.showBubble('跳完啦！好开心~', 2000);
          }
        }, 10000);
      },
    };
    if (acts[a]) acts[a]();
  }

  showBubble(t, dur=3000) {
    if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
    this.bubbleText.textContent = t;
    this.speechBubble.classList.remove('hidden');
    this.bubbleTimer = setTimeout(() => this.hideBubble(), dur);
  }
  hideBubble() {
    this.speechBubble.classList.add('hidden');
    if (this.bubbleTimer) { clearTimeout(this.bubbleTimer); this.bubbleTimer = null; }
  }
  showContextMenu(x, y) {
    this.contextMenu.classList.remove('hidden');
    this.menuVisible = true;
    const menuH = this.contextMenu.offsetHeight;
    const menuW = this.contextMenu.offsetWidth;
    const left = Math.min(x, this.WIN_W - menuW - 5);
    const top = Math.max(5, y - menuH);
    this.contextMenu.style.left = `${left}px`;
    this.contextMenu.style.top = `${top}px`;
  }
  hideContextMenu() {
    this.contextMenu.classList.add('hidden');
    this.menuVisible = false;
  }
}

window.addEventListener('DOMContentLoaded', () => new DesktopPet());
