import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./AddQuantity.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateProductID,setData,getData,checkUser } from "../../helperFunctions/functions"
import Request from "../../Request/Request"
import { Redirect } from "react-router-dom"

library.add(faPlusCircle,faSave,faUserCog)

class AddQuantity extends Component{

	constructor(props){
		super(props)	
		this.state = {
			products: [{}],
			vendors: [{}],
			error: false,
			status: false,
			productID: "",
			vendorID: "",
			quantity: 0,
			addedBy: "",
		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
		this.fetchProducts = this.fetchProducts.bind(this)
		this.fetchVendors = this.fetchVendors.bind(this)
	}

	componentDidMount(){
		
		this.fetchProducts()
		this.fetchVendors()

		setInterval(()=>{
			this.fetchVendors()
			this.fetchProducts()
		},2000)
		const addedBy = JSON.parse(getData("staffIDs")) || JSON.parse(getData("adminIDs")) 
		this.setState({addedBy})
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

	fetchVendors(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `vendor=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					vendors: responseJSON,
					ready:true
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
   	const vendorID = this.state.vendorID
   	const productID = this.state.productID
    const request = new Request("AddQuantity.php")
    const bodyMessage = `add=true&vendorID=${vendorID}&quantityAdded=${this.state.quantity}&productID=${productID}&addedBy=${this.state.addedBy}`
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
					<DashboardLeftSideBar2 link = "addquantity"/>
					<div className = "jumbotron add-product">
			            <p className = "label text-center" > ADD NEW QUANTITY </p>
			            <hr className = "my-4"/>
			              <form ref = "form" className = "admin-form m-auto">
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
			                <select ref = "productID" onChange = {this.handleInput} name = "productID" className="form-control">
			                <option disabled selected>Select Product</option>
			                {
			                	this.state.products.map((product,index)=>{
			                		return(<option value = {product.productID} title = {product.productID}>{product.name}</option>)
			                	})
			                }
				    
				            </select>
				            <select ref = "vendorID" onChange = {this.handleInput} name = "vendorID" className="form-control">
			                <option disabled selected>Select Vendor</option>
			                {
			                	this.state.vendors.map((vendor,index)=>{
			                		return(<option value = {vendor.vendorID} title = {vendor.vendorID}>{vendor.name}</option>)
			                	})
			                }
				    
				            </select>
			                <label htmlFor="inputText" className="sr-only">Quantity</label>
			                <input onChange = {this.handleInput} name = "quantity" type="number" id="inputText" className="form-control" placeholder="Quantity" required autoFocus/> 
			                <button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Add <FontAwesomeIcon icon = "plus-circle"/></button>
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default AddQuantity



