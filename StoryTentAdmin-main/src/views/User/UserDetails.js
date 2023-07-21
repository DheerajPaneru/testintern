import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';
import Constant from '../Constant';

import swal from 'sweetalert';
import { getAccessToken } from '../../hooks/AccessToken';

export default class UserDetails extends Component {

    state = {
        UserData: {},
        ERROR: true
    }

    /* API integration of get user data */

    getUserDataById = async (id) => {
        try {
            let token = getAccessToken();
            let req = {
                method: 'GET',
                url: Constant.apiBasePath + '/getUserDataById/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form/urlencoded',
                    'token': token
                },
                json: true
            }

            Axios(req).then(response => {
                const { data } = response;
                if (data.status === Constant.statusSuccess) {
                   this.setState({ 'UserData': data.data, ERROR: false });
                }
                else {
                    swal({text:data.message, icon:"warning", dangerMode:true });
                    this.setState({ 'UserData': '', ERROR: true });
                }
            }).catch(error => {
                console.log(error);
            });
        }
        catch(err) {
            console.log(err);
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id !== undefined) {
        this.getUserDataById(id);
        }
    }


    render() {
        const { UserData } = this.state;
        let profilePic = "";
        let name = "";
        let mobile = "";
        let email = "";
        let gender = "";
        let createdAt = new Date();

        let followers = 0;
        let following = 0;
        let posts = 0;
        let cityName = '';
        let userId = '';
        let dob = '';

        if(UserData.mobile || UserData.email) {
            profilePic = (UserData.profilePic) ? UserData.profilePic : '/images/Icon feather-user.png';
            name = UserData.name;
            mobile = UserData.mobile;
            email = UserData.email;
            createdAt = UserData.createdAt.split("T")[0];
            gender = UserData.gender;
            following = 0;
            followers = 0;
            posts = 0;
            cityName = UserData.cityName;
            userId = UserData._id;
            dob = UserData.dob;
        }


        return (

            <div className="content-page user-details-page">
                <div className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                            <h4 className="page-title-heading">User Details</h4>
                                <div className="mt-3">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="/user-management">User Management</Link></li>
                                        <li className="breadcrumb-item active">User Details</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>   
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body"> 
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Name</label>
                                                    <input type="text" id="firstName" className="form-control" value= {name} />       
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Mobile</label>
                                                    <input type="number" id="mobile" className="form-control" value= {mobile} />    
                                                </div>     
                                            </div>
                                        </div> 

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Email</label>
                                                    <input type="email" id="email" className="form-control" value= {email} />       
                                                </div>
                                            </div>
            
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Gender</label>
                                                    <input type="text" id="gender" className="form-control" value= {gender} />    
                                                </div>     
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Profile Pic</label>
                                                    <img src={profilePic} alt="StoryTent" id="profilePic" style={{width: 60, heigth: 60, marginLeft: "20px"}} />    
                                                </div>     
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">User Id</label>
                                                    <input type="text" id="createdAt" className="form-control" value= { userId } />    
                                                </div>     
                                            </div>
                                        </div>  

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Created At</label>
                                                    <input type="text" id="createdAt" className="form-control" value= {createdAt} />    
                                                </div>     
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">City Name</label>
                                                    <input type="text" id="cityName" className="form-control" value= {cityName} />    
                                                </div>     
                                            </div>
                                            {/* <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Following</label>
                                                    <p><Link to={ `/user-followings/${UserData._id}/1` } id="following">{following}</Link></p>   
                                                </div>     
                                            </div> */}
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">DOB</label>
                                                    <input type="text" id="dob" className="form-control" value= {dob} />    
                                                </div>     
                                            </div>
                                        </div>
                                        {/* <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Followers</label>
                                                    <p><Link to={ `/user-followers/${UserData._id}/2`} id="followers">{followers}</Link></p>    
                                                </div>     
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="update" className="update">Posts</label>
                                                    <p><Link to={ `/user-posts/${UserData._id}`} id="posts">{posts}</Link></p>    
                                                </div>     
                                            </div>
                                        </div> */}
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