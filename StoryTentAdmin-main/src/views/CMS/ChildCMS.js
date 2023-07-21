import React, { Component } from 'react'
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';
import {Link} from 'react-router-dom';
import $ from 'jquery';

    class ChildCMS extends Component {
        state = { 
            ERROR: true,
            parentCms:[],
            pageName:'',
            ChildCMSId:'',
            parentCmsId:'',
            isAdd:true, 
        }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }; 


/*---------------------------------------- delete faqs data -------------------------------- */
deleteContent = async (id) => {
    try {
        var result = window.confirm("Are you sure to delete?");
        if(result){
           
        const response = await Axios.delete(Constant.apiBasePath+'deleteCMS/'+ id+'/2');
        let {data} = response;
        if(data.status === Constant.statusSuccess) {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'green');
            this.handleSubmit(this.props.match.params.id);
        }
        else {
            $('#gen-message').text(data.message);
            $('#gen-message').css('color', 'red');
        }  
    }  
    }
    catch(err) {
        console.log(err);
    }
} 

/*-------------------------------------- end of delete ------------------------------------- */

//----------------------------------Integrate API for update faqs-------------------------------\\


editChildFaqs = async ( event ) => {
    event.preventDefault();
     let pageName = (this.state.pageName === '') ? $('#pageName').val() : this.state.pageName;
     
     const response = await Axios.put(Constant.apiBasePath+'updateCMS/'+ this.state.ChildCMSId+'/2',{'pageTitle':pageName});
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
    if($('#pageName').val() === ''){
        $('#pageNameError').text("pageName required");
        $('#pageNameError').show();
        return false;
    }else{
        $('#pageNameError').hide();
    }
   
     const response = await Axios.post(Constant.apiBasePath+'createCMS/2',{'pageTitle':this.state.pageName});
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
       //   event = (this.state.parentCmsId === '') ? this.setState({parentCmsId:event}) : event;
        const response = await Axios.get(Constant.apiBasePath + 'getChildCMSByParentId/'+event);
        const {data} = response.data;
        this.setState({parentCms: data, ERROR: false,parentCmsId:event});
    }
    catch(err) {
         console.log(err);
    }
}

isActive = async (id, eleStatus) => {
   const response = await Axios.put(Constant.apiBasePath + 'activeDeactive',{id,status:eleStatus,updateType:2});
   const {status, message} = response.data;
   $('#gen-message').text(message);
   $('#gen-message').css('color', 'green');
   this.handleSubmit(this.props.match.params.id);
}


//----------------------------------Integrate API for update faqs-------------------------------\\


editFaqsData = async ele => {

    this.setState({'isAdd':false});
    this.setState({'ChildCMSId':ele});
    let pageName = $('#editfaqs_'+ele).attr('data-pageTitle');
    $('.modal-title').text("Update");
    $('#pageName').val(pageName);
    $('#btn_save').text("Update");
    window.$('#addEdit').modal('show');
}


addCmsDetails = async event => {
    try {
        this.props.history.push('/add-cms/'+ event+'/add'); 
    }
    catch(err) {
        console.log(err);
    }
}

editCmsDetails = async (id) => {
    try {
        let event = this.props.match.params.id;
        this.props.history.push('/edit-cms/'+ event+'/edit/'+id); 
    }
    catch(err) {
        console.log(err);
    }
}
//----------------------------------Integrate show faqs API----------------------------------\\


//--------------------------------------------Reload component----------------------------------------------//    
componentDidMount() {
    let id = this.props.match.params.id;
    if(id !== undefined) {
        this.setState({parentCmsId:id});
        this.handleSubmit(id);
    }
}

//-------------------------------------------End API-------------------------------------------------------\\     

render() {
const {parentCms, isAdd, parentCmsId} = this.state;

    let bodyData = '';

    if(parentCms.length > 0) {
        bodyData = parentCms.map( (data, index ) => {
      
            return <tr key={index+1}>
                <td>{index+1}</td>
                {/* <td><img src={data.image} alt="contentImg" height="150" width="150" /></td> */}
                <td>{data.title}</td>
                <td style={{maxWidth: 200, margin: 'auto'}}>
                    {/* <strong>Page Name : </strong>{data.title}<br /> */}
                    {/* <strong>Description :</strong>{data.content} */}
                    {data.content}
                </td>
                <td className="action-btn">
                {(data.status === 1) ? <button className="btn btn-info mr-2" style={{width:'auto'}} onClick={() => {this.isActive(data._id,0)}}>Active</button> : <button className="btn btn-info mr-2" onClick={() => {this.isActive(data._id,1)}} style={{width:'auto'}}>Inactive</button> }
                    <button className="btn btn-info teacher-btn edit-faqs"  onClick={() => {this.editCmsDetails(data._id)}} style={{marginRight:5}}>
                    <i className="fa fa-edit" title='Update Parent cms'></i></button>
                    <button className="btn btn-danger teacher-btn delete-faqs" onClick={() => {this.deleteContent(data._id)}}>
                    <i className="fa fa-trash"></i></button>
           </td></tr>
        })
    }

    
        return (
                <div className="content-page teacher-management-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-5">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">CMS Detail</h4>
                                </div>
                            </div>
                            <div className="col-7">
                            <button type="button" className="btn btn-info float-right" onClick={ () => this.addCmsDetails(parentCmsId)}>
                                Add Content</button>
                               <div className="page-title-box float-right mr-3 ">
                                     <div className="page-title-left">
                                         <ol className="breadcrumb m-0">
                                             <li className="breadcrumb-item"><Link to="/cms-management">CMS Management</Link></li>
                                             <li className="breadcrumb-item active">CMS Details</li>
                                         </ol>
                                     </div>
                                 </div>
                                 
                             </div>
                        </div> 
                        <div className='row'>
                            <div className="col-5">
                                <p id="gen-message"></p>
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
                                                            <th>Title</th>
                                                            <th>Content</th>
                                                            <th style={{width: 225}}>Action</th>
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

export default ChildCMS;