import { useState } from "react"
interface toolbarprops {
  activeTool: string
  setActiveTool: (tool: string) => void
  fontSize?:number
}
export function ToolBar(props: toolbarprops) {
  const [fontSize , setFontSize] = useState(20)
  const tools = [
    { name: "pen", icon: "/images/tools/tool_pen.png" },
    { name: "line", icon: "/images/tools/tool_line.png" },
    { name: "square", icon: "/images/tools/tool_square.png" },
    { name: "rectangle", icon: "/images/tools/tool_rectangle.png" },
    { name: "circle", icon: "/images/tools/tool_circle.png" },
    { name: "arrow", icon: "/images/tools/tool_arrow.png" },
    { name: "eraser", icon: "/images/tools/tool_eraser.png" },
    { name: "text", icon:"/images/tools/tool_text.png"}
  ]

  return (
    <div className="bg-zinc-100 h-20 w-100 flex items-center rounded-md shadow-xl gap-2 px-4">
      {tools.map(tool => (
        <img
          key={tool.name}
          src={tool.icon}
          onClick={() => props.setActiveTool(tool.name)}
          className={`h-10 w-10 cursor-pointer rounded-md ${props.activeTool === tool.name ? "ring-2 ring-slate-700" : ""}`}
        />
      ))}
    </div>
  )
}