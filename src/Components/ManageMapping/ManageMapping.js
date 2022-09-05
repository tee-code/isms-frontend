import React,{Component} from "react"
import TruckSideBar from "../functionalComponents/TruckSideBar"
import "./ManageMapping.css"
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

class ManageMapping extends Component{

	constructor(props){
		super(props)	
		this.state = {
			mappings: [{}],
			vehicles: [{}],
			drivers: [{}],
			names: [{}],
			mapping: "",
		}
		this.handleDelete = this.handleDelete.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.fetchUser = this.fetchUser.bind(this)
		
		this.fetchVehicles = this.fetchVehicles.bind(this)
		this.fetchDrivers = this.fetchDrivers.bind(this)

	}

	componentDidMount(){

		this.fetchDrivers()
		this.fetchVehicles()
		this.fetchUser()
		
		this.interval = setInterval(()=>{
			this.fetchDrivers()
			this.fetchVehicles()
			
			this.fetchUser()
			
			
		},2000)

	}
	

	fetchDrivers = ()=>{
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

	fetchVehicles = ()=>{
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

	fetchUser = ()=>{
		const request = new Request("selectAllUser.php")
		const bodyMessage = `mapping=true`
		request.post(bodyMessage).then((response)=>{
			
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					mappings: responseJSON,
					ready:true
				})
			}
		})
	}

	handleEdit = (id)=>{
		const request = new Request("updateMapping.php")

		const driverID = this.refs[`driverID${id}`].value
		const vehicleID = this.refs[`vehicleID${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value
		

	    const bodyMessage = `id=${id}&vehicleID=${vehicleID}&update=true&driverID=${driverID}&dateMapped=${dateAdded}&mappedBy=${addedBy}`

	    request.post(bodyMessage).then((response)=>{
	      console.log(response)
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
		
		const request = new Request("deleteMapping.php")
		const bodyMessage = `delete=true&id=${id}`
		request.post(bodyMessage).then((response)=>{
			console.log(response)
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
					<TruckSideBar link = "managemapping"/>
					<div className = "jumbotron manage-mapping add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			          
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      
							      <th scope="col">Driver's Name</th>
							      
							      <th scope="col">Vehicles's Number</th>
							      
							      <th scope="col">Mapped By</th>
							      <th scope="col">Date Mapped</th>
							      <th scope="col">Actions</th>
							    </tr>
							  </thead>
							  <tbody>
							  {
							  	this.state.ready === true
							  	&&
								  	this.state.mappings.map((mapping,index)=>{
								  		return(
								  		<React.Fragment>
								  			<tr key = {index+1}>
										      <th scope="row">{index+1}</th>
										      
										      <td>{mapping.driverName}</td>
										      
										      <td>{mapping.vehicleName}</td>
										     
										      <td>{mapping.addedBy}</td>
										      <td>{mapping.dateAdded}</td>
										      {
									      		`"${mapping.addedBy}"` == getData("staffIDs") || getData("adminIDs") ? (

									      		
										      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+mapping.id} title = {mapping.id} icon = "trash-alt" />
										      		<div id = {"delete"+mapping.id} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Mapping Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {mapping.driverName} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(mapping.id)} type="button" className="btn btn-primary">Delete</button>
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
													      
													      <select key = {index+5} className = "form-control" ref = {"driverID"+mapping.id} name = "driverID" type = "text" defaultValue = {mapping.mappingName}>
			            									return(<option value = {mapping.driverID} selected>{mapping.driverName}</option>)
							            					{
							            						this.state.drivers.map((name,index)=>{
							            							
							            								return(<option value = {name.driverID}>{name.name}</option>)
							            							
							            							
							            							
							            						})
							            					}
							            					
							            				 </select>
							            				 <select key = {index+3} className = "form-control" ref = {"vehicleID"+mapping.id} name = "vehicleID" type = "text" defaultValue = {mapping.driverName}>
			            								return(<option value = {mapping.vehicleID} selected>{mapping.vehicleName}</option>)
							            					{

							            						this.state.vehicles.map((name,index)=>{
							            								return (<option value = {name.vehicleID}>{name.name}</option>)
							            						})
							            					}
							            					
							            				 </select>
													      
													   	  <input className = "form-control" ref = {"addedBy"+mapping.id} name = "addedBy" type = "text" defaultValue = {mapping.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+mapping.id} name = "dateAdded" type = "text" defaultValue = {mapping.dateAdded} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(mapping.id)} title = {mapping.id} className = "save btn">Save Changes</button>
													  	  }
													  	  {
													  	  	this.state.status
													  	  	&&
													  	  	<button title = {mapping.id} className = "save btn">Updated Successfully.</button>
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




export default ManageMapping



