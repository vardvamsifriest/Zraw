interface inputprops
{
    placeholder:string,
    id:string
}
export function InputBox(props: inputprops) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.id} className="text-sm font-geist font-medium text-gray-600">
        {props.id}
      </label>
      <input
        className="border font-geist border-gray-300 rounded-md p-2 text-sm outline-none focus:border-gray-500"
        type="text"
        id={props.id}
        placeholder={props.placeholder}
      />
    </div>
  )
}