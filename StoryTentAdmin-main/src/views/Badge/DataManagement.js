import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Constant from '../Constant';

import '../../css/style.css';
import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';


class DataManagement extends Component {
      
    state = {
        ERROR: true,
        DataList: []
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

//----------------------------------Change status-----------------------------------------------\\

changeStatus = async (id, status) => {
    try {
        let token = getAccessToken();
        const response = await Axios.patch(Constant.apiBasePath+'badge/changeStatus/'+ id, {status: status}, { headers: { 'token': token }});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit();
        }
        else {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'red');
        }    
    }
    catch(err) {
        console.log(err);
    }
} 

//------------------------------------Integrate API for remove banner-------------------------------//

deleteBadge = async event => {
    try {
        let token = getAccessToken();
        const response = await Axios.delete(Constant.apiBasePath+'badge/' + event, { headers: { 'token': token }});
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit();
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }
        else {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'red');
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }  

    }
    catch(err) {
         console.log(err);
    }
}

//----------------------------------Integrate API for update banner-------------------------------\\

updateBadge = async event => {
    try {
        this.props.history.push('/update-badge/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}


//----------------------------------Integrate show banner API----------------------------------\\

handleSubmit = async () => {
    try {
        let token = getAccessToken();
        const response = await Axios.post(Constant.apiBasePath + 'badge/get-all', {'pageNo': 1 }, { headers: { 'token': token }});
        const { data } = response.data;
        this.setState({DataList: data, ERROR: false});
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
            let status = "Inactive";
            if(el.status === 1) {
                status = "Active";
            } 

            let type = "Writer";
            if(el.type === 2) {
                type = "Reader";
            } 

            return <tr><td>{i}</td><td>{type}</td><td>{el.noOfPoems}</td><td>{el.noOfStories}</td><td>{el.title}</td><td>{el.subTitle}</td><td><img src={el.image} alt="ind" style={{width:50,height:50}} key={el._id} resizemode="contain"/></td><td>{el.count}</td><td><button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.status)}}>{status}</button></td><td><button className="btn btn-danger Banner-btn" onClick={() => {if(window.confirm('Delete the Badge?'))
            {this.deleteBadge(el._id)}}}><i className="mdi mdi-delete" title='Delete Badge'></i></button>
            <button className="btn btn-info Banner-btn edit-banner ml5" onClick={() => {this.updateBadge(el._id)}}>
            <i className="mdi mdi-square-edit-outline" title='Update Badge'></i></button></td></tr>
        })
    }
   
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Badge Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/add-badge"><button type="button" className="btn btn-info mb-2 mr-2 float-right">
                                    Add New</button></Link>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                               
                                <div className="card">
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                        {/* <div className="row">
                                            <div className="col-md-3">
                                                <select id="selectValue" onChange={()=>{this.handleSubmit()}} className="form-control">
                                                    <option value="all">Select one</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <p id="gen-message"></p>
                                            </div>
                                        </div> */}

                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                            <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Type</th>
                                                            <th>No Of Poems</th>
                                                            <th>No Of Stories</th>
                                                            <th>Title</th>
                                                            <th>Sub Title</th>
                                                            <th>Image</th>
                                                            <th>Count</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
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