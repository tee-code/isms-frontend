import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./ManageQuantity.css"
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

class ManageQuantity extends Component{

	constructor(props){
		super(props)	
		this.state = {
			products: [{}],
			vendors:[{}],
			reports: {},
			names: [{}],
			product: "",
		}
		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
		this.fetchReport = this.fetchReport.bind(this)
		this.handleProduct = this.handleProduct.bind(this)
		this.fetchName = this.fetchName.bind(this)

	}

	componentDidMount(){

		this.fetchName()
		this.fetchVendor()
		this.fetchUser()
		this.fetchReport(this.refs.product.value)
		this.interval = setInterval(()=>{
			this.fetchName()
			this.fetchVendor()
			this.fetchUser()
			
			if(this.refs.product){
				this.fetchReport(this.refs.product.value)	
			}
			
		},2000)

	}
	
	handleProduct = (e)=>{
		
		this.setState({
			product: e.target.value
		})
		this.fetchReport(e.target.value)
	}

	fetchName = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `product=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					names: responseJSON,
					ready:true
				})
			}
		})
	}

	fetchVendor = ()=>{
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

	fetchReport = (product)=>{
		
		const request = new Request("quantityReport.php")
		const bodyMessage = `report=true&product=${product}`
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
		const bodyMessage = `quantity=true`
		request.post(bodyMessage).then((response)=>{
			console.log(response)
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
		const request = new Request("updateQuantity.php")

		const vendorID = this.refs[`vendorID${id}`].value
		const productID = this.refs[`productID${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value
		const quantity = this.refs[`quantity${id}`].value

	    const bodyMessage = `quantityAdded=${quantity}&id=${id}&productID=${productID}&update=true&vendorID=${vendorID}&dateAdded=${dateAdded}&addedBy=${addedBy}`

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
		
		const request = new Request("deleteQuantity.php")
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
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar2 link = "managequantity"/>
					<div className = "jumbotron manage-product add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			            <table className = "table table-dark table-responsive-lg">
			            	<thead>
			            		<tr>
			            			<th scope = "col">Product Name</th>
			            			<th scope = "col">Quantity IN</th>
			            			<th scope = "col">Quantity OUT</th>
			            			<th scope = "col">Quantity Remaining</th>
			            		</tr>

			            	</thead>
			            	<tbody>
			            		<tr>
			            			<td>
			            				<select ref = "product" onChange = {this.handleProduct} className = "form-control">
			            					
			            					{
			            						this.state.names.map((name,index)=>{
			            							return (<option value = {name.productID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			<td>{this.state.reports.quantityIN}</td>
			            			<td>{this.state.reports.quantityOUT}</td>
			            			<td>{this.state.reports.quantityRemaining}</td>
			            		</tr>
			            	</tbody>
			            </table>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      
							      <th scope="col">ProductName</th>
							      
							      <th scope="col">VendorName</th>
							      <th scope="col">Quantity</th>
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
										      
										      <td>{product.vendorName}</td>
										      <td>{product.quantityAdded}</td>
										      <td>{product.addedBy}</td>
										      <td>{product.dateAdded}</td>
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
										    	<td key = {index} colSpan = "9" >
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
							            						this.state.names.map((name,index)=>{
							            							
							            								return(<option value = {name.productID}>{name.name}</option>)
							            							
							            							
							            							
							            						})
							            					}
							            					
							            				 </select>
							            				 <select key = {index+3} className = "form-control" ref = {"vendorID"+product.id} name = "vendorID" type = "text" defaultValue = {product.vendorName}>
			            								return(<option value = {product.vendorID} selected>{product.vendorName}</option>)
							            					{

							            						this.state.vendors.map((name,index)=>{
							            								return (<option value = {name.vendorID}>{name.name}</option>)
							            						})
							            					}
							            					
							            				 </select>
													      <input className = "form-control" ref = {"quantity"+product.id} name = "quantity" type = "number" defaultValue = {product.quantityAdded} required/>
													   	  <input className = "form-control" ref = {"addedBy"+product.id} name = "addedBy" type = "text" defaultValue = {product.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+product.id} name = "dateAdded" type = "text" defaultValue = {product.dateAdded} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(product.id)} title = {product.id} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {product.productID} className = "save btn">Updated Successfully.</button>
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




export default ManageQuantity



