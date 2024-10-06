import type { Request, Response } from "express"

export class ProjectController {
    
    static getAllProjects = async (req: Request, res: Response) => {
        res.send('All the projects')
    }

}