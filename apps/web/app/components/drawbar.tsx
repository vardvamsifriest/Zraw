import { ToolBar} from "./toolbar";
import { ColorBar} from "./colorbar";
import { ShapeDecider } from "./shapedecider";
import { Button } from "@repo/ui/button";
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
    <div className="bg-slate-500 flex items-center gap-2 h-24 p-2 gap-2 rounded-md shadow-xl">
      <ToolBar activeTool={props.activeTool} setActiveTool={props.setActiveTool} />
      <ColorBar activeColor={props.activeColor} setActiveColor={props.setActiveColor} />
      <ShapeDecider filled={props.filled} setFilled={props.setFilled} />
      <div className=" hidden md:flex items-center gap-1">
       <button onClick={() => props.setFontSize(16)} className={`px-2 py-1 text-xs rounded ${props.fontSize === 16 ? "bg-slate-200" : "hover:bg-gray-200"}`}>S</button>
      <button onClick={() => props.setFontSize(24)} className={`px-2 py-1 text-sm rounded ${props.fontSize === 24 ? "bg-slate-200" : "hover:bg-gray-200"}`}>M</button>
       <button onClick={() => props.setFontSize(36)} className={`px-2 py-1 text-lg rounded ${props.fontSize === 36 ? "bg-slate-200" : "hover:bg-gray-200"}`}>L</button>
          </div>
          
        <div>
</div>
    </div>
  )
}