import { createRef, useContext, useEffect, useState } from 'react'

import { FaStar } from 'react-icons/fa6';
import { MdAccountCircle, MdStars } from "react-icons/md";
import { IoIosExit } from "react-icons/io";

import "../App.css"

import getColor from '../API/apiCall'
import { Color } from '../API/intefaces';
import { userContext } from '../contexts/userContextProvider';
import { useNavigate } from 'react-router-dom';

export const getHighlightedColor = (c : string) => {
    let red = parseInt(c.substring(1,3), 16);  
    let green = parseInt(c.substring(3,5), 16);    
    let blue = parseInt(c.substring(5,7), 16); 

    return `#${(red < 128 ? red + 50 : red - 50).toString(16)}${(green < 128 ? green + 50 : green - 50).toString(16)}${(blue < 128 ? blue + 50 : blue - 50).toString(16)}`
}

export const getOppositeColor = (c : string) => {
    if(c.length != 6 && c.length > 0)
        c += '0'.repeat(7 - c.length);

    let oppositeRed = 255 - parseInt(c.substring(1,3), 16);  
    let oppositeGreen= 255 - parseInt(c.substring(3,5), 16);    
    let oppositeBlue = 255 - parseInt(c.substring(5,7), 16);  

    return `#${oppositeRed.toString(16).length < 2 ? oppositeRed.toString(16) + '0' : oppositeRed.toString(16)}${oppositeGreen.toString(16).length < 2 ? oppositeGreen.toString(16) + '0' : oppositeGreen.toString(16)}${oppositeBlue.toString(16).length < 2 ? oppositeBlue.toString(16) + '0' : oppositeBlue.toString(16)}`;
}

