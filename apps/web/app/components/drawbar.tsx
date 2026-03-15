import { ToolBar} from "./toolbar";
import { ColorBar} from "./colorbar";
import { ShapeDecider } from "./shapedecider";

interface DrawBarProps {
  filled: boolean
  setFilled: (v: boolean) => void
  activeTool: string
  setActiveTool: (tool: string) => void
  activeColor: string
  setActiveColor: (color: string) => void
}
export function DrawBar(props: DrawBarProps) {
  return (
    <div className="bg-slate-500 flex items-center gap-2 h-24 p-2 gap-2 rounded-md shadow-xl">
      <ToolBar activeTool={props.activeTool} setActiveTool={props.setActiveTool} />
      <ColorBar activeColor={props.activeColor} setActiveColor={props.setActiveColor} />
      <ShapeDecider filled={props.filled} setFilled={props.setFilled} />
    </div>
  )
}