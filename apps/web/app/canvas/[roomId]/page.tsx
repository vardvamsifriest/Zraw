"use client"
import { useEffect, useRef, useState } from "react"

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
}

export default function Canvas({ params }: { params: { roomId: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const currentStroke = useRef<Point[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Connect to WebSocket
    const token = localStorage.getItem("token")
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("Connected to WS")
      ws.send(JSON.stringify({
        type: "join_room",
        roomId: params.roomId
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "chat") {
        const stroke: Stroke = JSON.parse(data.message)
        drawStroke(stroke)
        setStrokes(prev => [...prev, stroke])
      }
    }

    ws.onclose = () => console.log("WS disconnected")
    ws.onerror = (e) => console.error("WS error:", e)

    return () => ws.close()
  }, [])

  function drawStroke(stroke: Stroke) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (!stroke.points || stroke.points.length === 0) 
        {
            return
        }
    ctx.beginPath()
    ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
    stroke.points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
  }
  function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    currentStroke.current = [{ x: e.clientX, y: e.clientY }]
    ctx.beginPath()
    ctx.moveTo(e.clientX, e.clientY)
    setIsDrawing(true)
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    currentStroke.current.push({ x: e.clientX, y: e.clientY })
    ctx.lineTo(e.clientX, e.clientY)
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
  }

  function stopDrawing() {
    if (!isDrawing) return
    const stroke: Stroke = {
      points: currentStroke.current,
      color: "white",
      width: 2
    }
    setStrokes(prev => [...prev, stroke])

    // Send stroke to WS
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        roomId: params.roomId,
        message: JSON.stringify(stroke)
      }))
    }

    currentStroke.current = []
    setIsDrawing(false)
  }

  return (
    <canvas
      ref={canvasRef}
      className="bg-slate-900"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  )
}