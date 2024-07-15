export interface Color{
    name : ColorName,
    hex: {
        value : string,
        clean : string
    },
    image : {
        bare : string,
        named : string
    }
}

export interface ColorName{
    value : string,
    closest_named_hex : string,
    exact_match_name : boolean,
    distance : number
}
