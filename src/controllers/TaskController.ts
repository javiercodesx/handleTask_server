import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await task.save()
            await req.project.save()
            res.send('Task created successfully')
        } catch (error) {
            console.error('Error creating the task: ', error);
        }
    };
}