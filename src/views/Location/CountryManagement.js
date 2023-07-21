import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';
import { getAccessToken } from '../../hooks/AccessToken';


class CountryManagement extends Component {
      
    state = {
        DataList: [],
        ERROR: true
    }

   
    //----------------------------------Integrate show Country API----------------------------------\\

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

    //--------------------------------------------Reload component----------------------------------------------//    

    componentDidMount() {
        this.handleSubmit();
    }

    
    //-------------------------------------------End API-------------------------------------------------------\\     

    render() {
        const { DataList } = this.state;
        let i = 0;
        let bodyData = '';

        if(DataList.length > 0) {
            bodyData = DataList.map(el => {
                i++; 
                return <tr><td>{i}</td><td>{el.name}</td><td>{el.isoCode}</td><td>{(el.status === 0)?<span className="text-danger">Deactive</span>:<span className="text-success">Active</span>}</td></tr>
            })
        }
        
        return (
            <div>
                {/* **************core-container************ */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 align-self-center">
                            <div className="d-flex align-items-center">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb m-0 p-0">
                                        <li className="breadcrumb-item">Country Management
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive mb-3">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Serial number</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">ISO Code</th>
                                                    <th scope="col">Status</th>
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
export default CountryManagement;