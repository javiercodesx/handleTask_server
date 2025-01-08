import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    res.send('from auth')
})

export default router