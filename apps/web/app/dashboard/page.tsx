"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Logo } from "@repo/ui/logo"
import { Button } from "@repo/ui/button"
import { UserCard } from "../components/usercard"

export default function Dashboard() {
  const router = useRouter()
  const [rooms, setRooms] = useState([])
  const [slug, setSlug] = useState("")
  const [joinId , setJoinId] = useState("")
  const [joinedRooms , setJoinedRooms] = useState([])
  const [createdRooms , setCreatedRooms] = useState([])
  const [createdRoomId , setCreatedRoomId] = useState("")
  const [showUserCard , setShowUserCard] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    fetchRooms()
  }, [])

  async function fetchRooms() {
  const token = localStorage.getItem("token")
  const headers : Record<string ,string> = { authorization: token || "" }
  
  const [created, joined] = await Promise.all([
    axios.get("http://localhost:3001/rooms", { headers }),
    axios.get("http://localhost:3001/joined-rooms", { headers })
  ])
  
  setCreatedRooms(created.data.rooms)
  setJoinedRooms(joined.data.rooms)
}
 async function createRoom() {
  const token = localStorage.getItem("token")
  const response = await axios.post("http://localhost:3001/room",
    { slug },
    { headers: { authorization: token } }
  )
   
  const roomId = response.data.roomId
  setCreatedRoomId(roomId)
  await fetchRooms()
  router.push(`/canvas/${String(roomId)}`)
}

async function joinRoom(roomId?: number) {
  if (roomId) {
    router.push(`/canvas/${String(roomId)}`)
    return
  }
}
async function handleJoinByCode()
{
  const token = localStorage.getItem("token")
  const response = await axios.get(`http://localhost:3001/room/${joinId}`, {
    headers: { authorization: token || "" }
  })
 
  const fetchedRoomId = response.data.roomId
  router.push(`/canvas/${String(fetchedRoomId)}`)
}

  return (
  <div className="bg-slate-900 min-h-screen w-full">

    {showUserCard && (
      <div 
        className="fixed inset-0 z-50 flex justify-end items-start pt-24 pr-4 md:pr-8"
        onClick={() => setShowUserCard(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <UserCard needdashboard={false} />
        </div>
      </div>
    )}

    <div className={showUserCard ? "blur-sm pointer-events-none" : ""}>
      
      {/* Navbar */}
      <div className="h-20 flex items-center w-full border-b border-slate-700 bg-slate-900 px-4 md:px-8">
        <Logo />
        <div className="ml-auto">
          <img 
            onClick={() => setShowUserCard(true)} 
            src="/images/user.png" 
            className="h-8 w-8 md:h-10 md:w-10 cursor-pointer hover:opacity-80 transition-all" 
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-8 md:gap-10">

        {/* Create + Join — stack on mobile */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          
          {/* Create Room */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col gap-4 flex-1 hover:border-slate-500 transition-all">
            <div>
              <p className="text-white text-lg md:text-xl font-geist font-semibold">Create a Room</p>
              <p className="text-slate-400 text-sm font-geist mt-1">Start a new canvas and share the Room ID</p>
            </div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Room name"
              className="bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 font-geist outline-none focus:border-slate-400 transition-all"
            />
            <Button onClick={createRoom} size="md" text="Create" variant="primary" />
            {createdRoomId && (
              <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center justify-between">
                <p className="text-white font-geist text-sm">Room ID: <span className="font-bold text-teal-400">{createdRoomId}</span></p>
                <button 
                  onClick={() => router.push(`/canvas/${createdRoomId}`)}
                  className="text-teal-400 text-sm font-geist hover:text-teal-300">
                  Enter →
                </button>
              </div>
            )}
          </div>

          {/* Join Room */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col gap-4 flex-1 hover:border-slate-500 transition-all">
            <div>
              <p className="text-white text-lg md:text-xl font-geist font-semibold">Join a Room</p>
              <p className="text-slate-400 text-sm font-geist mt-1">Enter a Room ID to collaborate with others</p>
            </div>
            <input
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="Enter Room Code"
              className="bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 font-geist outline-none focus:border-slate-400 transition-all"
            />
            <Button onClick={handleJoinByCode} size="md" text="Join" variant="primary" />
          </div>

        </div>

        {/* Your Rooms */}
        <div className="flex flex-col gap-4">
          <p className="text-white font-geist font-semibold text-lg md:text-xl">Your Rooms</p>
          {createdRooms.length === 0 ? (
            <p className="text-slate-500 font-geist text-sm">No rooms yet — create one above!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {createdRooms.map((room: any) => (
                <div 
                  key={room.id} 
                  onClick={() => joinRoom(room.id)} 
                  className="bg-slate-800 border border-slate-600 rounded-xl p-6 cursor-pointer hover:border-slate-400 transition-all group">
                  <p className="text-white font-geist font-semibold group-hover:text-teal-400 transition-all">{room.slug}</p>
                  <p className="text-slate-400 text-sm font-geist mt-1">Room Code: {room.code}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joined Rooms */}
        <div className="flex flex-col gap-4">
          <p className="text-white font-geist font-semibold text-lg md:text-xl">Joined Rooms</p>
          {joinedRooms.length === 0 ? (
            <p className="text-slate-500 font-geist text-sm">No joined rooms yet!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {joinedRooms.map((room: any) => (
                <div 
                  key={room.id} 
                  onClick={() => joinRoom(room.id)} 
                  className="bg-slate-800 border border-slate-600 rounded-xl p-6 cursor-pointer hover:border-slate-400 transition-all group">
                  <p className="text-white font-geist font-semibold group-hover:text-teal-400 transition-all">{room.slug}</p>
                  <p className="text-slate-400 text-sm font-geist mt-1">Room ID: {room.code}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  </div>
)
}
