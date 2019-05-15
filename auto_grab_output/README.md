Auto Grab Output for WASM HTML v2.0.0
---
---

# 插件功能

自动扫描并依次运行目录及子目录下的 WASM HTML 并记录 WASM 运行结果.

全新版本!

采用了新的扫描 WASM HTML 的策略, 去掉了繁琐的本地服务, 支持通过 IP 访问远程服务器的网页, 并支持结果的可视化及下载.

# 注意

* 需要保证给定文件夹中的 html 页面全部为通过 emcc 或 em++ 编译得到的.
# 环境需求

* 操作系统为 Linux 或 MacOS
* Google Chrome 或 Google Chromium

# 安装

1. 在地址栏输入 `chrome://extensions/` 进入扩展程序管理页面, 确保右上角开发者模式的开关为开启状态.
2. 点击 **[加载已解压的扩展程序]** 按钮, 在弹出的文件选择弹窗中选择该项目中 `auto_grab_output` 文件夹, 以添加该插件.

# 使用

1. 点击添加至浏览器右上角的插件图标, 输入 Host 和 Port, 点击 'Start' 按钮, 即可开始任务, 点击 'Stop' 按钮终止任务.

2. 当任务完成或任务被终止, 会新建一个页面展示本次任务中抓取的数据, 点击 'Click here to download' 按钮可下载数据.

# 作者
* 阿猫 sun.arcate@icloud.com