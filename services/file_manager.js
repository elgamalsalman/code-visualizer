import fs from "fs";
import path from "path";
import { strict as assert } from "assert";

import config from "../config.js";
import { recursive_read } from "../utils/file_system_utils.js";

export default class File_Manager {
	#root_dir;

	constructor(root_dir) {
		// ensure root dir does exist
		assert(
			fs.existsSync(path.resolve(root_dir)) &&
				"file manager root directory doesn't exist"
		);

		this.#root_dir = root_dir;
	}

	get_user_dir_path = async (user_id) => {
		// console.log(`get_user_dir_path(${user_id})`);
		const user_dir_path = path.resolve(this.#root_dir, user_id);
		if (!fs.existsSync(user_dir_path)) {
			await fs.promises.mkdir(user_dir_path);
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
			for (let { action, path: user_path, entity, content } of updates) {
				// validate updates information
				if (
					!config.file_manager.actions.includes(action) ||
					!config.file_manager.entities.includes(entity)
				) {
					throw new Error("invalid file manager update's action or entity");
				}

				const full_path = path.resolve(user_dir_path, user_path);
				if (action === "create") {
					if (entity === "file") {
						await fs.promises.writeFile(full_path, content);
					} else if (entity === "dir") {
						await fs.promises.mkdir(full_path, { recursive: true });
					}
				} else if (action === "write") {
					if (entity === "file") {
						await fs.promises.writeFile(full_path, content);
					} else if (entity === "dir") {
						throw new Error("file manager cannot write to a directory");
					}
				} else if (action === "delete") {
					if (!fs.existsSync(full_path)) {
						throw new Error(
							"file manager can't delete an entity that doesn't exist"
						);
					}

					if (entity === "file") {
						await fs.promises.unlink(full_path);
					} else if (entity === "dir") {
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

	get_user_files = async (user_id) => {
		// create user directory if it doesn't exist
		const user_dir_path = await this.get_user_dir_path(user_id);

		// wait for pending updates and update status to reading
		await this.wait_for_pending_user(user_id);
		await this.set_user_status(
			user_id,
			config.file_manager.user_statuses.pending_statuses.reading
		);

		const entity_descriptors = [];
		try {
			// get user files
			await recursive_read(
				user_dir_path,
				(file_path, file_content) => {
					entity_descriptors.push({
						entity: "file",
						path: file_path,
						content: file_content,
					});
				},
				(dir_path) => {
					entity_descriptors.push({
						entity: "dir",
						path: dir_path,
					});
				}
			);
		} finally {
			// return user status back to free
			await this.set_user_status_to_free(user_id);
		}

		return entity_descriptors;
	};
}