export function Home(){
    const con = useContext(userContext);

    const [color, setColor] = useState("ffffff");
    const [colorInfo, setColorInfo] = useState<Color>();

    const colorInputRef = createRef<HTMLInputElement>();
    const starRef = createRef<HTMLDivElement>();
    const nameRef = createRef<HTMLDivElement>();
    const loginRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLDivElement>();
    const exitRef = createRef<HTMLDivElement>();

    const navigate = useNavigate();

    const currentUser = JSON.parse(window.localStorage.getItem(window.localStorage.getItem('currentUser')!)!);

    const mouseOver = (ref: React.RefObject<HTMLDivElement>) => {
    
        if(ref.current!.style.color == nameRef.current!.style.color)
        ref.current!.style.color = ref.current!.id == 'login' || ref.current!.id == 'exit' ? (colorInfo?.hex == undefined ? (titleRef.current?.style.color == undefined ? 'white' : titleRef.current?.style.color) : colorInfo.hex.value) : getHighlightedColor(getOppositeColor(color));
        else
        ref.current!.style.color = nameRef.current!.style.color;
    }  

 
    useEffect(() => {
        const call = setTimeout(() => {
        getColor(color)
        .then((res) => {
            setColorInfo({
            name: res.name,
            hex: res.hex,
            image: res.image
            });
        })
        
        }, 250);

        return () => clearTimeout(call);
  }, [color])


  useEffect(() => {
    if(currentUser !== null && con?.state.username !== currentUser.username)
      con?.setState(currentUser)
  }, [con])

  const validateColor = () => {
    
    let input = colorInputRef.current!;
    
    let correctedInput = "";

    for(let index = 0; index < input.value.length; index++){
      const char = input.value.charCodeAt(index);

      if(char === 35 || char > 47 && char < 58 || char > 64 && char < 71 || char > 96 && char < 103)
        correctedInput += input.value[index];
    }
    colorInputRef.current!.value = correctedInput;

    if(input.value !== undefined && input.value[0] !== '#' && input.value.length > 0)
      colorInputRef.current!.value = `#${input.value}`;
    
    else if(input.value?.length == 1 && input.value[0] == '#')
      colorInputRef.current!.value = '';

    setColor(colorInputRef.current!.value[0] === '#' ? colorInputRef.current!.value.substring(1) : colorInputRef.current!.value)
  }

  const addToFavourites = () => {

    let c : Color = colorInfo!;

    if(con?.state.favourites.find(item => item.hex.clean === c.hex.clean) === undefined)
        con?.setState((prevState) => ({
        ...prevState,
        favourites: [...prevState.favourites, c],
        }))

    if(con?.state != undefined && con?.state.favourites.find(item => item.hex.clean === c.hex.clean) === undefined)
        localStorage.setItem(con?.state.username, JSON.stringify({
            username: con.state.username,
            hash: con.state.hash,
            favourites: [...con.state.favourites, c]
        }))
  }

  const logOut = () => {

    console.log('abc')

    window.localStorage.removeItem('currentUser');

    con?.setState({
      username: "",
      favourites: [],
      hash: '',
      loggedIn: false
    })
    
    navigate('/')
  }

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      { currentUser !== null ? 
        <div ref={exitRef} id='exit' style={{width: '100vw', height: '10vh', display: 'flex', justifyContent: 'end', color: colorInfo?.hex == undefined ? titleRef.current?.style.color : colorInfo.hex.value}}>
          <IoIosExit size={'60%'} style={{marginLeft: '90vw', transition: 'color .23s ease'}} onMouseLeave={() => mouseOver(exitRef)} onMouseEnter={() => mouseOver(exitRef)} onClickCapture={logOut} fontSize={'75%'}></IoIosExit>
        </div>
        :
        ''
      }
    <div style={{width: '100vw', height: '90vh', marginTop: '-10vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <h1 ref={titleRef} style={{color:'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>C
          <div id='login' style={{color: colorInfo?.hex == undefined ? titleRef.current?.style.color : colorInfo.hex.value}} ref={loginRef}>
              { currentUser == null ?
                  <MdAccountCircle onClick={() => navigate('login')} onMouseLeave={() => mouseOver(loginRef)} onMouseEnter={() => mouseOver(loginRef)} fontSize={'75%'} style={{height: '100%', marginTop: '3.5vh', transition: 'color .23s ease'}}></MdAccountCircle>
                  :
                  <MdStars onClick={() => navigate('favourites')} onMouseLeave={() => mouseOver(loginRef)} onMouseEnter={() => mouseOver(loginRef)} fontSize={'75%'} style={{height: '100%', marginTop: '3.5vh', transition: 'color .23s ease'}}></MdStars>
              }
          </div>lors</h1>
      <div style={{overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: colorInfo?.hex != undefined ? colorInfo.hex.value : '#ffffff', width: '30vh', height: '30vh', minHeight: '100px', minWidth: '100px', borderRadius: '4vh', transition: 'background-color .25s ease'}}>
        <div ref={starRef} id='favourites' style={{display: 'flex', justifyContent: 'end', width: '100%', height: '20%', color: getOppositeColor(colorInfo?.hex == undefined ? "#ffffff" : colorInfo.hex.value)}}>
            { currentUser != null && con?.state.favourites.find(item => item.hex.clean === colorInfo?.hex.clean) === undefined ?
            <div onClick={() => addToFavourites()} onMouseLeave={() => mouseOver(starRef)} onMouseEnter={() => mouseOver(starRef)} style={{zIndex: '100', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%', margin: '.5vh .5vh 1vh 1vh', transition: 'color .5s ease'}}>
              <FaStar></FaStar>
            </div>
            : ''
            }
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-10%', width: '100%', height: '80%'}}>
          <i ref={nameRef} style={{color: getOppositeColor(colorInfo?.hex == undefined ? "#ffffff" : colorInfo.hex.value), transition: 'color .5s ease', textAlign: 'center'}}><b>{colorInfo?.name?.value == undefined ? "White" : colorInfo?.name?.value}</b></i>
        </div>
      </div>
      <div style={{marginTop: '5vh'}}>
        <input className='ColorInput' maxLength={7} ref={colorInputRef} type='text' id='colorInput' placeholder='#FFFFFF' onInput={validateColor}/>
      </div>
    </div>
   </div>
  )
}
