import { Card } from "@repo/ui/card";

export default function Signup()
{
    return (
        <div className="bg-slate-900 h-screen flex justify-center items-center w-full">
            <Card link={true} title="Sign Up" needusername={true} size="md" text="Submit" />
        </div>
    )
}