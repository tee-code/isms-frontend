import React,{Component} from "react"
import TruckSideBar from "../functionalComponents/TruckSideBar"
import "./AddVehicle.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateVehicleID,setData,getData,checkUser } from "../../helperFunctions/functions"
import Request from "../../Request/Request"
import { Redirect } from "react-router-dom"

library.add(faPlusCircle,faSave,faUserCog)

class AddVehicle extends Component{

	constructor(props){
		super(props)	
		this.state = {
			error: false,
			status: false,
			name: "",
			addedBy: "",
		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
	}

	componentDidMount(){
		const addedBy = JSON.parse(getData("staffIDs")) || JSON.parse(getData("adminIDs")) 
		this.setState({addedBy})
	}

	clearStatus(){

	    setTimeout(()=>{
	      this.setState({
	        status:false,
	        error:false,
	      })
	      this.refs.form.reset()
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

   
   	const vehicleID = generateVehicleID(this.state.name)
   	
    const request = new Request("AddVehicle.php")
    const bodyMessage = `add=true&name=${this.state.name}&vehicleID=${vehicleID}&addedBy=${this.state.addedBy}`
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
					<TruckSideBar link = "addvehicle"/>
					<div className = "jumbotron add-product">
			            <p className = "label text-center" > ADD NEW VEHICLE </p>
			            <hr className = "my-4"/>
			              <form ref = "form" className = "admin-form m-auto">
			                {
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">VEHICLE Not Added</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Added Successfully</div>
			                }

			                <label htmlFor="inputText" className="sr-only">Vehicle's Number</label>
			                <input onChange = {this.handleInput} name = "name" type="text" id="inputText" className="form-control" placeholder="Vehicle's Number" required autoFocus/> 
			                <button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Add <FontAwesomeIcon icon = "plus-circle"/></button>
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default AddVehicle



