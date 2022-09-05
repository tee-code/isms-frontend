import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./AddVendor.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateVendorID,setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"
import Request from "../../Request/Request"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser)

class AddVendor extends Component{

	constructor(props){
		super(props)	
		this.state = {
			name: "",
			address: "",
			phonenumber: "",
			state: "",
			addedBy: "",
			email: "",
			status: false,
			error: false
		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
	}

	componentDidMount(){
		const addedBy = JSON.parse(getData("adminIDs"))
		this.setState({addedBy})
	}

	clearStatus(){

	    setTimeout(()=>{
	      this.setState({
	        status:false,
	        error:false,
	      })
	      this.refs.form1.reset()
	      this.refs.form2.reset()
	    },2000)
  }

	handleInput(e){

	    e.persist()

	    this.setState({
	      [e.target.name] : e.target.value,
	    })
  }

  handleSubmit(e){
   
    e.preventDefault()

   
   	const vendorID = generateVendorID(this.state.name)
   	
    const request = new Request("addVendor.php")
    const bodyMessage = `add=true&name=${this.state.name}&email=${this.state.email}&phoneNumber=${this.state.phonenumber}&vendorID=${vendorID}&address=${this.state.address}&state=${this.state.state}&addedBy=${this.state.addedBy}`
    
    request.post(bodyMessage).then((response)=>{
      const responseJSON = JSON.parse(response)
      if(responseJSON.status){
        this.setState({status:true})
      }else{
      	this.setState({error:true})
      }
      this.clearStatus()
    })
  }

	render(){
		if((!getData("adminIDs") && !getData("adminToken")) && (!getData("staffIDs") && !getData("staffToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar2 link = "addvendor"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > ADD NEW VENDOR </p>
			            <hr className = "my-4"/>

			            <form ref = "form1" style = {{"margin":"0 auto"}} className = "text-center company-form">

			            	{
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Vendor Not Added</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Added Successfully</div>
			                }

			            	<span style = {{"fontSize":"40px"}}>
			            		<FontAwesomeIcon icon = "user" />
			            	</span>

			                <label htmlFor="inputEmail" className="sr-only">Customer's Name</label>
			                <input onChange = {this.handleInput} name = "name" type="text" id="inputText" className="form-control" placeholder="Vendor's Name" required autoFocus/> 
			                <label htmlFor="inputText" className="sr-only">Address</label>
			                <input onChange = {this.handleInput} name = "address" type="text" id="inputText" className="form-control" placeholder="Vendor's Address" required autoFocus/> 
			                <label htmlFor="inputEmail" className="sr-only">Email address</label>
			                <input onChange = {this.handleInput} name = "email" type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus/>
			                
			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">PhoneNumber</label>
			                    <input onChange = {this.handleInput} name = "phonenumber" type="number" className="form-control" id="" placeholder="PhoneNumber"/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="inputText" className="sr-only">State</label>
			                    <input onChange = {this.handleInput} name = "state" type="text" className="form-control" id="" placeholder="State"/>
			                  </div>

			                </form>
			     
			             
			              	<button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Add <FontAwesomeIcon icon = "plus-circle"/></button>
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default AddVendor



