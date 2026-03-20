"use client"
import { Card } from "@repo/ui/card"
import { Logo } from "@repo/ui/logo"
import axios from "axios"
import { useRouter } from "next/navigation"
export default function Signin()
{ const router = useRouter()
    async function HandleSignin(email:string , password:string,username:string)
    {
            try {
            const response = await axios.post("http://localhost:3001/signin" , {
            email,
            password
        })
       
        if(response.data.token)
        {
            const token = response.data.token
            localStorage.setItem("token", response.data.token)
           router.push("/dashboard")
        }
        else{
            console.log("Login Failed" , response.data.message)
        }
    }
    catch(e:any)
    {
        console.log("Signin Failed" , e?.response?.data || e.message)
    }
    }
    return (
  <div className="bg-slate-900 min-h-screen w-full flex flex-col">
    <div className="flex justify-center items-center h-24 w-full border-b-4 border-slate-700">
      <Logo />
    </div>
    <div className="flex justify-center items-center flex-1 px-4">
      <Card onClick={HandleSignin} text="Submit" size="sm" needusername={false} title="Sign In" link={false} />
    </div>
  </div>
)
}