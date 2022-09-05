import React,{Component} from "react"
import InventorySideBar from "../functionalComponents/InventorySideBar"
import "./Credit.css"
import "../Settings/Settings.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import { faPlusCircle, faSave, faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { generateCustomerID,setData,getData,checkUser } from "../../helperFunctions/functions"
import { Redirect } from "react-router-dom"
import Request from "../../Request/Request"

library.add(faPlusCircle,faSave,faUserCog, faTrashAlt, faPenAlt, faBuilding, faUser)

class AddCustomer extends Component{

	constructor(props){
		super(props)
		this.state = {
			error: false,
			status: false,
			lecturerID: "",
			amountPaid: 0,
			month: "",
			paymentMode: "",
			balance: 0.0,
			products: [{}],
			customers: [{}],
			paymentsMode:["Cash","Cheque","Transfer"],
			admin: false,
			staff: false,

		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearStatus = this.clearStatus.bind(this)
		this.fetchProducts = this.fetchProducts.bind(this)
		this.fetchCustomers = this.fetchCustomers.bind(this)
	}

	componentDidMount(){
		this.fetchProducts()
		this.fetchCustomers()

		setInterval(()=>{
			this.fetchCustomers()
			this.fetchProducts()
			if(getData("adminIDs") && getData("adminToken")){
				this.setState({admin:true})
			}
			if(getData("staffIDs") && getData("staffToken")){
				this.setState({staff:true})
			}
		},2000)
		const addedBy = JSON.parse(getData("staffIDs")) || JSON.parse(getData("adminIDs")) 
		this.setState({addedBy})
	}

	clearStatus(){

	    setTimeout(()=>{
	      this.setState({
	        status:false,
	        error:false,
	      })
	      this.refs.form1.reset()
	      this.refs.form2.reset()
	    },2000)
    }

	handleInput(e){

	    e.persist()

	    this.setState({
	      [e.target.name] : e.target.value,
	    })
  }

	fetchLecturers(){
		const request = new Request("selectAllUser.php")
		const bodyMessage = `lecturer=true`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			if(responseJSON[0].status){
				this.setState({
					lecturers: responseJSON,
					ready:true
				})
			}
		})
	}

  handleSubmit(e){
   
    e.preventDefault()
    
    const request = new Request("credit.php")
    const bodyMessage = `add=true&month=${this.state.month}&paymentMode=${this.state.paymentMode}&amount=${this.state.amountPaid}&lecturerID=${this.state.lecturerID}`
    request.post(bodyMessage).then((response)=>{
    	console.log(response)
      const responseJSON = JSON.parse(response)
      
      if(responseJSON.status){
        this.setState({status:true})
      }else{
      	this.setState({error:true})
      }
      this.clearStatus()
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
					<InventorySideBar link = "credit"/>
					<div className = "jumbotron add-staff pt-4">
			            <p className = "label text-center" > CREDIT YOUR ACCOUNT </p>
			            <hr className = "my-4"/>

			            <form ref = "form1" style = {{"margin":"0 auto"}} className = "text-center company-form">
			            	{
			                  this.state.error
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Account not creditd</div>
			                }
			                {
			                  this.state.status
			                  &&
			                  <div className = "p-2 m-2 bg-danger">Added Successfully</div>
			                }
			            	<span style = {{"fontSize":"40px"}}>
			            		<FontAwesomeIcon icon = "user" />
			            	</span>
			            	<input onChange = {this.handleInput} name = "month" type = "date" className = "form-control" placeholder = "choose a date" required autoFocus/>
			                <label htmlFor="inputEmail" className="sr-only">Lecturer's Name</label>
			                <select onChange = {this.handleInput} name = "lecturerID" className="form-control" placeholder="Lecturer's Name" required autoFocus>
			                	<option disabled selected>Select Lecturer</option>
			                	{
				                	this.state.lecturers.map((lecturer)=>{
				                		return (<option value = {lecturer.lecturerID}>{lecturer.name}</option>)
				                	})
				                }
			                </select>
			
			                <label htmlFor="inputEmail" className="sr-only">Mode of Payment</label>
			                <select onChange = {this.handleInput} name = "paymentMode" className="form-control" placeholder="" required autoFocus>
			                	<option disabled selected>Select Mode of Payment</option>
			                	{
			                		this.state.paymentsMode.map((paymentMode)=>{
			                			return (<option value = {paymentMode}>{paymentMode}</option>) 
			                		})
			                	}
			                	
			                </select>
			                <form ref = "form2" className="form-inline PhoneNumber">
			      
			        
			                  <div className="form-group">
			                    <label htmlFor="" className="sr-only">Amount Paid</label>
			                    <input onChange = {this.handleInput} name = "amountPaid" type="number" className="form-control" id="i" placeholder="Amount Paid"/>
			                  </div>
			                </form>
			             
			              	<button onClick = {this.handleSubmit} className="save btn btn-lg btn-block" type="submit">Make Payment <FontAwesomeIcon icon = "plus-circle"/></button>
			                
			                
			              
			              </form>
			          </div>
				</main>
				<Footer />
			</div>
		)
	}

	
}




export default AddCustomer



