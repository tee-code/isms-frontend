import React,{Component} from "react"
import InventorySideBar from "../functionalComponents/InventorySideBar"
import "./PaymentReport.css"
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

class PaymentReport extends Component{

	constructor(props){
		super(props)	

		this.state = {
			products: [{}],
			allProducts: [{}],
			reports: [{}],
			customers: [{}],
			product:"",
			customer:"",
			staff: false,
			admin:false,
		}

		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
		this.fetchReport = this.fetchReport.bind(this)
		this.handleProduct = this.handleProduct.bind(this)
		this.fetchName = this.fetchName.bind(this)
		this.fetchProduct = this.fetchProduct.bind(this)

	}

	componentDidMount(){

		this.fetchUser()
		this.fetchName()
		this.fetchProduct()
		this.fetchReport(this.refs.customer.value,this.refs.product.value)
		this.interval = setInterval(()=>{
			this.fetchUser()
			this.fetchName()
			this.fetchProduct()
			if(this.refs.customer && this.refs.Product){
				this.fetchReport(this.refs.customer.value,this.refs.product.value)
			}
			if(getData("adminIDs") && getData("adminToken")){
				this.setState({admin:true})
			}
			if(getData("staffIDs") && getData("staffToken")){
				this.setState({staff:true})
			}
			
		},2000)

	}

	componentDidUnMount(){
		this.interval.clearInterval()
	}
	
	handleProduct = (e)=>{
		
		this.setState({
			product: e.target.value,
			customer: e.target.value
		})
		this.fetchReport(this.refs.customer.value,this.refs.product.value)
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

	fetchReport = (customer,product)=>{
		
		const request = new Request("paymentReport.php")
		const bodyMessage = `report=true&customer=${customer}&product=${product}`
		request.post(bodyMessage).then((response)=>{
			
			const responseJSON = JSON.parse(response)
			if(responseJSON.status){
				this.setState({
					reports:responseJSON,
				})
			}
		})
	}

	
	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `payment=true`
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

	handleEdit = (id)=>{

		const request = new Request("updatePayment.php")

		const customerID = this.refs[`customerID${id}`].value
		const productID = this.refs[`productID${id}`].value
		const amountPaid = this.refs[`amountPaid${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const date = this.refs[`date${id}`].value
		const paymentMode = this.refs[`paymentMode${id}`].value


	    const bodyMessage = `amountPaid=${amountPaid}&paymentMode=${paymentMode}&id=${id}&productID=${productID}&update=true&customerID=${customerID}&date=${date}&addedBy=${addedBy}`

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
		
		const request = new Request("deletePayment.php")
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
					<InventorySideBar link = "managepayment"/>
					<div className = "jumbotron manage-product add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			             <table className = "table table-dark table-responsive-lg">
			            	<thead>
			            		<tr>
			            			<th scope = "col">Overall Expected Amount</th>
			            			<th scope = "col">Amount IN</th>
			            			<th scope = "col">Balance</th>
			            			<th scope = "col">Balance Type</th>
			            		</tr>

			            	</thead>
			            	<tbody>
			            		<tr>
			            			<td>{this.state.reports.generalTotal}</td>
			            			<td>{this.state.reports.generalAmountPaid}</td>
			            			<td>{this.state.reports.balance}</td>
			            			<td>{this.state.reports.balanceType}</td>
			            		</tr>
			            	</tbody>
			            </table>
			            <table className = "table table-dark table-responsive-lg">
			            	<thead>
			            		<tr>
			            			<th scope = "col">Customer Name</th>
			            			<th scope = "col">Product Name</th>
			            			<th scope = "col">Total Amount</th>
			            			<th scope = "col">Amount Paid</th>
			            			<th scope = "col">Balance</th>
			            			<th scope = "col">Balance Type</th>
			            		</tr>

			            	</thead>
			            	<tbody>
			            		<tr>
			            			<td>
			            				<select ref = "customer" onChange = {this.handleProduct} className = "form-control">
			            					
			            					{
			            						this.state.customers.map((name,index)=>{
			            							return (<option value = {name.customerID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			<td>
			            				<select ref = "product" onChange = {this.handleProduct} className = "form-control">
			            					
			            					{
			            						this.state.allProducts.map((name,index)=>{
			            							return (<option value = {name.productID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			<td>{this.state.reports.totalAmount}</td>
			            			<td>{this.state.reports.amountPaid}</td>
			            			<td>{this.state.reports.eachBalance}</td>
			            			<td>{this.state.reports.balanceType2}</td>
			            		</tr>
			            	</tbody>
			            </table>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							     
							      <th scope="col">ProductName</th>
							      <th scope="col">CustomerName</th>
							      <th scope="col">Amount Paid</th>
							      <th scope="col">Payment Mode</th>
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
										      <td>{product.amountPaid}</td>
										      <td>{product.paymentMode}</td>
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
													        <h5 className="modal-title">Delete Payment Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {product.customerName} record?</p>
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
													      
													     <select className = "form-control" ref = {"productID"+product.id} name = "productID" type = "text" defaultValue = {product.productName}>
			            									return(<option value = {product.productID} selected>{product.productName}</option>)
							            					{
							            					
										            			this.state.allProducts.map((name,index)=>{
										            							
										            				return(<option value = {name.productID}>{name.name}</option>)
										            							
										            							
										            							
								            						})
								            					}
							            							
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
													      <input className = "form-control" ref = {"amountPaid"+product.id} name = "amountPaid" type = "number" defaultValue = {product.amountPaid} required/>
													   	  <select className = "form-control" ref = {"paymentMode"+product.id} name = "paymentMode" required>
													   	  	<option disabled selected>Select Mode Of payment</option>
													   	  	
													   	  	{
													   	  		product.paymentMode === "Cash"
													   	  		&&
													   	  		<React.Fragment>
													   	  		<option defaultValue = "Cash" selected>Cash</option>
													   	  		<option defaultValue = "Cheque">Cheque</option>
													   	  		<option defaultValue = "Transfer">Transfer</option>
													   	  		</React.Fragment>

													   	  	}
													   	  	{
													   	  		product.paymentMode === "Cheque"
													   	  		&&
													   	  		<React.Fragment>
													   	  		<option defaultValue = "Cash">Cash</option>
													   	  		<option defaultValue = "Cheque" selected>Cheque</option>
													   	  		<option defaultValue = "Transfer">Transfer</option>
													   	  		</React.Fragment>
													   	  	}
													   	  	{
													   	  		product.paymentMode === "Transfer"
													   	  		&&
													   	  		<React.Fragment>
													   	  		<option defaultValue = "Cash">Cash</option>
													   	  		<option defaultValue = "Cheque">Cheque</option>
													   	  		<option defaultValue = "Transfer" selected>Transfer</option>
													   	  		</React.Fragment>
													   	  	}
													   	  	
													   	  
													   	  </select>
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




export default PaymentReport



