import React from "react"
import logo from "../../logo.svg"
import "./Footer.css"

//creating a functional Footer component

const Footer = (props)=>{
  const year = new Date().getFullYear()
  return(
    <footer className = "app-footer container-fluid">
      <p className = "footer-content">&copy; {props.companyName} {year} | Developed @ Padnet Enterprise</p>
    </footer>
  )
}


export default Footer
