import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';
import Constant from '../Constant';

import swal from 'sweetalert';
import $ from 'jquery';

export default class AddUpdateUser extends Component {

    state = {
        UserData: {},
        name: '',
        email: '',
        mobile: '',
        profilePic: null,
        userType: '',
        bio: '',
        ERROR: true
    }
        
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

    handleImageChange = (e) => {
        this.setState({
            [e.target.id]: e.target.files[0]
        })
    };

    /** Update user info */

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let UserData = this.state.UserData;
            const formData = new FormData();
            
            /* Create a function for validate input fields */

            let checkValidation = this.inputFieldValidation();
            if(checkValidation === false) {
                return false;
            }

            /* Validate file type */
            if(this.state.image) {
    
                let fileName = this.state.profilePic.name;
                let extension = fileName.split('.').pop();
    
                if(extension !== 'jpg' && extension !== 'png') {
                    $("#imageRequired").text('Only jpg and png file type are allow !');
                    $("#imageRequired").css("color", "red");
                    return false;
                }
            }


            let id = this.props.match.params.id;
            if(id === undefined) {
                  
                formData.append('name', this.state.name);
                formData.append('email', this.state.email);
                formData.append('mobile', this.state.mobile);
                formData.append('userType', this.state.userType);
                formData.append('bio', this.state.bio);
                (this.state.profilePic) ? formData.append('profilePic', this.state.profilePic, this.state.profilePic.name) : formData.append('profilePic', '');
                    
                const response = await Axios.post(Constant.apiBasePath + 'userRegistration', formData);
                const {data} = response;
                if(data.status === Constant.statusSuccess) {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'green');
                    // window.location.reload();
                    setTimeout(function() { window.location.reload(); }, 3000 );
                }
                else {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'red');
                }
            }
            
            else {
                let verifyByTwitter = UserData.verifyByTwitter;
                if(this.state.userType === '0' || this.state.userType === '1') {
                    verifyByTwitter = 0;
                }
                if(this.state.userType === '2') {
                    verifyByTwitter = 1;
                }
               

                (this.state.name) ? formData.append('name', this.state.name) : formData.append('name', UserData.name);
                (this.state.email) ? formData.append('email', this.state.email) : formData.append('email', UserData.email);
                (this.state.mobile) ? formData.append('mobile', this.state.mobile) : formData.append('mobile', UserData.mobile);
                (this.state.userType) ? formData.append('userType', this.state.userType) : formData.append('userType', UserData.userType);
                (this.state.bio) ? formData.append('bio', this.state.bio) : formData.append('bio', UserData.bio);
                (this.state.profilePic) ? formData.append('profilePic', this.state.profilePic, this.state.profilePic.name) : formData.append('profilePic', UserData.profilePic);
                formData.append('verifyByTwitter', verifyByTwitter);
                const response = await Axios.patch(Constant.apiBasePath + 'updateUserInfoById/' + id, formData);
                const {data} = response;
                if(data.status === Constant.statusSuccess) {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'green');
                    this.props.history.push('/user-management');
                }
            
                else {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'red');
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    inputFieldValidation = () => {
        let name = $("#name").val();
        let email = $("#email").val();
        let mobile = $("#mobile").val();
        let userType = $("#userType").val();

        if(name === '') {
            $("#nameRequired").text('name is required');
            $("#nameRequired").css("color", "red");
            return false;
        }
        else{
            $("#nameRequired").text('');
        }

        if(email === '') {
            $("#emailRequired").text('email is required');
            $("#emailRequired").css("color", "red");
            return false;
        }
        else{
            $("#emailRequired").text('');
        }

        if(mobile.length !== 10) {
            console.log(mobile.length);
            $("#mobileRequired").text('mobile number must be 10 digits only');
            $("#mobileRequired").css("color", "red");
            return false;
        }
        else{
            $("#mobileRequired").text('');
        }

        if(userType === 'all') {
            $("#userTypeRequired").text('userType is required');
            $("#userTypeRequired").css("color", "red");
            return false;
        }
        else{
            $("#userTypeRequired").text('');
        }
    }


    searchData = async (id) => {
        try {
            const response = await Axios.get(Constant.apiBasePath + 'getUserDataById/' + id);
            const { data } = response;
            if (data.status === Constant.statusSuccess) {
               this.setState({ 'UserData': data.data, ERROR: false });
            }
            else {
                swal({text: data.message, icon:"warning", dangerMode:true });
                this.setState({ 'UserData': '', ERROR: true });
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id !== undefined) {
            this.searchData(id);
        }
    }

  render() {

    const { UserData } = this.state;

    let name = (UserData.name === '') ? '' : UserData.name;
    let email = (UserData.email === '') ? '' : UserData.email;
    let mobile = (UserData.mobile === '') ? '' : UserData.mobile;
    let bio = (UserData.bio === '') ? '' : UserData.bio;
    let profilePic = (UserData.profilePic === '') ? '/images/Icon feather-user.png' : UserData.profilePic;
   
    /**
     * handle heading and btn value
     */
    let btnVal = 'Add';
    let heading = 'Add User';

    if(UserData.name !== undefined) {
        btnVal = 'Update';
        heading = 'Update User';
    }

    let userTypeOptions = <><option id="0" value="0">Csnaps</option><option id="1" value="1">Normal</option><option id="2" value="2">Celebrity</option></>;
    
    if(UserData) {

        if(UserData.userType === 0) {
            userTypeOptions = <><option id="0" value="0" selected="selected">Csnaps</option><option id="1" value="1">Normal</option><option id="2" value="2">Celebrity</option></>;
        }
        if(UserData.userType === 1) {
            userTypeOptions = <><option id="0" value="0">Csnaps</option><option id="1" value="1" selected="selected">Normal</option><option id="2" value="2">Celebrity</option></>;
        }
        else if(UserData.userType === 2) {
            userTypeOptions = <><option id="0" value="0">Csnaps</option><option id="1" value="1">Normal</option><option id="2" value="2" selected="selected">Celebrity</option></>;
        }

    }


    
        return (

        <div className="content-page">
        <div className="content">
            <div className="row">
                <div className="col-12">
                <div className="page-title-box">
                        <h4 className="page-title-heading">{heading}</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><Link to="/user-management">User Management</Link></li>
                                <li className="breadcrumb-item active">{heading}</li>
                            </ol>
                        </div>
                        <p id="gen-message"></p>
                    </div>
                </div>
            </div>   
            <div className="row">  
                <div className="col-12">
                    <div className="card">
                        <div className="card-body"> 
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="update" className="update">Name *</label>
                                                <input type="text" id="name" className="form-control section1" onChange={this.handleChange} defaultValue= {name} 
                                                />       
                                                <p id="nameRequired"></p>  
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="update" className="update">Email *</label>
                                                <input type="email" id="email" className="form-control section1" onChange={this.handleChange} defaultValue= {email} 
                                                />    
                                                <p id="emailRequired"></p>  
                                        </div>     
                                    </div>
                              </div>   
            
                              <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="update" className="update">Mobile Number *</label>
                                                <input type="number" id="mobile" className="form-control section2" onChange={this.handleChange} defaultValue= {mobile} 
                                                />   
                                                <p id="mobileRequired"></p>  
                                        </div> 
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="update" className="update">Select User Type *</label>
                                            <select id="userType" className="form-control" onChange={this.handleChange}>
                                                <option id="all" value="all" selected="selected">Select one</option>
                                                {userTypeOptions}
                                            </select>     
                                            <p id="userTypeRequired"></p>
                                        </div>     
                                    </div>
                                </div>
                                {
                                    (UserData.name === undefined) ?

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Select Profile Pic</label>
                                                        <input type="file" id="profilePic" name="profilePic" accept="image/png,image/jpg"  className="form-control section1" onChange={this.handleImageChange} 
                                                        />       
                                                        <p id="imageRequired"></p>  
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Bio</label>
                                                        <input type="text" id="bio" className="form-control section1" onChange={this.handleChange} defaultValue= {bio} 
                                                        />       
                                                        <p id="bioRequired"></p>  
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        
                                        <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Select Profile Pic</label>
                                                            <input type="file" id="profilePic" name="profilePic" accept="image/png,image/jpg" className="form-control section1" onChange={this.handleImageChange} 
                                                            />       
                                                            <p id="imageRequired"></p>  
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Old Profile Pic</label>
                                                            <img src={profilePic} alt="IND" style={{width: 50, height: 50, marginLeft: 10}} 
                                                            />       
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Bio</label>
                                                            <input type="text" id="bio" className="form-control section1" onChange={this.handleChange} defaultValue= {bio} 
                                                            />       
                                                            <p id="bioRequired"></p>  
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                }
                                <button type="submit" className="btn btn-info teacher-btn">{btnVal}</button>               
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