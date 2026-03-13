interface buttonprops {
  "size":"lg"|"md"|"sm",
  "variant":"primary"|"secondary",
  text:string,
  onClick?:()=>void
}
const SizeStyles = {
"sm":"p-2",
"md":"p-4",
"lg":"p-8"
}
const VariantStyles = {
"primary":"bg-white text-black transition-all hover:pointer-cursor hover:scale-110 font-geist rounded-md shadow-xl",
"secondary":"bg-slate-900 text-white transition-all hover:pointer-cursor hover:scale-110 font-geist rounded-md shadow-xl"
}
export function Button(props:buttonprops)
{
  return (
    <div>
      <button onClick = {props.onClick} 
      className={`${SizeStyles[props.size]} ${VariantStyles[props.variant]}`}>{props.text}</button>
    </div>
  )
}