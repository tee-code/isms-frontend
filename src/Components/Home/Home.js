import React,{Component} from "react"
import "./Home.css"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Info from "../Info/Info"
import {Redirect,Link} from "react-router-dom"
import Request from "../../Request/Request"


class Home extends Component{

  constructor(props){
    super(props)

    this.state = {
        status: false
    }

    this.fetchData = this.fetchData.bind(this)

  }

  componentDidMount(){
    this.fetchData()
  }


  fetchData(){
    const request = new Request("manageCompany.php")
    const bodyMessage = `get=true`
    
    request.post(bodyMessage).then((response)=>{
      
      const responseJSON = JSON.parse(response)
      if(responseJSON.status){
        this.setState({
          status: responseJSON.status
        })
      }
    })
  }

  //render function

  render(){

    

    return(
      <div className = "wrapper app-wrapper container-fluid">
      <Link to = "/dashboard"><button className = "dashboard">Dashboard</button></Link>
        <div className = "wrap">
          <h1 className = "head display-1">FACO </h1>
          <h1 className="title lead">Faculty of Science Family...</h1>
          
        </div>
        <Footer/>
      </div>
    )
  }

}







export default Home
