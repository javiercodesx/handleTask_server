import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('The project must have a project name'),
    body('clientName')
        .notEmpty().withMessage('The project must have a client name'),
    body('description')
        .notEmpty().withMessage('The project must have a description'),

    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id')
        .isMongoId().withMessage('Not valid ID'),

    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id')
    .isMongoId().withMessage('Not valid ID'),
    body('projectName')
    .notEmpty().withMessage('The project must have a project name'),
    body('clientName')
    .notEmpty().withMessage('The project must have a client name'),
    body('description')
    .notEmpty().withMessage('The project must have a description'),
    
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id',
    param('id')
    .isMongoId().withMessage('Not valid ID'),
    
    handleInputErrors,
    ProjectController.deleteProject
)

router.post('/:projectId/tasks',
    validateProjectExists,
    TaskController.createTask
)

export default router