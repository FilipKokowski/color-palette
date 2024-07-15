import { ChangeEvent, createRef, LegacyRef, useContext, useEffect, useState } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/userContextProvider";
import error from "../utils/errors";
import { sha256 } from "js-sha256";

export function Login(){

    const context = useContext(userContext);
    
    const navigate = useNavigate();

    const homeRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLDivElement>();

    const logInRef = createRef<HTMLDivElement>();
    const usernameRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    const [err, setErr] = useState<string | boolean>(false);

    let prevColor = "";

    const [register, setRegister] = useState<boolean>(false);

    const highlight = (event : React.MouseEvent<SVGElement, MouseEvent> | React.MouseEvent<HTMLHeadingElement, MouseEvent>, ref = createRef<HTMLDivElement | HTMLInputElement>()) => {
        if(event.type == 'mouseenter'){
            prevColor = ref.current!.style.color;
            ref.current!.style.color = ref.current!.id == 'login' ? 'coral' : (error('password', passwordRef.current!.value) == true && usernameRef.current!.value != "" && usernameRef.current!.value != undefined ? '#758542' : 'white');
        }
        else if(event.type == 'mouseleave')
            ref.current!.style.color = prevColor;
    }

    const validateData = () => {  
        if(usernameRef.current!.value != "" && usernameRef.current!.value != undefined && error('password', passwordRef.current!.value) == true)
            logInRef.current!.style.color = '#cade8a'
        else
            logInRef.current!.style.color = 'white'
        
    }

    const validatePass = () => {
        passwordRef.current!.value.length > 0 ?
            setErr(error('password', passwordRef.current!.value))
        :
            setErr(false)
    }

    useEffect(() => {
        
        console.log(context)

        if(context?.state.username){
            window.localStorage.setItem(context.state.username, JSON.stringify(context.state));

            window.localStorage.setItem('currentUser', context.state.username);

            navigate('/');
        }
        
    }, [context])

    const auth = (type : string) => {

        switch(type){
            case 'login':
                const user = localStorage.getItem(usernameRef.current!.value)            

                if(user === null) break;

                context?.setState(JSON.parse(user))

                

                break;

            case 'register':
                
                context?.setState({
                    username: usernameRef.current!.value,
                    hash: sha256(passwordRef.current!.value),
                    loggedIn: true,
                    favourites: []
                })

                break;
        }
    }

    return(
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1 ref={titleRef} style={{ marginBottom: '0', color:'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>C<div id='login' ref={homeRef}><IoArrowBackCircle onMouseEnter={(e) => highlight(e, homeRef)} onMouseLeave={(e) => highlight(e, homeRef)} onClick={() => navigate('/')} fontSize={'75%'} style={{height: '100%', marginTop: '3.5vh', transition: 'color .23s ease'}}></IoArrowBackCircle></div>lors</h1>
            <div>
                {(!register) ?
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <h2 id="login" onClick={() => auth('login')} ref={logInRef} onMouseEnter={(e) => highlight(e, logInRef)} onMouseLeave={(e) => highlight(e, logInRef)} style={{transition: 'color .5s ease', color: 'white'}}>Login</h2>
                        <input ref={usernameRef} onChange={validateData} onBlur={validatePass} name="username" type="text" placeholder="Username" style={{ marginBottom: '3vh', textAlign: 'center', width: '25vh',height: '5vh', borderRadius: '2vh', border: 'none', backgroundColor: 'rgb(63, 63, 63)', fontSize: '75%'}}></input>
                        <input ref={passwordRef} onChange={validateData} onBlur={validatePass} name="password" type="password" placeholder="Password" style={{marginBottom: '3vh', textAlign: 'center', width: '25vh', height: '5vh', borderRadius: '2vh', border: 'none', backgroundColor: 'rgb(63, 63, 63)', fontSize: '75%'}}></input>
                        <h4 style={{fontSize: '2vh', marginTop: '0'}} onClick={() => setRegister(true)}>Or register...</h4>
                    </div> :
                    <div>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <h2 id="register" onClick={() => auth('register')} ref={logInRef} onMouseEnter={(e) => highlight(e, logInRef)} onMouseLeave={(e) => highlight(e, logInRef)} style={{transition: 'color .5s ease', color: 'white'}}>Register</h2>
                            <input ref={usernameRef} onChange={validateData} onBlur={validatePass} name="username" type="text" placeholder="Username" style={{ marginBottom: '3vh', textAlign: 'center', width: '25vh',height: '5vh', borderRadius: '2vh', border: 'none', backgroundColor: 'rgb(63, 63, 63)', fontSize: '75%'}}></input>
                            <input ref={passwordRef} onChange={validateData} onBlur={validatePass} name="password" type="password" placeholder="Password" style={{marginBottom: '3vh', textAlign: 'center', width: '25vh', height: '5vh', borderRadius: '2vh', border: 'none', backgroundColor: 'rgb(63, 63, 63)', fontSize: '75%'}}></input>
                            <h4 style={{fontSize: '2vh', marginTop: '0'}} onClick={() => setRegister(false)}>Or login...</h4>
                        </div>
                        <i style={{fontSize: '2vh', marginTop: '0'}}>{err}</i>
                    </div>
                }
            </div>
        </div>
    )

}