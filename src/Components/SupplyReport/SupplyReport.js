import React,{Component} from "react"
import TruckSideBar from "../functionalComponents/TruckSideBar"
import "./SupplyReport.css"
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

class SupplyReport extends Component{

	constructor(props){
		super(props)	

		this.state = {
			products: [{}],
			allProducts: [{}],
			reports: {},
			drivers: [{}],
			vehicles:[{}],
			product:"",
			driver:"",
			vehicle: "",
			staff: false,
			admin:false,
			all:false,
		}

		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
		this.fetchReport = this.fetchReport.bind(this)
		this.handleProduct = this.handleProduct.bind(this)
		this.fetchDriver = this.fetchDriver.bind(this)
		this.fetchVehicle = this.fetchVehicle.bind(this)
		this.fetchProduct = this.fetchProduct.bind(this)

	}

	componentDidMount(){

		this.fetchUser()
		this.fetchDriver()
		this.fetchVehicle()
		this.fetchProduct()
		this.fetchReport(this.refs.vehicle.value,this.refs.driver.value,this.refs.product.value)
		this.interval = setInterval(()=>{
			this.fetchUser()
			this.fetchDriver()
			this.fetchVehicle()
			this.fetchProduct()
			if(this.refs.driver && this.refs.vehicle && this.refs.product){
				if(this.refs.driver.value === "all" && this.refs.vehicle.value == "all" && this.refs.product.value != "all"){
					this.setState({
						all:true
					})
				}else{
					this.setState({
						all:false
					})
				}
				this.fetchReport(this.refs.vehicle.value,this.refs.driver.value,this.refs.product.value)
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
		this.fetchReport(this.refs.vehicle.value,this.refs.driver.value,this.refs.product.value)
	}

	fetchDriver = ()=>{
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

	fetchVehicle = ()=>{
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

	fetchReport = (vehicle,driver,product)=>{
		
		const request = new Request("getSupplyReport.php")
		const bodyMessage = `vehicle=${vehicle}&report=true&driver=${driver}&product=${product}`
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
		const bodyMessage = `supply=true`
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

		const request = new Request("updateSupply.php")

		const driverID = this.refs[`driverID${id}`].value
		const productID = this.refs[`productID${id}`].value
		const vehicleID = this.refs[`vehicleID${id}`].value
		const destination = this.refs[`destination${id}`].value
		const cost = this.refs[`cost${id}`].value
		const loads = this.refs[`loads${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const date = this.refs[`date${id}`].value
		const allowance = this.refs[`allowance${id}`].value
		const quantity = this.refs[`quantity${id}`].value
		const price = this.refs[`price${id}`].value
		

	    const bodyMessage = `update=true&id=${id}&date=${date}&driverID=${driverID}&vehicleID=${vehicleID}&destination=${destination}&loads=${loads}&cost=${cost}&allowance=${allowance}&quantity=${quantity}&price=${price}&productID=${productID}&addedBy=${addedBy}`

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
		
		const request = new Request("deleteSupply.php")
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
					<TruckSideBar link = "managesupply"/>
					<div className = "jumbotron manage-product add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			             
			            <table className = "table table-dark table-responsive-sm">
			            	<thead>
			            		<tr>
			            			<th scope = "col">Driver Name</th>
			            			<th scope = "col">Vehicle Number</th>
			            			<th scope = "col">Product Name</th>
			            			<th scope = "col">Total Load</th>
			            			<th scope = "col">Total Fuel Taken</th>
			            			{
			            				this.state.all
			            				&&
			            				<th scope = "col">Rem. Fuel</th>
			            			}
			            			<th scope = "col">Total Cost</th>
			            			<th scope = "col">Driver's Allow.</th>
			            			<th scope = "col">Cumm. Income</th>
			            		</tr>

			            	</thead>
			            	<tbody>
			            		<tr>
			            			<td>
			            				<select ref = "driver" onChange = {this.handleProduct} className = "form-control">
			            					<option value = "all">All</option> 
			            					{
			            						this.state.drivers.map((name,index)=>{
			            							return (<option value = {name.driverID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			<td>
			            				<select ref = "vehicle" onChange = {this.handleProduct} className = "form-control">
			            					<option value = "all">All</option> 
			            					{
			            						this.state.vehicles.map((name,index)=>{
			            							return (<option value = {name.vehicleID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			<td>
			            				<select ref = "product" onChange = {this.handleProduct} className = "form-control">
			            					<option value = "all">All</option> 
			            					{
			            						this.state.allProducts.map((name,index)=>{
			            							return (<option value = {name.productID}>{name.name}</option>)
			            						})
			            					}
			            					
			            				</select>
			            				
			            			</td>
			            			
			            			<td>{this.state.reports.loads}</td>
			            			<td>{this.state.reports.quantity}</td>
			            			{
			            				this.state.all
			            				&&
			            				<td>{this.state.reports.remaining}</td>
			            			}
			            			
			            			<td>{this.state.reports.cost}</td>
			            			<td>{this.state.reports.allowance}</td>
			            			<td>{this.state.reports.income}</td>
			            		</tr>
			            	</tbody>
			            </table>
			              <table className="table table-dark table-responsive-xl">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							     
							      <th scope="col">Product</th>
							      <th scope="col">Driver</th>
							      <th scope="col">Vehicle</th>
							      <th scope="col">Load</th>
							      <th scope="col">Destination</th>
							      <th scope="col">Cost</th>
							      <th scope="col">Fuel Taken</th>
							      <th scope="col">Price</th>
							      <th scope="col">Total</th>
							      <th scope="col">Driver Allw.</th>
							      <th scope="col">Net Income</th>
							      
							      <th scope="col">Date Added</th>
							      <th scope="col">Added By</th>
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
										      <td>{product.driverName}</td>
										      <td>{product.vehicleName}</td>
										      <td>{product.loads}</td>
										      <td>{product.destination}</td>
										      <td>{product.cost}</td>
										      <td>{product.quantity}</td>
										      <td>{product.price}</td>
										      
										      <td>{product.total}</td>
										      <td>{product.allowance}</td>
										      <td>{product.netIncome}</td>
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
													        <h5 className="modal-title">Delete Supply Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {product.driverName} record?</p>
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
										    	<td key = {index} colSpan = "15" >
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
							            				 <select className = "form-control" ref = {"driverID"+product.id} name = "driverID" type = "text" defaultValue = {product.driverName}>
							            					return(<option value = {product.driverID} selected>{product.driverName}</option>)
							            					{
							            					
										            			this.state.drivers.map((name,index)=>{
										            							
										            				return(<option value = {name.driverID}>{name.name}</option>)
										            							
										            							
										            							
								            						})
								            					}
							            							
							            						})
							            					}
							            				 </select>
							            				 <select className = "form-control" ref = {"vehicleID"+product.id} name = "vehicleID" type = "text" defaultValue = {product.vehicleName}>
							            					return(<option value = {product.vehicleID} selected>{product.vehicleName}</option>)
							            					{
							            					
										            			this.state.vehicles.map((name,index)=>{
										            							
										            				return(<option value = {name.vehicleID}>{name.name}</option>)
										            							
										            							
										            							
								            						})
								            					}
							            							
							            						})
							            					}
							            				 </select>
													      <input className = "form-control" ref = {"loads"+product.id} name = "loads" type = "number" defaultValue = {product.loads} required/>
													   	  <input className = "form-control" ref = {"destination"+product.id} name = "destination" type = "text" defaultValue = {product.destination} required/>
													   	  <input className = "form-control" ref = {"cost"+product.id} name = "cost" type = "number" defaultValue = {product.cost} required/>
													   	  <input className = "form-control" ref = {"quantity"+product.id} name = "quantity" type = "number" defaultValue = {product.quantity} required/>
													   	  <input className = "form-control" ref = {"price"+product.id} name = "price" type = "number" defaultValue = {product.price} required/>
													   	  <input className = "form-control" ref = {"allowance"+product.id} name = "allowance" type = "number" defaultValue = {product.allowance} required/>
													   	  
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




export default SupplyReport



