# Code Visualizer

An online coding tool that allows you to visually see what your code does. The vision of this project is to create a mockup of Replit that would allow users to see what their code is doing on on running their code.

As the teaching assistant of Data Structures and Algorithms at NYUAD, my motivation behind buildling this project is to help improve students visualisation of algorithms, since the lack of the ability to visualise how the algorithm works in one's head is one of the main reasons why some students end up with a lot of conceptual errors in their codes, especially when it comes to pointers.

## Features

#### Modes
- stack & heap analysis
- class structure (inheritence)
- function stack
- graphs

#### helpful tools
- step through code slowly
- taking screenshots
- vim mode

## Dev Notes

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

#### Useful C++ Snippets

- The following is a snippet that overrides all the new operator and delete operator functions so that they print the address and size of the block of memory allocated

```cpp
void* operator new(std::size_t size) {
    void* ptr = std::malloc(size);
    if (ptr) {
        std::cout << "// Global new: Allocated " << size << " bytes at address " << ptr << std::endl;
    }
    return ptr;
}

void operator delete(void* ptr) noexcept {
    std::cout << "// Global delete: Deallocated memory at address " << ptr << std::endl;
    std::free(ptr);
}

void* operator new[](std::size_t size) {
    void* ptr = std::malloc(size);
    if (ptr) {
        std::cout << "// Global new[]: Allocated " << size << " bytes at address " << ptr << std::endl;
    }
    return ptr;
}

void operator delete[](void* ptr) noexcept {
		std::cout << "// Global delete[]: Deallocated memory at address " << ptr << std::endl;
    std::free(ptr);
}
```

- This runs before main to print the class size, downside is that the file needs editing

```cpp
void __attribute__ ((constructor)) premain() {
	printf("// CLASS_SIZE My_class: %zu\n", sizeof(My_class));
}
```

#### Steps of Detecting New Object Allocations

__logging__
```
set logging file linked_list.gdb.out
set logging overwrite on
set logging redirect on
set logging on
```

__breakpoints__
```
break operator new
break operator delete(void*)
```

__run__
```
run > linked_list.out
```

__the full thing without interruptions__
```
set logging file linked_list.gdb.out
set logging overwrite on
set logging redirect on
set logging on
break operator new
break operator delete(void*)
run > linked_list.out
```

#### Log Events

- creation of new node
```json
{
	'type': 'new',
	'object': {
		'class': 'node',
		'location': 'heap',
		'id': 0x034234,
		'value': 0,
	},
}
```

- deletion of node
```json
{
	'type': 'delete',
	'id': 0x034234,
}
```

- change in a node's member variable value
```json
{
	'type': 'change',
	'id': 0x034234
	'parameter': 'value',
	'new_value': 23,
}
```
