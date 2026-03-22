interface LogoProps {
  size?: "sm" | "lg"
}

export function Logo({ size = "lg" }: LogoProps) {
  return (
    <div className="flex items-center">
      <img src="/pen.gif" className={size === "sm" ? "h-10 w-10" : "h-20 w-20"} />
      <p className={`text-white font-azeret font-bold ${size === "sm" ? "text-2xl" : "text-8xl"}`}>
        ZRAW
      </p>
    </div>
  )
}