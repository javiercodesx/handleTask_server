import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created successfully')
        } catch (error) {
            console.error('Error creating the task: ', error);
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Theres a new error'})
        }
    }
   
    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId)
            if(!task) {
                const error = new Error('Task not found')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id) {
                const error = new Error('Not valid action')
                res.status(400).json({error: error.message})
                return
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'Theres a new error'})
        }
    }
    
    static updateTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId)
            if(!task) {
                const error = new Error('Task not found')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id) {
                const error = new Error('Not valid action')
                res.status(400).json({error: error.message})
                return
            }

            task.name = req.body.name
            task.description = req.body.description
            await task.save()

            res.send("Task updated correctly")
        } catch (error) {
            res.status(500).json({error: 'Theres a new error'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId, req.body)
            if(!task) {
                const error = new Error('Task not found')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id) {
                const error = new Error('Not valid action')
                res.status(400).json({error: error.message})
                return
            }
            
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId)

            await Promise.allSettled([task.deleteOne(), req.project.save()])

            res.send("Task deleted correctly")
        } catch (error) {
            res.status(500).json({error: 'Theres a new error'})
        }
    }

}