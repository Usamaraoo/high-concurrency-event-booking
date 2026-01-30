import envConfig from "../../config/envConfig"
import { createToken } from "../../utils/jwt-token"
import { comparePassword, hashedPassword } from "../../utils/hashedPassword"
import { UserRole } from "./user.entity"
import { UserRepository } from "./user.repository"
import { CreateUserOutput, SigninUser, SigSignup } from "./user.schema"


// signup uer
export const signupUser = async (data: SigSignup) => {
    // const { } = data
    const hashed = await hashedPassword(data.password)
    const created = await createUser({
        ...data,
        role: UserRole.USER,
        password: hashed
    })
    const { password, ...rest } = created
    return rest
}

export const loginUser = async (data: SigninUser) => {
    const { email } = data
    const user = await UserRepository.findOneBy({ email })
    if (!user) {
        return null
    }
    const exists = await comparePassword(data.password, user.password)
    if (!exists) {
        throw new Error('Invalid credentials')
    }
    const { password, ...rest } = user
    const token = createToken(rest)
    return token
}

export const getUserById = async (id: string) => {
    const user = await UserRepository.findOneBy({ id })
    if (!user) {
        throw new Error('User not found')
    }
    const { password, ...rest } = user
    return rest
}

// create user service
export const createUser = async (data: CreateUserOutput) => {
    const created = UserRepository.create(data)
    await UserRepository.save(created)
    return created
}


// seed db with admin
export const seedUser = async () => {
    const user = await UserRepository.findOneBy({ email: envConfig.seed.user.email })
    if (!user) {
        const hashed = await hashedPassword(envConfig.seed.user.password)

        const res = await createUser({
            name: envConfig.seed.user.username,
            email: envConfig.seed.user.email,
            role: UserRole.ADMIN,
            password: hashed
        })
        return res?.id
    }
    return user?.id
}