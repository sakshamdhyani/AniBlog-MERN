import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {

    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [firstName , setFirstName] = useState('');
    const [lastName , setLastName] = useState('');
    const [email , setEmail] = useState('');
    const [redirect , setRedirect] = useState(false);

    async function register(event){
        event.preventDefault();

        const response = await fetch('http://localhost:4000/register',
        {
            method: 'POST',
            body: JSON.stringify({firstName,lastName,email,username,password}),
            headers: {'Content-Type' : 'application/json'},
        }
        );

        if(response.status === 200){
            setRedirect(true);
            alert("Registration successfull");
        }
        else{
            alert("Registration Failed");
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

  return (

    <form className='register' onSubmit={register}>
        <h1>Register</h1>

        <input type="text" 
        placeholder='First name'
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        />
        <input type="text" 
        placeholder='Last name'
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        />
        <input type="email" 
        placeholder='Email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        />
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

        <button>Register</button>
    </form>

  )
}

export default RegisterPage