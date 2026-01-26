import envConfig from "../../config/envConfig"
import { UserRole } from "./user.entity"
import { UserRepository } from "./user.repository"
import { CreateUserOutput } from "./user.schema"

export const createUser = async (data: CreateUserOutput) => {
    const created = UserRepository.create(data)
    await UserRepository.save(created)
    return created
}


// seed db with admin
export const seedUser = async () => {
    const user = await UserRepository.findOneBy({ email: envConfig.seed.user.email })
    if (!user) {
        const res = await createUser({
            name: envConfig.seed.user.username,
            email: envConfig.seed.user.email,
            role: UserRole.ADMIN,
        })
        return res?.id
    }
    console.log('check',user)
    return user?.id
}