import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Constant from './Constant';
import '../css/style.css';
import { getAccessToken } from '../hooks/AccessToken';


class ExpertDashboard extends Component {
    state = {
        ERROR: true,
        data: {}
    }

/*.............................................Dashboard API....................................................*/    

    componentDidMount() {
        try {
            let token = getAccessToken();
            let req = {
                method: 'GET',
                url: Constant.apiBasePath + '/dashboard',
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': token
                },
                json: true
            }
            Axios(req).then(response => {
                let { data } = response;
                if(data.status === Constant.statusSuccess) {
                    const getData = response.data.data;
                    const setData = {};
                    setData['totalActiveUser'] = getData.totalActiveUser;
                    setData['totalInActiveUser'] = getData.totalInActiveUser;
                    setData['totalActiveVideo'] = getData.totalActiveVideo;
                    setData['totalInActiveVideo'] = getData.totalInActiveVideo;
                    setData['totalActiveAudio'] = getData.totalActiveAudio;
                    setData['totalInActiveAudio'] = getData.totalInActiveAudio;
                    setData['totalActiveStory'] = getData.totalActiveStory;
                    setData['totalInActiveStory'] = getData.totalInActiveStory;
                    setData['totalEarningAmount'] = getData.totalEarningAmount;
                    this.setState({ data: setData, ERROR: false }); 
                }
                else{
                    alert(response.data.message);
                    return false;
                }
            }).catch(error => {
                let { data } = error;
                alert(data);
                return false;
            });
        }
        catch(error) {
            console.log(error);
        }
    }

//--------------------------------------------End-------------------------------------------------------\\       

/*..................................................end API.....................................................*/ 
    
    render() {
        const { data } = this.state;

          return (
                <div className="content-page">
                    <div className="content dashboardPage">   
                        {/* <!-- start page title --> */}
                        <div className="row">
                            <div className="col-12">
                                <h4 className="page-title-heading">My Dashboard</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4">
                                <div className="card tilebox-one">
                                    <div className="card-body">
                                        <i className='fas fa-chalkboard-teacher'></i>
                                        <h6 className="text-uppercase mt-0">Total Active User</h6>
                                        <h2 className="my-2" id="active-users-count">{ data.totalActiveUser }</h2>
                                        <h6 className="text-uppercase mt-0">Total Inactive User</h6>
                                        <h2 className="my-2" id="active-users-count">{ data.totalInActiveUser }</h2>
                                        <p className="mb-0 text-muted">
                                            <span className="text-success mr-2"><Link to="/user-management" id="modules">
                                                User Management</Link>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-4">
                                <div className="card tilebox-one">
                                    <div className="card-body">
                                        <i className="fa fa-video" aria-hidden="true"></i>
                                        <h6 className="text-uppercase mt-0">Today Active Video</h6>
                                        <h2 className="my-2" id="active-users-count">{ data.totalActiveVideo }</h2>
                                        <h6 className="text-uppercase mt-0">Today InActive Video</h6>
                                        <h2 className="my-2" id="active-users-count">{ data.totalInActiveVideo }</h2>
                                        <p className="mb-0 text-muted">
                                            <span className="text-success mr-2"><Link to="/video-management" id="modules">
                                                Video Management</Link>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-4">
                                <div className="card tilebox-one">
                                    <div className="card-body">
                                        <i className="fa fa-volume-up" aria-hidden="true"></i>
                                        <h6 className="text-uppercase mt-0">Total Active Audio</h6>
                                        <h2 className="my-2" id="active-users-count">{data.totalActiveAudio}</h2>
                                        <h6 className="text-uppercase mt-0">Total InActive Audio</h6>
                                        <h2 className="my-2" id="active-users-count">{data.totalInActiveAudio}</h2>
                                        <p className="mb-0 text-muted">
                                            <span className="text-success mr-2"><Link to="/audio-management" id="modules">
                                                Audio Management</Link>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-xl-3 col-lg-4">
                                <div className="card tilebox-one">
                                    <div className="card-body">
                                        <i className="fa fa-history" aria-hidden="true"></i>
                                        <h6 className="text-uppercase mt-0">Total Active Story</h6>
                                        <h2 className="my-2" id="active-users-count">{data.totalActiveStory}</h2>
                                        <h6 className="text-uppercase mt-0">Total InActive Story</h6>
                                        <h2 className="my-2" id="active-users-count">{data.totalInActiveStory}</h2>
                                        <p className="mb-0 text-muted">
                                            <span className="text-success mr-2"><Link to="/story-management" id="modules">
                                                Story Management</Link>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <div className="card tilebox-one">
                                    <div className="card-body">
                                        <i className="fa fa-money" aria-hidden="true"></i>
                                        <h6 className="text-uppercase mt-0">Total Earning</h6>
                                        <h2 className="my-2" id="active-users-count">{`${data.totalEarningAmount} RS`}</h2>
                                        <p className="mb-0 text-muted">
                                            <span className="text-success mr-2">
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default ExpertDashboard;
