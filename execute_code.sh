#!/usr/bin/bash

# ---------- INPUT ----------

# check minimum number of arguments
if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <code_header_file> <code_file> <output_commands>"
    exit 1
fi

# get input file names
code_header_file="$1"
code_file="$2"

# get input file names
executable_file="${code_file%.cpp}.out"

# check if input files exists
if [ ! -e "$code_header_file" ]; then
    echo "Error: File '$code_header_file' does not exist."
    exit 1
fi

if [ ! -e "$code_file" ]; then
    echo "Error: File '$code_file' does not exist."
    exit 1
fi

# ---------- MAIN PROGRAM ----------

# concatenate code_header and code files
g++ -g "$code_header_file" "$code_file" -o "$executable_file"

# ----- GDB PROGRAM -----

/usr/bin/expect <<EOD

	set timeout -1

	spawn gdb -q "$executable_file"

	expect "(gdb)"
	send "break operator new\r"
	expect "(gdb)"
	interact

EOD

# send 'break operator new[]'
# send 'break operator delete'
# send 'break operator delete[]'
