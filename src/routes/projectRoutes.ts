import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router()

/** Routes for projects */

router.post('/',
    authenticate,
    
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

/** Routes for tasks */

router.param('projectId', projectExists)

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('The task must have a name'),
    body('description')
        .notEmpty().withMessage('The task must have a description'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Not valid ID'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Not valid ID'),
    body('name')
        .notEmpty().withMessage('The task must have a name'),
    body('description')
        .notEmpty().withMessage('The task must have a description'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Not valid ID'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('Not valid ID'),
    body('status')
        .notEmpty().withMessage('The status is required'),
    handleInputErrors,
    TaskController.updateTaskStatus
)

export default router