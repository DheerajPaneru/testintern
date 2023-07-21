import React, { Component } from 'react'
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';

import $ from 'jquery';
import { getAccessToken  } from '../../hooks/AccessToken';


export default class CMSManagement extends Component {
    state = {
        ERROR: true,
        parentCms:[],
        pageName:'',
        childCmsId:'',
        isAdd:true,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 


/*---------------------------------------- delete faqs data -------------------------------- */

deleteFaqs = async (id) => {
    try {
        var result = window.confirm("Are you sure to delete?");
        if(result){
           
        const response = await Axios.delete(Constant.apiBasePath+'deleteCMS/'+ id+'/1');
        let {data} = response;
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
    }
    catch(err) {
        console.log(err);
    }
} 

/*-------------------------------------- end of delete functionality ------------------------------------- */

//----------------------------------Integrate API for update faqs-------------------------------\\


editChildFaqs = async ( event ) => {
    event.preventDefault();
    let token = getAccessToken();
     let pageName = (this.state.pageName === '') ? $('#pageName').val() : this.state.pageName;
     const response = await Axios.put(Constant.apiBasePath+'updateCMS/'+ this.state.childCmsId+'/1',{'pageTitle':pageName}, { headers: { 'token': token }});
     let {data} = response;
     if(data.status === Constant.statusSuccess) {
        window.$('#addEdit').modal('hide');
        this.handleSubmit();
     }
     else {
        $('#pageNameError').text(data.message);
        $('#pageNameError').show();
     }
   
}



/*--------------------------------save parent cms ---------------------------------*/
addChildFaqs = async ( ) => {
    //event.preventDefault();
    let token = getAccessToken();
    let pageName = $('#pageName').val();

    if(pageName === ''){
        $('#pageNameError').text("pageName is required");
        $('#pageNameError').show();
        return false;
    }
    else if(pageName.length > 30){
        $('#pageNameError').text("pageName less then equal to 30 characters");
        $('#pageNameError').show();
        return false;
    }
    else{
        $('#pageNameError').hide();
    }
   
     const response = await Axios.post(Constant.apiBasePath+'createCMS/1',{'pageTitle':this.state.pageName}, { headers: { 'token': token }});
     let {data} = response;
     console.log(data);
     if(data.status === Constant.statusSuccess) {
        window.$('#addEdit').modal('hide');
         this.handleSubmit();
     }
     else {
        $('#pageNameError').text(data.message);
        $('#pageNameError').show();
        
     }
   
}

/*-------------------------------- end of parent cms ----------------------------------------*/
//----------------------------------Integrate show faqs API----------------------------------\\

handleSubmit = async event => {
    try {
        let token = getAccessToken();
        let req = {
            'method': 'GET',
            'url': Constant.apiBasePath + 'getCMS/1',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
            },
            json: true
        }
        Axios(req).then(response => {
            const {data} = response.data;
            this.setState({parentCms: data, ERROR: false});
        }).catch(error => {
            alert(error.message);
        });
    }
    catch(err) {
        console.log(err);
    }
}


//----------------------------------Integrate API for update faqs-------------------------------\\
viewCms = async event => {
    try {
        this.props.history.push('/view-cms/'+ event); 
    }
    catch(err) {
        console.log(err);
    }
}


editFaqsData = async ele => {

    this.setState({'isAdd':false});
    this.setState({'childCmsId':ele});
    let pageName = $('#editfaqs_'+ele).attr('data-pageTitle');
    $('.modal-title').text("Update");
    $('#pageName').val(pageName);
    $('#btn_save').text("Update");
    window.$('#addEdit').modal('show');
}

addNewPage = async ele => {
    $("#language option:first").prop('selected',true);
   
    this.setState({'isAdd':true});
    this.setState({'childFaqsId':ele});
    $('.modal-title').text("Add New Page");
    $('#pageName').val('');
    $('#btn_save').text("save");
    window.$('#addEdit').modal('show');
}
//----------------------------------Integrate show faqs API----------------------------------\\


//--------------------------------------------Reload component----------------------------------------------//    
componentDidMount() {
    this.handleSubmit(this.state.defaultPageNo);
}

//-------------------------------------------End API-------------------------------------------------------\\     

render() {
const {parentCms, isAdd} = this.state;

    let bodyData = '';

    if(parentCms.length > 0) {
        bodyData = parentCms.map( (data, index ) => {
           
            
            return <tr key={index+1}>
                <td>{index+1}</td>
                <td style={{maxWidth: 200, margin: 'auto'}}>{data.pageTitle}</td>
                <td>
                    <button className="btn btn-info teacher-btn edit-faqs" id={'editfaqs_'+data._id} data-pageTitle={data.pageTitle} onClick={() => {this.editFaqsData(data._id)}} style={{marginRight:5}}>
                    <i className="fa fa-edit" title='Update Parent cms'></i></button>
                    <button className="btn btn-danger teacher-btn delete-faqs" onClick={() => {this.deleteFaqs(data._id)}}>
                    <i className="fa fa-trash"></i></button>
                    <button className="btn btn-primary teacher-btn view-faqs" onClick={() => {this.viewCms(data._id)}}>
                    <i className="fa fa-eye"></i></button>
                </td>
           </tr>
        })
    }

    
        return (
                <div className="content-page teacher-management-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-10">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">CMS Management</h4>
                                    <p id="gen-message"></p>
                                </div>
                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-info mb-2 mr-2 float-right add-btn" onClick={ () => this.addNewPage()}>
                                Add New Page</button>
                            </div>
                        </div> 
                       
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
                                                            <th>Page name</th>
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

                    <div className="modal" id="addEdit">
                        <div className="modal-dialog">
                          <div className="modal-content">
                           <div className="modal-header">
                              <h4 className="modal-title">Add</h4>
                            </div>
                            <div className="modal-body">
                            <form id="faqsSave" onSubmit={ this.editChildFaqs} >
                                 <div className="row">
                                     <div className="col-md-12">
                                         <div className="form-group mb-3">
                                             <label htmlFor="update" className="update">Page Name *</label>
                                                 <input type="text" id="pageName" className="form-control" onChange={this.handleChange} 
                                                        defaultValue=""/>   
                                                        <span id="pageNameError" style={{display:'none',color:'red'}}></span>      
                                         </div> 
                
                                         <div className="form-group">
                                             {(isAdd === true) ? <button type="button" className="btn btn-info" id="btn_save" onClick={ () => this.addChildFaqs()}>sdsd</button>
                                              : <button type="submit" className="btn btn-info" id="btn_save">sdsd</button>
                                              }
                                        
                                             </div>
                                         </div>
                                     </div>
                                     
                               </form>
                             </div>
                           </div>
                         </div>
                       </div>
                </div>
        )
    }  
}
