const entity_types = {
	file: "file",
	dir: "dir",
};

const get_entity_meta = (path, type, isSaved) => {
	return {
		path,
		type,
		isSaved,
	};
};

const get_entity_data = (path, type, isSaved, content) => {
	return {
		meta: get_entity_meta(path, type, isSaved),
		content,
	};
};

const get_file_tree_node = (name, type) => {
	const node = {
		name: name,
		type: type,
	};
	if (type === entity_types.dir) node.children = [];
	return node;
};

export { entity_types, get_entity_meta, get_entity_data, get_file_tree_node };
