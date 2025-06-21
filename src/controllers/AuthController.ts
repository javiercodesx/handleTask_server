import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {

    static createAccount = async (req: Request, res: Response): Promise<void> => {
        const { password, email }: { password: string; email: string } = req.body;
        try {
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('Email already registered')
                res.status(409).json({ error: error.message })
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

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created. Please check your email to confirm it')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed succesfully')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User not found')
                res.status(401).json({ error: error.message })
                return
            }
            if (!user.confirmed) {
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
                res.status(401).json({ error: error.message })
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Incorrect password')
                res.status(401).json({ error: error.message })
                return
            }

            const token = generateJWT({ id: user.id })

            res.send(token)
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        const { email } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Email not registered')
                res.status(404).json({ error: error.message })
                return
            }

            if (user.confirmed) {
                const error = new Error('Email already registered')
                res.status(403).json({ error: error.message })
                return
            }

            // generate new token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('New token sent successfully')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Email not registered')
                res.status(404).json({ error: error.message })
                return
            }

            // generate new token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // send email
            AuthEmail.sendResetPasswordEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

            res.send('Check your email for instructions')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }

            res.send('Valid token. Please set your new password')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Not valid token')
                res.status(401).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Password successfully modified')
        } catch (error) {
            res.status(500).send({ error: 'An error ocurred. We could not process your request' })
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
        return
    }
}