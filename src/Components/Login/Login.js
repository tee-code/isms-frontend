import React,{Component} from "react"
import "../Settings/Settings.css"
import "./Login.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Welcome from "../functionalComponents/Welcome"
import LoginForm from "../functionalComponents/LoginForm"
import Request from "../../Request/Request"
import {Redirect} from "react-router-dom"
import {setData,getData} from "../../helperFunctions/functions"

class Login extends Component{

  constructor(props){
    super(props)

    this.state = {
        companyName: "",
        status: false,
        username: "",
        password: "",
        useType: "",
        adminLoggedIn: false,
        staffLoggedIn: false,
        error: false,

    }
    this.handleInput = this.handleInput.bind(this)
    this.fetchData = this.fetchData.bind(this)

  }

componentDidMount(){
  this.fetchData()
}


handleInput(e){
  e.persist()
  this.setState({
    [e.target.name] : e.target.value
  })
}

handleSubmit = (e)=>{
  e.preventDefault()
  const request = new Request("login.php")
  const bodyMessage =   `login=true&lecturerID=${this.state.username}&password=${this.state.password}&userType=${this.state.userType}`

  request.post(bodyMessage).then((response)=>{
    const responseJSON = JSON.parse(response)
    console.log(responseJSON)
    if(responseJSON.status){
      
      setData(`${responseJSON.userType}IDs`,responseJSON.userID)
      setData(`${responseJSON.userType}Token`,responseJSON.token)

      if(responseJSON.userType === "admin"){
          this.setState({
            adminLoggedIn: true
          })
      }else{
        this.setState({
          staffLoggedIn: true
        })
      }
      
    }else{
      this.setState({error:true})
      setTimeout(()=>{
        this.setState({error:false})
      },3000)
    }
  })

}

fetchData(){
    const request = new Request("manageCompany.php")
    const bodyMessage = `get=true`
    
    request.post(bodyMessage).then((response)=>{
      const responseJSON = JSON.parse(response)
      
      if(responseJSON.status){
        this.setState({
          status: responseJSON.status,
          companyName: responseJSON.name
        })
      }
    })
  }

  //render functional

  render(){

    if(getData("adminIDs") || this.state.adminLoggedIn){

      return(<Redirect to = "/dashboard/admin/"/>)

    }else if(getData("staffIDs") || this.state.staffLoggedIn){

      return(<Redirect to = "/dashboard/staff/"/>)

    }
    return(
      <div className = "app-wrapper container-fluid">
        <Header appName = {"IMS | " + this.state.companyName} />
        <main className = "container-fluid login settings">
          <div className = "jumbotron">
            <Welcome />
            <h1 className = "display-4" > {this.state.companyName} </h1>
            <hr className = "my-4"/>
            
            
              <form className = "admin-form m-auto">

                {
                  this.state.error
                  &&
                  <div className = "m-2 bg-danger">Invalid Combinations.</div>
                }

                <LoginForm submit = {this.handleSubmit} action = {this.handleInput} value = "Login" showForgot = {true} icon = "sign-in-alt" />

              </form>

          </div>

        </main>

        <Footer companyName = {this.state.companyName}/>
        
      </div>
    )
  }

}







export default Login
