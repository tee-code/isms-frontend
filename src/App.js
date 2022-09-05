import React, {Component} from "react";
import "./App.css"

import logo from "./logo.jpg"


class App extends Component{

  constructor(props){
    super(props)

    this.state = {

    }
    this.date = new Date().getFullYear()
  }


  render(){
    return(
      <div className = "wrapper">
        <header className = "app-header">
          <h3 className = "btn"><img src = {logo} className = "logo" />Christ Power Media</h3>
        </header>
        <main className = "main-content">
          
          
        </main>
        <footer className = "app-footer">
          &copy; {this.date} | Christ Power Media
        </footer>
      </div>
    )
  }
}






export default App;