import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';

import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import { Link } from 'react-router-dom';
import Parse from 'html-react-parser';

class DataManagement extends Component {
      
    state = {
        ERROR: true,
        DataList: [],
        pageNo: 1,
        length: 1
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 


 //----------------------------------Change data status-----------------------------------------------\\

changeStatus = async (id, status) => {
    try {
        let token = getAccessToken();
        const response = await Axios.patch(Constant.apiBasePath+'enrollment/changeStatus/'+ id, {status: status}, { headers: { 'token': token }});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            alert(data.message);
            this.handleSubmit(this.state.pageNo);
        }
        else {
            alert(data.message);
            this.handleSubmit(this.state.pageNo);
        }    
    }
    catch(err) {
        console.log(err);
    }
} 


//------------------------------------Integrate API for remove Chapter-------------------------------//

deleteData = event => {
    let token = getAccessToken();
    let req = {
        method: 'DELETE',
        url: Constant.apiBasePath + 'enrollment/' + event,
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

//----------------------------------Integrate API for update banner-------------------------------\\

updateData = async event => {
    try {
        this.props.history.push('/update-membership-plan/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}


//----------------------------------Integrate show el API----------------------------------\\

handleSubmit = async (event) => {
    try {
        let token = getAccessToken();
        let selectValue = $("#selectValue").val();
        const response = await Axios.post(Constant.apiBasePath + 'enrollment/getData', { 'pageNo': event, 'key': selectValue }, { headers: { 'token': token }});
        const {data} = response;
        if(data.status === Constant.statusSuccess) {
            this.setState({DataList: data.data, pageNo: data.pageNo, length: data.length, ERROR: false});
        }
        else{
            if(data.message === Constant.tokenExpired) {
                alert(data.message);
                localStorage.removeItem('loginDetails');
                window.location.href = '/';
            }
            else{
                alert(data.message);
                this.setState({DataList: data.data, pageNo: data.pageNo, length: data.length, ERROR: false});
                return false;
            }
        }
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
const {DataList, pageNo, length } = this.state;

    let i = 0;
    let bodyData = '';

    if(DataList.length > 0) {
        $(".tab-content").show();
        $(".emptyText").text("");
        bodyData = DataList.map(el => {
            i++;
            let status = "Inactive";

            let planType = 'Topup';
            if(el.status === 1) {
                status = "Active";
            }
            
            if(el.planType === 2) {
                planType = 'Monthly';
            }
            if(el.planType === 3) {
                planType = 'Quarterly';
            }
            if(el.planType === 4) {
                planType = 'Half yearly';
            }
            if(el.planType === 5) {
                planType = 'Yearly';
            }
            
            return  <tr>
                        <td>{i}</td><td>{el.name}</td><td>{Parse(el.description)}</td><td>{el.amount}</td><td>{el.fromAge}</td><td>{el.toAge}</td><td>{planType}</td>
                        <td>
                            <button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.status)}}>{status}</button>                 
                        </td>
                        <td>
                            <button className="btn btn-danger Banner-btn delete-el" onClick={() => {if(window.confirm('Delete the plan?')){this.deleteData(el._id)}}}><i className="mdi mdi-delete" title='Delete plan'></i></button>
                            <button className="btn btn-info edit-data" onClick={() => {this.updateData(el._id)}}><i className="mdi mdi-square-edit-outline" title='Update data'></i></button>
                        </td>
                    </tr>

        })
    }
    else{
        $(".tab-content").hide();
        $(".emptyText").text("No data here..");
    }

    let previous = 0;
    let next = 0;
    let customLength = 0

    if(pageNo !== 0) {
        previous = pageNo - 1;
        next = pageNo + 1;
    }

    if(length !== 0) {
        customLength = length;
    }

    if(length) {
        if (length === 1) {
            $(".pagination").hide();
        }
        else {
            $(".pagination").show();
        }
    }

    
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-8">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Membership Plan</h4>
                                </div>
                            </div>
                            <div className="col-4 text-right">
                                <Link to="/add-membership-plan"><button type="button" className="btn btn-info">
                                    Add New Data</button>
                                </Link>
                            </div>
                        </div>   

                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <p className="emptyText"></p>
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                        <div className="row">
                                            <div className="col-md-2">
                                                <select id="selectValue" className="form-control" onChange={()=>{this.handleSubmit(this.state.pageNo)}}>
                                                    <option value="all">Select one</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>

                                            {/* <div className="col-md-2">
                                                <input type="text" className="form-control" id="searchKey"/>
                                            </div>
                                            <div className="col-md-2">
                                                <button className="btn btn-info" onClick={()=>this.handleSubmit(this.state.pageNo)}>Search</button>
                                            </div> */}
                                        </div>

                                        <div className="tab-content mt-3">
                                            <div className="tab-pane table-responsive show active" id="buttons-table-preview">
                                                <table id="complex-header-datatable" className="table nowrap el-table">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Name</th>
                                                            <th>Description</th>
                                                            <th>Amount</th>
                                                            <th>From Age</th>
                                                            <th>To Age</th>
                                                            <th>Plan Type</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
                                                    </tbody>
                                                </table> 
                                                <div className="pagination">
                                                    {
                                                        (pageNo <= 1) ?
                                                    <a>Previous</a>
                                                    :
                                                    <a className="paginate-link" onClick={() => this.handleSubmit(previous)}>Previous</a>
                                                    }
                                                    
                                                    <a>{pageNo}</a>
                                                    {
                                                        (pageNo >= customLength)
                                                        ?
                                                    <a className="active">Next</a>
                                                    :
                                                    <a className="paginate-link active" onClick={() => this.handleSubmit(next)}>Next</a>

                                                    }
                                                </div>
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
