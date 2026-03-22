import { Button } from "@repo/ui/button"
import {useState , useEffect} from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface usercardprops {
    needdashboard:boolean,
    
}
export function UserCard(props:usercardprops)
{    
    const router = useRouter()
    const [username, setUsername] = useState("")
    useEffect(() => {
  const token = localStorage.getItem("token")
  axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
    headers: { authorization: token }
  }).then(res => setUsername(res.data.user.username))
}, [])
    return (
        <div className="bg-slate-800 w-72 h-72 outline-2 outline-slate-700 rounded-md shadow-xl">
            <div className="flex justify-center pt-4">
            <p className="text-white font-azeret">
               Hi , {username}
            </p>
            
            </div>
            <div > 
                <div className="flex items-center justify-center pt-20 ">
            {props.needdashboard &&   <Button text ="Dashboard" size="md" variant="primary" img={<img src ="/turn.gif" className="h-10 w-10"/>} onClick={()=>router.push("/dashboard")} />  }
            </div>
            <div className="flex items-center justify-center pt-4 ">
            <Button text = "Logout" onClick={()=>router.push("/signin")} size="md" variant="primary" img={<img src ="/turn.gif" className="h-10 w-10"/>} />
            </div>
            </div>
        </div>
    )
}