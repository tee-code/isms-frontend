import React, {Component} from "react"
import logo from "../../logo.svg"
import "./Header.css"
import {Redirect,Link} from "react-router-dom"
import {setData,getData} from "../../helperFunctions/functions"
import Request from "../../Request/Request"

class Header extends Component{
	constructor(props){

		super(props)

		this.state = {
			loggedOut:false,
			affectedCustomers: [{}],
			showNotification: !getData("notified"),
			
		}

		this.logout = this.logout.bind(this)
		this.checkSalesLimit = this.checkSalesLimit.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleMinimize = this.handleMinimize.bind(this)
		
	}

	componentDidMount(){

		if(!getData("notified")){
			this.checkSalesLimit()
		}
		
		this.handleMinimize()
		setInterval(()=>{
			this.checkSalesLimit()
		},3000000)
		
		
	}

	handleMinimize = ()=>{

		const sideBars = document.querySelectorAll(".sidebar");
		const main = document.querySelectorAll(".jumbotron");

		sideBars.forEach((sidebar)=>{
			if(sidebar.style.display == "none"){
				sidebar.style.display = "block";
				sidebar.style.position = "fixed";
				sidebar.style.left = 0;
				sidebar.style.height = "87%";
				main.forEach((m)=>{
					
					m.style.flex = "0 0 100%";
				})
			}else{
				sidebar.style.display = "none";
				main.forEach((m)=>{
					console.log(m)
					m.style.flex = "0 0 100%";
				})
			}
		})
	}

	handleClick = (e)=>{
		e.preventDefault()
		
		setData("notified",true)
		this.setState({
			showNotification: !getData("notified")
		})
		
	}

	checkSalesLimit = ()=>{
	  const request = new Request("checkSalesLimit.php")
	    const bodyMessage = `check=true`
	    request.post(bodyMessage).then((response)=>{
	      
	      const responseJSON = JSON.parse(response)
	      
	      if(responseJSON[0] && responseJSON[0].status){
	        this.setState({
	        	affectedCustomers:responseJSON,
	        	showNotification: true,
	        })


	      }
	    })
	}

	logout = ()=>{
		if(getData("adminIDs") || getData("staffIDs") || getData("adminToken") || getData("staffToken")){

			localStorage.removeItem("adminIDs")
			localStorage.removeItem("staffIDs")
			sessionStorage.removeItem("adminIDs")
			sessionStorage.removeItem("staffIDs")
			localStorage.removeItem("adminToken")
			localStorage.removeItem("staffToken")
			sessionStorage.removeItem("adminToken")
			sessionStorage.removeItem("staffToken")
			sessionStorage.removeItem("notified")
			localStorage.removeItem("notified")

			localStorage.clear()
			sessionStorage.clear()

			this.setState({
				loggedOut: true
			})

		}
	}

	render(){

	  if(this.state.loggedOut){
	  	return(<Redirect to = "/login" />)
	  }
	  
	  return(
	    <header className = "app-header container-fluid">
	    {
	    	this.state.showNotification && this.state.affectedCustomers[0].customerName
	    	&&
	    	
		    	<div className="notification alert alert-success" role="alert">
		    	  <button onClick = {this.handleClick} type="button" className="close">
				    <span onClick = {this.handleClick} className = "close-notification">&times;</span>
				  </button>
				  <h6 className="alert-heading notification-heading" >Sales Limit Notification!</h6>
				  <div>
				  	<table className = "table table-responsive">
				  	<thead>
					    <tr>
					      <th scope="col">SN</th>
					      <th scope="col">Customer Name</th>
					      <th scope="col">Product Name</th>
					      <th scope="col">Date Issued</th>
					      <th scope="col">Payment Limit</th>
					      <th scope="col">Rem. Days</th>
					    </tr>
					 </thead>
					 <tbody>

					  	{
					  		this.state.affectedCustomers.map((customer,index)=>{
		  						return(
		  							<tr scope = "row">
		  								<td>{index+1}</td>
		  								<td>{customer.customerName}</td>
		  								<td>{customer.productName}</td>
		  								<td>{customer.date}</td>
		  								<td>{customer.salesLimit}</td>
		  								<td>{customer.daysRemaining}</td>
		  							</tr>
		  						)
		  					})
					  	}
					</tbody>
				  	</table>
				  </div>
				</div>
			
		}
		  <span onClick = {this.handleMinimize} style = {{"cursor":"pointer"}}>&#9776;</span>
	      
	      <Link to = "/home"><span className = "lead name">{this.props.appName}</span></Link>
	      {
	      	this.props.logout === true
	      	&&
	      	<span onClick = {this.logout} style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Logout | </span>

	      }
	      {
	      	getData("adminIDs") && getData("adminToken")
	      	&&
	      	<React.Fragment>
		      	<Link to = "/dashboard/admin/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Admin | </span></Link>
		      	<Link to = "/dashboard/staff/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Staff | </span></Link>
		      	<Link to = "/dashboard/inventory/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Inventory | </span></Link>
		      	<Link to = "/dashboard/truck/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Truck Services | </span></Link>
		    </React.Fragment>
	      	
	      }
	      {
	      	getData("staffIDs") && getData("staffToken")
	      	&&
	      	<React.Fragment>
		      	<Link to = "/dashboard/staff/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Staff | </span></Link>
		      	<Link to = "/dashboard/inventory/"><span style = {{"color":"#DD4B39","float":"right","cursor":"pointer"}}> Inventory | </span></Link>
		    </React.Fragment>
	      	
	      }
	      
	    </header>
	  )
	}
}


export default Header
