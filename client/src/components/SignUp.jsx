import { useState } from "react";
import "../style/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SignUp() {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  // restrict the user to signup if already signup 
  
  // useEffect(()=>{
  //   if(localStorage.getItem('signup')){
  //     navigate('/')
  //   }
  // })
  const handleSignUp = async () => {
    console.log(userData);
    let result = await fetch("http://localhost:5000/signup", {
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
      localStorage.setItem('signup',userData.email)
      navigate('/')
    } else{
      alert("invalid credentials")
    }
  };
  return (
    <div className="container">
      <h1>Sign Up</h1>

      <label htmlFor="">Name</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, name: event.target.value })
        }
        type="text"
        name="name"
        placeholder="Enter user name"
      />
      <label htmlFor="">Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="text"
        name="email"
        placeholder="Enter user email"
      />
      <label htmlFor="">Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="text"
        name="password"
        placeholder="Enter user password"
      />
      <button onClick={handleSignUp} className="submit">
        Sign up
      </button>

      <Link to="/login">Login</Link>
    </div>
  );
}
