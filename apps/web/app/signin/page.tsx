import { Card } from "@repo/ui/card"
import { Logo } from "@repo/ui/logo"
export default function Signin()
{
    return (
        <div className="bg-slate-900 w-full h-screen">
            <div className="bg-slate-900 flex justify-center h-24 w-full border-b-4 border-slate-700">
                <Logo/>
            </div>
            <div className="flex justify-center pt-30">
            <Card text="Submit" size="sm" needusername={false} title="Sign In" link={false} />
            </div>
        </div>
    )
}