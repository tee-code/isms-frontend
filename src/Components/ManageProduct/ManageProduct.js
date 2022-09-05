import React,{Component} from "react"
import DashboardLeftSideBar2 from "../functionalComponents/DashboardLeftSideBar2"
import "./ManageProduct.css"
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

class ManageProduct extends Component{

	constructor(props){
		super(props)	
		this.state = {
			products: [{}]
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

	handleEdit = (id)=>{
		const request = new Request("updateProduct.php")

		const name = this.refs[`name${id}`].value
		const username = this.refs[`productID${id}`].value
		const addedBy = this.refs[`addedBy${id}`].value
		const dateAdded = this.refs[`dateAdded${id}`].value

	    const bodyMessage = `productID=${id}&update=true&name=${name}&dateAdded=${dateAdded}&addedBy=${addedBy}`

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
		const request = new Request("deleteProduct.php")
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
		if((!getData("adminIDs") && !getData("adminToken")) && (!getData("staffIDs") && !getData("staffToken"))){
			return(<Redirect  to = "/login" />)
		}
		return(
			<div className = "container-fluid app-wrapper">
				<Header appName = "IMC" logout = {true}/>
				<main className = "container-fluid d-flex p-0 dashboard">
					<DashboardLeftSideBar2 link = "manageproduct"/>
					<div className = "jumbotron manage-product add-staff pt-4">
			            <p className = "label text-center" > View, Update & Delete</p>
			            <hr className = "my-4"/>
			              <table className="table table-dark table-responsive-lg">
							  <thead>
							    <tr>
							      <th scope="col">SN</th>
							      <th scope="col">Product's Name</th>
							      <th scope="col">ProductID</th>
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
										      <td>{product.name}</td>
										      <td>{product.productID}</td>
										      <td>{product.addedBy}</td>
										      <td>{product.dateAdded}</td>
										      {
									      		`"${product.addedBy}"` == getData("staffIDs") || getData("adminIDs") ? (

									      		
										      <td>

										      	<span className = "action p-2">
										      		<FontAwesomeIcon data-toggle="modal" data-target={"#delete"+product.productID} title = {product.productID} icon = "trash-alt" />
										      		<div id = {"delete"+product.productID} style = {{"color":"black"}} className="modal fade exampleModal" tabindex="-1" role="dialog">
													  <div className="modal-dialog" role="document">
													    <div className="modal-content">
													      <div className="modal-header">
													        <h5 className="modal-title">Delete Product Record</h5>
													        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
													          <span aria-hidden="true">&times;</span>
													        </button>
													      </div>
													      <div className="modal-body">
													        <p>Are you sure you want to delete {product.name} record?</p>
													      </div>
													      <div className="modal-footer">
													        <button data-dismiss="modal" onClick = {()=>this.handleDelete(product.productID)} type="button" className="btn btn-primary">Delete</button>
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
										    	<td key = {index} colSpan = "7" >
												    <div className="collapse" id={"collapseExample"+index}>
												    {
												    	this.state.error
										                &&
										                <div className = "m-2 bg-danger">Not updated!!!</div>

												    }
													  <div className="bg-dark card card-body">
													  	<form key = {index}>
													      <input className = "form-control" ref = {"name"+product.productID} name = "name" type = "text" defaultValue = {product.name} required />
													      <input className = "form-control" ref = {"productID"+product.productID} name = "productID" type = "text" defaultValue = {product.productID} required/>
													      <input className = "form-control" ref = {"addedBy"+product.productID} name = "addedBy" type = "text" defaultValue = {product.addedBy} required/>
													      <input className = "form-control" ref = {"dateAdded"+product.productID} name = "dateAdded" type = "text" defaultValue = {product.dateAdded} required/>
													  	</form>
													  	  {
													  	  	!this.state.status
													  	  	&&
													  	  	<button onClick = {()=>this.handleEdit(product.productID)} title = {product.productID} className = "save btn">Save Changes</button>
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




export default ManageProduct



