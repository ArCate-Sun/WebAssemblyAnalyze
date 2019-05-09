#!<python3_path>
# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

# A simple native messaging host. Shows a Tkinter dialog with incoming messages
# that also allows to send message back to the webapp.
import json
import struct
import sys
import os


WORK_DIR_PATH = ""
OUTPUT_FILE_PATH = ""

fout = None


running = True

# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
if sys.platform == "win32":
	import os, msvcrt

	msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
	msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)


def init(work_dir_path, output_file_path):
	global WORK_DIR_PATH
	global OUTPUT_FILE_PATH
	global fout
	global running

	WORK_DIR_PATH = work_dir_path
	OUTPUT_FILE_PATH = output_file_path
	try:
		fout = open(OUTPUT_FILE_PATH, "w")
	except Exception as ex:
		running = False


# Helper function that sends a message to the webapp.
def send_message(message):
	message = json.dumps(message)
	# Write message size.
	sys.stdout.buffer.write(struct.pack('I', len(message)))
	# Write the message itself.
	sys.stdout.write(message)
	sys.stdout.flush()


def get_html_list(target_dir_path: str = None) -> [str]:
	"""
	获取所有HTML列表
	:return:
	"""

	global WORK_DIR_PATH

	if not target_dir_path:
		target_dir_path = os.path.join(WORK_DIR_PATH)
	if not target_dir_path.endswith("/"):
		target_dir_path = target_dir_path + "/"

	result = []
	for dirpath, dirnames, filenames in os.walk(target_dir_path):
		for filename in filenames:
			if filename.endswith(".html"):
				absolute_path = os.path.join(dirpath, filename)
				abstract_path = absolute_path.replace(target_dir_path, "", )
				result.append(abstract_path)

	return result


def execute_message(msg: dict):

	global running
	global fout

	if msg["cmd"] == "start":

		data = msg["data"]
		work_dir_path = data["work_dir_path"]
		output_file_path = data["output_file_path"]
		init(work_dir_path, output_file_path)

		msg = {
			"cmd": "get_html_list",
			"data": get_html_list()
		}
		send_message(msg)

	elif msg["cmd"] == "output":

		data = msg["data"]
		id = data["id"]
		output = eval(repr(data["output"]).replace("\\", "\\\\"))
		fout.writelines("%s\t%s\n" % (id, output))
		fout.flush()

	elif msg["cmd"] == "terminate":
		running = False


def main():
	global running

	while running:
		# Read the message length (first 4 bytes).
		text_length_bytes = sys.stdin.buffer.read(4)

		if len(text_length_bytes) == 0:
			sys.exit(0)

		# Unpack message length as 4 byte integer.
		text_length = struct.unpack('i', text_length_bytes)[0]

		# Read the text (JSON object) of the message.
		text = sys.stdin.buffer.read(text_length).decode('utf-8')
		msg = json.loads(text)

		# Add your execute code...
		execute_message(msg)


if __name__ == '__main__':
	send_message("native program started.")
	main()
