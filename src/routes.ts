import { Router } from 'express'
import eventRoutes from './modules/event/event.routes'
import userRoutes from './modules/user/user.routes'




const router = Router()

router.use('/events', eventRoutes)
router.use('/users', userRoutes)
router.get('/health', (_, res) => {
    console.log(`Handled by instance on port ${process.env.PORT}`);
    res.send("Health OK")
})


export default router