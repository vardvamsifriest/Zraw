import {z} from "zod"

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3)
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3)
})