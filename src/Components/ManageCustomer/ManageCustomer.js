import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./ManageCustomer.css"
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

class ManageCustomer extends Component{

	constructor(props){
		super(props)	
		this.state = {
			customers: [{}],
			secured: false
			
		}
		this.fetchUser = this.fetchUser.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
	}

	
	componentDidMount(){

		this.fetchUser()
		this.interval = setInterval(()=>{
			this.fetchUser()
		},2000)

	}

	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `customer=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					customers: responseJSON,
					ready: true
				})
			}
		})
	}

	handleDelete = (id)=>{
		const request = new Request("deleteCustomer.php")
		const bodyMessage = `delete=true&username=${id}`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON.status){
				this.setState({
					deleted:true
				})
			}
		})
	}

	handleEdit = (id)=>{

		const request = new Request("updateCustomer.php")

		const name = this.refs[`name${id}`].value
		const  email = this.refs[`email${id}`] ? this.refs[`email${id}`].value : "Not Applicable"
		const phonenumber = this.refs[`phonenumber${id}`] ? this.refs[`phonenumber${id}`].value : "Not Applicable"
		const username = this.refs[`customerID${id}`] ? this.refs[`customerID${id}`].value : "Not Applicable"
		const  state = this.refs[`state${id}`] ? this.refs[`state${id}`].value : "Not Applicable"
		const address = this.refs[`address${id}`] ? this.refs[`address${id}`].value : "Not Applicable"
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value

	    const bodyMessage = `state=${state}&address=${address}&email=${email}&customerID=${id}&update=true&name=${name}&customerID=${username}&phoneNumber=${phonenumber}&dateAdded=${dateAdded}&addedBy=${addedBy}`

	    request.post(bodyMessage).then((response)=>{
	      console.log(response," response")
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


	render(){
		if((!getData("adminIDs") && !getData("adminToken")) && (!getData("staffIDs") && !getData("staffToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar2 link = "managecustomer"/>
					<div className = "jumbotron manage-customer add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      <th scope="col">Name</th>
							      <th scope="col">CustomerID</th>
							      <th scope="col">Email</th>
							      <th scope="col">PhoneNumber</th>
							      <th scope="col">Address</th>
							      <th scope="col">State</th>
							      <th scope="col">Added By</th>
							      <th scope="col">Date Added</th>
							      <th scope="col">Actions</th>
							    </tr>
							  </thead>
							  <tbody>
							  {
							  	this.state.customers.map((customer,index)=>{
							  		
							  		return(
							  		<React.Fragment>
							  			<tr key = {index+1}>
									      <th scope="row">{index+1}</th>
									      <td>{customer.name}</td>
									      <td>{customer.customerID}</td>
									      <td>{customer.email}</td>
									      <td>{`0${customer.phonenumber}`}</td>
									      <td>{customer.address}</td>
									      <td>{customer.state}</td>
									      <td>{customer.addedBy}</td>
									      <td>{customer.dateAdded}</td>
									      	
									      	{

									      		`"${customer.addedBy}"` === getData("staffIDs") || getData("adminIDs") ? (
									      			<td>

											      	<span className = "action p-2">
											      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+customer.customerID} title = {customer.customerID} icon = "trash-alt" />
											      		<div id = {"delete"+customer.customerID} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
														  <div className="modal-dialog" role="document">
														    <div className="modal-content">
														      <div className="modal-header">
														        <h5 className="modal-title">Delete Customer Record</h5>
														        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
														          <span aria-hidden="true">&times;</span>
														        </button>
														      </div>
														      <div className="modal-body">
														        <p title = {customer.name}>Are you sure you want to delete {customer.name} record?</p>
														      </div>
														      <div className="modal-footer">
														        <button data-dismiss="modal" onClick = {()=>this.handleDelete(customer.customerID)} type="button" className="btn btn-primary">Delete</button>
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

										    	<td key = {index} colSpan = "10" >
												    <div className="collapse" id={"collapseExample"+index}>
												    {
												    	this.state.error
										                &&
										                <div className = "m-2 bg-danger">Not updated!!!</div>

												    }
													  <div className="bg-dark card card-body">

													  	<form key = {index}>
													  	{

													  		customer.isTruck === "1"  ? (
													  			<React.Fragment>												  		
													  				<input className = "form-control" ref = {"name"+customer.customerID} name = "name" type = "text" defaultValue = {customer.name} required />
													  				<input className = "form-control" ref = {"addedBy"+customer.customerID} name = "addedBy" type = "text" defaultValue = {customer.addedBy} required/>
															    	<input className = "form-control" ref = {"dateAdded"+customer.customerID} name = "dateAdded" type = "text" defaultValue = {customer.dateAdded} required/>
													  			</React.Fragment>
													  		) : (
														  		<React.Fragment>
															      <input className = "form-control" ref = {"name"+customer.customerID} name = "name" type = "text" defaultValue = {customer.name} required />
															      <input className = "form-control" ref = {"customerID"+customer.customerID} name = "customerID" type = "text" defaultValue = {customer.customerID} required/>
															      <input className = "form-control" ref = {"email"+customer.customerID} name = "email" type = "email" defaultValue = {customer.email} required/>
															      <input className = "form-control" ref = {"phonenumber"+customer.customerID} name = "phonenumber" type = "number" defaultValue = {customer.phonenumber} required />
															      <input className = "form-control" ref = {"address"+customer.customerID} name = "address" type = "text" defaultValue = {customer.address} required/>
															      <input className = "form-control" ref = {"state"+customer.customerID} name = "state" type = "text" defaultValue = {customer.state} required/>
															      <input className = "form-control" ref = {"addedBy"+customer.customerID} name = "addedBy" type = "text" defaultValue = {customer.addedBy} required/>
															      <input className = "form-control" ref = {"dateAdded"+customer.customerID} name = "dateAdded" type = "text" defaultValue = {customer.dateAdded} required/>
														  		</React.Fragment>
													  		)
													    }
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(customer.customerID)} title = {customer.customerID} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {customer.customerID} className = "save btn">Updated Successfully.</button>
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




export default ManageCustomer



