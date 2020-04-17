import React from "react"
import  { Redirect } from 'react-router-dom'
import { LinkContainer } from "react-router-bootstrap";
import sbl from './sbl.png'



class NavBar extends React.Component {
  constructor(props){
    super(props)
    this.state={
      success: false,
      form:{
        symbol:""
      }
    }

  }

  handleSubmit = (event) => {
      event.preventDefault()
      let { form } = this.state
      fetch(`https://api.twelvedata.com/price?symbol=${ form.symbol }&apikey=bc07ae0baa6241d79c88764a862a7dba`)
        .then((response)=>{
      if(response.status === 200){
        return(response.json())
      }
    })
      .then((result)=>{
        if(result.price){
          window.location.href = `/stock/${form.symbol}`
        }
        else{
        window.location.href = "/stocknotfound"
      }
    })
  }

  handleChange = (event) => {
      let { form } = this.state
      form[event.target.name] = event.target.value
      this.setState({ form: form})
  }



  render () {

    const {
    logged_in,
    sign_in_route,
    sign_out_route,
    edit_user_route
    } = this.props;

    return(
      <React.Fragment>


    <nav className="navbar sticky-top navbar-light bg-light">
      <div className="container-fluid">

        </div>
        <ul className="nav nav-pills">
              <li>
                <a>
                    <img src= {sbl}  style={{width: "25%", height:"25%"}} alt="Stock Byte Rules!!!"/>
                </a>
              </li>
                <li className="nav-item  btn-lg">
                  <a className="nav-link" data-toggle="pill" href="/">Home</a>
                </li>
                <li className="nav-item btn-lg">
                  <a className="nav-link" data-toggle="pill" href="/overview">Overview</a>
                </li>

              {logged_in &&
                <li class="nav-item btn-lg">
                <a class="nav-link" data-toggle="pill" href="/portfolio">Portfolio</a>
                </li>}

                  {logged_in &&
                    <li className="nav-item btn-lg">
                    <a className="nav-link" data-toggle="pill" href="/portfolio">Portfolio</a>
                  </li>}

                  {logged_in &&
                    <li className="nav-item btn-lg">
                      <a className="nav-link" data-toggle="tab" href="/playground">Playground</a>
                    </li>}



                    {!logged_in &&
                    <li className="nav-item btn-lg">
                    <a className="nav-link" data-toggle="tab" href="/about">About</a>
                    </li>}

                    {!logged_in &&
                      <li className="nav-item btn-lg">
                        <a className="nav-link" data-toggle="pill" href={ edit_user_route }>Account</a>
                      </li>}

                    {logged_in &&
                      <li className="nav-item btn-lg">
                        <a href={sign_out_route}>Sign Out</a>
                      </li>}


                    {!logged_in &&
                      <li className="btn-lg">
                        <a href={sign_in_route}>Sign In</a>
                      </li>}

                      <form className="form-inline my-2 my-lg-0">
                      <li>
                        <input className="form-control mr-sm-2" onChange = { this.handleChange } type="text" placeholder="Stock Search" name="symbol" />

                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick = { this.handleSubmit }>Find</button>
                      </li>
                      </form>

        </ul>
      </nav>



      </React.Fragment>
    )
  }
}

export default NavBar
