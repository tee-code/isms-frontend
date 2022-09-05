import React,{Component} from "react"
import DashboardLeftSideBar from "../functionalComponents/DashboardLeftSideBar"
import "./ManageStaff.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Request from "../../Request/Request"
import { generateAdminID, generateStaffID, setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt)

class ManageStaff extends Component{

	constructor(props){
		super(props)	
		this.state = {
			admin: [{}],
			deleted: false,
			ready: false,
		}

		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
	}

	componentDidMount(){

		this.fetchUser()
		this.interval = setInterval(()=>{
			this.fetchUser()
		},2000)

	}
	
	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `staff=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					admin: responseJSON,
					ready:true
				})
			}
		})
	}

	handleEdit = (id)=>{
		const request = new Request("update.php")

		const name = this.refs[`name${id}`].value
		const userType = this.refs[`userType${id}`].value
		const password = this.refs[`password${id}`].value
		const username = this.refs[`staffID${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value

	    const bodyMessage = `userType=${userType}&userID=${id}&update=true&name=${name}&username=${username}&password=${password}&dateAdded=${dateAdded}&addedBy=${addedBy}`

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
		const request = new Request("delete.php")
		const bodyMessage = `delete=true&username=${id}`
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
		if((!getData("adminIDs") && !getData("adminToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar link = "managestaff"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      <th scope="col">Name</th>
							      <th scope="col">StaffID</th>
							      <th scope="col">Password</th>
							      <th scope="col">Added By</th>
							      <th scope="col">Date Added</th>
							      <th scope="col">Actions</th>
							    </tr>
							  </thead>
							  <tbody>
							  {
							  	this.state.ready === true
							  	&&
								  	this.state.admin.map((admin,index)=>{
								  		return(
								  		<React.Fragment>
								  			<tr key = {index+1}>
										      <th scope="row">{index+1}</th>
										      <td>{admin.name}</td>
										      <td>{admin.staffID}</td>
										      <td>{admin.password}</td>
										      <td>{admin.addedBy}</td>
										      <td>{admin.dateJoined}</td>
										      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+admin.staffID} title = {admin.staffID} icon = "trash-alt" />
										      		<div id = {"delete"+admin.staffID} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Staff Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {admin.name} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(admin.staffID)} type="button" className="btn btn-primary">Delete</button>
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
										    </tr>
										    <tr key = {index}>
										    	<td key = {index} colSpan = "7" >
												    <div className="collapse" id={"collapseExample"+index}>
												    {
												    	this.state.error
										                &&
										                <div className = "m-2 bg-danger">Not updated!!!</div>

												    }
													  <div className="bg-dark card card-body">
													  	<form key = {index}>
													      <input className = "form-control" ref = {"name"+admin.staffID} name = "name" type = "text" defaultValue = {admin.name} required />
													      <input className = "form-control" ref = {"staffID"+admin.staffID} name = "staffID" type = "text" defaultValue = {admin.staffID} required/>
													      <input className = "form-control" ref = {"password"+admin.staffID} name = "password" type = "text" defaultValue = {admin.password} required/>
													      <select className = "form-control" ref = {"userType"+admin.staffID} name = "userType" required>
													      	<option value = "" disabled>User Type</option>
													      	<option value = "admin">User-type: Admin</option>
													      	<option value = "staff" selected>User-type: Staff</option>
													      </select>
													      <input className = "form-control" ref = {"addedBy"+admin.staffID} name = "addedBy" type = "text" defaultValue = {admin.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+admin.staffID} name = "dateAdded" type = "text" defaultValue = {admin.dateJoined} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(admin.staffID)} title = {admin.staffID} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {admin.staffID} className = "save btn">Updated Successfully.</button>
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




export default ManageStaff



