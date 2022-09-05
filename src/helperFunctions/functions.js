import React from "react"
import Request from "../Request/Request"
import { Redirect } from "react-router-dom"

//function to auto generate customerID
export const generateCustomerID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.split(" ")[0][0] + name.split(" ")[1][0]

	return "L" + word + string

}
//function to auto generate companyID
export const generateCompanyID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.split(" ")[0][0] + name.split(" ")[1][0]

	return word + string

}
//function to auto generate adminID
export const generateAdminID = ()=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)


	return "AD" + string

}

//function to auto generate staffID
export const generateStaffID = ()=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)


	return "ST" + string

}

export const setData = (key,value)=>{
  localStorage.setItem(key,JSON.stringify(value))
  sessionStorage.setItem(key,JSON.stringify(value))
}

export const getData = (key)=>{
  return sessionStorage.getItem(key) || localStorage.getItem(key)
}

//function to auto generate vendorID
export const generateVendorID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.split(" ")[0][0] + name.split(" ")[1][0]

	return "V" + word + string

}

//function to auto generate productID
export const generateProductID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.substring(0,2)

	return "P" + word + string

}

//function to auto generate productID
export const generateDriverID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.substring(0,2)

	return "D" + word + string

}

//function to auto generate productID
export const generateVehicleID = (name)=>{

	const number = Math.floor(100 + Math.random() * 900)
	const string = String(number)

	const word = name.substring(0,2)

	return "V" + word + string

}

export const logout = ()=>{
	if(getData("adminIDs") || getData("staffIDs") || getData("adminToken") || getData("staffToken")){

		localStorage.removeItem("adminIDs")
		localStorage.removeItem("staffIDs")
		sessionStorage.removeItem("adminIDs")
		sessionStorage.removeItem("staffIDs")
		localStorage.removeItem("adminToken")
		localStorage.removeItem("staffToken")
		sessionStorage.removeItem("adminToken")
		sessionStorage.removeItem("staffToken")

		localStorage.clear()
		sessionStorage.clear()

	}

}

export const checkUser = ()=>{
		
	const username = JSON.parse(getData("adminIDs")) || JSON.parse(getData("staffIDs")) || null
	
	const token = JSON.parse(getData("adminToken")) || JSON.parse(getData("staffToken")) || null
	
	if(username && token){

		const request = new Request("http://localhost:81//inventory-app/apis/fetchUser.php")
		const bodyMessage = `check=true&username=${username}&token=${token}`
		request.post(bodyMessage).then((response)=>{
			const responseJSON = JSON.parse(response)
			
			return responseJSON.status 
		})

	}else{
		
		return false
	}
	
}