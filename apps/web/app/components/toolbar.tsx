interface toolbarprops {
  activeTool: string
  setActiveTool: (tool: string) => void
}
export function ToolBar(props: toolbarprops) {
  const tools = [
    { name: "pen", icon: "/images/tools/tool_pen.png" },
    { name: "line", icon: "/images/tools/tool_line.png" },
    { name: "square", icon: "/images/tools/tool_square.png" },
    { name: "rectangle", icon: "/images/tools/tool_rectangle.png" },
    { name: "circle", icon: "/images/tools/tool_circle.png" },
    { name: "arrow", icon: "/images/tools/tool_arrow.png" },
    { name: "eraser", icon: "/images/tools/tool_eraser.png" },
  ]

  return (
    <div className="bg-zinc-100 h-20 w-90 flex items-center rounded-md shadow-xl gap-2 px-4">
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