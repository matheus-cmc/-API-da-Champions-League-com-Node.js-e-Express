import {Router} from "express";
import * as playerController from "./controllers/players-controller";

const router = Router();

router.get("/player", playerController.getPlayers);
router.get("/player/:id", playerController.getplayerById);

router.post("/players", playerController.postPlayer);

export default router;