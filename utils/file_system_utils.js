import fs from "fs";
import path from "path";

const recursive_read = async (root_path, file_callback, dir_callback) => {
	const entities = await fs.readdir(root_path);
	for (const entity of entities) {
		const entity_path = path.resolve(root_path, entity);
		const entity_stats = await fs.stat(entity_path);
		if (entity_stats.isFile()) {
			const content = await fs.readFile(entity_path);
			file_callback(entity_path, content);
		} else if (entity_stats.isDirectory()) {
			dir_callback(entity_path);
			await recursive_read(entity_path, file_callback, dir_callback);
		} else {
			throw new Error(`${file} is neither a file nor a directory`);
		}
	}
};

export { recursive_read };
