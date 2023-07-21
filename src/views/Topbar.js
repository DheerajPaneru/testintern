import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './../App.css';
import { getTokenDetails } from './Utilities/CommonFunctions';


export default class Topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            ERROR: true,
            adminName: 'Admin',
            userType: '',
        }
        this.getTokenDetails = getTokenDetails.bind(this);
    }

    componentDidMount() {
        let token = localStorage.getItem('loginDetails');
        let getDetails = getTokenDetails(token);
        if(getDetails.role === 2) {
            this.setState({'adminName': 'Admin'});
        }
        
        this.setState({ 'id': getDetails.id, 'userType': getDetails.userType, ERROR: false });
    }

    logout = () => {
        localStorage.removeItem('loginDetails');
        window.location.href = '/';
    }

    render() {
            let { id } = this.state;
            let path = '/change-password/' + id;
            
        return (
            <div className="navbar-custom topnav-navbar topnav-navbar-dark">
            <div className="container-fluid">
                <a href="/dashboard" className="topnav-logo">
                    <span className="topnav-logo-lg">
                        <img src="/images/logo.png" alt="" className="dashborad-logo"/>
                        {/* <h4 className="appName">StoryTent</h4> */}
                    </span>
                    </a>
                <ul className="list-unstyled topbar-right-menu float-right mb-0"> 
                    <li className="dropdown notification-list">
                        {/* <a className="nav-link dropdown-toggle nav-user arrow-none mr-0" data-toggle="dropdown" id="topbar-userdrop"
                            href="/#" role="button" aria-haspopup="true" aria-expanded="false"> */}
                             <a className="nav-link dropdown-toggle" data-toggle="dropdown" id="topbar-userdrop"
                            href="/#" role="button" aria-haspopup="true" aria-expanded="false">
                           
                            <span>
                                <span className="account-user-name" id="admin">{this.state.adminName}</span>
                                {/* <span className="account-position"  id="admin">Developer</span> */}
                            </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right dropdown-menu-animated topbar-dropdown-menu profile-dropdown"
                            aria-labelledby="topbar-userdrop">

                            <Link to={path} className="dropdown-item notify-item">
                            <i className="fa fa-key mr-1" aria-hidden="true"></i>
                                <span>Change Password</span>
                            </Link>
                            
                            <Link to="#" className="dropdown-item notify-item" onClick={this.logout}>
                                <i className="mdi mdi-logout mr-1"></i>
                                <span on>Logout</span>
                            </Link>

                        </div>
                    </li>

                </ul>
                <a href="/#" className="button-menu-mobile disable-btn">
                    <div className="lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </a>
            </div>
        </div>
        )
    }
}
