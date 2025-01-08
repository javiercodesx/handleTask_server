import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utilts/auth"
import Token from "../models/Token"
import { generateToken } from "../utilts/token"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        const { password, email } = req.body
        try {
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('Email already registered')
                res.status(409).json({error: error.message})
                return
            }

            // create user
            const user = new User(req.body)

            // hash password
            user.password = await hashPassword(password)

            // generate password
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created. Please check your email to confirm it')
        } catch (error) {
            res.status(500).send({error: 'An error ocurred. We could not process your request'})
        }
    }
}