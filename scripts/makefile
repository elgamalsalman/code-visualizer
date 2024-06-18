# Compiler
CXX := g++

# Compiler flags
CXXFLAGS := -std=c++11 -g -I.

# Executable name
TARGET := .exe

# Find all source files recursively in the current directory
CPP := $(shell find . -name '*.cpp')
H := $(shell find . -name '*.h')
CODE_HEADER := ../../scripts/code_header.cpp

# Default rule to build the target
all: $(TARGET)

# Rule to link and compile all .cpp files into the executable
$(TARGET):
	$(CXX) $(CXXFLAGS) $(CODE_HEADER) $(CPP) $(H) -o $(TARGET)

# Clean rule to remove the generated executable
clean:
	rm -f $(TARGET)

# Phony targets to avoid conflicts with files of the same name
.PHONY: all clean
