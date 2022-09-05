import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./ManageVendor.css"
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

class ManageVendor extends Component{

	constructor(props){
		super(props)	
		this.state = {
			vendors: [{}],
			
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
		const bodyMessage = `vendor=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					vendors: responseJSON,
					ready: true
				})
			}
		})
	}

	handleDelete = (id)=>{
		const request = new Request("deleteVendor.php")
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

		const request = new Request("updateVendor.php")

		const name = this.refs[`name${id}`].value
		const  email = this.refs[`email${id}`].value
		const phonenumber = this.refs[`phonenumber${id}`].value
		const username = this.refs[`vendorID${id}`].value
		const  state = this.refs[`state${id}`].value
		const address = this.refs[`address${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value

	    const bodyMessage = `state=${state}&address=${address}&email=${email}&vendorID=${id}&update=true&name=${name}&vendorID=${username}&phoneNumber=${phonenumber}&dateAdded=${dateAdded}&addedBy=${addedBy}`

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
					<DashboardLeftSideBar2 link = "managevendor"/>
					<div className = "jumbotron manage-vendor add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      <th scope="col">Name</th>
							      <th scope="col">VendorID</th>
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
							  	this.state.vendors.map((vendor,index)=>{
							  		return(
							  		<React.Fragment>
							  			<tr key = {index+1}>
									      <th scope="row">{index+1}</th>
									      <td>{vendor.name}</td>
									      <td>{vendor.vendorID}</td>
									      <td>{vendor.email}</td>
									      <td>{`0${vendor.phonenumber}`}</td>
									      <td>{vendor.address}</td>
									      <td>{vendor.state}</td>
									      <td>{vendor.addedBy}</td>
									      <td>{vendor.dateAdded}</td>
									      {
									      	`"${vendor.addedBy}"` == getData("staffIDs") || getData("adminIDs") ? (

									      	
									      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+vendor.vendorID} title = {vendor.vendorID} icon = "trash-alt" />
										      		<div id = {"delete"+vendor.vendorID} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Vendor Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p title = {vendor.name}>Are you sure you want to delete {vendor.name} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(vendor.vendorID)} type="button" className="btn btn-primary">Delete</button>
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
													      <input className = "form-control" ref = {"name"+vendor.vendorID} name = "name" type = "text" defaultValue = {vendor.name} required />
													      <input className = "form-control" ref = {"vendorID"+vendor.vendorID} name = "vendorID" type = "text" defaultValue = {vendor.vendorID} required/>
													      <input className = "form-control" ref = {"email"+vendor.vendorID} name = "email" type = "email" defaultValue = {vendor.email} required/>
													      <input className = "form-control" ref = {"phonenumber"+vendor.vendorID} name = "name" type = "number" defaultValue = {vendor.phonenumber} required />
													      <input className = "form-control" ref = {"address"+vendor.vendorID} name = "address" type = "text" defaultValue = {vendor.address} required/>
													      <input className = "form-control" ref = {"state"+vendor.vendorID} name = "state" type = "text" defaultValue = {vendor.state} required/>
													      <input className = "form-control" ref = {"addedBy"+vendor.vendorID} name = "addedBy" type = "text" defaultValue = {vendor.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+vendor.vendorID} name = "dateAdded" type = "text" defaultValue = {vendor.dateAdded} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(vendor.vendorID)} title = {vendor.vendorID} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {vendor.vendorID} className = "save btn">Updated Successfully.</button>
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




export default ManageVendor



