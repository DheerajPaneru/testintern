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
        pageNo: '',
        defaultPageNo: 1,
        searchKey: '',
        sortByAttribute: 1,
        actionId: 0,
        standard: 0,
        id: '',
        modalNumber: 1,
        previousStandard: 0,
        previousStatus: 0,
        reason: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

//----------------------------------Change status-----------------------------------------------\\

changeStatus = async (event) => {
    try {
        event.preventDefault();
        let token = getAccessToken();
        let id = this.state.id;
        let actionId = this.state.actionId;
        let standard = this.state.standard;
        let modalNumber = this.state.modalNumber;
        let metaData = {
            'id': id,
            'status': actionId,
            'standard': standard,
            'type': modalNumber,
            'reason': this.state.reason
        }
       
        const response = await Axios.patch(Constant.apiBasePath+'poem/changeStatus/'+ id, metaData, { headers: { 'token': token }});
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

makeFeature = async (event, status) => {
    try {
        let token = getAccessToken();
        let metaData = { 'feature': (status) ? 0 : 1 };
       
        const response = await Axios.patch(Constant.apiBasePath + 'poem/changeStatus/'+ event, metaData, { headers: { 'token': token }});
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

//------------------------------------Integrate API for remove banner-------------------------------//

delete = async event => {
    try {
        let token = getAccessToken();
        const response = await Axios.delete(Constant.apiBasePath+'poem/' + event, { headers: { 'token': token }});
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

update = async event => {
    try {
        this.props.history.push('/update-poem/'+ event); 
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
        let searchKey = $("#searchKey").val();
        let sortByAttribute = this.state.sortByAttribute;
        if(sort) {
            this.setState({'sortByAttribute': sort});
            sortByAttribute = sort;
        }
        const response = await Axios.post(Constant.apiBasePath + 'poem/get-all', {'key': selectValue, 'pageNo': event, 'searchKey': searchKey, 'sortByAttribute': sortByAttribute}, { headers: { 'token': token }});
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

openModal = (id, modalNumber, status, standard) => {
    this.setState({ 'id': id, 'modalNumber': modalNumber, 'previousStatus': status, 'previousStandard': standard });
    window.$("#myModal").modal("show");
}

//-------------------------------------------End API-------------------------------------------------------\\     

render() {
    const {DataList, length, pageNo, modalNumber, previousStatus, previousStandard } = this.state;
    let i = (pageNo - 1) * Constant.perPage;
    
    let bodyData = '';
    if(DataList.length > 0) {
        bodyData = DataList.map(el => {
            i++;
            let status = "Pending";
            let standard = "Pending";
            let buttonClass = 'btn btn-warning tblbtns';
            let standardButtonClass = 'btn btn-warning tblbtns';

            if(el.status === 1) {
                status = "Approved";
                buttonClass = 'btn btn-success tblbtns';
            } 

            else if(el.status === 2) {
                status = 'Rejected';
                buttonClass = 'btn btn-danger tblbtns';
            }

            if(el.standard === 1) {
                standard = "Freemium";
                standardButtonClass = 'btn btn-primary tblbtns';
            }
            if(el.standard === 2) {
                standard = 'Premium';
                standardButtonClass = 'btn btn-success tblbtns';
            }

            let filmURL = '#';
            if(el.userId) {
                filmURL = '/add-movies?userId=' + el.userId
            }

            let feature = "Feature";
            if(el.feature === 0) {
                feature = "UnFeature";
            }
            
            return <tr><td>{i}</td><td className='namecol'>{el.name}</td><td className='namecol'>{el.description}</td><td><img src={el.thumbnail} alt="ind" style={{width:50,height:50}} key={el._id} resizemode="contain"/></td><td>{el.createdAt}</td><td><button className={buttonClass} onClick = {()=>{this.openModal(el._id, 1, el.status, el.standard)}}>{status}</button></td>
            <td><button className={ standardButtonClass } onClick = {()=>{this.openModal(el._id, 2, el.status, el.standard)}}>{standard}</button></td>
            <td>
                <button className="btn btn-info tblbtns" onClick = {()=>{this.makeFeature(el._id, el.feature)}}>{feature}</button>                 
            </td>
            <td><Link to={filmURL}><button className='btn btn-primary tblbtns'>Film</button></Link></td>
            <td><button className="btn btn-danger Banner-btn updatebtns" onClick={() => {if(window.confirm('Delete the poem?'))
            {this.delete(el._id)}}}><i className="mdi mdi-delete" title='Delete Poem'></i></button>
             <button className="btn btn-info Banner-btn edit-banner ml5 updatebtns" onClick={() => {this.update(el._id)}}>
            <i className="mdi mdi-square-edit-outline" title='Update Story'></i></button>
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

        let modalBody = '';
        let actionOptions = [];

        for(let i = 0; i < 3; i++) {
            if(modalNumber === 1) {
                actionOptions = <><option value="0" selected>Select one</option><option value="1">Approved</option><option value="2">Rejected</option></>
                if(previousStatus === 1) {
                    actionOptions = <><option value="0">Select one</option><option value="1" selected>Approved</option><option value="2">Rejected</option></>
                }
                else if(previousStatus === 2) {
                    actionOptions = <><option value="0">Select one</option><option value="1">Approved</option><option value="2" selected>Rejected</option></>
                }
            }
            else{
                actionOptions = <><option value="0" selected>Select one</option><option value="1">Freemium</option><option value="2">Premium</option></>
                if(previousStandard === 1) {
                    actionOptions = <><option value="0">Select one</option><option value="1" selected>Freemium</option><option value="2">Premium</option></>
                }
                else if(previousStandard === 2) {
                    actionOptions = <><option value="0">Select one</option><option value="1">Freemium</option><option value="2" selected>Premium</option></>
                }
            }
        }

        if(modalNumber === 1) {
            modalBody = <div className="form-group mb-3 hide-language-section">
                            <label htmlFor="update" className="update">Select one:</label>
                            <select className="form-control" id="actionId" onChange={ this.handleChange }>
                                { actionOptions }
                            </select>
                        </div>
        }

        else if(modalNumber === 2) {
            modalBody = <div className="form-group mb-3 hide-language-section">
                <label htmlFor="update" className="update">Select Standard:</label>
                <select className="form-control" id="standard" onChange={ this.handleChange }>
                    { actionOptions }
                </select>
            </div>
        }
   
        $(".export-content-btn").on("click", async () => {
            try {
                let token = getAccessToken();
                var {data} = await Axios.post(Constant.apiBasePath + 'poem/get-all', { 'exportData': 1 }, { headers: { token: token }});
                if(data.status === Constant.statusSuccess) {
                    var csvString = data.data;
                    var universalBOM = "\uFEFF";
                    var a = window.document.createElement('a');
                    a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString));
                    a.setAttribute('download', 'poems.csv');
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


        return (
                <div className="content-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">Poem Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/create-poem"><button type="button" className="btn btn-info mb-2 mr-2 float-right">
                                    Add New Poem</button></Link>
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
                                                    <option value="0">Pending</option>
                                                    <option value="1">Approved</option>
                                                    <option value="2">Rejected</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <p id="gen-message"></p>
                                            </div>
                                            <div className="col-6 text-right">
                                                <button className="btn btn-success export-content-btn">Export Data</button>
                                            </div>
                                        </div>

                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                            <table id="complex-header-datatable" className="table dt-responsive nowrap">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th style={{width:'20%'}}>Name</th>
                                                            <th style={{width:'20%'}}>Description</th>
                                                            <th>Thumbnail</th>
                                                            <th>Created At</th>
                                                            <th>Approved/Rejected</th>
                                                            <th>Freemium/Premium</th>
                                                            <th>Feature</th>
                                                            <th>Film</th>
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

                    {/** start modal */}

                    <div class="modal" id="myModal">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Poem Model</h4>
                                    <p id="popup-message"></p>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <form onSubmit={this.changeStatus}>

                                    <div class="modal-body">
                                        { modalBody }
                                        {
                                            (this.state.actionId === "2")
                                            ?
                                                <div className="form-group mb-3 hide-language-section">
                                                    <label htmlFor="update" className="update">Reason of rejection *</label>
                                                    <input type="text" id="reason" className="form-control" onChange={this.handleChange}/>         
                                                </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div class="modal-footer">
                                        <p id="general-msg"></p>
                                        <button type="submit" class="btn btn-info">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    { /** end modal */}
                </div>
        )
    }    
        
}
export default DataManagement;
