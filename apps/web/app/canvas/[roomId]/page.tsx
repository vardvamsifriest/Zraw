"use client"
import { useEffect, useRef, useState } from "react"
import { use } from "react"
import { DrawBar } from "../../components/drawbar"

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
  tool?: string
  filled?: boolean
}

export default function Canvas({ params }: { params: Promise<{ roomId: string }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const currentStroke = useRef<Point[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const [filled, setFilled] = useState(false)
  const [activeTool, setActiveTool] = useState("pen")
  const [activeColor, setActiveColor] = useState("white")
  const { roomId } = use(params)
  const startPoint = useRef<Point | null>(null)
  const strokesRef = useRef<Stroke[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

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

  function drawStroke(stroke: Stroke) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (!stroke.points || stroke.points.length === 0) return

    ctx.strokeStyle = stroke.color
    ctx.fillStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (!stroke.tool || stroke.tool === "pen") {
      ctx.beginPath()
      ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
      stroke.points.forEach(point => ctx.lineTo(point.x, point.y))
      ctx.stroke()
    } else if (stroke.tool === "rectangle") {
      const w = stroke.points[1]!.x - stroke.points[0]!.x
      const h = stroke.points[1]!.y - stroke.points[0]!.y
      if (stroke.filled) {
        ctx.fillRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
      } else {
        ctx.strokeRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
      }
    }
    else if (stroke.tool === "circle") {
  const radiusX = (stroke.points[1]!.x - stroke.points[0]!.x) / 2
  const radiusY = (stroke.points[1]!.y - stroke.points[0]!.y) / 2
  const centerX = stroke.points[0]!.x + radiusX
  const centerY = stroke.points[0]!.y + radiusY
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI)
  if (stroke.filled) ctx.fill()
  else ctx.stroke()
} else if (stroke.tool === "line") {
  ctx.beginPath()
  ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
  ctx.lineTo(stroke.points[1]!.x, stroke.points[1]!.y)
  ctx.stroke()
} else if (stroke.tool === "arrow") {
  const angle = Math.atan2(stroke.points[1]!.y - stroke.points[0]!.y, stroke.points[1]!.x - stroke.points[0]!.x)
  const headLen = 15
  ctx.beginPath()
  ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
  ctx.lineTo(stroke.points[1]!.x, stroke.points[1]!.y)
  ctx.lineTo(stroke.points[1]!.x - headLen * Math.cos(angle - Math.PI / 6), stroke.points[1]!.y - headLen * Math.sin(angle - Math.PI / 6))
  ctx.moveTo(stroke.points[1]!.x, stroke.points[1]!.y)
  ctx.lineTo(stroke.points[1]!.x - headLen * Math.cos(angle + Math.PI / 6), stroke.points[1]!.y - headLen * Math.sin(angle + Math.PI / 6))
  ctx.stroke()
} else if (stroke.tool === "square") {
  const side = Math.min(Math.abs(stroke.points[1]!.x - stroke.points[0]!.x), Math.abs(stroke.points[1]!.y - stroke.points[0]!.y))
  const w = stroke.points[1]!.x > stroke.points[0]!.x ? side : -side
  const h = stroke.points[1]!.y > stroke.points[0]!.y ? side : -side
  if (stroke.filled) ctx.fillRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
  else ctx.strokeRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
} else if (stroke.tool === "eraser") {
  ctx.beginPath()
  ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
  stroke.points.forEach(point => ctx.lineTo(point.x, point.y))
  ctx.strokeStyle = "#0f172a"
  ctx.lineWidth = 20
  ctx.lineCap = "round"
  ctx.stroke()
}
  }

  function redrawCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokesRef.current.forEach(stroke => drawStroke(stroke))
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    startPoint.current = { x: e.clientX, y: e.clientY }
    currentStroke.current = [{ x: e.clientX, y: e.clientY }]
    ctx.beginPath()
    ctx.moveTo(e.clientX, e.clientY)
    setIsDrawing(true)
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    console.log("selected tool",activeTool)
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (activeTool === "pen") {
      currentStroke.current.push({ x: e.clientX, y: e.clientY })
      ctx.lineTo(e.clientX, e.clientY)
      ctx.strokeStyle = activeColor
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }

    if (activeTool === "rectangle") {
      redrawCanvas()
      const start = startPoint.current!
      const w = e.clientX - start.x
      const h = e.clientY - start.y
      ctx.strokeStyle = activeColor
      ctx.fillStyle = activeColor
      ctx.lineWidth = 2
      if (filled) {
        ctx.fillRect(start.x, start.y, w, h)
      } else {
        ctx.strokeRect(start.x, start.y, w, h)
      }
    }
    if(activeTool=="circle")
    {
      redrawCanvas()
      const start = startPoint.current!
      const radiusX = (e.clientX - start.x)/2
      const radiusY = (e.clientY - start.y)/2
      const centerX = start.x + radiusX
      const centerY = start.y + radiusY
      ctx.beginPath()
      ctx.ellipse(centerX , centerY , Math.abs(radiusX),Math.abs(radiusY),0,0,2*Math.PI)
      ctx.strokeStyle = activeColor
      ctx.fillStyle = activeColor
      ctx.lineWidth =2
      if(filled)
        ctx.fill()
      else
        ctx.stroke()
    }
    if(activeTool == "line")
    {
      redrawCanvas()
      const start = startPoint.current! 
      ctx.beginPath()
      ctx.moveTo(start.x , start.y)
      ctx.lineTo(e.clientX , e.clientY)
      ctx.strokeStyle = activeColor
      ctx.lineWidth = 2;
      ctx.stroke()
    }
    if (activeTool == "square") {
    redrawCanvas()
     const start = startPoint.current!
    const side = Math.min(Math.abs(e.clientX - start.x), Math.abs(e.clientY - start.y))
    const w = e.clientX > start.x ? side : -side
    const h = e.clientY > start.y ? side : -side
    ctx.strokeStyle = activeColor
    ctx.fillStyle = activeColor
    ctx.lineWidth = 2
    if (filled) ctx.fillRect(start.x, start.y, w, h)
    else ctx.strokeRect(start.x, start.y, w, h)
 }
     if(activeTool=="arrow")
     {
       redrawCanvas()
       const start = startPoint.current!
        const angle = Math.atan2(e.clientY - start.y, e.clientX - start.x)
        const headLen = 15
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(e.clientX, e.clientY)
        ctx.lineTo(e.clientX - headLen * Math.cos(angle - Math.PI / 6), e.clientY - headLen * Math.sin(angle - Math.PI / 6))
        ctx.moveTo(e.clientX, e.clientY)
        ctx.lineTo(e.clientX - headLen * Math.cos(angle + Math.PI / 6), e.clientY - headLen * Math.sin(angle + Math.PI / 6))
        ctx.strokeStyle = activeColor
        ctx.lineWidth = 2
         ctx.stroke()
     }
     if (activeTool === "eraser") {
      currentStroke.current.push({ x: e.clientX, y: e.clientY })
      ctx.lineTo(e.clientX, e.clientY)
      ctx.strokeStyle = "#0f172a"  // slate-900 to match background
      ctx.lineWidth = 20
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
}
    }

  function stopDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return

    let stroke: Stroke | undefined

    if (activeTool === "pen") {
      stroke = {
        points: currentStroke.current,
        color: activeColor,
        width: 2
      }
    } else if (activeTool === "rectangle") {
      const start = startPoint.current!
      stroke = {
        points: [start, { x: e.clientX, y: e.clientY }],
        color: activeColor,
        width: 2,
        tool: "rectangle",
        filled
      }
    }
    else if (activeTool === "circle" || activeTool === "line" || activeTool === "arrow" || activeTool === "square") {
  const start = startPoint.current!
  stroke = {
    points: [start, { x: e.clientX, y: e.clientY }],
    color: activeColor,
    width: 2,
    tool: activeTool,
    filled
  }
  } else if (activeTool === "eraser") {
  stroke = {
    points: currentStroke.current,
    color: "#0f172a",
    width: 20,
    tool: "eraser"
  }
}

    if (!stroke) return

    strokesRef.current = [...strokesRef.current, stroke]
    setStrokes(prev => [...prev, stroke!])

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(stroke)
      }))
    }

    currentStroke.current = []
    startPoint.current = null
    setIsDrawing(false)
  }

  return (
    <div className="relative w-screen h-screen bg-slate-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <DrawBar
          filled={filled}
          setFilled={setFilled}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
        />
      </div>
    </div>
  )
}