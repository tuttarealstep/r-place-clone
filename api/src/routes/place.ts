import { Request, Response, Router } from "express";
import { draw, map, options } from "../controllers/place";

const router = Router();

router.post("/draw", draw)
router.get("/map", map)
router.get("/options", options)

export default router;