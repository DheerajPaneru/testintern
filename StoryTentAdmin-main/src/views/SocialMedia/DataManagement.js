import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';

import '../../css/style.css';
import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import {Link} from 'react-router-dom';


class DataManagement extends Component {
      
    state = {
        ERROR: true,
        DataList: [],
        length: '',
        pageNo: 1,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

//------------------------------------Integrate API for remove Chapter-------------------------------//

deleteData = event => {
    let token = getAccessToken();
    let req = {
        method: 'DELETE',
        url: Constant.apiBasePath + 'social-media/' + event,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': token
        },
        json: true
    }

    Axios(req).then(response => { 
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            alert(data.message);
            this.handleSubmit(this.state.pageNo);
        }
        else {
            alert(data.message);
            this.handleSubmit(this.state.pageNo);
        }
    }).catch(error => {
        console.log(error);
        alert(Constant.somethingError);
        return false;
    })
}

//----------------------------------Integrate API for show data----------------------------------\\

handleSubmit = async (event, sort) => {
    try {
        let token = getAccessToken();
        const response = await Axios.post(Constant.apiBasePath + '/getSocialMediaData', { headers: { 'token': token }});
        const { data } = response.data;
        this.setState({ DataList: data, ERROR: false });
    }
    catch(err) {
        console.log(err);
    }
}

//--------------------------------------------Reload component----------------------------------------------//    
componentDidMount() {
    this.handleSubmit(this.state.pageNo);
}


//-------------------------------------------End API-------------------------------------------------------\\     

render() {
    const { DataList } = this.state;
    let i = 0;

    let bodyData = '';
    if(DataList.length > 0) {
        bodyData = DataList.map(el => {
            i++; 
            return <tr>
                        <td>{i}</td><td>{el.title}</td><td>{el.redirectURL}</td><td><img src={el.image} alt="ind" style={{width:50,height:50}} key={el._id} resizemode="contain"/></td>
                        <td>
                            <button className="btn btn-danger Banner-btn delete-el" onClick={() => {if(window.confirm('Delete the social media?')){this.deleteData(el._id)}}}><i className="mdi mdi-delete" title='Delete social media'></i></button></td>
                    </tr>
        })
    }

    
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Social Media</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/add-social-media"><button type="button" className="btn btn-info mb-2 mr-2 float-right add-btn">
                                    Add New</button></Link>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                               
                                <div className="card">
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                       
                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                            <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Title</th>
                                                            <th>Redirect URL</th>
                                                            <th>Icon</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                       { bodyData }
                                                    </tbody>
                                                </table> 
                                            </div>                                          
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
export default DataManagement;