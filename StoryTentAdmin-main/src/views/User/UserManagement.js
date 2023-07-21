import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';

import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import { getCountry, getStateByCountryId, getCityByStateId} from '../../service/CommonServices';
import { Link } from 'react-router-dom';


class UserManagement extends Component {
      
    state = {
        ERROR: true,
        UserList: [],
        pageNo: 1,
        length: 1,
        sortByAttribute: 1,
        limit: 10,
        entries: 0,
        CountryList: [],
        StateList: [],
        CityList: [],
        countryCode: '',
        stateCode: '',
        cityId: ''
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.handleSubmit(this.state.pageNo, this.state.sortByAttribute, value, this.state.cityId);
    }

    handleDropdown = (event) => {
        this.setState({
            [event.target.id]: event.target.value 
        });

        if(event.target.id === 'countryCode') {
            getStateByCountryId(event.target.value).then(result => {
                this.setState({ 'StateList': result });
            })
        }

        if(event.target.id === 'stateCode') {
            getCityByStateId(this.state.countryCode, event.target.value).then(result => {
                this.setState({ 'CityList': result });
            })
        }

        if(event.target.id === 'cityId') {
            this.handleSubmit(this.state.pageNo, this.state.sortByAttribute, this.state.pageLimit, event.target.value);
        }
    }

//----------------------------------Change Teacher status-----------------------------------------------\\

changeStatus = async (id, status) => {
    try {
        let token = getAccessToken();
        if(status) {
            status = 0;
        }
        else{
            status = 1;
        }
        const response = await Axios.patch(Constant.apiBasePath + 'user/changeStatus/' + id, { 'status': status }, { 'headers': { 'token': token }});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.pageNo, this.state.sortByAttribute, this.state.pageLimit, this.state.cityId);
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

deleted = async (id) => {
    try {
        let token = getAccessToken();
        let metaData = {};
        const response = await Axios.patch(Constant.apiBasePath + 'user/deleteUser/' + id, metaData, { 'headers': { 'token': token }});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.pageNo, this.state.sortByAttribute, this.state.pageLimit, this.state.cityId);
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

//----------------------------------Integrate API for update Teacher-------------------------------\\

viewUser = async event => {
    try {
        this.props.history.push('/user-details/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}

//-------------------------------Integrate API for show data list----------------------------------\\

handleSubmit = async (event, sort, pageLimit, cityId) => {
    try {
        let token = getAccessToken();
        let searchKey = $("#searchKey").val();
        let sortByAttribute = this.state.sortByAttribute;

        if(sort) {
            this.setState({'sortByAttribute': sort});
            sortByAttribute = sort;
        }
        
        let selectValue = $("#selectValue").val();
        const response = await Axios.post(Constant.apiBasePath + 'getAllUsers', {'searchKey': searchKey, 'sortByAttribute': sortByAttribute, 'pageNo': event, limit: pageLimit, 'key': selectValue, 'cityId': cityId }, { headers: { 'token': token }});
        const {data, pageNo, length, limit, count} = response.data;
        this.setState({ UserList: data, pageNo: pageNo, length: length, searchKey: '', limit: limit, entries: count, ERROR: false });
    }
    catch(err) {
        console.log(err);
    }
}

//--------------------------------------------Reload component----------------------------------------------//    

componentDidMount() {
    this.handleSubmit(this.state.pageNo, this.state.sortByAttribute, Constant.perPage, this.state.cityId);
    getCountry().then(result => {
        this.setState({ 'CountryList': result });
    }).catch(error => {
        console.log(error);
    });
}

//-------------------------------------------End API-------------------------------------------------------\\     

render() {

const { UserList, length, pageNo, limit, entries, sortByAttribute, CountryList, StateList, CityList } = this.state;

    let i = (pageNo - 1) * limit;
    let bodyData = '';

    if(UserList.length > 0) {
        bodyData = UserList.map(el => {
            i++;

            // code for add dummy profile image
            
            let profilePic = el.profilePic;

            if(el.profilePic === ""){
                profilePic = 'images/Icon feather-user.png';
            }

            let status = "Inactive";
            if(el.isActivate === 1) {
                status = "Active";
            }
            
            let date = el.createdAt.split("T")[0];
            let planStatus = 'No';
            let stories = [];
            
            if(el.subscriptionUserData.length > 0) {
                let verifyPlanStatus = el.subscriptionUserData.filter(el => (el.isExpire === false) );
                if(verifyPlanStatus.length > 0) {
                    planStatus = 'Yes';
                }
            }

            if(el.stories.length > 0) {
                stories = el.stories.filter(el => (el.status !== 2) );
            }

            return <tr><td>{i}</td><td>{el.name}</td><td>{el.mobile}</td><td>{ el.countryName }</td><td>{ el.stateName }</td><td>{ el.cityName }</td><td>{ date }</td>
            <td><Link to={ `/user-stories/${el._id}` } id="following">{stories.length}</Link></td><td>{ planStatus } </td>
            {/* <td>{el.followingId.length}</td><td>{el.followerId.length}</td><td>{el.userId.length}</td><td>{el.receiverId.length}</td> */}
            <td><button className="btn btn-info btn-sm user-btn block-user" style={{width:80}} onClick = {()=>{this.changeStatus(el._id, el.isActivate)}}>{status}</button></td>
            <td>
                <button className="btn btn-danger Banner-btn" onClick={() => {if(window.confirm('Delete the user?')){this.deleted(el._id)}}}><i className="mdi mdi-delete" title='Delete User'></i></button>
                <button className="btn btn-warning btn-sm user-btn view-user" onClick={() => {this.viewUser(el._id)}}><i className="fa fa-eye" title="User details"></i></button>
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
    else{
        $(".pagination").show();
    }

    $(".export-user-btn").on("click", async () => {
        try {
            let token = getAccessToken();
            var {data} = await Axios.post(Constant.apiBasePath + 'getAllUsers', { 'exportData': 1 }, { headers: { token: token }});
            if(data.status === Constant.statusSuccess) {
                var csvString = data.data;
                var universalBOM = "\uFEFF";
                var a = window.document.createElement('a');
                a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString));
                a.setAttribute('download', 'users.csv');
                window.document.body.appendChild(a);
                a.click();
                window.location.reload();
            }
            else {
                alert(data.message);
                return false;
            }
        }
        catch(error) {
            console.log(error);
        }
    });

    let countryOptions = [];
    let stateOptions = [];
    let cityOptions = [];

    if(CountryList.length > 0) {
        countryOptions = CountryList.map(el => {
            return <option id={el.isoCode} value={el.isoCode}>{el.name}</option>
        });
    }

    if(StateList.length > 0) {
        stateOptions.push(<option id="0" value="0">Select one</option>);
        StateList.map(el => {
            stateOptions.push(<option id={el.isoCode} value={el.isoCode}>{el.name}</option>);
        });
    }
    else{
        stateOptions.push(<option value="0" id="0">Not Available</option>);
    }

    if(CityList.length > 0) {
        cityOptions.push(<option id="0" value="0">Select one</option>);
        CityList.map(el => {
            cityOptions.push(<option id={el._id} value={el._id}>{el.name}</option>);
        });
    }
    else{
        cityOptions.push(<option value="0" id="0">Not Available</option>);
    }

    
        return (
                <div className="content-page teacher-management-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-10">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">User Management</h4>
                                </div>
                            </div>
                            <div className="col-2">
                                <button className="btn btn-success export-user-btn">Export Data</button>
                            </div>
                        </div> 

                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-between align-items-center searchTableBox">
                                            <div className="col-md-4">
                                                <label>Show 
                                                    <select id="pageLimit" onChange={ this.handleChange }>
                                                        <option id="option1" value="10" selected="selected">10</option>
                                                        <option id="option2" value="25">25</option>
                                                        <option id="option3" value="50">50</option>
                                                        <option id="option4" value="100">100</option>
                                                    </select> 
                                                    <span style={{marginLeft: "5px"}}>{ entries }</span>
                                                </label>
                                            </div>
                                            <div className="col-md-2">
                                                <select id="selectValue" onChange={()=>{this.handleSubmit(pageNo, sortByAttribute, limit, this.state.cityId)}} className="form-control">
                                                    <option value="all">Select all</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4 text-right">
                                                <label>Search: <input type="text" className="" id="searchKey" placeholder=""/></label>
                                                <button className="btn btn-success" onClick={()=>this.handleSubmit(pageNo, sortByAttribute, limit, this.state.cityId)}>Search</button>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <label>Select country</label>
                                                <select id="countryCode" className='form-control' onChange={this.handleDropdown}>
                                                    <option id="0" value="0">Select one</option>
                                                    { countryOptions }
                                                </select> 
                                            </div>
                                            <div className='col-md-4'>
                                                <label>Select state</label>
                                                <select id="stateCode" className='form-control' onChange={this.handleDropdown}>
                                                    { stateOptions }
                                                </select> 
                                            </div>
                                            <div className='col-md-4'>
                                                <label>Select city</label>
                                                <select id="cityId" className='form-control' onChange={this.handleDropdown}>
                                                    { cityOptions }
                                                </select> 
                                            </div>
                                        </div>
                                        <p id="gen-message"></p>
                                        <div className="tab-content mt-3">
                                            <div className="tab-pane table-responsive show active" id="buttons-table-preview">
                                                <table id="complex-header-datatable" className="table table-x-scroll dt-responsive nowrap teacher-table">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Name</th>
                                                            <th>Mobile</th>
                                                            {/* <th>Email</th> */}
                                                            <th>Country</th>
                                                            <th>State</th>
                                                            <th>City</th>
                                                            <th>Date</th>
                                                            <th>Stories</th>
                                                            <th>Plan</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
                                                    </tbody>
                                                </table> 
                                               {
                                                   (UserList.length > 0 && length > 1)
                                                    ?
                                                        <div className='d-flex justify-content-between align-items-center showingCount'>
                                                        <div class="dataTables_info">Showing { ((pageNo - 1) * limit) + 1 } to { (entries > (pageNo * limit)) ? (pageNo * limit) : entries } of { entries } entries</div>
                                                        <div className="pagination">
                                                            {
                                                                (pageNo <= 1) ?
                                                            <a className="default-previous">Previous</a>
                                                            :
                                                            <a className="paginate-link" onClick={() => this.handleSubmit(previous, sortByAttribute, limit, this.state.cityId)}>Previous</a>
                                                            }
                                                            
                                                            <a>{pageNo}</a>
                                                            {
                                                                (pageNo >= customLength)
                                                                ?
                                                            <a className="active default-next">Next</a>
                                                            :
                                                            <a className="paginate-link" class="active" onClick={() => this.handleSubmit(next, sortByAttribute, limit, this.state.cityId)}>Next</a>

                                                            }
                                                        </div>
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
export default UserManagement;
