import React, { Component } from "react"
import Collapsible from 'react-collapsible'
import Request from "../../controllers/Request.js"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash,faEye } from '@fortawesome/free-solid-svg-icons'
library.add(faEye,faEyeSlash)

class OnlineFriends extends Component{
  constructor(props){
    super(props)
    this.state = {
      styles: {
        color: "#f2f2f2",
        padding: "5px",
        width: "100%",
        display: "block",
        fontSize: "15px",
        cursor: "pointer",
        backgroundColor: "hsl(195,87%,10%)"
      },
      followers: [{}],
      profilepix: "/profile.png",
      email: "",
      intervalID: ""
    }
    this.viewMessages = this.viewMessages.bind(this)
    this.renderOnlineFriends = this.renderOnlineFriends.bind(this)
    this.getHashCode = this.getHashCode.bind(this)
  }
  componentDidMount(){
    if(navigator.onLine){
      this.interval = setInterval(()=>{
        this.renderOnlineFriends()
        if(!Object.keys(this.state.followers[0]).length){
          document.querySelector("#wrapper").style.opacity = 0.1
          document.querySelector("#loading").style.display = "block"
        }else{
          document.querySelector("#wrapper").style.opacity = 1
          document.querySelector("#loading").style.display = "none"
          }
      },500)
    }
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  renderOnlineFriends(){
    if(sessionStorage.getItem("sesscode")){
      const responseJSON = JSON.parse(sessionStorage.getItem("sesscode"))

      const request = new Request("https://mypage.ng/api.php")
      const body = {
        getfollowers: true,
        email: responseJSON.email,
        rrt: 1000
      }

      const bodyMessage = `get${this.props.friendType}=${body.getfollowers}&email=${body.email}&rrt=${body.rrt}`
      request.get(bodyMessage).then((result)=>{
        const responseJSON = JSON.parse(result)
        if(responseJSON.status){
          //Gather all followers that are online
          let onlineFriends
          if(this.props.friendType === "followers"){
            onlineFriends = responseJSON.followers.filter((friend,index)=>{
              return friend.online === true
            })
          }else{
            onlineFriends = responseJSON.followings.filter((friend,index)=>{
              return friend.online === true
            })
          }

          this.setState({
            followers: onlineFriends
          })
        }
      })
    }

  }

  getHashCode = (hisid,username,online,profilepix) =>{
    const request = new Request("https://mypage.ng/api/message")
    const responseJSON = JSON.parse(sessionStorage.getItem("sesscode"))
    const body = {
      sesscode: responseJSON.sesscode,
      uid: responseJSON.uid,
      hisid,

    }
    const bodyMessage = `sesscode=${body.sesscode}&uid=${body.uid}&hisid=${body.hisid}`
    request.post(bodyMessage).then((response)=>{
      const resultJSON = JSON.parse(response)
      if(resultJSON.status){
        const userID = {
          uid: responseJSON.uid,
          sesscode: responseJSON.sesscode,
          email: responseJSON.email,
          hashcode: resultJSON.hashcode,
          username,
          online,
          profilepix,
          hisid
        }
        sessionStorage.setItem("sesscode",JSON.stringify(userID))
        localStorage.setItem("sesscode",JSON.stringify(userID))
      }
    })
  }

  viewMessages = (event)=>{
    let ID = event.target.title
    document.querySelectorAll('.online .each-message').forEach((follower)=>{
      if(follower.title === event.target.title){
        follower.style.backgroundColor = "#032530"
        follower.style.color = "white"
      }else{
        follower.style.backgroundColor = "#E8EAED"
        follower.style.color = "#212529"
      }
    })
    let currentFollower = this.state.followers.filter((follower,index)=>{
      return follower.hisid === ID
    })
    currentFollower = currentFollower[0]
    this.getHashCode(currentFollower.hisid,currentFollower.username,currentFollower.online,currentFollower.profilepix)

  }
  followers = (
    <div id = "_followers">
      <p className = "" style = {{float:"left",width:"90%"}}>Online {this.props.friendtype}</p>
      <p className = "" id = "plus_minus" style = {{float:"right",width:"10%"}}>+</p>
      <div style = {{clear:"both",height:"0px"}}></div>
    </div>

  )
  _followers = (
    <div id = "_followers">
      <p className = "" style = {{float:"left",width:"90%"}}>Online {this.props.friendtype}</p>
      <p className = "" id = "plus_minus" style = {{float:"right",width:"10%"}}>-</p>
      <div style = {{clear:"both",height:"0px"}}></div>
    </div>
  )

  render(){
    return(
      <Collapsible
      trigger={this.followers}
      triggerStyle = {this.state.styles}
      triggerWhenOpen = {this._followers}>
      <div className = "followers online">
      {
          this.state.followers.map((follower,index)=>{
            return(
              <div 
                  className = "each-message"
                  key = {index+1}
                  title = {follower.hisid} 
                  onClick = {this.viewMessages}>
                  <div 
                    className = "profile-pic"
                    onClick = {this.viewMessages}
                    title = {follower.hisid} >
                    <img 
                      onClick = {this.viewMessages}
                      title = {follower.hisid} 
                      src = {follower.profilepix}
                      alt = "profile pix"
                      className = "img-fluid"/>
                    <div 
                      className = "name-parker"
                      onClick = {this.viewMessages}
                      title = {follower.hisid}>
                      <p 
                        className ="name mb-0"
                        onClick = {this.viewMessages}
                        title = {follower.hisid} >
                        {follower.username}
                         <span 
                          className ="status"
                          onClick = {this.viewMessages}
                          title = {follower.hisid} >
                          {
                            follower.status2 === "1"  ? <FontAwesomeIcon icon = "eye" /> : <FontAwesomeIcon icon = "eye-slash" />
                          }
                        </span>
                      </p>
                      <p 
                        className ="message mt-0"
                        onClick = {this.viewMessages}
                        title = {follower.hisid}>
                        {follower.fname} {follower.lname}
                      </p>
                    </div>
                  </div>
              </div>
            )

        })
      }

      </div>
      </Collapsible>
    )
  }

}













export default OnlineFriends
