import express from 'express'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'
import morgan from 'morgan'
import cors, { CorsOptions } from 'cors'

connectDB()

const app = express()

const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]
        
        if(whiteList.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error('Cors ERROR'))
        }
    }
}

// Cors
app.use(cors(corsOptions))

// Logging
app.use(morgan('dev'))

// Read JSON format
app.use(express.json())

app.use('/api/projects', projectRoutes)

export default app