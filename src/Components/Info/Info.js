import React,{Component} from "react"
import "./Info.css"
import {Link} from "react-router-dom"
import Welcome from "../functionalComponents/Welcome"

class Info extends Component{

  constructor(props){
    super(props)
    this.state = {

    }
  }

    render(){
      return(
        <main className=  "info container-fluid">
          <div className="jumbotron jumbotron-fluid">
            <h1 className="display-3">INVENTORY MANAGEMENT SYSTEM SOFTWARE</h1>
            <hr className="my-4"/>
            <br/>
            <Welcome />
            <p className = "lead">kindly click on settings below to provide your company's information. Thanks</p>
            <p className="lead mt-4">
              <Link to = {"/settings"}>
                <a className="btn settings-btn btn-lg" href="#" role="button">Settings</a>
              </Link>
            </p>
          </div>
        </main>
      )
    }
}











export default Info
