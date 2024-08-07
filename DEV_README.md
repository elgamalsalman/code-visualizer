#### Useful G++ and GDB Flags and Commands

- g++ `-g`: includes extra debuggin information
- gdb `./a.out`: this takes one argument, which is the file to run
- gdb `-q`: run quietly
- gdb `-x`: run gdb commands from file
- gdb `file`/`exec-file`: specify the file to run
- gdb `run`: run file with debugger with the current set arguments by `run` or by `set args`
- gdb `show args`: show the current set arguments
- gdb `break +offset` & `break -offset`: set a breakpoint some number of lines forward or back from the position at which execution stopped in the currently selected stack frame.
- gdb `start`: instruct the debugger to start and breaks the program before the execution of the `main()` body
- gdb `starti`: instruct the debugger to start and directly break the execution of the program before the first instruction
- gdb `stepi`: instruct the debugger to step into next instruction
- gdb `nexti`: instruct the debugger to step over next instruction, in other words, doesn't get into functions
- gdb `continue`: continues execution of program normally
- gdb `finish`: instruct the debugger to step out of current function
- gdb `info proc mappings`: report memory address space ranges
- gdb `frame`: reports the current line with the line number
- gdb `frame 1`: reports the calling line with the line number
- gdb `info locals`: All local variables of current stack frame or those matching REGEXPs
- gdb `print`: prints the contents of a variable
- gdb `output`: like `print` but doesn't print `$# = ` and a newline
- gdb `*`: can be used in an expression to dereference a pointer
- gdb `(new type)`: casting works in gdb expressions too
- gdb `break operator new`: creates a break point at every use of operator new
- gdb `ptype`: print type
- gdb `dump memory heap_1.bin 0xheap_start_address 0xheap_end_address`: dump the heap
- gdb `macro define offsetof(t, f) (size_t)&((t *) 0)->f`: defines the offset macro that can then be used as follows `p offset(t, f)` where `t` is the class `f` is the variable and the byte offset is returned
- gdb `x/16bx address`: inspect 16 bytes in hexadecimal starting from address
- gdb `p sizeof(My_class)`: print the size of an object of class `My_class`
- gdb `watch var`: creates a watchpoint on the variable, in other words, execution will break if the variable's value changed
- bash `command 2> error 1> output`: redirects error and output to error and output respectively
- gdb `print &((Node *)(0x55555556b2c0)).next`
- gdb `set logging file <file>`: sets the logging file, the file to redirect gdb output to
- gdb `set logging overwrite [on|off]`: sets whether to overwrite the logging file or append to it
- gdb `set logging redirect [on|off]`: sets whether to redirect and not even print the output to the screen or do both
- gdb `set logging [on|off]`: turns logging on or off
