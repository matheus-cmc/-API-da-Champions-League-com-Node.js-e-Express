import {Router} from "express";
import { getPlayers } from "./controllers/players-controller";

const router = Router();

router.get("/player", getPlayers);

export default router;