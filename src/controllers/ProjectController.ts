import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()

            console.log(req.user)
            res.send('Project created successfully')
        } catch (error) {
            console.log(error)            
        }
    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    
    static getProjectById = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id).populate('tasks')
            if (!project) {
                const error = new Error('Project not found')
                res.status(404).json({ error: error.message })
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }
    
    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            
            if (!project) {
                const error = new Error('Project not found')
                res.status(404).json({ error: error.message })
                return
            }
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description
            await project.save()
            res.send('Project updated')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project not found')
                res.status(404).json({ error: error.message })
                return
            }
            
            await project.deleteOne()
            res.send('Project deleted')
        } catch (error) {
            console.log(error)
        }
    }

}