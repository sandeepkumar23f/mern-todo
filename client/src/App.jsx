import { useState } from 'react'
import './style/app.css'
import Navbar from './components/Navbar'
import List from './components/List'
import {Routes,Route} from "react-router-dom"
import AddTask from './components/AddTask'
import UpdateTask from './components/UpdateTask'
import SignUp from './components/SignUp'
import Login from './components/Login'
function App() {

  return (
    <>
    <Navbar/>
      <Routes>
        <Route path='/' element={<List/>} />
        <Route path='/add' element={<AddTask/>} />
        
        <Route path='/update/:id' element={<UpdateTask/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
    </>
  )
}

export default App
