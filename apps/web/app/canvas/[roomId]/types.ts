export interface Point {
  x: number
  y: number
}

export interface Stroke {
  points: Point[]
  color: string
  width: number
  tool?: string
  filled?: boolean
  text?:string
  fontSize?:number
}