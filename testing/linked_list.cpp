#include <bits/stdc++.h>

using namespace std;

// ----- class definitions -----

struct Node {
	int value; Node *next;
	Node(int v = 0, Node* n = nullptr) : value(v), next(n) {}
};

class Linked_list {
	Node *head, *tail;

	public:
	Linked_list() : head(new Node) , tail(new Node) {}

	void push_front(Node* new_node) {
		new_node->next = head->next;
		head->next = new_node;
	}
};

// ----- main program -----

int main() {
	// create a linked list
	// Linked_list list;

	// allocate three nodes in the heap
	cout << "// creating nodes!\n";
	printf("// test\n");
	Node *node_one = new Node(1); Node *node_two = new Node(1e9); new Linked_list();
	// Node *nodes = new Node[3];
	node_one->next = node_two;

	cout << "// ending\n";

	delete node_one;
	// delete node_two;
}
