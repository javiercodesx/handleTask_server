import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body } from "express-validator";

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('The project must have a project name'),
    body('clientName')
        .notEmpty().withMessage('The project must have a client name'),
    body('description')
        .notEmpty().withMessage('The project must have a description'),
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)

export default router