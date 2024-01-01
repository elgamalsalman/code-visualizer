#include <stddef.h>
#include <iostream>

void* operator new(std::size_t size) {
	void* ptr = std::malloc(size);
	return ptr;
}

void operator delete(void* ptr) noexcept {
	std::free(ptr);
}

void* operator new[](std::size_t size) {
	void* ptr = std::malloc(size);
	return ptr;
}

void operator delete[](void* ptr) noexcept {
	std::free(ptr);
}

// premain
static void premain() {
	// set automatic flushing
	setvbuf(stdout, NULL, _IONBF, 0);
	setvbuf(stderr, NULL, _IONBF, 0);
}
static int const run_premain = (premain(), 0);
