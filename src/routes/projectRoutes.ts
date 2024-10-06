import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router()

router.get('/', ProjectController.getAllProjects)

export default router