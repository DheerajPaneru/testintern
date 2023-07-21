import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import '../css/style.css';

import swal from 'sweetalert';

class ChangePassword extends Component {
    state = {
        oldPassword: '',
        password:'',
        confirmPassword: '',
        Error: {},
    }

        
    //--------------------------------------------change field value------------------------------------\\
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
     };
    

    //-----------------------------------------Integrate API for change Admin password --------------------\\

    handleSubmit = (event) => {
        event.preventDefault();
        let id = this.props.match.params.id;
        let data = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.password,
            confirmPassword: this.state.confirmPassword
        }

        Axios.patch(Constant.apiBasePath + 'admin/change-password/' + id, data, {'Content-Type':'application/json'})
                    .then(response => {       
            const getResults = response.data;
            
            if (getResults.status === Constant.statusSuccess) {
                swal({text:"Your Password has been updated Successfully",icon:"success",successMode:true});
                return this.props.history.push('/login');
            }

            else if(getResults.status === 400) {
                swal({text:getResults.message, icon:"warning", dangerMode:true});
            }

            else if(getResults.status === 401) {
                swal({text:"Unauthorize Access!", icon:"warning", dangerMode:true});
            }

            else {
                if(getResults.message === '"oldPassword" length must be at least 6 characters long') {
                    swal({text: 'Old password must be at least 6 characters long.', icon:"warning", dangerMode: true});
                }
                else if(getResults.message === '"newPassword" length must be at least 6 characters long') {
                    swal({text: 'New password must be at least 6 characters long.', icon:"warning",dangerMode: true});
                }
                else if(getResults.message === '"confirmPassword" must be [ref:newPassword]') {
                    swal({text: "New and Confirm Password must be same.", icon:"warning",dangerMode: true});
                }
                else{
                    swal({text: getResults.message, icon:"warning",dangerMode: true});
                }
            }
            
        });
    }

    //-----------------------------------------End-------------------------------------------------------------\\

    render() {

        var code = document.getElementById("password");

        var strengthbar = document.getElementById("meter");
        var display = document.getElementsByClassName("textbox")[0];

        if(code) {
            code.addEventListener("keyup", function() {
               checkpassword(code.value);
            });
        }

        function checkpassword(password) {
        var strength = 0;
        if (password.match(/[a-z]+/)) {
            strength += 1;
        }
        if (password.match(/[A-Z]+/)) {
            strength += 1;
        }
        if (password.match(/[0-9]+/)) {
            strength += 1;
        }
        if (password.match(/[$@#&!]+/)) {
            strength += 1;

        }

        if (password.length < 6) {
            display.innerHTML = "minimum number of characters is 6";
        }

        if (password.length > 12) {
            display.innerHTML = "maximum number of characters is 12";
        }

        switch (strength) {
            case 0:
            strengthbar.value = 0;
            break;

            case 1:
            strengthbar.value = 25;
            break;

            case 2:
            strengthbar.value = 50;
            break;

            case 3:
            strengthbar.value = 75;
            break;

            case 4:
            strengthbar.value = 100;
            break;
        }
        }

        return (
            <div className="content-page">
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                                <h4 className="page-title-heading">Change Password</h4>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={this.handleSubmit} className="change-password-form">
                        <div className="row">
                            <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor="update" className="update admin-pass-label">Old Password:</label>
                                    <input type="password" id="oldPassword" className="form-control" onChange={this.handleChange} 
                                    />         
                            </div> 
                            <div className="form-group mb-3">
                                <label htmlFor="update" className="update admin-pass-label">New Password:</label>
                                    <input type="password" id="password" className="form-control" onChange={this.handleChange} 
                                    />   
                                    <p id="checkLength"></p>  
                                    <progress max="100" value="0" id="meter"></progress> 
                                    <p class="textbox text-center"></p>
                            </div> 

                            <div className="form-group mb-3">
                                <label htmlFor="update" className="update admin-pass-label">Confirm Password:</label>
                                    <input type="password" id="confirmPassword" className="form-control" onChange={this.handleChange} 
                                    />
                            </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">Change Password</button>
                    </form>
                </div>
            </div>
        )

    }
}
export default ChangePassword;