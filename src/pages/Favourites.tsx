import { createRef, useContext, useEffect } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/userContextProvider";
import error from "../utils/errors";
import { getOppositeColor } from "./Home";

import "../App.css";

import { FaStar } from 'react-icons/fa6';
import { Color } from "../API/intefaces";

export default function Favourites(){

    const context = useContext(userContext);

    const navigate = useNavigate();

    const homeRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLDivElement>();

    const usernameRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    let prevColor = "";

    const highlight = (event : React.MouseEvent<SVGElement, MouseEvent> | React.MouseEvent<HTMLHeadingElement, MouseEvent>, ref = createRef<HTMLDivElement | HTMLInputElement>()) => {
        if(event.type == 'mouseenter'){
            prevColor = ref.current!.style.color;
            ref.current!.style.color = ref.current!.id == 'login' ? 'coral' : (error('password', passwordRef.current!.value) == true && usernameRef.current!.value != "" && usernameRef.current!.value != undefined ? '#758542' : 'white');
        }
        else if(event.type == 'mouseleave')
            ref.current!.style.color = prevColor;
    }

    useEffect(() => {
        window.localStorage.setItem(context?.state.username!, JSON.stringify(context?.state!))
    }, [context])


    const removeFromFavourites = (c : Color) => {
        context?.setState((prevState) => ({
            ...prevState,
            favourites : prevState.favourites.filter(favourite => favourite !== c),
        }));

    };

    return(
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1 ref={titleRef} style={{ marginBottom: '0', color:'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Fav<div id='login' ref={homeRef}><IoArrowBackCircle onMouseEnter={(e) => highlight(e, homeRef)} onMouseLeave={(e) => highlight(e, homeRef)} onClick={() => navigate('/')} fontSize={'75%'} style={{height: '100%', marginTop: '3.5vh', transition: 'color .23s ease'}}></IoArrowBackCircle></div>urite</h1>
            <div style={{width: '96vw', height: '37vh', display: 'flex', justifyContent:'space-evenly', alignItems: 'center', overflowX: 'scroll', overflowY: 'hidden'}}>
                {context?.state.favourites.map((elem) => {
                    return(
                        <div key={elem.hex.clean} style={{margin: '1vh 1vh 1vh 1vh', minWidth: '30vh', minHeight: '30vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: elem?.hex != undefined ? elem.hex.value : '#ffffff', width: '30vh', height: '30vh', borderRadius: '4vh', transition: 'background-color .25s ease'}}>
                            <div style={{display: 'flex', justifyContent: 'end', width: '100%', height: '20%', color: getOppositeColor(elem?.hex == undefined ? "#ffffff" : elem.hex.value)}}>
                                <div onClick={() => removeFromFavourites(elem)} style={{zIndex: '100', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%', margin: '.5vh .5vh 1vh 1vh', transition: 'color .5s ease'}}>
                                <FaStar id={elem.hex.clean}></FaStar>
                                </div>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-10%', width: '100%', height: '80%'}}>
                            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                <i style={{color: getOppositeColor(elem?.hex == undefined ? "#ffffff" : elem.hex.value), transition: 'color .5s ease', textAlign: 'center'}}><b>{elem?.name?.value == undefined ? "White" : elem?.name?.value}</b></i>
                                <i style={{color : getOppositeColor(elem?.hex == undefined ? "#ffffff" : elem.hex.value), fontSize: '60%', userSelect: 'all'}}>{elem.hex.value}</i>
                            </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}