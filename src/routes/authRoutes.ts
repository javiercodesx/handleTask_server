import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
    body('name').notEmpty().withMessage('User name is required'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match')
        }
        return true}),
    body('email').notEmpty().withMessage('Not valid email'),

    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('The token is required'),

    handleInputErrors,
    AuthController.confirmAccount
)

export default router