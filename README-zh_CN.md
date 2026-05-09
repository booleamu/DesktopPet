<p align="center">
  <img src="assets/cat-main.png" width="120" alt="桌面宠物">
</p>

<h1 align="center">🐱 桌面宠物</h1>

<p align="center">
  <strong>一只可爱的桌面猫咪，陪你写代码、摸鱼、度过每一天</strong>
</p>

<p align="center">
  <a href="README.md">English</a> | 简体中文
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-35-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/平台-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="平台">
  <img src="https://img.shields.io/badge/协议-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/版本-1.0.0-orange" alt="版本">
</p>

<p align="center">
  <img src="assets/preview.png" width="600" alt="桌面宠物预览">
</p>

---

## ✨ 功能特点

- 🐱 **可爱猫咪** — 奶油色小猫，红蝴蝶结，超萌立绘
- 🚶 **自主行走** — 在屏幕底部左右巡逻，到达边界自动转向
- 🖱️ **拖拽互动** — 鼠标拖拽到空中松手会有重力下落 + 弹跳效果
- 💬 **随机对话** — 双击触发随机气泡对话，萌系语录
- 🎭 **丰富表情** — 8 种独立状态动画，每种都有专属帧组
- 👻 **完美透明** — 窗口完全透明，宠物区域外的点击直接穿透到桌面
- 📌 **系统托盘** — 不占用任务栏，右键托盘图标管理
- 🛡️ **防走丢** — 智能边界检测，即使切换分辨率也不会跑出屏幕

## 🎭 状态动画一览

| 状态 | 触发方式 | 帧数 | 描述 |
|------|---------|------|------|
| 🧍 待机 | 默认 | 1 帧 | 正面站立，等待互动 |
| 🚶 走路 | 自动 | 4 帧 | 侧面行走，左右镜像 |
| 😊 开心 | 右键 → 摸摸头 | 1 帧 | 眯眼微笑，爱心腮红 |
| 🐟 吃东西 | 右键 → 喂食 | 2 帧 | 拿鱼 → 大口吃 |
| 🧶 玩耍 | 右键 → 玩耍 | 4 帧 | 蹲伏 → 拍打 → 抱球 → 被缠住 |
| 💤 睡觉 | 右键 → 睡觉 | 2 帧 | Zzz 慢呼吸节奏 |
| 💃 跳舞 | 右键 → 跳舞 | 3 帧 | 左摆 → 举手 → 右摆 |
| 😱 被拖拽 | 鼠标拖拽 | 1 帧 | 惊恐张嘴，四肢张开 |

## 🚀 快速开始

### 方式一：下载可执行文件（推荐）

前往 [Releases](../../releases) 页面下载最新版本。

| 平台 | 文件格式 | 说明 |
|------|---------|------|
| 🪟 Windows | `.exe` (Setup) | 安装版 |
| 🪟 Windows | `.exe` (Portable) | 便携版，免安装 |
| 🍎 macOS | `.dmg` | 支持 Intel 和 Apple Silicon |
| 🐧 Linux | `.AppImage` | 免安装通用包 |
| 🐧 Linux | `.deb` | Debian/Ubuntu 安装包 |

### 方式二：从源码运行

```bash
git clone https://github.com/booleamu/DesktopPet.git
cd DesktopPet
npm install
npm start
```

### 方式三：自行打包

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🎮 操作指南

| 操作 | 效果 |
|------|------|
| **双击** 宠物 | 随机气泡对话 |
| **右键** 宠物 | 打开互动菜单（摸摸头 / 喂食 / 玩耍 / 睡觉 / 跳舞） |
| **左键拖拽** 宠物 | 抓起宠物，松手后重力下落 |
| **右键托盘图标** | 置顶窗口 / 重置位置 / 退出 |

## 📁 项目结构

```
DesktopPet/
├── assets/                # 宠物素材（19 张 PNG 帧）
│   ├── cat-main.png       # 正面待机
│   ├── cat-walk-1~4.png   # 走路帧
│   ├── cat-happy.png      # 开心表情
│   ├── cat-eat-1~2.png    # 吃东西帧
│   ├── cat-play-1~4.png   # 玩耍帧（毛线球）
│   ├── cat-sleep-1~2.png  # 睡觉帧
│   ├── cat-dance-1~3.png  # 跳舞帧
│   ├── cat-drag.png       # 被拖拽表情
│   └── tray-icon.png      # 系统托盘图标
├── main.js                # Electron 主进程
├── preload.js             # 预加载脚本（IPC 桥接）
├── index.html             # 页面结构
├── style.css              # 样式 + CSS 穿透控制
├── pet.js                 # 宠物核心逻辑（状态机 + 动画）
└── package.json           # 项目配置
```

## 🏗️ 技术架构

### 核心技术栈
- **Electron 35** — 跨平台桌面应用框架
- **Canvas 2D** — 绿幕去背 + 帧动画渲染
- **CSS pointer-events** — 鼠标穿透控制（替代 `setIgnoreMouseEvents`）
- **GitHub Actions** — 自动化跨平台 CI/CD 构建

### 关键设计决策

**🎨 绿幕去背算法**：宠物素材使用纯绿色（#00FF00）背景，运行时通过 Canvas 逐像素分析 RGB 通道，自动去除绿色背景并平滑边缘。

**🖱️ 鼠标穿透方案**：采用 CSS `pointer-events: none` + `pointer-events: auto` 组合，而非 Electron 的 `setIgnoreMouseEvents` API（后者在 Windows 上会触发 DWM 重绘标题栏）。

**🛡️ 多分辨率适配**：使用 `workArea` 获取完整工作区坐标（含任务栏偏移），每 5 秒进行安全边界检查。

## 🎨 自定义宠物形象

想换一只你自己的宠物？只需替换 `assets/` 目录下的图片：

1. **素材要求**：PNG 格式，纯绿色 (#00FF00) 背景
2. **建议尺寸**：512×512 或更大（程序会自动缩放）
3. **命名规范**：保持现有文件名不变

推荐使用 [Nano Banana](https://nanobanana.ai) 等 AI 绘图工具生成一致性角色。

## 🤝 贡献

欢迎 PR！以下是一些可以改进的方向：

- [ ] 🐶 更多宠物角色
- [ ] 🎵 添加音效
- [ ] ⚙️ 设置面板（速度 / 大小 / 对话自定义）
- [ ] 🖥️ 多显示器支持
- [ ] 🧩 插件系统

## 📄 开源协议

[MIT License](LICENSE) — 随便用，开心就好 😸

---

<p align="center">
  如果觉得可爱，请给个 ⭐ Star！
</p>
