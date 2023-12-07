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
