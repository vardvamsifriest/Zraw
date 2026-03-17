import { useRef, useState, useEffect } from "react"
import { Stroke, Point } from "./types"

interface UseCanvasProps {
  activeTool: string
  activeColor: string
  filled: boolean
  fontSizeRef: React.RefObject<number>
  roomId: string
  wsRef: React.RefObject<WebSocket | null>
}

export function useCanvas(props: UseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentStroke = useRef<Point[]>([])
  const startPoint = useRef<Point | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState<Point | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const isCommitting = useRef(false)
  const fontSizeRef = { current: 20 }
  const [fontSize, setFontSize] = useState(20)
  function handleSetFontSize(size: number) {
  setFontSize(size)
  fontSizeRef.current = size
  console.log("fontSizeRef updated to:", fontSizeRef.current)
}
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas?.getContext("2d")
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  strokesRef.current.forEach(stroke => drawStroke(stroke))
}, [props.activeTool])
  function drawStroke(stroke: Stroke) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (!stroke.points || stroke.points.length === 0) return
    ctx.save()
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
      if (stroke.filled) ctx.fillRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
      else ctx.strokeRect(stroke.points[0]!.x, stroke.points[0]!.y, w, h)
    } else if (stroke.tool === "circle") {
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
    } else if (stroke.tool === "text") {
      ctx.fillStyle = stroke.color
      ctx.font = `${stroke.fontSize || 20}px Geist, sans-serif`
      ctx.fillText(stroke.text!, stroke.points[0]!.x, stroke.points[0]!.y)
    }  else if (stroke.tool === "eraser") {
  ctx.strokeStyle = "whtie"
  ctx.beginPath()
  ctx.moveTo(stroke.points[0]!.x, stroke.points[0]!.y)
  stroke.points.forEach(point => ctx.lineTo(point.x, point.y))
  ctx.lineWidth = 60
  ctx.lineCap = "round"
  ctx.stroke()
}
    ctx.restore()
  }

 function redrawCanvas() {
  const canvas = canvasRef.current
  const ctx = canvas?.getContext("2d")
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  strokesRef.current.forEach(stroke => drawStroke(stroke))
}

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    if (props.activeTool === "text") {
      setTextPosition({ x: e.clientX, y: e.clientY })
      setIsTyping(true)
      return
    }
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
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (props.activeTool === "pen") {
      currentStroke.current.push({ x: e.clientX, y: e.clientY })
      ctx.lineTo(e.clientX, e.clientY)
      ctx.strokeStyle = props.activeColor
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }
    if (props.activeTool === "rectangle") {
      redrawCanvas()
      const start = startPoint.current!
      const w = e.clientX - start.x
      const h = e.clientY - start.y
      ctx.strokeStyle = props.activeColor
      ctx.fillStyle = props.activeColor
      ctx.lineWidth = 2
      if (props.filled) ctx.fillRect(start.x, start.y, w, h)
      else ctx.strokeRect(start.x, start.y, w, h)
    }
    if (props.activeTool === "circle") {
      redrawCanvas()
      const start = startPoint.current!
      const radiusX = (e.clientX - start.x) / 2
      const radiusY = (e.clientY - start.y) / 2
      const centerX = start.x + radiusX
      const centerY = start.y + radiusY
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI)
      ctx.strokeStyle = props.activeColor
      ctx.fillStyle = props.activeColor
      ctx.lineWidth = 2
      if (props.filled) ctx.fill()
      else ctx.stroke()
    }
    if (props.activeTool === "line") {
      redrawCanvas()
      const start = startPoint.current!
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(e.clientX, e.clientY)
      ctx.strokeStyle = props.activeColor
      ctx.lineWidth = 2
      ctx.stroke()
    }
    if (props.activeTool === "square") {
      redrawCanvas()
      const start = startPoint.current!
      const side = Math.min(Math.abs(e.clientX - start.x), Math.abs(e.clientY - start.y))
      const w = e.clientX > start.x ? side : -side
      const h = e.clientY > start.y ? side : -side
      ctx.strokeStyle = props.activeColor
      ctx.fillStyle = props.activeColor
      ctx.lineWidth = 2
      if (props.filled) ctx.fillRect(start.x, start.y, w, h)
      else ctx.strokeRect(start.x, start.y, w, h)
    }
    if (props.activeTool === "arrow") {
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
      ctx.strokeStyle = props.activeColor
      ctx.lineWidth = 2
      ctx.stroke()
    }
    if (props.activeTool === "eraser") {
  currentStroke.current.push({ x: e.clientX, y: e.clientY })
  ctx.strokeStyle = "white"
  ctx.lineTo(e.clientX, e.clientY)
  ctx.lineWidth = 60
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.stroke()
}
  }

  function commitText() {
  console.log("fontSize in commitText:", props.fontSizeRef.current)
    if (isCommitting.current) return
    if (!textInput || !textPosition) return
    isCommitting.current = true
    const stroke: Stroke = {
      points: [textPosition],
      color: props.activeColor,
      width: 2,
      tool: "text",
      text: textInput,
      fontSize: props.fontSizeRef.current
    }
    strokesRef.current = [...strokesRef.current, stroke]
    setStrokes(prev => [...prev, stroke])
    if (props.wsRef.current?.readyState === WebSocket.OPEN) {
      props.wsRef.current.send(JSON.stringify({
        type: "chat",
        roomId: props.roomId,
        message: JSON.stringify(stroke)
      }))
    }
    setTextInput("")
    setTextPosition(null)
    setIsTyping(false)
    isCommitting.current = false
  }

  function stopDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    if (props.activeTool === "text") return
    if (!isDrawing) return
    let stroke: Stroke | undefined
    if (props.activeTool === "pen") {
      stroke = { points: currentStroke.current, color: props.activeColor, width: 2 }
    } else if (props.activeTool === "rectangle") {
      const start = startPoint.current!
      stroke = { points: [start, { x: e.clientX, y: e.clientY }], color: props.activeColor, width: 2, tool: "rectangle", filled: props.filled }
    } else if (props.activeTool === "circle" || props.activeTool === "line" || props.activeTool === "arrow" || props.activeTool === "square") {
      const start = startPoint.current!
      stroke = { points: [start, { x: e.clientX, y: e.clientY }], color: props.activeColor, width: 2, tool: props.activeTool, filled: props.filled }
    } else if (props.activeTool === "eraser") {
      stroke = { points: currentStroke.current, color: "white", width: 60, tool: "eraser" }
    }
    if (!stroke) return
    strokesRef.current = [...strokesRef.current, stroke]
    setStrokes(prev => [...prev, stroke!])
    if (props.wsRef.current?.readyState === WebSocket.OPEN) {
      props.wsRef.current.send(JSON.stringify({
        type: "chat",
        roomId: props.roomId,
        message: JSON.stringify(stroke)
      }))
    }
    currentStroke.current = []
    startPoint.current = null
    setIsDrawing(false)
  }

  return {
    canvasRef,
    strokesRef,
    startDrawing,
    draw,
    stopDrawing,
    drawStroke,
    commitText,
    isTyping,
    textPosition,
    textInput,
    setTextInput,
    setTextPosition,
    setIsTyping
  }
}