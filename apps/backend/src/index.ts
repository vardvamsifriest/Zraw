import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common"
import { middleware, AuthRequest } from "./middleware"
import { prisma } from "@repo/db"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common"
import cors from "cors"
import bcrypt from "bcrypt"
const app = express()
app.use(cors())
app.use(express.json())

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect credentials" })
    return
  }

  const { email, password, username } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
      data: { email, password:hashedPassword, username }
    })
    res.json({ userId: user.id })
  } catch (e) {
    console.error(e)
    res.json({ message: "User already exists or DB error", error: e })
  }
})
app.post("/signin", async (req, res) => {
  const { email, password } = req.body  
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.json({ message: "Invalid credentials" })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return res.json({ message: "Invalid credentials" })
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
app.get("/rooms", middleware, async (req, res) => {
  const authReq = req as AuthRequest
  const rooms = await prisma.room.findMany({
    where: { adminId: Number(authReq.userId) }  // ← add this
  })
  res.json({ rooms })
})

app.get("/joined-rooms", middleware, async (req, res) => {
  const authReq = req as AuthRequest
  const chats = await prisma.chat.findMany({
    where: { userId: Number(authReq.userId),
      room:{
        adminId : {not:Number(authReq.userId)}
      }
     },
    select: { room: true },
    distinct: ["roomId"]
  })
  const rooms = chats.map(chat => chat.room)
  res.json({ rooms })
})
app.get("/me", middleware, async (req, res) => {
  const authReq = req as AuthRequest
  const user = await prisma.user.findUnique({
    where: { id: Number(authReq.userId) },
    select: { username: true, email: true }
  })
  res.json({ user })
})
app.get("/chats/:roomId", middleware, async (req, res) => {
  const chats = await prisma.chat.findMany({
    where: { roomId: Number(req.params.roomId) },
    orderBy: { id: "asc" }
  })
  res.json({ chats })
})
app.get("/room/:code", middleware, async (req, res) => {
  const code = String(req.params.code)
  const room = await prisma.room.findUnique({
    where: { code }
  })
  if (!room) {
    res.json({ message: "Room not found" })
    return
  }
  res.json({ roomId: room.id })
})
app.listen(3001)