<p align="center">
  <img src="assets/cat-main.png" width="120" alt="Desktop Pet">
</p>

<h1 align="center">🐱 Desktop Pet</h1>

<p align="center">
  <strong>A cute desktop cat companion that walks, plays, sleeps, and dances on your screen</strong>
</p>

<p align="center">
  <a href="#-english">English</a> | <a href="#-中文">中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-35-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/Version-1.0.0-orange" alt="Version">
</p>

<p align="center">
  <img src="assets/preview.png" width="600" alt="Desktop Pet Preview">
</p>

---

## 🇬🇧 English

### ✨ Features

- 🐱 **Adorable Cat** — Cream-colored chibi kitten with a red bow tie
- 🚶 **Auto Walking** — Patrols left and right along the bottom of your screen
- 🖱️ **Drag & Drop** — Grab and toss with physics-based gravity and bounce
- 💬 **Chat Bubbles** — Double-click for random cute dialogues
- 🎭 **Rich Animations** — 8 unique states with dedicated sprite frames
- 👻 **Fully Transparent** — Clicks pass through to your desktop in empty areas
- 📌 **System Tray** — Minimal footprint, manage from tray icon
- 🛡️ **Anti-Lost** — Smart boundary detection across any screen resolution

### 🎭 Animation States

| State | Trigger | Frames | Description |
|-------|---------|--------|-------------|
| 🧍 Idle | Default | 1 | Standing front-facing |
| 🚶 Walk | Auto | 4 | Side-view walk cycle (mirrored L/R) |
| 😊 Happy | Right-click → Pet | 1 | Squinting smile with hearts |
| 🐟 Eat | Right-click → Feed | 2 | Grabbing fish → chomping |
| 🧶 Play | Right-click → Play | 4 | Crouch → swipe → hug yarn → tangled |
| 💤 Sleep | Right-click → Sleep | 2 | Slow breathing rhythm |
| 💃 Dance | Right-click → Dance | 3 | Left sway → arms up → right sway |
| 😱 Drag | Mouse drag | 1 | Startled expression |

### 🚀 Quick Start

#### Option 1: Download (Recommended)

Go to [Releases](../../releases) and download the latest build for your OS.

#### Option 2: Run from Source

```bash
git clone https://github.com/booleamu/DesktopPet.git
cd DesktopPet
npm install
npm start
```

#### Option 3: Build Yourself

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### 🎮 Controls

| Action | Effect |
|--------|--------|
| **Double-click** pet | Random chat bubble |
| **Right-click** pet | Action menu (Pet / Feed / Play / Sleep / Dance) |
| **Left-drag** pet | Pick up; drops with gravity on release |
| **Right-click** tray icon | Pin to top / Reset position / Quit |

### 📁 Project Structure

```
DesktopPet/
├── assets/                # Sprite assets (19 PNG frames)
│   ├── cat-main.png       # Idle front-facing
│   ├── cat-walk-1~4.png   # Walk cycle
│   ├── cat-happy.png      # Happy expression
│   ├── cat-eat-1~2.png    # Eating frames
│   ├── cat-play-1~4.png   # Playing with yarn
│   ├── cat-sleep-1~2.png  # Sleeping frames
│   ├── cat-dance-1~3.png  # Dancing frames
│   ├── cat-drag.png       # Dragged expression
│   └── tray-icon.png      # System tray icon
├── main.js                # Electron main process
├── preload.js             # Preload script (IPC bridge)
├── index.html             # Page structure
├── style.css              # Styles + CSS click-through
├── pet.js                 # Core logic (state machine + animation)
└── package.json           # Project config
```

### 🏗️ Tech Stack

- **Electron 35** — Cross-platform desktop framework
- **Canvas 2D** — Runtime green-screen removal + frame animation
- **CSS pointer-events** — Click passthrough (replaces `setIgnoreMouseEvents`)
- **GitHub Actions** — Automated cross-platform CI/CD builds

### 🎨 Customize Your Pet

Want a different character? Replace the PNGs in `assets/`:

