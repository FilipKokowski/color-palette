import { Color } from "./intefaces";


export default async function getColor(hex = 'ffffff'){

    if(hex.length != 6 && hex.length > 0)
        hex += '0'.repeat(6 - hex.length);

    const color = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);

    if(!color.ok)
        throw new Error(`An error has occured: ${color.status}`);

    const data : Color = await color.json();

    return data;
}