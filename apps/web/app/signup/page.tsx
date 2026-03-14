import { Card } from "@repo/ui/card";
import { Logo } from "@repo/ui/logo";
export default function Signup()
{
    return (
        <div className="bg-slate-900 h-screen w-full">
            <div className="bg-slate-900 flex justify-center h-24 w-full border-b-4 border-slate-700">
                <Logo />
            </div>
            <div className="flex justify-center pt-30">
            <Card link={true} title="Sign Up" needusername={true} size="md" text="Submit" />
            </div>
        </div>
    )
}