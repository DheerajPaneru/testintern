import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';
import $ from 'jquery';
import Constant from '../Constant';


class AddFaqs extends Component {
    constructor(props) {
    super(props);
    this.state = {
        question: '',
        answer: '',
        FaqsData: {},
        ERROR: true,
        Message:"rerer",
        formStatus:true,
        isShowMessage:false
    }
}

    handleChange = (e) => {
        console.log(e.target.id);
        this.setState({
            [e.target.id]: e.target.value
        })
    };  

 
/*.................. Integrate API for update banner...............................................*/

    handleSubmit = async event => {
        try{
            event.preventDefault();
             
            let id = this.props.match.params.id;
            
            if(id === undefined) {

                /*------------ validation --------------- */

                if(this.state.question === ''){
                    $('#titleError').show();
                    $('#titleError').text('question is required');
                    return false;
                }else{
                    $('#titleError').hide();
                    $('#titleError').text('');
                }
                if(this.state.answer === ''){
                    $('#descriptionError').show();
                    $('#descriptionError').text('answer is required');
                    return false;
                }else{
                    $('#descriptionError').hide();
                    $('#descriptionError').text('');
                }
               
                let metaData = {
                    question: this.state.question,
                    answer: this.state.answer
                } 

                Axios.post(Constant.apiBasePath + 'saveFaqs', metaData).then(response => {
                const getResults = response.data.message;
                
                    if(response.data.status === Constant.statusSuccess) {
                        $('.alert').removeClass('d-none');
                        $('.alert').addClass('alert-success');
                        $('#ErrorMessage').text(getResults);
                        setTimeout(() => window.location.reload(), 3000);
                    }
    
                    else {
                        $('.alert').removeClass('d-none');
                        $('.alert').addClass('alert-danger');
                        $('#ErrorMessage').text(getResults);
                    }
    
                }).catch( error => { 
                        $('.alert').removeClass('d-none');
                        $('.alert').addClass('alert-danger');
                        $('#ErrorMessage').text("somthing wents wrong");
                })
            }

            else {
                let FaqsData = this.state.FaqsData;
                let finalQuestion = (this.state.question) ? this.state.question : FaqsData.question;
                let finalAnswer = (this.state.answer) ? this.state.answer  :  FaqsData.answer;
                Axios.put(Constant.apiBasePath+'editFaqs/' + id, {'question': finalQuestion,'answer':finalAnswer,'updateType':1 }).then(response => {
                const getResults = response.data.message;

                if(response.data.status === Constant.statusSuccess) {
                    $('.alert').removeClass('d-none');
                        $('.alert').addClass('alert-success');
                        $('#ErrorMessage').text(getResults);
                        const { history } = this.props;
                        setTimeout(function () {
                          history.push('/faqs-management');
                          }, 500);
                          
                   //
                }
                else {
                    $('.alert').removeClass('d-none');
                    $('.alert').addClass('alert-danger');
                    $('#ErrorMessage').text(getResults);
                   
                }
                });
            }

        }
        catch(err) {
            console.log(err);
        }       
    }


    getFaqs(id){
        Axios.post(Constant.apiBasePath + 'getAllFaqs',{'pageNo': 1,'id':id}).then(response => {
            const {data} = response;
           // console.log(data.data[0]);
            if (data.status === Constant.statusSuccess) {
                this.setState({ FaqsData: data.data[0], question:data.data[0].question ,answer:data.data[0].answer , ERROR: false });
            }
            else {
                this.setState({ FaqsData: '', ERROR: false });
            }
        }).catch(error => ('Something Error'));

    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id !== undefined) {
            this.getFaqs(id);
        }
    }
    

/*.................................end API .................................................................*/

    render() {
        const { FaqsData } = this.state;
        let question = '';
        let answer = '';
        let btnVal = 'Add';
        let heading = 'Add Faqs';
        
        if(FaqsData.question !== undefined) {
            question = FaqsData.question;
            answer = FaqsData.answer;
            btnVal = 'Update';
            heading = 'Update Faqs';
        }


        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/faqs-management">Faqs Management</Link></li>
                                            <li className="breadcrumb-item active">{heading}</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">{heading}</h4>
                                </div>
                            </div>
                        </div>   
                       
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="alert d-none">
                                         <span id="ErrorMessage"></span>
                                    </div>
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Question *</label>
                                                            <input type="text" id="question" className="form-control" onChange={this.handleChange} 
                                                                   defaultValue={question}/>   
                                                                   <span id="titleError" style={{display:'none',color:'red'}}></span>      
                                                    </div> 
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Answer *</label>
                                                            <textarea type="text" id="answer" className="form-control" onChange={this.handleChange} 
                                                                   defaultValue={answer} rows="5" cols="50"/> 
                                                              <span id="descriptionError" style={{display:'none',color:'red'}}></span>  
                                                    </div> 
                                                    
                                                    <div className="form-group">
                                                       <button type="submit" className="btn btn-info">{btnVal}</button> 
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default AddFaqs;