---
name: build-all
description: 构建所有平台的最新版本（Mac arm64/x64 和 Windows），生成 DMG、EXE 安装包和应用程序文件
disable-model-invocation: true
allowed-tools:
  - Bash(npm *)
  - Bash(ls *)
  - Bash(du *)
  - Read
---

# 构建所有平台版本

自动构建 Mac（arm64 和 x64）和 Windows 平台的所有安装包和应用程序文件。

## 执行流程

### 1. 前置检查

- 确认当前在项目根目录
- 检查 `package.json` 是否存在
- 读取当前版本号
- 清理旧的构建文件（可选）

### 2. 构建所有平台

执行构建命令：

```bash
npm run dist:all
```

这个命令会：
- 构建 macOS arm64 版本（Apple Silicon）
- 构建 macOS x64 版本（Intel）
- 构建 Windows x64 版本

### 3. 等待构建完成

构建过程通常需要 3-5 分钟，包括：
- 安装和重建原生依赖
- 打包 Electron 应用
- 生成 DMG 文件（Mac）
- 生成 NSIS 安装程序（Windows）
- 创建 blockmap 文件

### 4. 验证构建结果

检查 `dist/` 目录中的文件：

**macOS 文件：**
- `DontbeTerm-{version}-arm64.dmg` - Apple Silicon 安装包
- `DontbeTerm-{version}-x64.dmg` - Intel Mac 安装包
- `mac-arm64/DontbeTerm.app` - Apple Silicon 应用程序
- `mac/DontbeTerm.app` - Intel Mac 应用程序

**Windows 文件：**
- `DontbeTerm-{version}-Setup.exe` - Windows 安装程序

### 5. 显示构建摘要

列出所有生成的文件及其大小：

```bash
ls -lh dist/*.dmg dist/*.exe 2>/dev/null
du -sh dist/mac-arm64/DontbeTerm.app dist/mac/DontbeTerm.app dist/win-unpacked 2>/dev/null
```

## 输出格式

成功时输出：

```
✅ 构建完成！

📦 生成的文件：

macOS (Apple Silicon):
- DontbeTerm-{version}-arm64.dmg (99MB)
- mac-arm64/DontbeTerm.app

macOS (Intel):
- DontbeTerm-{version}-x64.dmg (104MB)
- mac/DontbeTerm.app

Windows:
- DontbeTerm-{version}-Setup.exe (85MB)

💾 所有文件位于: dist/
```

失败时输出：

```
❌ 构建失败: <错误原因>

💡 建议:
<具体的解决步骤>
```

## 注意事项

- 构建过程会占用较多 CPU 和内存
- 确保有足够的磁盘空间（至少 500MB）
- 如果路径中包含空格，可能会有警告（可以忽略）
- macOS 版本未签名，分发时用户需要执行 `xattr -cr` 命令

## 使用示例

```bash
/build-all
```

执行后会自动构建所有平台的最新版本。
