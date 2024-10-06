import express from 'express'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'

connectDB()

const app = express()

app.use('/api/projects', projectRoutes)

export default app