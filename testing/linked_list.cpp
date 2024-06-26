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

	~Linked_list() { delete head; delete tail; }

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
	cerr << "// creating nodes!\n";
	cout << "// getting first node value: ";

	int value = 0;
	cin >> value;

	Linked_list *p;
	Node *node_one = new Node(value); Node *node_two = new Node(1e9); p = new Linked_list();
	// Node *nodes = new Node[3];
	node_one->next = node_two;

	node_two->value = 123;

	cerr << "// ending\n";

	delete node_one;
	delete node_two;
	delete p;
}
