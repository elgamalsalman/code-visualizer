import fs from "fs";
import path from "path";

import config from "../config.js";

import { read_file_tree } from "../utils/file_system_utils.js";
import { entity_types, get_entity_data } from "../models/entity_models.js";

export default class File_Manager {
	#users_dir;

	constructor() {
		this.#users_dir = path.resolve(config.users.files.root_dir_path);

		// create users dir if it doesn't exist
		if (!fs.existsSync(this.#users_dir)) {
			fs.mkdirSync(this.#users_dir);
		}
	}

	create_user_dir = async (user_id) => {
		const user_dir_path = path.resolve(this.#users_dir, user_id);
		await fs.promises.mkdir(user_dir_path);
		const make_file_path = path.resolve(
			config.root_dir_path,
			config.users.files.shared.makefile.path
		);
		await fs.promises.cp(
			make_file_path,
			path.resolve(user_dir_path, config.users.files.shared.makefile.name)
		);
	};

	get_user_dir_path = async (user_id) => {
		// console.log(`get_user_dir_path(${user_id})`);
		const user_dir_path = path.resolve(this.#users_dir, user_id);
		if (!fs.existsSync(user_dir_path)) {
			await this.create_user_dir(user_id);
		}
		return user_dir_path;
	};

	// TODO
	get_user_status = async (user_id) => {
		// console.log(`get_user_status(${user_id})`);
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);
		const pending_statuses = Object.values(
			config.file_manager.user_statuses.pending_statuses
		);
		for (const status of pending_statuses) {
			const status_marker_path = path.resolve(user_dir_path, status);
			if (fs.existsSync(status_marker_path)) {
				return status;
			}
		}
		return config.file_manager.user_statuses.free_status;
	};

	set_user_status_to_free = async (user_id) => {
		const free_status = config.file_manager.user_statuses.free_status;
		await this.set_user_status(user_id, free_status);
	};

	set_user_status = async (user_id, status) => {
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);
		const free_status = config.file_manager.user_statuses.free_status;
		const pending_statuses = Object.values(
			config.file_manager.user_statuses.pending_statuses
		);

		// make sure the status is a valid status
		if (status !== free_status && !pending_statuses.includes(status)) {
			throw new Error(`Invalid status ${status} to set user ${user_id} to!`);
		}

		// reset status to free
		for (const status of pending_statuses) {
			const status_marker_path = path.resolve(user_dir_path, status);
			try {
				await fs.promises.unlink(status_marker_path);
			} catch {}
		}

		// if setting to a pending status
		if (status !== free_status) {
			const status_marker_path = path.resolve(user_dir_path, status);
			await fs.promises.writeFile(status_marker_path, "");
		}
	};

	wait_for_pending_user = (user_id) => {
		return new Promise((resolve, reject) => {
			const period = config.file_manager.user_statuses.pending_check_period;
			const free_status = config.file_manager.user_statuses.free_status;
			const interval = setInterval(async () => {
				if ((await this.get_user_status(user_id)) === free_status) {
					clearInterval(interval);
					resolve();
				}
			}, period);
		});
	};

	update_user_files = async (user_id, updates) => {
		// console.log(`update_user_files(${user_id}, ${updates})`);
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);

		// wait for user to be free and change status to writing
		await this.wait_for_pending_user(user_id);
		await this.set_user_status(
			user_id,
			config.file_manager.user_statuses.pending_statuses.writing
		);

		try {
			// update the files
			console.log(updates);
			for (let {
				type: eventType,
				entity: {
					meta: { path: user_path, type: entityType },
					content,
				},
			} of updates) {
				// validate updates information
				if (
					!config.file_manager.eventTypes.includes(eventType) ||
					!config.file_manager.entityTypes.includes(entityType)
				) {
					throw new Error("invalid file manager update's eventyType or entity");
				}

				const full_path = path.resolve(user_dir_path, user_path);
				if (eventType === "create") {
					if (entityType === "file") {
						await fs.promises.writeFile(full_path, content);
					} else if (entityType === "dir") {
						await fs.promises.mkdir(full_path, { recursive: true });
					}
				} else if (eventType === "write") {
					if (entityType === "file") {
						await fs.promises.writeFile(full_path, content);
					} else if (entityType === "dir") {
						throw new Error("file manager cannot write to a directory");
					}
				} else if (eventType === "delete") {
					if (!fs.existsSync(full_path)) {
						throw new Error(
							"file manager can't delete an entity that doesn't exist"
						);
					}

					if (entityType === "file") {
						await fs.promises.unlink(full_path);
					} else if (entityType === "dir") {
						await fs.promises.rm(full_path, {
							recursive: true,
							force: true,
						});
					}
				}
			}
		} finally {
			await this.set_user_status_to_free(user_id);
		}
	};

	get_user_file_tree = async (user_id) => {
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);

		// wait for pending updates and update status to reading
		await this.wait_for_pending_user(user_id);
		await this.set_user_status(
			user_id,
			config.file_manager.user_statuses.pending_statuses.reading
		);

		let file_tree = null;
		try {
			// get user file tree
			file_tree = await read_file_tree(user_dir_path, [
				config.file_manager.user_statuses.free_status,
				...Object.values(config.file_manager.user_statuses.pending_statuses),
				config.users.files.executable_file_name,
				config.users.files.program_input_file_name,
				config.users.files.program_output_file_name,
				config.users.files.program_error_file_name,
				config.users.files.shared.makefile.name,
			]);
		} finally {
			// return user status back to free
			await this.set_user_status_to_free(user_id);
		}

		return file_tree;
	};

	get_user_entities = async (user_id, entity_metas) => {
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);

		// wait for pending updates and update status to reading
		await this.wait_for_pending_user(user_id);
		await this.set_user_status(
			user_id,
			config.file_manager.user_statuses.pending_statuses.reading
		);

		let entities = null;
		try {
			entities = await Promise.all(
				entity_metas.map(async (entity_meta) => {
					let content = undefined;
					if (entity_meta.type === entity_types.file) {
						content = await fs
							.readFileSync(path.resolve(user_dir_path, entity_meta.path))
							.toString();
					}
					return get_entity_data(
						entity_meta.path,
						entity_meta.type,
						entity_meta.isSaved,
						content
					);
				})
			);
		} finally {
			// return user status back to free
			await this.set_user_status_to_free(user_id);
		}

		return entities;
	};
}