1. **Format**: PNG with solid green (#00FF00) background
2. **Size**: 512×512 or larger (auto-scaled)
3. **Naming**: Keep existing filenames

Recommended: Use [Nano Banana](https://nanobanana.ai) for consistent AI-generated character art.

### 🤝 Contributing

PRs welcome! Some ideas:

- [ ] 🐶 More pet characters
- [ ] 🎵 Sound effects
- [ ] ⚙️ Settings panel (speed / size / custom dialogue)
- [ ] 🖥️ Multi-monitor support
- [ ] 🧩 Plugin system

---

## 🇨🇳 中文

### ✨ 功能特点

- 🐱 **可爱猫咪** — 奶油色小猫，红蝴蝶结，超萌立绘
- 🚶 **自主行走** — 在屏幕底部左右巡逻，到达边界自动转向
- 🖱️ **拖拽互动** — 鼠标拖拽到空中松手会有重力下落 + 弹跳效果
- 💬 **随机对话** — 双击触发随机气泡对话，萌系语录
- 🎭 **丰富表情** — 8 种独立状态动画，每种都有专属帧组
- 👻 **完美透明** — 窗口完全透明，宠物区域外的点击直接穿透到桌面
- 📌 **系统托盘** — 不占用任务栏，右键托盘图标管理
- 🛡️ **防走丢** — 智能边界检测，即使切换分辨率也不会跑出屏幕

### 🎭 状态动画一览

| 状态 | 触发方式 | 帧数 | 描述 |
|------|---------|------|------|
| 🧍 待机 | 默认 | 1 帧 | 正面站立，等待互动 |
| 🚶 走路 | 自动 / 玩耍 | 4 帧 | 侧面行走，左右镜像 |
| 😊 开心 | 右键 → 摸摸头 | 1 帧 | 眯眼微笑，爱心腮红 |
| 🐟 吃东西 | 右键 → 喂食 | 2 帧 | 拿鱼 → 大口吃 |
| 🧶 玩耍 | 右键 → 玩耍 | 4 帧 | 蹲伏 → 拍打 → 抱球 → 被缠住 |
| 💤 睡觉 | 右键 → 睡觉 | 2 帧 | Zzz 慢呼吸节奏 |
| 💃 跳舞 | 右键 → 跳舞 | 3 帧 | 左摆 → 举手 → 右摆 |
| 😱 被拖拽 | 鼠标拖拽 | 1 帧 | 惊恐张嘴，四肢张开 |

### 🚀 快速开始

#### 方式一：下载可执行文件（推荐）

前往 [Releases](../../releases) 页面下载最新版本。

| 平台 | 文件格式 | 说明 |
|------|---------|------|
| 🪟 Windows | `.exe` (Setup) | 安装版 |
| 🪟 Windows | `.exe` (Portable) | 便携版，免安装 |
| 🍎 macOS | `.dmg` | 支持 Intel 和 Apple Silicon |
| 🐧 Linux | `.AppImage` | 免安装通用包 |
| 🐧 Linux | `.deb` | Debian/Ubuntu 安装包 |

#### 方式二：从源码运行

```bash
git clone https://github.com/booleamu/DesktopPet.git
cd DesktopPet
npm install
npm start
```

#### 方式三：自行打包

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### 🎮 操作指南

| 操作 | 效果 |
|------|------|
| **双击** 宠物 | 随机气泡对话 |
| **右键** 宠物 | 打开互动菜单（摸摸头 / 喂食 / 玩耍 / 睡觉 / 跳舞） |
| **左键拖拽** 宠物 | 抓起宠物，松手后重力下落 |
| **右键托盘图标** | 置顶窗口 / 重置位置 / 退出 |

### 🏗️ 技术架构

#### 核心技术栈
- **Electron 35** — 跨平台桌面应用框架
- **Canvas 2D** — 绿幕去背 + 帧动画渲染
- **CSS pointer-events** — 鼠标穿透控制（替代 `setIgnoreMouseEvents`）
- **GitHub Actions** — 自动化跨平台 CI/CD 构建

#### 关键设计决策

**🎨 绿幕去背算法**：宠物素材使用纯绿色（#00FF00）背景，运行时通过 Canvas 逐像素分析 RGB 通道，自动去除绿色背景并平滑边缘。

**🖱️ 鼠标穿透方案**：采用 CSS `pointer-events: none` + `pointer-events: auto` 组合，而非 Electron 的 `setIgnoreMouseEvents` API（后者在 Windows 上会触发 DWM 重绘标题栏）。

**🛡️ 多分辨率适配**：使用 `workArea` 获取完整工作区坐标（含任务栏偏移），每 5 秒进行安全边界检查。

### 🎨 自定义宠物形象

替换 `assets/` 目录下的图片即可：

1. **格式**：PNG，纯绿色 (#00FF00) 背景
2. **尺寸**：512×512 或更大（程序自动缩放）
3. **命名**：保持现有文件名不变

推荐使用 [Nano Banana](https://nanobanana.ai) 等 AI 绘图工具生成一致性角色。

### 🤝 贡献

欢迎 PR！可以改进的方向：

- [ ] 🐶 更多宠物角色
- [ ] 🎵 添加音效
- [ ] ⚙️ 设置面板（速度 / 大小 / 对话自定义）
- [ ] 🖥️ 多显示器支持
- [ ] 🧩 插件系统

---

## 📄 License

[MIT License](LICENSE) — Free to use. Have fun! 😸

<p align="center">
  如果觉得可爱，请给个 ⭐ Star！<br>
  If you like it, give it a ⭐ Star!
</p>
