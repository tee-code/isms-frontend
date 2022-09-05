import React,{Component} from "react"
import InventorySideBar from "../functionalComponents/InventorySideBar"
import "./SalesReport.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from "../../Request/Request"
import { generateCustomerID,setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt)

class SalesReport extends Component{

	constructor(props){
		super(props)	

		this.state = {
			products: [{}],
			customers: [{}],
			allProducts: [{}],
			admin: false,
			staff: false
		}

		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
		this.fetchName = this.fetchName.bind(this)
		this.fetchProduct = this.fetchProduct.bind(this)

	}

	componentDidMount(){

		this.fetchUser()
		this.fetchName()
		this.fetchProduct()

		this.interval = setInterval(()=>{
			this.fetchUser()
			this.fetchName()
			this.fetchProduct()
			if(getData("adminIDs") && getData("adminToken")){
				this.setState({admin:true})
			}
			if(getData("staffIDs") && getData("staffToken")){
				this.setState({staff:true})
			}
		},2000)

	}

	
	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `sales=true`
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

	fetchName = ()=>{
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

	fetchProduct = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `product=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					allProducts: responseJSON,

					ready:true
				})
			}
		})
	}


	handleEdit = (id)=>{

		const request = new Request("updateSales.php")

		const customerID = this.refs[`customerID${id}`].value
		const productID= this.refs[`productID${id}`].value
		const price = this.refs[`price${id}`].value
		const salesLimit = this.refs[`salesLimit${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const date = this.refs[`date${id}`].value
		const quantity = this.refs[`quantity${id}`].value



	    const bodyMessage = `salesLimit=${salesLimit}&price=${price}&quantity=${quantity}&id=${id}&productID=${productID}&update=true&customerID=${customerID}&date=${date}&addedBy=${addedBy}`

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
	      },3000)

	    })
	}

	handleDelete = (id)=>{
		
		const request = new Request("deleteSales.php")
		const bodyMessage = `delete=true&id=${id}`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON.status){
				this.setState({
					deleted:true,

				})
			}
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
					<InventorySideBar link = "managesales"/>
					<div className = "jumbotron manage-product add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      
							      <th scope="col">ProductName</th>
							      <th scope="col">CustomerName</th>
							      <th scope="col">Quantity</th>
							      <th scope="col">Price</th>
							      <th scope="col">Total</th>
							      <th scope="col">Payment Limit</th>
							      <th scope="col">Added By</th>
							      <th scope="col">Date Added</th>
							      <th scope="col">Actions</th>
							    </tr>
							  </thead>
							  <tbody>
							  {
							  	this.state.ready === true
							  	&&
								  	this.state.products.map((product,index)=>{
								  		return(
								  		<React.Fragment>
								  			<tr key = {index+1}>
										      <th scope="row">{index+1}</th>
										      
										      
										      <td>{product.productName}</td>
										       <td>{product.customerName}</td>
										      <td>{product.quantity}</td>
										      <td>{product.price}</td>
										      <td>{product.total}</td>
										      <td>{product.salesLimit}</td>
										      <td>{product.addedBy}</td>
										      <td>{product.date}</td>
										      {
									      		`"${product.addedBy}"` == getData("staffIDs") || getData("adminIDs") ? (

									      		
										      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+product.id} title = {product.id} icon = "trash-alt" />
										      		<div id = {"delete"+product.id} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Quantity Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {product.productName} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(product.id)} type="button" className="btn btn-primary">Delete</button>
													        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
													      </div>
													    </div>
													  </div>
													</div>
										      	</span>
										      	<span className = "action p-2">
										      		<FontAwesomeIcon icon = "pen-alt" data-toggle="collapse" href={"#collapseExample"+index} aria-expanded="false" aria-controls="collapseExample"/>
			
										      	</span>
										      </td>
										    ) : null
										    }
										    </tr>
										    <tr key = {index}>
										    	<td key = {index} colSpan = "11" >
												    <div className="collapse" id={"collapseExample"+index}>
												    {
												    	this.state.error
										                &&
										                <div className = "m-2 bg-danger">Not updated!!!</div>

												    }
													  <div className="bg-dark card card-body">
													  	<form key = {index}>
													       <select key = {index+5} className = "form-control" ref = {"productID"+product.id} name = "productID" type = "text" defaultValue = {product.productName}>
			            									return(<option value = {product.productID} selected>{product.productName}</option>)
							            					{
							            						this.state.allProducts.map((name,index)=>{
							            							
							            								return(<option value = {name.productID}>{name.name}</option>)
							            							
							            							
							            							
							            						})
							            					}
							            					
							            				 </select>
							            				 <select className = "form-control" ref = {"customerID"+product.id} name = "customerID" type = "text" defaultValue = {product.customerName}>
							            					return(<option value = {product.customerID} selected>{product.customerName}</option>)
							            					{
							            					
										            			this.state.customers.map((name,index)=>{
										            							
										            				return(<option value = {name.customerID}>{name.name}</option>)
										            							
										            							
										            							
								            						})
								            					}
							            							
							            						})
							            					}
							            				 </select>
													      
													      
													      <input className = "form-control" ref = {"quantity"+product.id} name = "quantity" type = "number" defaultValue = {product.quantity} required/>
													   	  <input className = "form-control" ref = {"price"+product.id} name = "price" type = "text" defaultValue = {product.price} required/>
													   	   <input className = "form-control" ref = {"salesLimit"+product.id} name = "salesLimit" type = "text" defaultValue = {product.salesLimit} required/>
													   	  <input className = "form-control" ref = {"addedBy"+product.id} name = "addedBy" type = "text" defaultValue = {product.addedBy} required/>
													      <input className = "form-control" ref = {"date"+product.id} name = "date" type = "text" defaultValue = {product.date} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(product.id)} title = {product.id} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button className = "save btn">Updated Successfully.</button>
													  	  }
													  	  
													  </div>
													</div>
												</td>
											</tr>
										</React.Fragment>
								  		)
								  	})
								  }
							  </tbody>
							</table>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default SalesReport



