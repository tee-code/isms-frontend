import React,{Component} from "react"
import "./Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faCheckCircle,faPlusCircle, faSave, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from "../../Request/Request"
import {Redirect} from "react-router-dom"
import {generateCompanyID,generateAdminID} from "../../helperFunctions/functions.js"

library.add(faCheckCircle,faPlusCircle,faSave,faUserCog)

class Settings extends Component{

  constructor(props){
    super(props)

    this.state = {

        name: "",
        email: "",
        phoneNumber1: "",
        phoneNumber2: "",
        address: "",
        username: "",
        password: "",
        adminID: "",
        addedBy: "DEFAULT",
        status1: false,
        status2: false,
        status: false,
        companyName: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.setData = this.setData.bind(this)
    this.getData = this.getData.bind(this)
    this.clearStatus = this.clearStatus.bind(this)
    this.handleAdmin = this.handleAdmin.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount(){
    setTimeout(()=>{
      this.fetchData()
    },1000)
    
  }

  clearStatus(){

    setTimeout(()=>{
      this.setState({
        status1:false,
        status2:false
      })
      this.refs.companyForm.reset()
    },3000)
  }

   fetchData(){
    const request = new Request("manageCompany.php")
    const bodyMessage = `get=true`
    
    request.post(bodyMessage).then((response)=>{
      const responseJSON = JSON.parse(response)
      
      if(responseJSON.status){
        this.setState({
          status: responseJSON.status,
          companyName: responseJSON.name
        })
      }
    })
  }

  setData(key,value){
    localStorage.setItem(key,JSON.stringify(value))
  }

  getData(key){
    return localStorage.getItem(key)
  }

  handleInput(e){
    e.preventDefault()
    e.persist()
    this.setState({
      [e.target.name] : e.target.value
    })
    
  }

  handleSubmit(e){
   
    e.preventDefault()
   
    const request = new Request("addCompanyDetails.php")
    const bodyMessage = `add=true&name=${this.state.name}&email=${this.state.email}&phoneNumber1=${this.state.phoneNumber1}&phoneNumber2=${this.state.phoneNumber2}&address=${this.state.address}&companyID=${generateCompanyID(this.state.name)}`
    request.post(bodyMessage).then((response)=>{
      const responseJSON = JSON.parse(response)
      if(responseJSON.status){
        this.setData("companyID",responseJSON.companyID)
        this.setState({status1:true})
        this.clearStatus()
        return(<Redirect to = "/login" />)
      }
    })
  }

  handleAdmin(e){
    e.preventDefault()
   
    const request = new Request("adduser.php")
    const bodyMessage = `add=true&name=${this.state.companyName}&username=${this.refs.username.value}&password=${this.state.password}&userType=admin&addedBy=${this.state.addedBy}`
    
    request.post(bodyMessage).then((response)=>{
      const responseJSON = JSON.parse(response)
      if(responseJSON.status){
        this.setData("defaultID",responseJSON.username)
        this.setState({status2:true})
        this.clearStatus()
        if(this.state.status1){
          return(<Redirect to = "/login" />)
        }
      }
    })

  }

  //render function

  render(){
    
    if(!this.state.status || (this.state.status1 && this.state.status2)){
      return(<Redirect to = "/login" />)
    }
    
    return(
      <div className = "app-wrapper container-fluid"
      >
        <Header appName = "IMC"/>
        <main className = "container-fluid settings">
          <div className = "jumbotron">
            <Welcome />
            <h1 className = "display-4" > COMPANY DETAILS </h1>
            <p className = "lead"> Kindly provide the necessary details below.</p>
            <hr className = "my-4"/>
            <div className = "form-park">
              <form ref = "companyForm" className = "company-form">
                <p className = "lead form-header">Basic Company's Details</p>
                <label for="inputEmail" className="sr-only">Company's Name</label>
                <input onChange = {this.handleInput} name = "name" type="text" id="inputText" className="form-control" placeholder="Company's Name" required autofocus/> 
                <label for="inputEmail" className="sr-only">Email address</label>
                <input onChange = {this.handleInput} name = "email" type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus/>
                <form className="form-inline PhoneNumber">
      
                  <div className="form-group">
                    <label for="" className="sr-only">PhoneNumber</label>
                    <input onChange = {this.handleInput} name = "phoneNumber1" type="number" className="form-control" id="" placeholder="PhoneNumber1"/>
                  </div>
                  <div className="form-group">
                    <label for="" className="sr-only">PhoneNumber</label>
                    <input onChange = {this.handleInput} name = "phoneNumber2" type="number" className="form-control" id="i" placeholder="PhoneNumber2"/>
                  </div>
                </form>
                <label for="inputEmail" className="sr-only">Company's Address</label>
                <input onChange = {this.handleInput} name = "address" type="text" id="inputText" className="form-control" placeholder="Company's Address" required autofocus/> 
                {
                  this.state.status1
                  &&
                  <button className="save btn btn-lg btn-block" type="">Saved <FontAwesomeIcon icon = "check-circle"/></button>
                }
                {
                  !this.state.status1
                  &&
                  <button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Save <FontAwesomeIcon icon = "plus-circle"/></button>
                }     
              </form>
              <form id = "adminForm" className = "admin-form">
                <p className = "lead form-header">Add an Administrator</p>
                <div className = "rounded"><FontAwesomeIcon icon = "user-cog"/></div>
                <label for="inputEmail" className="sr-only">adminID</label>
                <input ref = "username" onChange = {this.handleInput} name = "username" type="text" id="inputText" value = {generateAdminID()} className="form-control" placeholder="Admin ID e.g. AFL2019" required autofocus/> 
                <label for="inputText" className="sr-only">Admin Username</label>
                <input onChange = {this.handleInput} name = "password" type="password" id="inputText" className="form-control" placeholder="Password" required autofocus/>
                {
                  this.state.status2
                  &&
                  <button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="">Added <FontAwesomeIcon icon = "check-circle"/></button>
                }
                {
                  !this.state.status2
                  &&
                  <button onClick = {this.handleAdmin} className="save btn btn-lg btn-block" type="submit">Add Admin <FontAwesomeIcon icon = "plus-circle"/></button>
                }
                
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

}







export default Settings
