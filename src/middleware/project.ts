import type { Request, Response, NextFunction } from "express";

export async function validateProjectExists(req : Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params
    } catch (error) {
        res.status(500).json({error: 'Theres a new error'})
    }
}