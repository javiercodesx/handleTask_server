import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()
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
            const project = await Project.findById(req.params.id)
            if (!project) {
                const error = new Error('Project not found')
                res.status(404).json({ error: error.message })
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }
    
}