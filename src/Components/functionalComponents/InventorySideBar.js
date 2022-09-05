//later changed to classical component

import React, {Component} from "react"
import {Link} from "react-router-dom"
import { faPlusCircle, faSearch, faCogs, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faPlusCircle,faSearch, faCogs, faUserCog)
 
 	class InventorySideBar extends Component{

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
					<Link to = {"/dashboard/inventory/sales"}>
					  <a name = "inventory" ref = "inventory" className="list-group-item list-group-item-action">Inventory
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "user-cog" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/inventory/sales"}>
					  <a name = "sales" ref = "sales" className="list-group-item list-group-item-action">Sales
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/inventory/payment"}>
					  <a name = "payment" ref = "payment" className="list-group-item list-group-item-action">Payment 
						  <span className = "icon">
						  	<FontAwesomeIcon icon = "cogs" />
						  </span>
					  </a>
					 </Link>
					 <Link to = {"/dashboard/inventory/managesales"}>
					  <a name = "managesales" ref = "managesales" className="list-group-item list-group-item-action">Manage Sales
					  	<span className = "icon">
						  	<FontAwesomeIcon icon = "plus-circle" />
						  </span>
					  </a>
					</Link>
					<Link to = {"/dashboard/inventory/managepayment"}>
					  <a name = "managepayment" ref = "managepayment" className="list-group-item list-group-item-action">Manage Payment 
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


export default InventorySideBar