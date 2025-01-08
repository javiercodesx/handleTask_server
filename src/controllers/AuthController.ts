import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utilts/auth"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        const { password } = req.body
        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            console.log(user.password)
            await user.save()
            res.send('Account created. Please check your email to confirm it')
        } catch (error) {
            res.status(500).send({error: 'An error ocurred. We could not process your request'})
        }
    }
}