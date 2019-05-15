Auto Grab Output for WASM HTML
---
---

# 插件功能

给定一个文件夹路径, 该插件可以自动扫描并依次运行该文件夹中所有 html 页面 (包括子文件夹中的 html 页面), 同时将 html 页面中 wasm 运行的输出结果记录至指定文件中.

# 注意

* 需要保证给定文件夹中的 html 页面全部为通过 emcc 或 em++ 编译得到的, 在下文该文件夹即为 **工作路径**.

# 环境需求

* 操作系统为 Linux 或 MacOS
* Google Chrome 或 Google Chromium
* Python3
* [WebAssembly](https://webassembly.org/getting-started/developers-guide/)

# 运行脚本安装

1. 在地址栏输入 `chrome://extensions/` 进入扩展程序管理页面, 确保右上角开发者模式的开关为开启状态.
2. 点击 **[加载已解压的扩展程序]** 按钮, 在弹出的文件选择弹窗中选择该项目中 `AutoGrabOutput` 文件夹, 以添加该插件.
3. 打开终端, 执行以下命令自动部署本地服务程序:
    ```
    $ cd ./AutoGrabOutput
    $ python3 install.py
    ```
7. 在 Chrome 浏览器插件管理页面中找到该插件的选项卡, 点击重新加载按钮.
8. 在 **工作路径** 下运行 `emrun --no_browser --port 8080 .` 建立 WEB 服务.
9. 在 Chrome 浏览器点击该插件, 输入指定的 **工作路径** 以及 **输出文件路径**, 点击 **[开始]** 按钮, 开始运行.

# 手动安装

1. 在地址栏输入 `chrome://extensions/` 进入扩展程序管理页面, 确保右上角开发者模式的开关为开启状态.
2. 点击 **[加载已解压的扩展程序]** 按钮, 在弹出的文件选择弹窗中选择该项目中 `AutoGrabOutput` 文件夹, 以添加该插件.
3. 在该插件添加之后, 在该插件的选项卡中可以看到该插件的 ID, 复制这个 ID, 打开 `AutoGrabOutput/cc.acat.auto_grab_output_for_wasm.json` 文件, 将文件中 `<extension_id>` 替换为该 ID.
4. `AutoGrabOutput/auto_grab_output_for_wasm.py` 文件的第一行, 将首行的 `<python3_path>` 替换为本地 python3 的路径.
4. `AutoGrabOutput/cc.acat.auto_grab_output_for_wasm.json` 文件中 `<native_program_path>` 替换为 `AutoGrabOutput/auto_grab_output_for_wasm.py` 文件的绝对路径.
    `AutoGrabOutput/auto_grab_output_for_wasm.py` 为插件所调用的本地服务程序, 其名称及路径可任意更改, 只需保证 `<native_program_path>` 为该文件的绝对路径即可.
5. 为本地服务程序进行注册.
    根据系统及 Chrome 版本, 将 `AutoGrabOutput/cc.acat.auto_grab_output_for_wasm.json` 移动至以下对应的目录下.
    * **OS X (system-wide)**
        * Google Chrome:
        /Library/Google/Chrome/NativeMessagingHosts/com.my_company.my_application.json
        * Chromium:
        /Library/Application Support/Chromium/NativeMessagingHosts/com.my_company.my_application.json
    * **OS X (user-specific, default path)**
        * Google Chrome:
        ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.my_company.my_application.json
        * Chromium:
        ~/Library/Application Support/Chromium/NativeMessagingHosts/com.my_company.my_application.json
    * **Linux (system-wide)**
        * Google Chrome:
        /etc/opt/chrome/native-messaging-hosts/com.my_company.my_application.json
        * Chromium:
        /etc/chromium/native-messaging-hosts/com.my_company.my_application.json
    * **Linux (user-specific, default path)**
        * Google Chrome:
        ~/.config/google-chrome/NativeMessagingHosts/com.my_company.my_application.json
        * Chromium:
        ~/.config/chromium/NativeMessagingHosts/com.my_company.my_application.json
7. 在 Chrome 浏览器插件管理页面中找到该插件的选项卡, 点击重新加载按钮.
8. 在 **工作路径** 下运行 `emrun --no_browser --port 8080 .` 建立 WEB 服务.
9. 在 Chrome 浏览器点击该插件, 输入指定的 **工作路径** 以及 **输出文件路径**, 点击 **[开始]** 按钮, 开始运行.

# 作者
* 阿猫 sun.arcate@icloud.com