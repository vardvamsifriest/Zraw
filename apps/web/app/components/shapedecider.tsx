import { useState } from "react"
interface ShapeDeciderProps {
  filled: boolean
  setFilled: (v: boolean) => void
}

export function ShapeDecider(props: ShapeDeciderProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => props.setFilled(true)}
        className={`px-4 py-2 rounded-md font-geist text-sm transition-all outline-2 outline-black ${props.filled ? "bg-slate-200" : "hover:bg-gray-200"}`}>
        Filled
      </button>
      <button
        onClick={() => props.setFilled(false)}
        className={`px-4 py-2 rounded-md font-geist text-sm transition-all ${!props.filled ? "bg-slate-200" : "hover:bg-gray-200"}`}>
        Outline
      </button>
    </div>
  )
}