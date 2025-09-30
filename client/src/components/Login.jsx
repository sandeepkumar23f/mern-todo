import { useState } from "react";
import '../style/addtask.css'
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Login(){

    const [userData, setUserData]=useState();
    const navigate=useNavigate()

    // restrict the user to access the login page if they are already login 
    useEffect(()=>{
      if(localStorage.getItem('login')){
        navigate('/')
      }
    })
    const handleLogin = async () => {
    console.log(userData);
    let result = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.success) {
      console.log(result)
      document.cookie="token="+result.token;
      localStorage.setItem('login',userData.email)
      window.dispatchEvent(new Event('localStorage-change'))
      navigate('/')
    } else{
      alert("wrong credentials")
    }
  };

    return(
        <div className="container">
            <h1>Login</h1>
            <label htmlFor="">Email</label>
            <input
            onChange={(event)=>setUserData({...userData,email:event.target.value})}
            type="text" name="email" placeholder="Enter user email" />
            <label htmlFor="">Password</label>
            <input
            onChange={(event)=>setUserData({...userData,password:event.target.value})}
            type="password" name="password" placeholder="Enter user password"/>
            <button onClick={handleLogin} className="submit">Login</button>

            <Link to={"/signup"}>Sign up</Link>
        </div>
    )
}