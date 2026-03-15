interface ColorBarProps {
  activeColor: string
  setActiveColor: (color: string) => void
}

export function ColorBar(props:ColorBarProps) {
  console.log("activecolor:" , props.activeColor)
  return (
    <div className="bg-zinc-100 h-20 w-110 rounded-md shadow-xl px-4 flex items-center gap-2">
      <img src="/images/colors/color_white.png" onClick={()=>props.setActiveColor("white")} className= {`${props.activeColor=="white" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_red.png"  onClick={()=>{props.setActiveColor("red") 
        console.log("red was clicked")} }className={`${props.activeColor=="red" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_blue.png"  onClick={()=>{props.setActiveColor("blue")}} className={`${props.activeColor=="blue" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_purple.png"  onClick={()=>props.setActiveColor("purple")} className={`${props.activeColor=="purple" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_pink.png"  onClick={()=>props.setActiveColor("pink")} className={`${props.activeColor=="pink" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_yellow.png"  onClick={()=>props.setActiveColor("yellow")} className = {`${props.activeColor=="yellow" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_green.png"  onClick={()=>props.setActiveColor("green")} className={`${props.activeColor=="green" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`}/>
      <img src="/images/colors/color_teal.png"  onClick={()=>props.setActiveColor("teal")} className={`${props.activeColor=="teal" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
      <img src="/images/colors/color_orange.png"  onClick={()=>props.setActiveColor("orange")} className={`${props.activeColor=="orange" ? "ring-2 ring-slate-700 rounded-full":""} h-10 w-10`} />
    </div>
  )
}