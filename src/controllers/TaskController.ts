import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.status(201).send('Task created successfully')
        } catch (error) {
            console.error('Error creating the task: ', error);
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: 'An error occurred. We could not process your request' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task?.id)
                .populate({ path: 'completedBy', select: 'id name email' });
                
            res.json(req.task)
        } catch (error) {
            res.status(500).json({ error: 'An error occurred. We could not process your request' });
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id) {
                const error = new Error('Not valid action')
                res.status(400).json({ error: error.message })
                return
            }

            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()

            res.send("Task updated correctly")
        } catch (error) {
            res.status(500).json({ error: 'An error occurred. We could not process your request' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.send("Task deleted correctly")
        } catch (error) {
            res.status(500).json({ error: 'An error occurred. We could not process your request' })
        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            if (status === 'pending') {
                req.task?.completedBy = null;
            } else {
                req.task?.completedBy = req.user?.id;
            }

            await req.task.save();
            res.send('Task updated!');
        } catch (error) {
            res.status(500).json({ error: 'An error occurred. We could not process your request' });
        }
    }

}