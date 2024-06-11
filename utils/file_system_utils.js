import fs from "fs";
import path from "path";

import { entity_types, get_file_tree_node } from "../models/entity_models.js";

const recursive_read = async (
	root_path,
	file_callback,
	dir_callback,
	read_contents = false,
	ignored_entities = []
) => {
	const entities = await fs.promises.readdir(root_path);
	for (const entity of entities) {
		const entity_path = path.resolve(root_path, entity);
		const entity_stats = await fs.promises.stat(entity_path);
		if (ignored_entities.includes(entity)) continue;
		if (entity_stats.isFile()) {
			let content = undefined;
			if (read_contents) {
				content = await fs.promises.readFile(entity_path);
			}
			file_callback(entity, content);
		} else if (entity_stats.isDirectory()) {
			dir_callback(entity);
			await recursive_read(
				entity_path,
				(sub_path, content) => {
					file_callback(path.join(entity, sub_path), content);
				},
				(sub_path) => {
					dir_callback(path.join(entity, sub_path));
				},
				read_contents,
				ignored_entities
			);
		} else {
			throw new Error(`${file} is neither a file nor a directory`);
		}
	}
};

const read_file_tree = async (root_path, ignored_entity_names) => {
	const entity_stats = await fs.promises.stat(root_path);
	const entity_name = path.basename(root_path);
	const entity_type = entity_stats.isFile()
		? entity_types.file
		: entity_types.dir;

	const file_tree = get_file_tree_node(entity_name, entity_type);
	if (entity_type === entity_types.dir) {
		const children = await fs.promises.readdir(root_path);
		for (const child of children) {
			if (ignored_entity_names.includes(child)) continue;

			const child_tree = await read_file_tree(
				path.resolve(root_path, child),
				ignored_entity_names
			);
			file_tree.children.push(child_tree);
		}
	}
	return file_tree;
};

export { recursive_read, read_file_tree };
