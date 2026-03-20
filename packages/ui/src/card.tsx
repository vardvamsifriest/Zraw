
import { InputBox } from "./inputbox";
import { Button } from "./button";
import Link from "next/link";
import { useState } from "react";
import {CreateUserSchema , SigninSchema} from "@repo/common"
interface cardprops {
  size: "sm" | "md" | "lg";
  needusername: boolean;
  text: string;
  title:string;
  link:boolean
  onClick:(email: string, password: string, username: string)=>void;
}
const SizeStyles = {
  "sm": "h-90 w-72",
  "md": "h-120 w-84",
  "lg": "h-96 w-96"
}

export function Card(props: cardprops) {
  const [email , setEmail] = useState("")
const [password , setPassword] = useState("")
const [username , setUsername] = useState("")
const [error , setError] = useState("")
 function handleClick() {
  setError("")
  
  if (props.needusername) {
    const result = CreateUserSchema.safeParse({ email, username, password })
    if (!result.success) {
      setError(result.error.issues[0]!.message)
      return
    }
  } else {
    const result = SigninSchema.safeParse({ email, password })
    if (!result.success) {
      setError(result.error.issues[0]!.message)
      return
    }
  }

  props.onClick?.(email, password, username)
}
  return (
    <div className={`${SizeStyles[props.size]} bg-zinc-100 backdrop-blur-sm border-4 border-slate-600 rounded-xl shadow-xl p-6 flex flex-col gap-4`}>
       <div className="flex justify-center">
      <p className="font-geist text-2xl font-semibold">
        {props.title}  
      </p>
      </div>
      <div>
        <InputBox placeholder="Enter your email" id="Email:" onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div>
        <InputBox placeholder="Enter your password" id="Password:" onChange={(e)=>setPassword(e.target.value)} />
      </div>
      {props.needusername && (
        <div>
          <InputBox placeholder="Enter your username" id="Username:" onChange={(e)=>setUsername(e.target.value)} />
        </div>
      )}
      {error && (
  <p className="text-red-500 text-sm font-geist text-center">{error}</p>
)}
      <div className="flex justify-center">
      <Button onClick={handleClick} img={<img src = "arrow_v2.gif" className="h-10 w-10"/>} text={props.text} variant="secondary" size="md" />
      </div>
      <div className="flex justify-center">
      {props.link && ( <Link href={"/signin"} className="text-sm font-geist text-black hover:cursor-pointer">Already have an account?</Link>)}
     </div>
    </div>
  )
}