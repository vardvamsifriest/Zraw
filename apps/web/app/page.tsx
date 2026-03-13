"use client"
import { Logo } from "@repo/ui/logo"
import { Button } from "@repo/ui/button"
import { useRouter } from "next/navigation"
export default function Landing()
{
  const router = useRouter();
  return (
    <div className="bg-slate-900 h-screen w-full">
        <div className="flex justify-center pt-5">
        <Logo/>
        </div>
        <div className="flex justify-center">
        <p className="text-white text-4xl font-semibold font-azereti">
          think.
        </p>
        <p className="text-white text-4xl font-semibold font-azereti">
          draw.
        </p>
        <p className="text-white text-4xl font-semibold font-azereti">
          collaborate
        </p>
        </div>
        <div className="flex justify-center ">
          <Button onClick={()=>router.push("/signup")} size="md" text="Get started" variant="primary"/>
        </div>
    </div>
  )
}