import mongoose from 'mongoose'
import 'dotenv/config'
import color from 'colors'

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(color.magenta.bold(`Connected to ${url}`))
    } catch (error) {
        console.log(color.red.bold((' Error trying to connect to the DB ')))
        process.exit(1)
    }
}