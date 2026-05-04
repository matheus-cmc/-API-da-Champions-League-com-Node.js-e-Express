import {Router} from "express";
import * as playerController from "./controllers/players-controller";
import * as clubsController from "./controllers/clubs-controller";

const router = Router();

router.get("/players", playerController.getPlayers);
router.get("/players/:id", playerController.getplayerById);
router.post("/players", playerController.postPlayer);
router.delete("/players/:id", playerController.deletePlayer);
router.patch("/players/:id" , playerController.updatePlayer);
router.get("/clubs", clubsController.getClubs);
export default router;