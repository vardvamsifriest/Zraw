import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common"
import { middleware, AuthRequest } from "./middleware"
import { prisma } from "@repo/db"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common"

const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect credentials" })
    return
  }

  const { email, password, username } = req.body

  try {
    const user = await prisma.user.create({
      data: { email, password, username }
    })
    res.json({ userId: user.id })
  } catch (e) {
    console.error(e)
    res.json({ message: "User already exists or DB error", error: e })
  }
})
app.post("/signin", async (req, res) => {
  const data = SigninSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect credentials" })
    return
  }

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.password !== password) {
    res.json({ message: "Invalid credentials" })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET)
  res.json({ token })
})

app.post("/room", middleware, async (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect input" })
    return
  }

  const { slug } = req.body
  const authReq = req as AuthRequest

  const room = await prisma.room.create({
    data: {
      slug,
      adminId: Number(authReq.userId)
    }
  })

  res.json({ roomId: room.id })
})

app.listen(3001)