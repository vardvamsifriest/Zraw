import {z} from "zod"

export const CreateUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters")
})

export const SigninSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6,"Password must be at least 6 characters")
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3)
})