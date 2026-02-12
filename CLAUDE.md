# DontbeTerm

Claude Code 多会话终端管理器，支持智能标签命名和 Claude 命令快捷访问。

## 项目简介

DontbeTerm 是一个基于 Electron 的终端管理器，专为 Claude Code 用户设计。它提供了多标签终端管理、智能标签自动命名、以及 Claude Code 命令快捷访问等功能。

## 主要功能

- **多标签终端管理**：支持同时打开多个终端会话
- **智能标签命名**：通过 Claude Code CLI 自动分析终端内容并生成有意义的标签名称
- **Claude 命令快捷访问**：工具栏提供 28 个 Claude Code 内置命令的快捷访问
- **主题切换**：支持日间/夜间模式切换
- **macOS 设计风格**：采用 Apple macOS 设计系统

## 技术栈

- Electron 33.x
- xterm.js - 终端模拟器
- node-pty - 伪终端支持
- Claude Code CLI - 标签智能命名

## 开发命令

- `npm start` - 启动开发模式
- `npm run dist:mac` - 构建 macOS 版本
- `npm run dist:win` - 构建 Windows 版本
- `npm run dist:all` - 构建所有平台版本

## 自定义 Skills

项目包含以下自定义 Claude Code skills：

### /build-all

构建所有平台的最新版本（Mac arm64/x64 和 Windows），生成 DMG、EXE 安装包和应用程序文件。

**使用方法：**
```bash
/build-all
```

**生成的文件：**
- `dist/DontbeTerm-{version}-arm64.dmg` - macOS Apple Silicon 安装包
- `dist/DontbeTerm-{version}-x64.dmg` - macOS Intel 安装包
- `dist/DontbeTerm-{version}-Setup.exe` - Windows 安装程序
- `dist/DontbeTerm-{version}-win-portable.zip` - Windows 便携版
- `dist/mac-arm64/DontbeTerm.app` - macOS Apple Silicon 应用
- `dist/mac/DontbeTerm.app` - macOS Intel 应用

## 发布说明

### 应用签名问题

应用目前未签名，这会导致：

**macOS**：
- 用户需要执行 `xattr -cr /Applications/DontbeTerm.app` 才能运行
- 或者在"系统设置" > "隐私与安全性"中点击"仍要打开"

**Windows**：
- Windows Defender SmartScreen 会显示警告
- 用户需要点击"更多信息" > "仍要运行"

**解决方案**：
1. 提供清晰的安装指南（见 INSTALLATION.md）
2. 在 GitHub Release 说明中包含安装步骤
3. 提供 macOS 安装脚本（install-macos.sh）
4. 提供 Windows 便携版，无需安装

**未来计划**：
- 获取 Apple Developer ID 证书（$99/年）
- 获取 Windows 代码签名证书（$100-$500/年）
- 实现应用签名和公证

### Windows 版本支持

为了更好地支持 Windows 用户：
1. 提供安装版（.exe）和便携版（.zip）
2. GitHub Actions 自动构建 Windows 版本
3. 详细的 Windows 安装指南和常见问题解决方案
4. 无需 Windows 电脑即可构建和发布 Windows 版本

## 项目结构

```
dontbeterm2/
├── main.js              # Electron 主进程
├── preload.js           # 预加载脚本
├── renderer/            # 渲染进程
│   ├── index.html       # 主界面
│   ├── app.js           # 应用逻辑
│   ├── terminal.js      # 终端管理
│   └── styles.css       # 样式文件
├── lib/                 # 库文件
│   └── topic-detector.js # 标签命名逻辑
├── skills/              # 自定义 Claude Code skills
│   └── build-all/       # 构建所有平台版本
└── dist/                # 构建输出目录
```

## 安全说明

- 应用不再需要配置 API Key
- 标签命名功能通过 Claude Code CLI 实现，无 API 泄露风险
- 构建的应用未签名，分发时用户需要执行 `xattr -cr` 命令

## 版本历史

### v1.2.0 (2026-02-11)
- 添加 Claude 命令下拉菜单（28 个命令）
- 移除 API Key 配置功能
- 使用 Claude Code CLI 实现标签自动命名
- 优化用户体验，简化配置流程

### v1.1.0
- 添加主题切换功能
- 优化 macOS 设计风格
- 改进标签管理

### v1.0.0
- 初始版本发布
- 基础多标签终端功能
