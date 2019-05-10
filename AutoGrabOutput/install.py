import getpass
import os
import stat
import platform
import shutil

# 文件
EX_JSON = "cc.acat.auto_grab_output_for_wasm.json"
EX_PY = "auto_grab_output_for_wasm.py"

# 系统
OS = platform.system()
if OS == "Darwin":
	OS = "MacOS"
OS_IS_MACOS = OS == "MacOS"
OS_IS_LINUX = OS == "Linux"
OS_IS_WINDOWS = OS == "Windows"

# 用户名
USERNAME = getpass.getuser()

# python3 位置
PYTHON3_PATH = os.popen("which python3").read().strip()

# 浏览器
BROWSER_IS_CHROME = False
BROWSER_IS_CHROMIUM = False


def check_install_file():
	"""
	检查待安装的文件是否缺失
	:return:
	"""

	global EX_JSON
	global EX_PY

	files = [EX_JSON, EX_PY]
	lack = []
	for file in files:
		if not os.path.exists(file) or not os.path.isfile(file):
			lack.append(file)
	return lack


def get_extension_directory(username: str):

	global OS_IS_MACOS
	global OS_IS_LINUX

	user_directory = ""
	if OS_IS_MACOS:
		user_directory = os.path.join("/", "Users", username)
	elif OS_IS_LINUX:
		user_directory = os.path.join("/", "home", username)
	return user_directory


def get_native_path():
	"""
	获取浏览器插件用于注册本地服务的路径
	:return:
	"""

	global EX_JSON
	global EX_PY
	global OS_IS_MACOS
	global OS_IS_LINUX
	global USERNAME
	global BROWSER_IS_CHROME
	global BROWSER_IS_CHROMIUM

	path = None
	if OS_IS_MACOS:
		if BROWSER_IS_CHROME:
			path = "/Users/%s/Library/Application Support/Google/Chrome/NativeMessagingHosts" % USERNAME
		elif BROWSER_IS_CHROMIUM:
			path = "/Users/%s/Library/Application Support/Chromium/NativeMessagingHosts" % USERNAME
	elif OS_IS_LINUX:
		if BROWSER_IS_CHROME:
			path = "/home/%s/.config/google-chrome/NativeMessagingHosts" % USERNAME
		elif BROWSER_IS_CHROME:
			path = "/home/%s//.config/chromium/NativeMessagingHosts" % USERNAME

	return path


def install(extension_id: str):
	"""
	安装过程
	:param extension_id
	:return:
	"""

	global EX_JSON
	global EX_PY
	global OS_IS_MACOS
	global OS_IS_LINUX
	global USERNAME
	global PYTHON3_PATH
	global BROWSER_IS_CHROME
	global BROWSER_IS_CHROMIUM

	# 获取路径
	dest_native_path = get_native_path()
	dest_ex_json_path = os.path.join(dest_native_path, EX_JSON)
	dest_ex_py_path = os.path.join(dest_native_path, EX_PY)

	# 读取文件内容
	f_ex_json = open(EX_JSON)
	f_ex_py = open(EX_PY)
	content_ex_json: [str] = f_ex_json.readlines()
	content_ex_py = f_ex_py.readlines()
	f_ex_json.close()
	f_ex_py.close()

	# 安装本地服务程序
	dest_ex_py = open(dest_ex_py_path, "w")
	for i in range(len(content_ex_py)):
		content_ex_py[i] = content_ex_py[i].replace("<python3_path>", PYTHON3_PATH)
	dest_ex_py.writelines(content_ex_py)
	dest_ex_py.close()
	os.chmod(dest_ex_py_path, stat.S_IRWXU + stat.S_IXOTH + stat.S_IXGRP)

	# 生成注册文件
	dest_ex_json = open(dest_ex_json_path, "w")
	for i in range(len(content_ex_json)):
		content_ex_json[i] = content_ex_json[i].replace("<extension_id>", extension_id)
		content_ex_json[i] = content_ex_json[i].replace("<native_program_path>", dest_ex_py_path)
	dest_ex_json.writelines(content_ex_json)
	dest_ex_json.close()
	os.chmod(dest_ex_json_path, stat.S_IRWXU + stat.S_IXOTH + stat.S_IXGRP)


if __name__ == "__main__":

	print("+----------------------------------------------+")
	print("|        Auto Grab Output for WASM HTML        |")
	print("+----------------------------------------------+")
	print()

	print("本程序将自动完成插件所需本地服务的部署与配置步骤.")
	print()

	print("检查文件:")
	lack_files = check_install_file()
	if lack_files:
		print("好像少了点东西啊老铁! 缺少: %s" % lack_files)
		print("巧妇难为无米之炊, 溜了溜了...")
		exit(-1)
	else:
		print("\033[1;32m√ 通过检查\033[0m")
		print()

	print("检查环境:")
	print("\t* 操作系统: \033[1m%s\033[0m" % OS)
	print("\t* 当前用户名: \033[1m%s\033[0m" % USERNAME)
	print("\t* python3 路径: \033[1m%s\033[0m" % PYTHON3_PATH)
	if not OS_IS_MACOS and not OS_IS_LINUX:
		print("本程序支持的操作系统有:")
		print("\t1. MacOS")
		print("\t2. Linux")
		print("本程序不支持您的操作系统, 告辞!")
		exit(-1)

	print("\033[1;32m√ 通过检查\033[0m")
	print()

	print("插件支持的浏览器有:")
	print("\t1. Google Chrome")
	print("\t2. Google Chromium")
	print("请选择您所用的浏览器:")
	browser = input()
	while not browser.isnumeric() and not int(browser) in [1, 2]:
		print("\033别瞎写:\033[0m")
		browser = input()
	if int(browser) == 1:
		BROWSER_IS_CHROME = True
	else:
		BROWSER_IS_CHROMIUM = True

	print("请确保您已经在 Google Chrome 或 Google Chromium 中成功加载了本插件.")
	print("请输入此插件的 ID:")

	# 获取插件 ID
	extension_id = input()
	while len(extension_id) != 32:
		print("\033[1;31m您输入的插件 ID 格式有误, 请确保输入正确的插件 ID:\033[0m")
		extension_id = input()
	print()

	print("开始安装...")
	install(extension_id)
	print("\033[1;32m√ 安装完成\033[0m")
	print()

	print("在浏览器插件管理页面刷新插件后, 插件即可正常运行.")
	print("不用感谢我, 我是雷锋...")
	print()

	print("\033[4;36mBy 阿猫 (sun.arcate@icloud.com)\033[0m")
	exit(0)
