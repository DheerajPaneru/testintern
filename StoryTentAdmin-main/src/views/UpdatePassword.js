import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import swal from 'sweetalert';
import '../../src/css/style.css';
require('dotenv').config();

export default class UpdatePassword extends Component {
    state = {
        token: "",
        newPassword: "",
        confirmPassword: "",
        ERROR: true
    }

    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
     };

    
      handleSubmit(event) {
          event.preventDefault();
          this.handleLogin();
      }

      handleLogin = async event => {
          try {
            const response = await Axios.post(Constant.apiBasePath+'admin/reset-password',{token: this.props.match.params.token,
            newPassword: this.state.newPassword, confirmPassword: this.state.confirmPassword});
            const {data} = response;
            if(data.status === 200) {
                swal({text:"Password reset successfully",icon:"success",successMode:true});
                return this.props.history.push('/');
            }
            else {
                swal({text:"Please Check Your Fields!",icon:"warning",dangerMode:true});
            }
          }
          catch(err) {
              console.log(err);
          }
      }


    render() {  
            // console.log(this.props.match.params.token);

        return (
               <div className="account-pages mt-5 mb-5">
                 <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="card">

                            <div className="card-header text-center bg-white">
                                <a href="/#">
                                    <h4 className="appName">Reset Password</h4>
                                </a>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={this.handleSubmit}>

                                    <div className="form-group">
                                        <label htmlFor="password" className='recovery-email'>New Password</label>
                                        <input className="form-control" type="password" id="newPassword" placeholder="Enter your password" 
                                        onChange={this.handleChange} defaultValue = {this.state.newPassword}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password" className='recovery-email'>Confirm Password</label>
                                        <input className="form-control" type="password" id="confirmPassword" placeholder="Enter your confirm password" 
                                        onChange={this.handleChange} defaultValue = {this.state.confirmPassword}/>
                                    </div>

                                    <div className="form-group mb-0 text-center">
                                        <button className="btn btn-success" type="submit">Reset</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
           
    )
    }
}