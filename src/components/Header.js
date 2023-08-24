import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contextApi/UserContex';

const Header = () => {

    const {setUserInfo,userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch("http://localhost:4000/profile" , {
            credentials: "include",
        })
        .then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });

    } , [setUserInfo]);


    function logout(){
        fetch('http://localhost:4000/logout' ,{
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }


    const username = userInfo?.username

  return (
    <header>
            <Link to="/" className="logo">AniBlog</Link>
        
            <nav>
              {
                username && (

                    <div className='nav'>

                        <Link to="/create" class='new-post'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>

                         New post</Link>

                        <a onClick={logout}>Logout</a>

                    </div>
                )
              }

              {
                !username && (
                    <div className='nav'>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )
              }
            </nav>

        </header>
  )
}

export default Header