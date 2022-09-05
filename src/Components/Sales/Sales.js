import React,{Component} from "react"
import InventorySideBar from "../functionalComponents/InventorySideBar"
import "./Sales.css"
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

class Sales extends Component{

	constructor(props){
		super(props)	
		this.state = {
			error: false,
			status: false,
			customerID: "",
			productID: "",
			quantity: 0,
			price: 0,
			date: "",
			salesLimit: 0,
			addedBy: "",
			products: [{}],
			customers: [{}],
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
		this.fetchCustomers = this.fetchCustomers.bind(this)
		this.getAvailableProduct = this.getAvailableProduct.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount(){
		this.fetchProducts()
		this.fetchCustomers()

		setInterval(()=>{
			this.fetchCustomers()
			this.fetchProducts()
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

	fetchCustomers(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `customer=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					customers: responseJSON,
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
	    const request = new Request("addSales.php")
	    const bodyMessage = `add=true&salesLimit=${this.state.salesLimit}&date=${this.state.date}&total=${total}&quantity=${this.state.quantity}&price=${this.state.price}&customerID=${this.state.customerID}&productID=${this.state.productID}&addedBy=${this.state.addedBy}`
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
  }

	render(){
		if((!getData("adminIDs") && !getData("adminToken")) && (!getData("staffIDs") && !getData("staffToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true} staff = {this.state.staff} admin = {this.state.admin}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<InventorySideBar link = "sales"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > ADD NEW SALES </p>
			            <hr className = "my-4"/>

			            <form ref = "form1" style = {{"margin":"0 auto"}} className = "text-center company-form">
			            {
			            	this.state.productChecked && this.state.quantityAvailable <= 0
			            	&&
			            	<div className="alert alert-warning alert-dismissible fade show" role="alert">
							  <strong>Quantity Notification!</strong> The selected product is currently out of stock.
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
			            	<input onChange = {this.handleInput} name = "date" type = "date" className = "form-control" placeholder = "choose a date" required autoFocus/>
			                <label htmlFor="inputEmail" className="sr-only">Customer's Name</label>
			                <select onChange = {this.handleInput} name = "customerID" className="form-control" placeholder="Customer's Name" required autoFocus>
			                	<option selected disabled>Select Customer</option>
			                	{
				                	this.state.customers.map((customer)=>{
				                		return (<option value = {customer.customerID}>{customer.name}</option>)
				                	})
				                }
			                </select>
			                <label htmlFor="inputEmail" className="sr-only">Product's Name</label>
			                <select onChange = {this.getAvailableProduct} name = "productID" className="form-control" placeholder="Product's Name" required autoFocus>
			                	<option selected disabled>Select Product</option>
			                	{
			                		this.state.products.map((product)=>{
			                			return (<option value = {product.productID}>{product.name}</option>) 
			                		})
			                	}
			                	
			                </select>
			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Quantity</label>
			                    <input onChange = {this.handleInput} name = "quantity" type="number" className="form-control" id="" placeholder="Quantity"/>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Price</label>
			                    <input onChange = {this.handleInput} name = "price" type="number" className="form-control" id="i" placeholder="Price"/>
			                  </div>
			                </form>
			             	<input onChange = {this.handleInput} name = "salesLimit" type = "number" className = "form-control" placeholder = "Payment Limit in days" required autoFocus/>
			              	<button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Submit <FontAwesomeIcon icon = "plus-circle"/></button>
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default Sales



