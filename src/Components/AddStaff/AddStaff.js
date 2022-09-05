import React,{Component} from "react"
import DashboardLeftSideBar from "../functionalComponents/DashboardLeftSideBar"
import "./AddStaff.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateAdminID, generateStaffID, setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"
import Request from "../../Request/Request"

library.add(faPlusCircle,faSave,faUserCog)

class AddStaff extends Component{

	constructor(props){
		super(props)

		this.state = {
			loggedIn: true,
			status: false,
			error: false,
			name: "",
			username: "",
			password: "",
			userType: "",
			addedBy: ""
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInput = this.handleInput.bind(this)


	}

	componentDidMount(){
		const addedBy = JSON.parse(getData("adminIDs"))
		this.setState({addedBy})
	}

	handleInput = (e)=>{
		if(e.target.name === "userType"){
			if(e.target.value === "admin"){
				document.querySelector("#username").value = generateAdminID()
			}
			if(e.target.value === "staff"){
				document.querySelector("#username").value = generateStaffID()
			}
		}
		this.setState({
			[e.target.name] : e.target.value
		})	
	}
	handleSubmit = (e)=>{

		e.preventDefault()
   
	    const request = new Request("adduser.php")
	    const bodyMessage = `add=true&name=${this.state.name}&username=${document.querySelector("#username").value}&password=${this.state.password}&userType=${this.state.userType}&addedBy=${this.state.addedBy}`
	    
	    request.post(bodyMessage).then((response)=>{
	      const responseJSON = JSON.parse(response)
	      if(responseJSON.status){
	        this.setState({status:true})
	      }else{
	      	this.setState({
	      		error: true
	      	})
	      }
	      setTimeout(()=>{
	      	this.setState({
	      		error:false,
	      		status:false,
	      	})
	      	document.querySelector("#form").reset()
	      },3000)
	    })
	}
	
	render(){
		if((!getData("adminIDs") && !getData("adminToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true} />
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar link = "addstaff"/>
					<div className = "jumbotron add-staff">
			            <p className = "label text-center" > ADD NEW USER </p>
			            <hr className = "my-4"/>
			              <form id = "form" className = "admin-form m-auto">
			                {
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Invalid Combinations.</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Added Successfully</div>
			                }
			                <LoginForm disabled = {true} action = {this.handleInput} showName = {true} submit = {this.handleSubmit} value = "Add" showForgot = {false} icon = "plus-circle"/>

			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default AddStaff



