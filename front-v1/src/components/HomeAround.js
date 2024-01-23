import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import Navbar from './navbar';

export default function HomeAround() {

 
  return (
    <>
<Navbar />
<div  className='card' style={{width:95+'%' , marginLeft:'auto',marginRight:'auto',marginTop:150+'px', height:80+'vh',overflow:'auto',boxSizing:'border-box' }}>


 
  <Outlet ></Outlet>
  </div>
    
    </>
  )
}
