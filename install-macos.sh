#!/bin/bash

# DontbeTerm macOS 安装脚本
# 此脚本会自动移除应用的隔离属性，允许应用运行

set -e

APP_NAME="DontbeTerm.app"
APP_PATH="/Applications/$APP_NAME"

echo "================================"
echo "DontbeTerm 安装脚本"
echo "================================"
echo ""

# 检查应用是否存在
if [ ! -d "$APP_PATH" ]; then
    echo "❌ 错误: 在 /Applications 中找不到 $APP_NAME"
    echo ""
    echo "请先："
    echo "1. 打开下载的 DMG 文件"
    echo "2. 将 DontbeTerm.app 拖到应用程序文件夹"
    echo "3. 然后再运行此脚本"
    echo ""
    exit 1
fi

echo "✓ 找到应用: $APP_PATH"
echo ""

# 移除隔离属性
echo "正在移除隔离属性..."
xattr -cr "$APP_PATH"

if [ $? -eq 0 ]; then
    echo "✓ 隔离属性已移除"
    echo ""
    echo "================================"
    echo "✅ 安装完成！"
    echo "================================"
    echo ""
    echo "现在可以从启动台或应用程序文件夹打开 DontbeTerm 了。"
    echo ""
else
    echo "❌ 移除隔离属性失败"
    echo ""
    echo "请手动执行以下命令："
    echo "  xattr -cr \"$APP_PATH\""
    echo ""
    exit 1
fi
