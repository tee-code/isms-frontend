import React,{Component} from "react"
import TruckSideBar from "../functionalComponents/TruckSideBar"
import "./Mapping.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"
import Request from "../../Request/Request"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser)

class Mapping extends Component{

	constructor(props){
		super(props)	
		this.state = {
			error: false,
			status: false,
			driverID: "",
			vehicleID: "",
			mappedBy: "",
			vehicles: [{}],
			drivers: [{}],
			admin: false,
			staff: false,

		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
		this.fetchVehicles = this.fetchVehicles.bind(this)
		this.fetchDrivers = this.fetchDrivers.bind(this)
		
	}

	componentDidMount(){
		this.fetchVehicles()
		this.fetchDrivers()

		setInterval(()=>{
			this.fetchDrivers()
			this.fetchVehicles()
			if(getData("adminIDs") && getData("adminToken")){
				this.setState({admin:true})
			}
			if(getData("staffIDs") && getData("staffToken")){
				this.setState({staff:true})
			}
		},2000)
		const mappedBy = JSON.parse(getData("staffIDs")) || JSON.parse(getData("adminIDs")) 
		this.setState({mappedBy})
	}


	clearStatus(){

	    setTimeout(()=>{
	      this.setState({
	        status:false,
	        error:false,
	      })
	      this.refs.form1.reset()
	      
	    },2000)
    }

	handleInput(e){

	    e.persist()
	    
	    this.setState({
	      [e.target.name] : e.target.value,
	    })
  }

  fetchVehicles(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `vehicle=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			
			if(responseJSON[0].status){
				this.setState({
					vehicles: responseJSON,
					ready:true
				})
			}
		})
	}

	fetchDrivers(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `driver=true`
		request.post(bodyMessage).then((response)=>{
			
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					drivers: responseJSON,
					ready:true
				})
			}
		})
	}

  handleSubmit(e){
   
    e.preventDefault()
	    const request = new Request("mapping.php")
	   
	    const bodyMessage = `map=true&driverID=${this.state.driverID}&vehicleID=${this.state.vehicleID}&mappedBy=${this.state.mappedBy}`
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
				<Header appName = "IMC" logout = {true} staff = {this.state.staff} admin = {this.state.admin}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<TruckSideBar link = "mapping"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > ADD NEW SALES </p>
			            <hr className = "my-4"/>

			            <form ref = "form1" style = {{"margin":"0 auto"}} className = "text-center company-form">
			            {
			            	this.state.vehicleChecked && this.state.quantityAvailable <= 0
			            	&&
			            	<div className="alert alert-warning alert-dismissible fade show" role="alert">
							  <strong>Quantity Notification!</strong> The selected vehicle is currently out of stock.
							 <button onClick = {this.handleClick} type="button" className="close" data-dismiss="alert" aria-label="Close">
							    <span aria-hidden="true">&times;</span>
							  </button>
							</div>
			            }
			            {
			            	this.state.quantityChecked
			            	&&
			            	<div className="alert alert-warning alert-dismissible fade show" role="alert">
							  <strong>Quantity Notification!</strong> Requested Quantity is more than the Avaialable Quantity.
							  Avaialable Quantity: {this.state.quantityAvailable} & Requested Quantity: {this.state.quantity}
							 <button onClick = {this.handleClick} type="button" className="close" data-dismiss="alert" aria-label="Close">
							    <span aria-hidden="true">&times;</span>
							  </button>
							</div>
			            }
			            	
			            	{
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Mapping Not Successfully</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Mapped Successfully</div>
			                }

			            	<span style = {{"fontSize":"40px"}}>
			            		<FontAwesomeIcon icon = "user" />
			            	</span>
			            	
			                <select onChange = {this.handleInput} name = "driverID" className="form-control" placeholder="Driver's Name" required autoFocus>
			                	<option selected disabled>Select Driver</option>
			                	{
				                	this.state.drivers.map((driver)=>{
				                		return (<option value = {driver.driverID}>{driver.name}</option>)
				                	})
				                }
			                </select>
			                <label htmlFor="inputEmail" className="sr-only">Vehicle's Name</label>
			                <select onChange = {this.handleInput} name = "vehicleID" className="form-control" placeholder="Vehicle's Name" required autoFocus>
			                	<option selected disabled>Select Vehicle</option>
			                	{
			                		this.state.vehicles.map((vehicle)=>{
			                			return (<option value = {vehicle.vehicleID}>{vehicle.name}</option>) 
			                		})
			                	}
			                	
			                </select>
			                
			             	<button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Map <FontAwesomeIcon icon = "plus-circle"/></button>
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default Mapping



