import { ReactElement } from "react"

interface buttonprops {
  "size":"lg"|"md"|"sm",
  "variant":"primary"|"secondary",
  text:string,
  onClick?:()=>void,
  img?:ReactElement
}
const SizeStyles = {
  "sm":"p-2",
  "md":"p-3",
  "lg":"p-8"
}
const VariantStyles = {
"primary":"bg-white text-black transition-all hover:cursor-pointer hover:scale-110 font-geist rounded-md shadow-xl",
"secondary":"bg-slate-600 text-white transition-all hover:cursor-pointer hover:scale-110 font-geist rounded-md shadow-xl"
}
export function Button(props:buttonprops)
{
  return (
    <div>
      <button onClick = {props.onClick} 
      className={`${SizeStyles[props.size]} ${VariantStyles[props.variant]}`}>
        <div className="flex items-center gap-2"
        >
        {props.img ?? props.img}{props.text}
        </div>
        </button>
    </div>
  )
}