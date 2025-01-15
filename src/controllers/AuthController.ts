import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utilts/auth"
import Token from "../models/Token"
import { generateToken } from "../utilts/token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        const { password, email } = req.body
        try {
            console.log(email)
            const userExists = await User.findOne({email: email})
            if(!userExists){
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
            console.log(token.token)
            token.user = user.id

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created. Please check your email to confirm it')
        } catch (error) {
            res.status(500).send({error: 'An error ocurred. We could not process your request'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Not valid token')
                res.status(401).json({error: error.message})
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed succesfully')
        } catch (error) {
            res.status(500).send({error: 'An error ocurred. We could not process your request'})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('User not found')
                res.status(401).json({error: error.message})
                return
            }
            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                
                // send email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('This account is not confirmed. We have sent a confirmation email')
                res.status(401).json({error: error.message})
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Incorrect password')
                res.status(401).json({error: error.message})
                return
            }

            res.send('Authenticated')
        } catch (error) {
            res.status(500).send({error: 'An error ocurred. We could not process your request'})
        }
    }
}