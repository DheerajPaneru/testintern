import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import '../css/style.css';
import '../css/custom.css';
import swal from 'sweetalert';
import $ from 'jquery';


export default class Login extends Component {
    state = {
          email: "",
          password: "",
          login:false,
          errors: {}
    }

//--------------------------------------------change field value------------------------------------\\
    handleChange = (e) => {
      this.setState({
        [e.target.id]: e.target.value
      })
   };

    componentWillMount(){
        if(localStorage.getItem('loginDetails')!== null){
            this.props.history.push("/dashboard");
        }
        else {
          this.props.history.push("/");
        }
    }



   handleSubmit = async (e) => {
    e.preventDefault();
        try {
            const response = await Axios.post(Constant.apiBasePath+'admin/login',{email: this.state.email,password:
            this.state.password});
            const {data} =response;
            if(data.status === Constant.statusSuccess) {
              localStorage.setItem('loginDetails', data.data);
              window.location.href = '/dashboard';
            }
            else if(data.status === 401) {
              swal({text:data.message,icon:"warning",dangerMode:true});
            }
            else {
                swal({text:data.message,icon:"warning",dangerMode:true}); 
              }
        }
        catch(err) {
            swal(err);
        }
      }

      responseGoogle = (response) => {
        console.log(response);
        // if(response.profileObj) {
        //     this.socialSignUp(response, 3);
        // }
        // else {
        //     return false;
        // }
    }


  render() {

    $(".fa-eye").on("mouseover", function() {
        $(this).toggleClass(".fa-eye");
        var input = $("#password");
        input.attr("type", "text");
    })

    $(".fa-eye").on("mouseout", function() {
        $(this).toggleClass(".fa-eye");
        var input = $("#password");
        input.attr("type", "password");
    })

      return (

          <div className="login-body">
            <div className="nav-container login-page-container">
                <div className="container">
                  <img src="images/logo.png" alt="in" id="logo-login"  className="login-logo"/>
                </div>
            </div>
           <section className="login login-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4">
                        </div>
                <div className="col-lg-4">
                     <div className="card">
                        <div className="card-body">
                            <p className="text-center login-heading">LOGIN</p>
                                 <form onSubmit={this.handleSubmit}>
                                      <div className="form-group">
                                          <label htmlFor="uname" className="headname">Username  <i className="fa fa-user"></i> </label>
                                              <input type="email" id="email" className="form-control login-control" onChange={this.handleChange} value={this.state.name} required/>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="pwd" className="headname">Password <i className="fa fa-eye" onClick={this.showText}></i></label>
                                              <input type="password" id="password" className="form-control login-control" onChange={this.handleChange} value={this.state.password} required/>
                                      </div>
                                      
                                      {/* <div><Link to="/send-email" className="forgot">Forgot Password</Link></div>
                                      <br/>
                                      <br/> */}
                                      <button type="submit" className="btn btn-success">Login</button>
                                </form>
                           </div>
                        </div>
                    </div>
                <div className="col-lg-4">
             </div>
         </div>
      </div>
   </section>
</div>
               
           
  )
  }  
}