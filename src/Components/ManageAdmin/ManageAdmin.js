import React,{Component} from "react"
import DashboardLeftSideBar from "../functionalComponents/DashboardLeftSideBar"
import "./ManageAdmin.css"
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

class ManageAdmin extends Component{

	constructor(props){
		super(props)	
		this.state = {
			admin: [{}],
			ready: false
			
		}

		this.fetchUser = this.fetchUser.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
	}

	componentDidMount(){

		this.fetchUser()
		setInterval(()=>{
			this.fetchUser()
		},2000)

	}

	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `admin=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					admin: responseJSON,
					ready: true
				})
			}
		})
	}

	handleDelete = (id)=>{
		const request = new Request("delete.php")
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
		const request = new Request("update.php")

		const name = this.refs[`name${id}`].value
		const userType = this.refs[`userType${id}`].value
		const password = this.refs[`password${id}`].value
		const username = this.refs[`adminID${id}`].value
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

	render(){
		if((!getData("adminIDs") && !getData("adminToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar link = "manageadmin"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      <th scope="col">Name</th>
							      <th scope="col">AdminID</th>
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
										      <td>{admin.adminID}</td>
										      <td>{admin.password}</td>
										      <td>{admin.addedBy}</td>
										      <td>{admin.dateJoined}</td>
										      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+admin.adminID} title = {admin.adminID} icon = "trash-alt" />
										      		<div id = {"delete"+admin.adminID} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Admin Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {admin.name} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(admin.adminID)} type="button" className="btn btn-primary">Delete</button>
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
													      <input className = "form-control" ref = {"name"+admin.adminID} name = "name" type = "text" defaultValue = {admin.name} required />
													      <input className = "form-control" ref = {"adminID"+admin.adminID} name = "adminID" type = "text" defaultValue = {admin.adminID} required/>
													      <input className = "form-control" ref = {"password"+admin.adminID} name = "password" type = "text" defaultValue = {admin.password} required/>
													      <select className = "form-control" ref = {"userType"+admin.adminID} name = "userType" required>
													      	<option value = "" disabled>User Type</option>
													      	<option value = "admin" selected>User-type: Admin</option>
													      	<option value = "staff">User-type: Staff</option>
													      </select>
													      <input className = "form-control" ref = {"addedBy"+admin.adminID} name = "addedBy" type = "text" defaultValue = {admin.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+admin.adminID} name = "dateAdded" type = "text" defaultValue = {admin.dateJoined} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(admin.adminID)} title = {admin.adminID} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {admin.adminID} className = "save btn">Updated Successfully.</button>
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




export default ManageAdmin



