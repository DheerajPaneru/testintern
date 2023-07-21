import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Constant from '../Constant';

import '../../css/style.css';
import $ from 'jquery';

class BannerManagement extends Component {
      
    state = {
        ERROR: true,
        BannerList: [],
        selectValue: '', 
        length: '',
        pageNo: '',
        defaultPageNo: 1,
        searchKey: '',
        sortByAttribute: 1
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

//----------------------------------Change banner status-----------------------------------------------\\
changeStatus = async (id, status) => {
    try {
        const response = await Axios.patch(Constant.apiBasePath+'banner/changeStatus/'+ id, {status: status});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.defaultPageNo);
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

deleteBanner = async event => {
    try {
        const response = await Axios.patch(Constant.apiBasePath+'banner/delete/' + event);
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.defaultPageNo);
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

updateBanner = async event => {
    try {
        this.props.history.push('/update-banner/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}


//----------------------------------Integrate show banner API----------------------------------\\

handleSubmit = async (event, sort) => {
    try {
        let selectValue = $("#selectValue").val();
        let searchKey = $("#searchKey").val();
        let sortByAttribute = this.state.sortByAttribute;
        if(sort) {
            this.setState({'sortByAttribute': sort});
            sortByAttribute = sort;
        }
        const response = await Axios.post(Constant.apiBasePath + 'banner/get-all', {'key': selectValue, 'pageNo': event, 'searchKey': searchKey, 'sortByAttribute': sortByAttribute});
        const {data, length, pageNo} = response.data;
        this.setState({BannerList: data, length: length, pageNo: pageNo, defaultPageNo: event, selectValue:'', 'searchKey': '', ERROR: false});
    }
    catch(err) {
         console.log(err);
    }
}

//--------------------------------------------Reload component----------------------------------------------//    
componentDidMount() {
    this.handleSubmit(this.state.defaultPageNo);
}




//-------------------------------------------End API-------------------------------------------------------\\     

render() {
    const {BannerList, length, pageNo} = this.state;
    let i = (pageNo - 1) * Constant.perPage;
    
    let bodyData = '';
    if(BannerList.length > 0) {
        bodyData = BannerList.map(banner => {
            i++;
            let status = "Active";
            if(banner.status === 0) {
                status = "Inactive";
            } 
            return <tr><td>{i}</td><td>{banner.name}</td><td>{banner.description}</td><td><img src={banner.image} alt="ind" style={{width:50,height:50}} key={banner._id} resizemode="contain"/></td><td>{banner.createdAt}</td><td><button className="btn btn-info tblbtns" onClick = {()=>{this.changeStatus(banner._id, banner.status)}}>{status}</button></td><td><button className="btn btn-danger Banner-btn updatebtns" onClick={() => {if(window.confirm('Delete the Banner?'))
            {this.deleteBanner(banner._id)}}}><i className="mdi mdi-delete" title='Delete Banner'></i></button>
            <button className="btn btn-info Banner-btn edit-banner ml5 updatebtns" onClick={() => {this.updateBanner(banner._id)}}>
            <i className="mdi mdi-square-edit-outline" title='Update Banner'></i></button></td></tr>
        })
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

        if(length < 2) {
           $(".pagination").hide();
        }

        $("#searchKey").on("change", () => {
            $("#selectValue").children(":selected").prop("selected", false);
        });

        $("#selectValue").on("change", () => {
            $("#searchKey").children(":selected").prop("selected", false);
        });

   
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Banner Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/add-banner"><button type="button" className="btn btn-info mb-2 mr-2 float-right">
                                    Add New Banner</button></Link>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                               
                                <div className="card">
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                        <div className="row">
                                            <div className="col-md-3">
                                                <select id="selectValue" onChange={()=>{this.handleSubmit(this.state.defaultPageNo)}} className="form-control">
                                                    <option value="all">Select one</option>
                                                    <option value="0">Active</option>
                                                    <option value="1">Inactive</option>
                                                </select>
                                            </div>
                                            
                                            {/* <div className="col-md-3">
                                                <select id="searchKey" className="form-control" onChange={()=>{this.handleSubmit(this.state.defaultPageNo)}}>
                                                    <option value="0">Search by position</option>
                                                    <option value="1">Home top</option>
                                                    <option value="2">Home Middle</option>
                                                    <option value="3">Home Bottom</option>
                                                </select>
                                            </div> */}
                                            <div className="col-md-3">
                                                <p id="gen-message"></p>
                                            </div>
                                        </div>

                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                            <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th style={{width:'20%'}}>Name</th>
                                                            <th style={{width:'30%'}}>Description</th>
                                                            {/* <th>Name <i class="fa fa-angle-up" style={{marginLeft:5}} onClick={()=>{this.handleSubmit(pageNo, 1)}}></i><i class="fa fa-angle-down" style={{marginLeft:3}} onClick={()=>{this.handleSubmit(pageNo, 2)}}></i></th> */}
                                                            {/* <th>Position <i class="fa fa-angle-up" style={{marginLeft:5}} onClick={()=>{this.handleSubmit(pageNo, 3)}}></i><i class="fa fa-angle-down" style={{marginLeft:3}} onClick={()=>{this.handleSubmit(pageNo, 4)}}></i></th> */}
                                                            <th>Image</th>
                                                            <th>Created At</th>
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
                                                    <a>Next</a>
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
export default BannerManagement;
