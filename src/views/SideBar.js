import React, { Component } from 'react';
import '../css/style.css';
import {Link} from 'react-router-dom';

export default class SideBar extends Component {

    
        state = {
            showLocation: false
        }

        showLocation = () => {
            if(this.state.showLocation === true) {
                this.setState({ 'showLocation': false });
            }
            else {
                this.setState({ 'showLocation': true });
            }
        }
    
    render() {
       
        return (

            <div className="left-side-menu left-side-menu-detached">
                <div className="leftbar-user">
                </div>        
                <ul className="metismenu side-nav">
                    <li className="side-nav-item">
                        <Link to="/dashboard" className="side-nav-link" id="main-sidebar">
                        <i className='fa fa-tachometer'></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/user-management" className="side-nav-link" id="main-sidebar">
                        <i className='fa fa-user'></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>User Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/country-management" className="side-nav-link" id="main-sidebar" onClick={this.showLocation}>
                        <i className="fa fa-location-arrow" aria-hidden="true"></i>
                            <span>Location Management </span>
                            <span className="menu-arrow"></span>
                        </Link>
                        {
                            this.state.showLocation ? 
                            (
                                <ul className="side-nav-second-level" aria-expanded="false" ref={(content)=> {this.dropdownContent=content;}}>
                                    <li>
                                       <Link to="/country-management" id="main-sidebar">Country Management</Link>
                                   </li>
                                    <li>
                                       <Link to="/state-management" id="main-sidebar">State Management</Link>
                                   </li>
                                   <li>
                                       <Link to="/city-management" id="main-sidebar">City Management</Link>
                                   </li>
                               </ul>
                            )
                            :
                            (null)
                        }
                    </li>

                    <li className="side-nav-item">
                        <Link to="/banner-management" className="side-nav-link" id="main-sidebar">
                        <i className='fa fa-image'></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>
                                Banner Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/category-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-list" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Category Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/story-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-history" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Story Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/poem-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-history" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Poem Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/thumbnail-management" className="side-nav-link" id="main-sidebar">
                        <i className='fa fa-list'></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Thumbnail Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/video-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-video-camera" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Video Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/audio-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-volume-up" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Audio Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/movies-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-film" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Movies Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/contest-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-trophy" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Contest Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/membership-plan" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Membership Plan</span>
                        </Link>
                    </li>
                    <li className="side-nav-item">
                        <Link to="/event-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-list"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Event Management</span>
                        </Link>
                    </li>

                    <li className="side-nav-item">
                        <Link to="/cms-management" className="side-nav-link" id="main-sidebar">
                        <i className='fa fa-database'></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>CMS Management</span>
                        </Link>
                    </li>
                    <li className="side-nav-item">
                        <Link to="/faqs-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-question-circle"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>FAQs Management</span>
                        </Link>
                    </li>
                    <li className="side-nav-item">
                        <Link to="/social-media" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-list"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Social Media</span>
                        </Link>
                    </li>
                    <li className="side-nav-item">
                        <Link to="/badge-management" className="side-nav-link" id="main-sidebar">
                        <i className="fa fa-hand-peace-o"></i>
                            <span className="badge badge-info badge-pill float-right"></span>
                            <span>Badge Management</span>
                        </Link>
                    </li>
                </ul>
            </div>
             
        )
    }
}