import { useState } from 'react'
import './style/app.css'
import Navbar from './components/Navbar'
import List from './components/List'
import { Routes, Route } from "react-router-dom"
import AddTask from './components/AddTask'
import UpdateTask from './components/UpdateTask'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Protected from './components/Protected'

function App() {
  const [login, setLogin] = useState(!!localStorage.getItem("login"));

  return (
    <>
      <Navbar login={login} setLogin={setLogin} />
      <Routes>
        <Route path='/' element={<Protected login={login}><List/></Protected>} />
        <Route path='/add' element={<Protected login={login}><AddTask/></Protected>} />
        <Route path='/update/:id' element={<Protected login={login}><UpdateTask/></Protected>} />
        <Route path='/signup' element={<SignUp setLogin={setLogin}/>}></Route>
        <Route path='/login' element={<Login setLogin={setLogin}/>}></Route>
      </Routes>
    </>
  )
}

export default App
