import { SetStateAction, useState } from "react";
import { createContext } from "react";
import { ReactNode, Dispatch } from "react";

import { Color } from "../API/intefaces";

interface AuthState{
    username : string,
    loggedIn: boolean,
    hash: string,
    favourites : Color[]
}

interface AuthContextType {
    state: AuthState,
    setState: Dispatch<SetStateAction<AuthState>>;
}

export const userContext = createContext<AuthContextType | undefined>(undefined);

export const UserContextProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [state, setState] = useState<AuthState>({
        username: "",
        loggedIn: false,
        hash: "",
        favourites: []
    });

    return (
        <userContext.Provider value={{state, setState}}>
            {children}
        </userContext.Provider>
    )
}