import React from "react"
import { faSignInAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faSignInAlt,faUserCog)

const LoginForm = (props)=>{
	return(
		<React.Fragment>
			<div className = "rounded"><FontAwesomeIcon icon = "user-cog" /></div>
			{
				props.showName
				&&
				<React.Fragment>
					<label for="inputEmail" className="sr-only">Name</label>
		    		<input onChange = {props.action} name = "name" type="text" id="inputText" className="form-control" placeholder="Name" autoComplete required autofocus/> 
				</React.Fragment>
			}
		    <label for="inputEmail" className="sr-only">Username</label>
		    <input onChange = {props.action} name = "username" type="text" id="username" className="form-control" placeholder="your ID e.g. AFL2019" autoComplete required autofocus disabled = {props.disabled} /> 
		    <label for="inputText" className="sr-only">Password</label>
		    <input onChange = {props.action} name = "password" type="password" id="inputText" className="form-control" placeholder="Password" required autoComplete autofocus />
		    <select onChange = {props.action} name = "userType" className="form-control">
               <option disabled selected>select user-type</option>
               <option value = "admin">Admin</option>
               <option value = "staff">Staff</option>
            </select>
          
		    <button onClick = {props.submit} className="save btn btn-lg btn-block" type="submit">{props.value} <FontAwesomeIcon icon = {props.icon}/></button>
			{
				props.showForgot
				&&
				<small className = "lead"><i>Forgot your details ? Contact your Administrator. </i></small>
			}
			
		</React.Fragment>
	)
}

export default LoginForm