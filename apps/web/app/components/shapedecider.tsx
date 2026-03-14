import { Button } from "@repo/ui/button"
export function ShapeDecider() {
  return (
    <div className="flex bg-zinc-100 rounded-md shadow-xl overflow-hidden">
      <Button size="lg" text="Filled" variant="primary" active={true} />
      <Button size="lg" text="Outline" variant="secondary" active={false} />
    </div>
  )
}