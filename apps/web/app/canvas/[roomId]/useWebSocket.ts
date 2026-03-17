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
      console.log("Connected to WS")
      ws.send(JSON.stringify({
        type: "join_room",
        roomId: roomId
      }))
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