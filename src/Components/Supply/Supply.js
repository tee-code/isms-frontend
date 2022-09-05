import React,{Component} from "react"
import TruckSideBar from "../functionalComponents/TruckSideBar"
import "./Supply.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateCustomerID,setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"
import Request from "../../Request/Request"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser)

class Supply extends Component{

	constructor(props){
		super(props)	
		this.state = {
			error: false,
			status: false,
			driverID: "",
			productID: "",
			quantity: 0,
			price: 0,
			date: "",
			cost: 0,
			allowance: 0,
			loads: 0,
			destination: "",
			addedBy: "",
			drivers: [{}],
			products: [{}],
			vehicles: [{}],
			admin: false,
			staff: false,
			quantityAvailable: 0,
			productChecked: false,
			quantityChecked: false,

		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
		this.fetchProducts = this.fetchProducts.bind(this)
		this.fetchDrivers = this.fetchDrivers.bind(this)
		this.fetchVehicles = this.fetchVehicles.bind(this)
		this.getAvailableProduct = this.getAvailableProduct.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount(){

		this.fetchProducts()
		this.fetchVehicles()
		this.fetchDrivers()

		setInterval(()=>{
			
			this.fetchProducts()
			this.fetchVehicles()
			this.fetchDrivers()

			if(getData("adminIDs") && getData("adminToken")){
				this.setState({admin:true})
			}
			if(getData("staffIDs") && getData("staffToken")){
				this.setState({staff:true})
			}
		},2000)
		const addedBy = JSON.parse(getData("staffIDs")) || JSON.parse(getData("adminIDs")) 
		this.setState({addedBy})
	}

	handleClick = (e)=>{
		this.setState({
			productChecked: false,
			quantityChecked: false,
		})
	}

	getAvailableProduct = (e)=>{

		this.setState({
			productID: e.target.value,
			productChecked: true
		})

		const productID = e.target.value
		
		const request = new Request("getAvailableProduct.php")
		const bodyMessage = `get=true&productID=${productID}`

		request.post(bodyMessage)
		.then((response)=>{
			
			return JSON.parse(response)
		})
		.then((responseJSON)=>{
			if(responseJSON.status){
				this.setState({
					quantityAvailable: responseJSON.quantityAvailable
				})

				
			}
		})


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

  fetchProducts(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `product=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			
			if(responseJSON[0].status){
				this.setState({
					products: responseJSON,
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

  handleSubmit(e){
   
    e.preventDefault()
    
  	const total = this.state.price * this.state.quantity
   	
   	if(this.state.quantity > this.state.quantityAvailable){
   		this.setState({
   			quantityChecked: true
   		})
   	}else{
	    const request = new Request("addSupply.php")
	    const bodyMessage = `add=true&total=${total}&date=${this.state.date}&driverID=${this.state.driverID}&vehicleID=${this.state.vehicleID}&destination=${this.state.destination}&loads=${this.state.loads}&cost=${this.state.cost}&allowance=${this.state.allowance}&quantity=${this.state.quantity}&price=${this.state.price}&productID=${this.state.productID}&addedBy=${this.state.addedBy}`
	    request.post(bodyMessage).then((response)=>{

	      console.log(response)
	      const responseJSON = JSON.parse(response)
	      
	      if(responseJSON.status){
	        this.setState({status:true})
	      }else{
	      	this.setState({error:true})
	      }
	      this.clearStatus()
	    })
	}
  }

	render(){
		if((!getData("adminIDs") && !getData("adminToken")) && (!getData("staffIDs") && !getData("staffToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true} staff = {this.state.staff} admin = {this.state.admin}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<TruckSideBar link = "supply"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > ADD NEW SUPPLY </p>
			            <hr className = "my-4"/>

			            <form ref = "form1" style = {{"margin":"0 auto"}} className = "text-center company-form">
			            
			            	
			            	{
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Product Not Added</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Added Successfully</div>
			                }

			            	<span style = {{"fontSize":"40px"}}>
			            		<FontAwesomeIcon icon = "user" />
			            	</span>
			            	
			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <input onChange = {this.handleInput} name = "date" type = "date" className = "form-control" placeholder = "choose a date" required autoFocus/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="inputEmail" className="sr-only">Product's Name</label>
				                <select onChange = {this.getAvailableProduct} name = "productID" className="form-control" placeholder="Product's Name" required autoFocus>
				                	<option selected disabled>Select Product</option>
				                	{
				                		this.state.products.map((product)=>{
				                			return (<option value = {product.productID}>{product.name}</option>) 
				                		})
				                	}
				                	
				                </select>
			                  </div>
			                </form>

			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="inputEmail" className="sr-only">Driver's Name</label>
				                <select onChange = {this.handleInput} name = "driverID" className="form-control" placeholder="Driver's Name" required autoFocus>
				                	<option selected disabled>Select Driver</option>
				                	{
					                	this.state.drivers.map((driver)=>{
					                		return (<option value = {driver.driverID}>{driver.name}</option>)
					                	})
					                }
				                </select>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="inputEmail" className="sr-only">Vehicle's Name</label>
				                <select onChange = {this.handleInput} name = "vehicleID" className="form-control" placeholder="Vehicle's Name" required autoFocus>
				                	<option selected disabled>Select Vehicle</option>
				                	{
				                		this.state.vehicles.map((vehicle)=>{
				                			return (<option value = {vehicle.vehicleID}>{vehicle.name}</option>) 
				                		})
				                	}
				                	
				                </select>
			                  </div>
			                </form>

			                
			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Desitination</label>
			                    <input onChange = {this.handleInput} name = "destination" type="text" className="form-control" id="" placeholder="Desitination"/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Load In Litres</label>
			                    <input onChange = {this.handleInput} name = "loads" type="number" className="form-control" id="" placeholder="Load In Litres"/>
			                  </div>
			                </form>

			                 <form ref = "form2" className="form-inline PhoneNumber">
			      			  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Rentage Cost</label>
			                    <input onChange = {this.handleInput} name = "cost" type="number" className="form-control" id="i" placeholder="Rentage Cost"/>
			                  </div>
			                  
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Driver's Allowance</label>
			                    <input onChange = {this.handleInput} name = "allowance" type="number" className="form-control" id="i" placeholder="Driver's Allowance"/>
			                  </div>
			                </form>

			                 <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Tanker's Fuel</label>
			                    <input onChange = {this.handleInput} name = "quantity" type="number" className="form-control" id="" placeholder="Tanker's Fuel in litres"/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Price</label>
			                    <input onChange = {this.handleInput} name = "price" type="number" className="form-control" id="i" placeholder="Price"/>
			                  </div>
			                </form>
			             	<button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Submit <FontAwesomeIcon icon = "plus-circle"/></button>
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default Supply



