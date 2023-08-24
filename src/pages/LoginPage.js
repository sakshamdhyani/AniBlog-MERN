import React, { useContext } from 'react'
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contextApi/UserContex';

const LoginPage = () => {

    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [redirect , setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login (event){

        event.preventDefault();

        const response = await fetch("http://localhost:4000/login" , {
            method: "POST",
            body: JSON.stringify({username,password}),
            headers: {'Content-Type' : 'application/json'},
            credentials: 'include',
        })

        if(response.ok){

            response.json().then(userInfo => {
                setUserInfo(userInfo);  //it is updated here to rerender the header
                setRedirect(true);
            })
            
        }else{
            alert("Wrong Credentials");
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

  return (
    
        <form className='login' onSubmit={login}>
            <h1>Login</h1>

            <input type="text" 
            placeholder='username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            />

            <input type="password" 
            placeholder='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />

            <button>Login</button>
        </form>
    
  )
}

export default LoginPage