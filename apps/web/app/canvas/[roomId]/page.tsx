"use client"
import { useState, useRef } from "react"
import { use } from "react"
import { DrawBar } from "../../components/drawbar"
import { Logo } from "@repo/ui/logo"
import { Stroke } from "./types"
import { useCanvas } from "./useCanvas"
import { UserCard } from "../../components/usercard"
import { useWebSocket } from "./useWebSocket"

export default function Canvas({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = use(params)
  const roomId = String(resolvedParams.roomId)
  console.log("roomId type:", typeof roomId, "value:", roomId)

  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [filled, setFilled] = useState(false)
  const [activeTool, setActiveTool] = useState("pen")
  const [activeColor, setActiveColor] = useState("black")
  const [fontSize, setFontSize] = useState(20)
  const fontSizeRef = useRef(20)
  const wsRef = useRef<WebSocket | null>(null)
  const [showUserCard, setShowUserCard] = useState(false)

  function handleSetFontSize(size: number) {
    setFontSize(size)
    fontSizeRef.current = size
  }

  const {
    canvasRef, strokesRef, startDrawing, draw, stopDrawing,
    drawStroke, commitText, isTyping, textPosition, textInput,
    setTextInput, setTextPosition, setIsTyping
  } = useCanvas({
    activeTool,
    activeColor,
    filled,
    fontSizeRef,
    roomId,
    wsRef
  })

  useWebSocket(roomId, strokesRef, setStrokes, drawStroke, wsRef)

  

  return (
    <div className="relative w-screen h-screen bg-white">

      {showUserCard && (
        <div
          className="fixed inset-0 z-50 flex justify-end items-start pt-24 pr-8"
          onClick={() => setShowUserCard(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UserCard needdashboard={true} />
          </div>
        </div>
      )}

      <div className={showUserCard ? "blur-sm pointer-events-none" : ""}>
        <div className="absolute top-0 left-0 w-full bg-slate-900 z-50 flex items-center border-b-4 border-slate-700 justify-between px-6 h-20">
          <div className="flex-shrink-0">
            <Logo size="sm" />
          </div>
          <div>
            <DrawBar
              filled={filled}
              setFilled={setFilled}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              fontSize={fontSize}
              setFontSize={handleSetFontSize}
            />
          </div>
          <div className="flex-shrink-0 cursor-pointer">
            <img
              onClick={() => setShowUserCard(true)}
              src="/images/user.png"
              className="h-8 w-8 hover:opacity-80 transition-all"
            />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {isTyping && textPosition && (
          <input
            autoFocus
            className="absolute bg-transparent border-none outline-none font-geist text-black z-50"
            style={{
              left: textPosition.x,
              top: textPosition.y,
              fontSize: `${fontSizeRef.current}px`
            }}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText()
              if (e.key === "Escape") {
                setTextInput("")
                setTextPosition(null)
                setIsTyping(false)
              }
            }}
            onBlur={(e) => {
              if (e.relatedTarget === canvasRef.current) return
              commitText()
            }}
          />
        )}
      </div>
    </div>
  )
}