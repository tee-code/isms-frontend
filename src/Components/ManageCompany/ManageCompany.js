import React,{Component} from "react"
import DashboardLeftSideBar from "../functionalComponents/DashboardLeftSideBar"
import "./ManageCompany.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt, faBuilding} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from "../../Request/Request"
import { generateAdminID, generateStaffID, setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt, faBuilding)

class ManageCompany extends Component{

	constructor(props){
		super(props)	
		this.state = {
			admin:{},
			editClicked: false,
			saveClicked: false,
			
		}

		this.handleEdit = this.handleEdit.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.fetchData = this.fetchData.bind(this)
	}


	componentDidMount(){

		this.fetchData()
		this.interval = setInterval(()=>{
			this.fetchData()
		},5000)

	}

	fetchData = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `company=true`
		request.post(bodyMessage).then((response)=>{

			const responseJSON = JSON.parse(response)
			if(responseJSON.status){
				this.setState({
					admin: responseJSON,
				})
			}
		})
	}


	handleEdit(e){
		e.preventDefault()
		this.setState({editClicked:true})
		document.querySelectorAll(".add-staff input").forEach((input)=>{
			input.disabled = false
		})
	}

	handleSave(e){
		e.preventDefault()
		document.querySelectorAll(".add-staff input").forEach((input)=>{
			input.disabled = true
		})
	}

	render(){
		if((!getData("adminIDs") && !getData("adminToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar link = "managecompany"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > View & Update</p>
			            <hr className = "my-4"/>

			            <form style = {{"margin":"0 auto"}} className = "text-center company-form">
			            	<span style = {{"fontSize":"40px"}}>
			            		<FontAwesomeIcon icon = "building" />
			            	</span>
			                <label htmlFor="inputEmail" className="sr-only">Company's Name</label>
			                <input value = {this.state.admin.companyName} name = "name" type="text" id="inputText" className="form-control" placeholder="Company's Name" required autoFocus disabled/> 
			                <label htmlFor="inputEmail" className="sr-only">Email address</label>
			                <input value = {this.state.admin.email} name = "email" type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus disabled/>
			                <form className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">PhoneNumber</label>
			                    <input value = {`0${this.state.admin.phonenumber1}`} name = "phonenmber1" type="number" className="form-control" id="" placeholder="PhoneNumber1" disabled/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">PhoneNumber</label>
			                    <input value = {`0${this.state.admin.phonenumber2}`} name = "phonenumber2" type="number" className="form-control" id="i" placeholder="PhoneNumber2" disabled/>
			                  </div>
			                </form>
			                <label htmlFor="inputEmail" className="sr-only">Company's Name</label>
			                <input value = {this.state.admin.address} name = "address" type="text" id="inputText" className="form-control" placeholder="Company's Address" required autoFocus disabled/> 
			                

			                {
			                	this.state.editClicked
			                	&&
			                	<button onClick = {this.handleSave} className="save btn btn-lg btn-block mt-3" type="submit">Save Details <FontAwesomeIcon icon = "save"/></button>
			                }
			                {
			                	!this.state.saveClicked
			                	&&
			                	<button onClick = {this.handleEdit} className="edit btn btn-lg btn-block mt-3" type="submit">Edit <FontAwesomeIcon icon = "pen-alt"/></button>
			                }
			              	
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default ManageCompany



