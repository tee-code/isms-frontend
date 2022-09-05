//later changed to classical component

import React, {Component} from "react"
import {Link} from "react-router-dom"
import { faPlusCircle, faSearch, faCogs, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faPlusCircle,faSearch, faCogs, faUserCog)
 
 	class DashboardLeftSideBar2 extends Component{

 		constructor(props){

 			super(props)

 			this.state = {
 				previousIndex: ""
 			}

 			this.handleClick = this.handleClick.bind(this)
 		}

 		componentDidMount(){

 			this.refs[this.props.link].style.borderBottom = "3px ridge white"
 		}

 		handleClick(e){
 			e.persist()
 			this.refs[e.currentTarget.name].style.borderBottom = "3px ridge white"
 			this.setState({previousIndex:e.currentTarget.name})
 			if(this.refs[this.state.previousIndex]){
 				this.refs[this.state.previousIndex].style.borderBottom = "none"
 			}
 			
 		}

 		render(){

 			return(
 				<div className = "sidebar p-1">
					<div className="input-group mt-2 mb-2">
					  <input type="text" className="search form-control" placeholder="search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
					  <div className="search-icon input-group-append">
					    <span className="input-group-text" id="basic-addon2"><FontAwesomeIcon icon = "search" /></span>
					  </div>
					</div>

					<div className="dashboard-list list-group ">
					<Link to = {"/dashboard/staff/addvendor"}>
					  <a name = "dashboard" ref = "dashboard" className="list-group-item list-group-item-action">Staff Dashboard
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "user-cog" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/staff/addvendor"}>
					  <a name = "addstaff" ref = "addvendor" className="list-group-item list-group-item-action">Add Vendor
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/staff/addcustomer"}>
					  <a name = "addcustomer" ref = "addcustomer" className="list-group-item list-group-item-action">Add Customer
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/staff/addproduct"}>
					  <a name = "addcustomer" ref = "addproduct" className="list-group-item list-group-item-action">Add Product
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/staff/addquantity"}>
					  <a name = "addquantity" ref = "addquantity" className="list-group-item list-group-item-action">Add Quantity
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/staff/managevendor"}>
					  <a name = "manageadmin" ref = "managevendor" className="list-group-item list-group-item-action">Manage Vendors 
						  <span className = "icon">
						  	<FontAwesomeIcon icon = "cogs" />
						  </span>
					  </a>
					 </Link>
					 <Link to = {"/dashboard/staff/managecustomer"}>
					  <a name = "managecustomer" ref = "managecustomer" className="list-group-item list-group-item-action">Manage Customers 
						  <span className = "icon">
						  	<FontAwesomeIcon icon = "cogs" />
						  </span>
					  </a>
					</Link>
					 <Link to = {"/dashboard/staff/manageproduct"}>
					  <a name = "manageproduct" ref = "manageproduct" className="list-group-item list-group-item-action">Manage Products
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "cogs" />
						 </span>
					  </a>
					 </Link>
					 <Link to = {"/dashboard/staff/managequantity"}>
					  <a name = "managequantity" ref = "managequantity" className="list-group-item list-group-item-action">Manage Stock
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "cogs" />
						 </span>
					  </a>
					 </Link>
					</div>
    			</div>
 			)
 		}
 	}


export default DashboardLeftSideBar2