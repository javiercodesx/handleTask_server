import express from 'express'
import { connectDB } from './config/db'

connectDB()

const app = express()


export default app