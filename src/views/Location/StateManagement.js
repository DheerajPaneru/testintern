import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';
import { getAccessToken } from '../../hooks/AccessToken';

class StateManagement extends Component {
      
    state = {
        CountryData: [],
        DataList: [],
        ERROR: true
    }


    //----------------------------------Integrate show State API----------------------------------\\

    getStateByCountry = (countryCode) => {
        try {
            let { accessToken } = getAccessToken();
            let req = {
                'url': Constant.apiBasePath + 'location/state/getAll?countryCode=' + countryCode,
                'method': 'GET',
                'json': true,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': accessToken
                }
            }
            Axios(req).then(response => {
                let data = response.data;
                if(data.status === Constant.statusSuccess) {
                    this.setState({ DataList: data.data, ERROR: false });
                }
                else{
                    alert(data.message);
                    return false;
                }
            }).catch(error => {
                console.log(error);
            })
        }
        catch(err) {
            console.log(err);
        }
    }

    handleSubmit = () => {
        try {
            let { accessToken } = getAccessToken();
            let req = {
                'url': Constant.apiBasePath + 'location/country/getAll',
                'method': 'GET',
                'json': true,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': accessToken
                }
            }
            Axios(req).then(response => {
                let data = response.data;
                if(data.status === Constant.statusSuccess) {
                    this.setState({ CountryData: data.data, ERROR: false });
                }
                else{
                    alert(data.message);
                    return false;
                }
            }).catch(error => {
                console.log(error);
            })
        }
        catch(err) {
            console.log(err);
        }
    }

    handleChange = (e) => {
        this.getStateByCountry(e.target.value);
    };  

    
    //--------------------------------------------Reload component----------------------------------------------//    

    componentDidMount() {
        this.handleSubmit();
    }

    
    //-------------------------------------------End API-------------------------------------------------------\\     

    render() {
        const { DataList, CountryData } = this.state;
        let i = 0;
        let bodyData = '';
        let CountryOptions = '';

        if(CountryData.length > 0) {
            CountryOptions = CountryData.map(list => {
                return <option id={list.isoCode} value={list.isoCode}>{list.name}</option>
            })
        }

        if(DataList.length > 0) {
            bodyData = DataList.map(el => {
                i++;
                return <tr><td>{i}</td><td>{el.name}</td><td>{el.isoCode}</td><td>{el.countryCode}</td>
                {/* <td>{(el.status === 0)?<span className="text-danger">Deactive</span>:<span className="text-success">Active</span>}</td> */}
                </tr>
            })
        }
        
        return (
            <div>
                <div className="page-breadcrumb">
                    <div className="row">
                        <div className="col-6 align-self-center">
                            <div className="d-flex align-items-center">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb m-0 p-0">
                                        <li className="breadcrumb-item">State Management
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* **************core-container************ */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                            <div className="card-body">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="update" className="update">Select Country *</label>
                                        <select id="countryId" className="form-control" onChange={this.handleChange} required>
                                            <option value="0">Select one</option>
                                            { CountryOptions }
                                        </select>  
                                    </div>
                                </div>
                                <div className="table-responsive mb-3">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Serial number</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">ISO Code</th>
                                                <th scope="col">Country Code</th>
                                                {/* <th scope="col">Status</th> */}
                                                {/* <th scope="col">Actions</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>{bodyData}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }    
        
}
export default StateManagement;