  import { useRef, useEffect } from "react"
import { Stroke } from "./types"

export function useWebSocket(
  roomId: string,
  strokesRef: React.RefObject<Stroke[]>,
  setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
  drawStroke: (stroke: Stroke) => void,
    wsRef = useRef<WebSocket | null>(null)
) {
 

  useEffect(() => {
    const token = localStorage.getItem("token")
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
  ws.send(JSON.stringify({ type: "join_room", roomId }))
  
  const token = localStorage.getItem("token")
  fetch(`http://localhost:3001/chats/${roomId}`, {
    headers: { authorization: token || "" }
  })
  .then(res => res.json())
  .then(data => {
    data.chats.forEach((chat: any) => {
      const stroke = JSON.parse(chat.message)
      strokesRef.current = [...strokesRef.current, stroke]
      drawStroke(stroke)
    })
  })
}

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "chat") {
        const stroke: Stroke = JSON.parse(data.message)
        strokesRef.current = [...strokesRef.current, stroke]
        setStrokes(prev => [...prev, stroke])
        drawStroke(stroke)
      }
    }

    ws.onclose = () => console.log("WS disconnected")
    ws.onerror = (e) => console.error("WS error:", e)

    return () => ws.close()
  }, [])

  return wsRef
}