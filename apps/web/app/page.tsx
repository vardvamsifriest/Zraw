"use client"
import { Logo } from "@repo/ui/logo"
import { Button } from "@repo/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const images = [
  "/images/screenshots/canvas1.png",
  "/images/screenshots/canvas2.png",
]

export default function Landing() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-900 min-h-screen w-full">
      
  
<div className="relative flex items-center justify-center px-8 py-4 border-b border-slate-700">
  <div className="absolute left-8">
    
  </div>
  <Logo />
  <div className="absolute right-8">
    <Button img={<img src = "arrow_v1.gif" className="h-10 w-10"/>} onClick={() => router.push("/signup")} size="sm" text="Get Started" variant="primary" />
  </div>
</div>

     
      <div className="flex flex-col items-center pt-16 gap-4">
        <p className="text-white text-6xl font-bold font-azeret tracking-tight">
          Draw.Think.Collaborate.
        </p>
        <p className="text-slate-400 text-xl font-geist">
          The open canvas for your best ideas.
        </p>
        <div className="mt-4">
          <Button img={<img src = "arrow_v1.gif" className="h-10 w-10"/>}  onClick={() => router.push("/signup")} size="md" text="Get Started" variant="primary" />
        </div>
      </div>

      
      <div className="flex justify-center mt-12 px-8">
        <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              className={`w-full transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 absolute inset-0"}`}
            />
          ))}
        </div>
      </div>

    
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-2 bg-slate-600"}`}
          />
        ))}
      </div>

    </div>
  )
}