import { InputBox } from "./inputbox";
import { Button } from "./button";
import Link from "next/link";
interface cardprops {
  size: "sm" | "md" | "lg";
  needusername: boolean;
  text: string;
  title:string;
  link:boolean
}

const SizeStyles = {
  "sm": "h-72 w-72",
  "md": "h-104 w-84",
  "lg": "h-96 w-96"
}

export function Card(props: cardprops) {
  return (
    <div className={`${SizeStyles[props.size]} bg-zinc-100 backdrop-blur-sm border-4 border-slate-500 rounded-xl shadow-xl p-6 flex flex-col gap-4`}>
       <div className="flex justify-center">
      <p className="font-geist text-2xl font-semibold">
        {props.title}  
      </p>
      </div>
      <div>
        <InputBox placeholder="email" id="Enter your email:" />
      </div>
      <div>
        <InputBox placeholder="password" id="Enter your password:" />
      </div>
      {props.needusername && (
        <div>
          <InputBox placeholder="username" id="Enter your username:" />
        </div>
      )}
      <div className="flex justify-center">
      <Button text={props.text} variant="secondary" size="md" />
      </div>
      <div className="flex justify-center">
      {props.link && ( <Link href={"/signin"} className="text-sm font-geist text-black hover:cursor-pointer">Already have an account?</Link>)}
     </div>
    </div>
  )
}