import { Router } from "express";

import entity_controller from "../../controllers/entity_controller.js";

const entity_router = Router();

// --- routes ---

entity_router.post("/push/", entity_controller.push_events);
entity_router.post("/pull/file-tree", entity_controller.pull_file_tree);
entity_router.post("/pull/entities", entity_controller.pull_entities);

// --- exports ---

export default entity_router;
