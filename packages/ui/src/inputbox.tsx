interface inputprops
{
    placeholder:string,
    id:string
}
export function InputBox(props:inputprops)
{
    return (
        <div>
            <label htmlFor={props.id}>
                {props.id}
            <input className="border font-geist border-gray-300 rounded-md p-2 text-sm outline-none focus:border-gray-500 font-geist " type = "text" id={props.id} placeholder={props.placeholder}/>
            </label>
        </div>
    )
}