import {Router} from "express"
import {changePassword, contribution, deleteAccount, login, me, register, resendRegister, updateProfile, verifyRegister} from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/Auth.js"
import forgotRoutes from "./authForgot.js"

const authRouter = Router()


authRouter.post('/register', register)
authRouter.post('/register/verify', verifyRegister)
authRouter.post('/register/resend', resendRegister)
authRouter.post('/login', login)


// to access these routes user must be logged-in
authRouter.get('/me', requireAuth, me)
authRouter.get('/me/contributions', requireAuth, contribution)


authRouter.patch('/me', requireAuth, updateProfile)
authRouter.patch('/me/password', requireAuth, changePassword)
authRouter.delete('/me', requireAuth, deleteAccount)


// for forgot password and reset it
authRouter.use("/forgot", forgotRoutes);

export default authRouter;