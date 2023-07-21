import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Constant from '../Constant';

import '../../css/style.css';
import $ from 'jquery';


class PlanManagement extends Component {
      
    state = {
        ERROR: true,
        PlanList: [],
        searchKey: '',
        pageNo: 1,
        length: 1
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

    //----------------------------------Change State status-----------------------------------------------\\

    changeStatus = async (id, status, type) => {
        try {
            let metaData = { 'status': status };
            if(type === 2) {
                metaData = { 'isDeleted': status }
            }
            let token = localStorage.getItem('loginDetails');
            Axios.patch(Constant.apiBasePath+'plan/changeStatus/'+ id, metaData , { headers: { 'token': token }}).then(response => {
                let {data} = response;
                if(data.status === Constant.statusSuccess) {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'green');
                    this.handleSubmit(this.state.pageNo);
                }
            }).catch(error => {
                if (error.response === undefined) {
                    $('#gen-message').text('API is not working');
                    $('#gen-message').css('color', 'red');
                    return false;
                }
                else{
                    $('#gen-message').text(error.response.data.message);
                    $('#gen-message').css('color', 'red');
                    return false;
                }
            });    
        }
        catch(err) {
            console.log(err);
        }
    } 

    //----------------------------------Integrate API for update donation-------------------------------\\

    updatePlan = async (id) => {
        try {
            this.props.history.push('/update-plan/'+ id); 
        }
        catch(err) {
            console.log(err);
        }
    }


    //----------------------------------Integrate show Donation API----------------------------------\\

    handleSubmit = async (event) => {
        try {
            let token = localStorage.getItem('loginDetails');
            Axios.post(Constant.apiBasePath + 'plan/get-all', { 'pageNo': event }, { headers: { 'token': token }}).then(response => {
                const {data, length, pageNo} = response.data;
                this.setState({PlanList: data, length: length, pageNo: pageNo, ERROR: false});
            }).catch(error => {
                if (error.response === undefined) {
                    $('#gen-message').text('API is not working');
                    $('#gen-message').css('color', 'red');
                    return false;
                }
                else{
                    $('#gen-message').text(error.response.data.message);
                    $('#gen-message').css('color', 'red');
                    return false;
                }
            });
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
        const {PlanList, length, pageNo} = this.state;
        let i = (pageNo - 1) * Constant.perPage;
        let bodyData = '';

        if(PlanList.length > 0) {
            bodyData = PlanList.map(el => {
                i++;
                let status = "Active";
                if(el.status === 0) {
                    status = "Inactive";
                }
                let price = el.price + '$';
                
                return <tr><td>{i}</td><td>{el.name}</td><td>{el.description}</td><td>{price}</td><td>{el.duration}</td><td><button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.status, 1)}}>{status}</button></td>
                            <td><button className="btn btn-danger state-btn" onClick={() => {if(window.confirm('Delete the plan?')){this.changeStatus(el._id, el.isDeleted, 2)}}}><i className="mdi mdi-delete" title='Delete plan'></i></button>
                            <button className="btn btn-info state-btn edit-state" onClick={() => {this.updatePlan(el._id)}}><i className="mdi mdi-square-edit-outline" title='Update donation'></i></button></td>
                        </tr> 
            })
        }
        

        var previous = 0;
        var next = 0;
        var customLength = 0

        if(pageNo >= 0) {
            previous = pageNo - 1;
            next = pageNo + 1;
        }

        if(length !== 0) {
            customLength = length;
        }

        if(length < 2) {
            $(".pagination").hide();
        }
   
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Plan Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/add-plan"><button type="button" className="btn btn-info mb-2 mr-2 float-right">
                                    Add New</button></Link>
                            </div>
                            <p id="gen-message"></p>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                                <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                    <thead>
                                                        <tr>
                                                                <th>S.No.</th>
                                                                <th>Name</th>
                                                                <th>Description</th>
                                                                <th>Price</th>
                                                                <th>Duration</th>
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
                                                    <a className="paginate-link" class="active" onClick={() => this.handleSubmit(next)}>Next</a>

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
export default PlanManagement;