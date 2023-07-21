import React, { Component } from 'react'
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';

import $ from 'jquery';
import {Link} from 'react-router-dom';

 class Faqs extends Component {
    state = {
        ERROR: true,
        Faqs: [],
        sortByDate: '',
        pageNo: '',
        length: '',
        defaultPageNo: 1,
        currentPage:1,
        nextPage:2,
        prevPage:1,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 

//----------------------------------Change faqs status-----------------------------------------------\\

isActivate = async (id, isActivate) => {
    try {
        console.log(id, isActivate);
        const response = await Axios.put(Constant.apiBasePath+'editFaqs/'+ id, {isActive: isActivate,type:2});
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.pageNo);
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

/*---------------------------------------- delete faqs data -------------------------------- */
deleteFaqs = async (id) => {
    try {
        var result = window.confirm("Are you sure to delete?");
        if(result){
           
        const response = await Axios.put(Constant.apiBasePath+'deleteFaqs/'+ id+'/2');
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.state.pageNo);
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }
        else {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'red');
            setTimeout(function() { $("#gen-message").text(''); }, 3000);
        }  
    }  
    }
    catch(err) {
        console.log(err);
    }
} 

/*-------------------------------------- end of delete ------------------------------------- */

//----------------------------------Integrate API for update faqs-------------------------------\\

viewFaqs = async event => {
    try {
        this.props.history.push('/view-faqs/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}

editFaqs = async event => {
    try {
        this.props.history.push('/edit-faqs/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}


//----------------------------------Integrate show faqs API----------------------------------\\

handleSubmit = async event => {
    try {
        const response = await Axios.post(Constant.apiBasePath + 'getAllFaqs', {'pageNo': event});
        const {data, pageNo, total, curr, next, prev} = response.data;
        this.setState({Faqs: data, nextPage:next,prevPage:prev, currentPage:curr,searchKey: '', ERROR: false});
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
const {Faqs, pageNo, length, nextPage, prevPage,currentPage} = this.state;

    let i = (pageNo - 1) * Constant.perPage;
    let bodyData = '';

    if(Faqs.length > 0) {
        bodyData = Faqs.map( (faqs, index ) => {
            i++;
            let isActivate = "Active";
            if(faqs.isActive === 1) {
                isActivate = "Inactive";
            }
            let status = '';
            if(faqs.isActive === 1) {
                status = 0;
            }else{
                status = 1;
            }
            
            return <tr key={index+1}><td>{index+1}</td><td style={{maxWidth: 200, margin: 'auto'}}>{faqs.question}</td><td  style={{maxWidth: 200, margin: 'auto'}}>{faqs.answer}</td>
                <td><button className="btn btn-info" onClick = {()=>{this.isActivate(faqs._id, status)}}>{isActivate}</button></td>
                <td>
                    <button className="btn btn-info teacher-btn edit-faq" onClick={() => {this.editFaqs(faqs._id)}} style={{marginRight:5}}>
                    <i className="fa fa-edit" title='Update faq'></i></button>
                    <button className="btn btn-danger teacher-btn delete-faqs" onClick={() => {this.deleteFaqs(faqs._id)}}>
                    <i className="fa fa-trash"></i></button>
                    {/* <button className="btn btn-primary teacher-btn view-faqs" onClick={() => {this.viewFaqs(faqs._id)}}>
                    <i className="fa fa-eye"></i></button> */}
                </td>
                </tr>
        })
    }

    
        return (
                <div className="content-page teacher-management-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-6">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">FAQ's Management</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <Link to="/add-faqs"><button type="button" className="btn btn-info mb-2 mr-2 float-right add-btn">
                                Add new FAQ</button></Link>
                            </div>
                        </div>  
                        <p id="gen-message"></p>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        {/*  <!-- end nav--> */}
                                        <div className="row">
                                            <div className="col-md-2">
                                            </div>
                                        </div>

                                        <div className="tab-content">
                                            <div className="tab-pane show active" id="buttons-table-preview">
                                                <table id="complex-header-datatable" className="table dt-responsive nowrap teacher-table table-bordered">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Question</th>
                                                            <th>Answer</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
                                                    </tbody>
                                                </table> 
                                                <div className="pagination">
                                                    <a className="paginate-link" onClick={() => this.handleSubmit(prevPage)}>Previous</a>
                                                    <a className="paginate-link active" onClick={() => this.handleSubmit(nextPage)}>Next</a>   
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

export default Faqs;