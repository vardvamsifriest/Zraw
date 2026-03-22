import { ToolBar } from "./toolbar"
import { ColorBar } from "./colorbar"
import { ShapeDecider } from "./shapedecider"

interface DrawBarProps {
  filled: boolean
  setFilled: (v: boolean) => void
  activeTool: string
  setActiveTool: (tool: string) => void
  activeColor: string
  setActiveColor: (color: string) => void
  fontSize: number
  setFontSize: (size: number) => void
}

export function DrawBar(props: DrawBarProps) {
  return (
    <div className="bg-slate-500 flex items-center gap-2 h-24 p-2 rounded-md shadow-xl">
      <ToolBar activeTool={props.activeTool} setActiveTool={props.setActiveTool} />
      <ColorBar activeColor={props.activeColor} setActiveColor={props.setActiveColor} />
      <ShapeDecider filled={props.filled} setFilled={props.setFilled} />
      <div className="flex items-center gap-1">
        <button onClick={() => props.setFontSize(16)} className={`px-2 py-1 text-xs rounded font-geist text-white ${props.fontSize === 16 ? "bg-slate-300 text-black" : "hover:bg-slate-400"}`}>S</button>
        <button onClick={() => props.setFontSize(24)} className={`px-2 py-1 text-sm rounded font-geist text-white ${props.fontSize === 24 ? "bg-slate-300 text-black" : "hover:bg-slate-400"}`}>M</button>
        <button onClick={() => props.setFontSize(36)} className={`px-2 py-1 text-lg rounded font-geist text-white ${props.fontSize === 36 ? "bg-slate-300 text-black" : "hover:bg-slate-400"}`}>L</button>
      </div>
    </div>
  )
}