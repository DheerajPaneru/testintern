import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';

import '../../css/style.css';
import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import { Link } from 'react-router-dom';


class DataManagement extends Component {
      
    state = {
        ERROR: true,
        DataList: [],
        selectValue: '', 
        length: '',
        defaultPageNo: 1,
        searchKey: '',
        sortByAttribute: 1
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

    updateMovies = (event) => {
        this.props.history.push('/update-movies/' + event);
    }

//----------------------------------Change status-----------------------------------------------\\

changeStatus = async (event, status, type) => {
    try {
        let token = getAccessToken();
        let metaData = {
            'status': (status) ? 0 : 1,
            'isDeleted': ''
        }

        if(type === 2) {
            metaData = { 'feature': (status) ? 0 : 1 }
        }
       
        const response = await Axios.patch(Constant.apiBasePath + 'movies/changeStatus/'+ event, metaData, { headers: { 'token': token }});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            window.scrollTo(0, 0);
            window.$("#myModal").modal("hide");
            this.handleSubmit(this.state.defaultPageNo);
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }
        else {
            $('#popup-message').text(data.message);
            $('#popup-message').css('color', 'red');
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }    
    }
    catch(err) {
        console.log(err);
    }
} 

//------------------------------------Integrate API for remove data-------------------------------//

delete = async event => {
    try {
        let token = getAccessToken();
        const response = await Axios.delete(Constant.apiBasePath + 'movies/delete/' + event, { headers: { 'token': token }});
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            window.scrollTo(0, 0);
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


//----------------------------------Integrate API for show data----------------------------------\\

handleSubmit = async (event, sort) => {
    try {
        let token = getAccessToken();
        let selectValue = $("#selectValue").val();
        const response = await Axios.post(Constant.apiBasePath + 'movies/get-all', { 'key': selectValue, 'pageNo': event }, { headers: { 'token': token }});
        const {data, length, pageNo} = response.data;
        this.setState({DataList: data, length: length, pageNo: pageNo, defaultPageNo: event, selectValue:'', 'searchKey': '', ERROR: false});
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
            let status = "Active";
            if(el.status === 0) {
                status = "Inactive";
            }
            
            let feature = "Feature";
            if(el.feature === 0) {
                feature = "UnFeature";
            }

            return <tr><td>{i}</td><td>{el.title}</td><td>{el.description}</td><td><img src={el.thumbnail} alt="story-tent" style={{ width: 50, heigth: 50}}/></td>
            <td>
                <button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.status, 1)}}>{status}</button>                 
            </td>
            <td>
                <button className="btn btn-info" onClick = {()=>{this.changeStatus(el._id, el.feature, 2)}}>{feature}</button>                 
            </td>
            <td><button className="btn btn-danger Banner-btn" onClick={() => {if(window.confirm('Delete the movies?'))
            {this.delete(el._id)}}}><i className="mdi mdi-delete" title='Delete movies'></i></button>
            <button className="btn btn-info Banner-btn edit-banner ml5" onClick={() => {this.updateMovies(el._id)}}>
            <i className="mdi mdi-square-edit-outline" title='Update movies'></i></button>
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
                            <div className="col-8">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Movies Management</h4>
                                </div>
                            </div>
                            <div className="col-4 text-right">
                                <Link to="/add-movies"><button type="button" className="btn btn-info">
                                    Add New Data</button>
                                </Link>
                            </div>
                        </div>  
                        <div className="row">
                            <div className="col-12">
                               
                                <div className="card">
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                        <div className="row">
                                            <div className="col-md-2">
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
                                            { 
                                                (DataList.length > 0)
                                                ?
                                                <div className="tab-pane show active" id="buttons-table-preview">
                                                    <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                        <thead>
                                                            <tr>
                                                                    <th>S.No.</th>
                                                                    <th>Title</th>
                                                                    <th style={{ width: 260 }}>Description</th>
                                                                    <th>Thumbnail</th>
                                                                    <th>Status</th>
                                                                    <th>Feature</th>
                                                                    <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                                {bodyData}
                                                            </tbody>
                                                    </table> 
                                                    {
                                                        (length > 1)
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
                                                :
                                                <p>No movies found.</p>
                                            }                                        
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
