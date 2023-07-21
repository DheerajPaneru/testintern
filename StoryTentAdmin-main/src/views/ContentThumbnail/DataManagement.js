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
        DataList: [],
        selectValue: '', 
        length: '',
        pageNo: '',
        defaultPageNo: 1,
        sortByAttribute: 1
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
        const response = await Axios.patch(Constant.apiBasePath+'content-thumbnail/changeStatus/'+ id, {status: (status) ? 0 : 1 }, { headers: { 'token': token }});
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

deleteThumbnail = async (event, thumbnail) => {
    try {
        let token = getAccessToken();
        const response = await Axios.delete(Constant.apiBasePath+'content-thumbnail/delete/' + event + '?thumbnail=' + thumbnail, { headers: { 'token': token }});
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

//----------------------------------Integrate show banner API----------------------------------\\

handleSubmit = async (event, sort) => {
    try {
        let token = getAccessToken();
        let selectValue = $("#selectValue").val();
        const response = await Axios.post(Constant.apiBasePath + 'content-thumbnail/get-all', { 'key': selectValue, 'pageNo': event }, { headers: { 'token': token }});
        const {data, length, pageNo} = response.data;
        this.setState({DataList: data, length: length, pageNo: pageNo, defaultPageNo: event, selectValue:'', ERROR: false});
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
    const {DataList, length, pageNo} = this.state;
    let i = (pageNo - 1) * Constant.perPage;
    
    let bodyData = '';
    if(DataList.length > 0) {
        bodyData = DataList.map(el => {
            i++;
            let status = "Inactive";
            if(el.status === 1) {
                status = "Active";
            } 

            return <tr><td>{i}</td><td>{el.title}</td><td><img src={el.thumbnail} alt="ind" style={{width:50,height:50}} key={el._id} resizemode="contain"/></td><td>{el.createdAt}</td><td><button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.status)}}>{status}</button></td><td><button className="btn btn-danger Banner-btn" onClick={() => {if(window.confirm('Delete the Thumbnail?'))
            {this.deleteThumbnail(el._id, el.thumbnail)}}}><i className="mdi mdi-delete" title='Delete Thumbnail'></i></button>
            </td></tr>
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

        $("#selectValue").on("change", () => {
            $("#searchKey").children(":selected").prop("selected", false);
        });

   
        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Thumbnail Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/upload-thumbnail"><button type="button" className="btn btn-info mb-2 mr-2 float-right">
                                    Add New</button></Link>
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
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
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
                                                            <th>Title</th>
                                                            <th>Thumbnail</th>
                                                            <th>Created At</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
                                                    </tbody>
                                                </table> 
                                                {
                                                    (DataList.length > 0 && length > 1)
                                                    ?
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
                                                    :
                                                        null
                                                }
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
