"use client"
import { Card } from "@repo/ui/card";
import { Logo } from "@repo/ui/logo";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Signup()
{   const router = useRouter()
    async function handleSignup(email:string , password:string , username:string)
    {
        try {
            const response = await axios.post("http://localhost:3001/signup",{
                email,
                password,
                username
            })
            if(response.status==200 || response.status==201)
            {
                router.push("/signin")
            }
        }
        catch(e:any)
        {
            console.log("Signup error:", e?.response?.data || e.message)
        }

    }
    return (
        <div className="bg-slate-900 h-screen w-full">
            <div className="bg-slate-900 flex justify-center h-24 w-full border-b-4 border-slate-700">
                <Logo />
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
            <div className="flex justify-center pt-30">
            <Card onClick={handleSignup} link={true} title="Sign Up" needusername={true} size="md" text="Submit" />
            </div>
        </div>
    )
}