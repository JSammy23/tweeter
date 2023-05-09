import React, { useState } from "react";
import { login } from "services/auth";
import { useNavigate, Link } from "react-router-dom";
import './LoginPage.Styles.css'; 
import styled from "styled-components";  

const Background = styled.div`
    background-color: ${props => props.theme.colors.bgDark};
    width: 100vw;
    height: 100vh;
`


// TODO:
// 1. Handle Forgotten Password
// 2. Add Google sign in

const LoginPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        login(email, password)
            .then(() => {
                console.log('Logged in successfully!')
                navigate('/home');
            })
            .catch((error) => {
                setError(error.message)
            });
    };

    const handleInputChange = (e) => {
        if (e.target.value !== '') {
            e.target.parentElement.classList.add('has-value');
        } else {
            e.target.parentElement.classList.remove('has-value');
        }
    };

    


  return (
    <Background>
        <div className="login-box">
            <form onSubmit={handleLogin}>
                <div className="user-box">
                    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                    <label htmlFor="email" >Email</label>
                </div>
                <div className="user-box">
                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                    <label htmlFor="password" >Password</label>
                </div>
                <div className="info">
                    <p>Don't have an account? Click sign up below.</p>
                </div>
                <div className="controls">
                    <button className="login-button" type="submit">Log In</button>
                    <Link to='/signup' className="sign-up-button" >Sign Up</Link>
                </div>
                {error && <div className='error'>{error}</div>}
            </form>
        </div>
    </Background>
  )
}

export default LoginPage