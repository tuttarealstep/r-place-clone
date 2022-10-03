import { Router } from "express";
import place from "./place";

const router = Router();

router.use('/place', place);

export default router;