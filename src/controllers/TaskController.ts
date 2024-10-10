import type { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        const { projectId } = req.params
        const project = await Project.findById(projectId)

        if(!project){
            const error = new Error('Project not found')
            res.status(404).json({error: error.message})
            return
        }

        try {
            const task = new Task(req.body)
            task.project = project.id
            project.tasks.push(task.id)
            await task.save()
            await project.save()
            res.send('Task created successfully')
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };
}