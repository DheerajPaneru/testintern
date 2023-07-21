import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import Constant from '../Constant';
import { getAccessToken } from '../../hooks/AccessToken';
import $ from 'jquery';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build';

class AddUpdate extends Component {

    state = {
        name: '',
        expiredDate: '',
        description: '',
        fromAge: 0,
        toAge: 0,
        planType: 1,
        readStoryCount: 0,
        writeStoryCount: 0,
        readPoemCount: 0,
        writePoemCount: 0,
        mixCount: 0,
        audioCount: 0,
        videoCount: 0,
        rechargeType: '',
        ShowData: {},
        ERROR: true
    }
    

/*..................................... default Topic object ............................................*/

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

/*.................. Integrate API for add and update Topic...............................................*/

    handleSubmit = async event => {
        try {
            event.preventDefault();
            let token = getAccessToken();
            let id = this.props.match.params.id;
            let amount = this.state.amount;
            let fromAge = this.state.fromAge;
            let expiredDate = this.state.expiredDate;

            let name = this.state.name;
            let toAge = this.state.toAge;
            let planType = this.state.planType;
            let description = this.state.description;
            let readStoryCount = this.state.readStoryCount;
            let writeStoryCount = this.state.writeStoryCount;
            let readPoemCount = this.state.readPoemCount;
            let writePoemCount = this.state.writePoemCount;
            let audioCount = this.state.audioCount;
            let videoCount = this.state.videoCount;
            let mixCount = this.state.mixCount;
            let rechargeType = this.state.rechargeType;

            if(id === undefined) {        
                let metaData = {
                    amount: amount,
                    expiredDate: expiredDate,
                    name: name,
                    fromAge: fromAge,
                    toAge: toAge,
                    description: description,
                    planType: planType,
                    readStoryCount: readStoryCount,
                    writeStoryCount: writeStoryCount,
                    readPoemCount: readPoemCount,
                    writePoemCount: writePoemCount,
                    mixCount: mixCount,
                    audioCount: audioCount,
                    videoCount: videoCount,
                    rechargeType: rechargeType
                } 
                
                Axios.post(Constant.apiBasePath + 'enrollment/create', metaData, { headers: { 'token': token }}).then(response => {
                const getResults = response.data.message;
                
                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        window.location.reload();
                    }

                    else {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'red');
                        return false;
                    }

                });
            }

            else {
                let {ShowData} = this.state;
                let metaData = {
                    amount:  (amount) ? amount : ShowData.amount,
                    fromAge:  (fromAge) ? fromAge : ShowData.fromAge,
                    toAge: (toAge) ? toAge : ShowData.toAge,
                    expiredDate: (expiredDate) ? expiredDate : ShowData.expiredDate,
                    name: (name) ? name : ShowData.name,
                    description: (description) ? description : ShowData.description,
                    planType: (planType) ? planType : ShowData.planType,
                    readStoryCount: (readStoryCount) ? readStoryCount : ShowData.readStoryCount,
                    writeStoryCount: (writeStoryCount) ? writeStoryCount : ShowData.writeStoryCount,
                    readPoemCount: (readPoemCount) ? readPoemCount : ShowData.readPoemCount,
                    writePoemCount: (writePoemCount) ? writePoemCount : ShowData.writePoemCount,
                    audioCount: (audioCount) ? audioCount : ShowData.audioCount,
                    videoCount: (videoCount) ? videoCount : ShowData.videoCount,
                    mixCount: (mixCount) ? mixCount : ShowData.mixCount,
                    rechargeType: (rechargeType) ? rechargeType : ShowData.rechargeType
                }

                Axios.patch(Constant.apiBasePath + 'enrollment/edit/' + id, metaData, { headers: { 'token': token }}).then(response => {
                const getResults = response.data.message;
                
                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        window.scrollTo(0, 0);
                        setTimeout(function() { window.location.href = '/membership-plan'; }, 3000 );
                    }

                    else {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'red');
                        return false;
                    }

                });
            }
        }
        catch(err) {
            console.log(err);
        }       
    }

    searchShowData(id) {
        let token = getAccessToken();
        Axios.get(Constant.apiBasePath + 'enrollment/getDataById/' + id, { headers: { 'token': token }}).then(response => {
            let data = {};
            let subjectIds = [];
            if(response.data.status === Constant.statusSuccess) {
                data = response.data.data[0];
            }
            this.setState({ ShowData: data, ERROR: false });
        })
    }

/*---------------------------Get Resource data by Id------------------------------------------ */

    componentDidMount() {
        let id = this.props.match.params.id;

        if(id !== undefined){
            this.searchShowData(id);
        }
    }

    
/*.................................end API .................................................................*/

    render() {
        const { ShowData } = this.state;

        let name = '';
        let amount = '';
        let fromAge = '';
        let toAge = '';
        let planType = '';
        let description = '';
        let readStoryCount = '';
        let writeStoryCount = '';
        let readPoemCount = '';
        let writePoemCount = '';
        let audioCount = '';
        let videoCount = '';
        let mixCount = '';
        let rechargeType = '';
        let expiredDate = '';

        let btnVal = 'Add';
        let heading = 'Add Plan';

        let rechargeTypeOptions = [
            <option id="audio" value="audio">Audio</option>,
            <option id="video" value="video">Video</option>
        ];
        
        let planOptions = [
            <option id="1" value="1">Topup</option>,
            <option id="2" value="2">Monthly</option>,
            <option id="3" value="3">Quarterly</option>,
            <option id="4" value="4">Half yearly</option>,
            <option id="5" value="5">Yearly</option>
        ];

        if(ShowData.amount !== undefined) {
            amount = ShowData.amount;
            fromAge = ShowData.fromAge;
            name = ShowData.name;
            toAge = ShowData.toAge;
            planType = ShowData.planType;
            description = ShowData.description;

            readStoryCount = ShowData.readStoryCount;
            writeStoryCount = ShowData.writeStoryCount;
            readPoemCount = ShowData.readPoemCount;
            writePoemCount = ShowData.writePoemCount;
            audioCount = ShowData.audioCount;
            videoCount = ShowData.videoCount;
            mixCount = ShowData.mixCount;
            rechargeType = ShowData.rechargeType;
            expiredDate = ShowData.expiredDate;

            btnVal = 'Update';
            heading = 'Update Plan';

            if(rechargeType === 'audio') {
                rechargeTypeOptions = 
                [
                    <option id="audio" value="audio" selected="selected">Audio</option>,
                    <option id="video" value="video">Video</option>
                ];
            }

            else if(rechargeType == 'video') {
                rechargeTypeOptions = [
                    <option id="audio" value="audio">Audio</option>,
                    <option id="video" value="video" selected="selected">Video</option>
                ];
            }
            
            if(planType === 1) {
                planOptions = [
                    <option id="1" value="1" selected="selected">Topup</option>,
                    <option id="2" value="2">Monthly</option>,
                    <option id="3" value="3">Quarterly</option>,
                    <option id="4" value="4">Half yearly</option>,
                    <option id="5" value="5">Yearly</option>
                ];
            }

            else if(planType === 2) {
                planOptions = [
                    <option id="1" value="1">Topup</option>,
                    <option id="2" value="2" selected="selected">Monthly</option>,
                    <option id="3" value="3">Quarterly</option>,
                    <option id="4" value="4">Half yearly</option>,
                    <option id="5" value="5">Yearly</option>
                ];
            }

            if(planType === 3) {
                planOptions = [
                    <option id="1" value="1">Topup</option>,
                    <option id="2" value="2">Monthly</option>,
                    <option id="3" value="3" selected="selected">Quarterly</option>,
                    <option id="4" value="4">Half yearly</option>,
                    <option id="5" value="5">Yearly</option>
                ];
            }

            else if(planType === 4) {
                planOptions = [
                    <option id="1" value="1">Topup</option>,
                    <option id="2" value="2">Monthly</option>,
                    <option id="3" value="3">Quarterly</option>,
                    <option id="4" value="4" selected="selected">Half yearly</option>,
                    <option id="5" value="5">Yearly</option>
                ];
            }

            if(planType === 5) {
                planOptions = [
                    <option id="1" value="1">Topup</option>,
                    <option id="2" value="2">Monthly</option>,
                    <option id="3" value="3">Quarterly</option>,
                    <option id="4" value="4">Half yearly</option>,
                    <option id="5" value="5" selected="selected">Yearly</option>
                ];
            }
        }

        
        return (
                <div className="content-page add-resource-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">{heading}</h4>
                                    <div>
                                        <ol className="breadcrumb m-10">
                                            <li className="breadcrumb-item"><Link to="/membership-plan">Membership Plan</Link></li>
                                            <li className="breadcrumb-item active">{heading}</li>
                                        </ol>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body"> 
                                    <p id="gen-message"></p>
                                        <form onSubmit={this.handleSubmit}>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Name:</label>
                                                        <input type="text" id="name" className="form-control" onChange={this.handleChange} defaultValue={name}/>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Amount *</label>
                                                            <input type="number" id="amount" className="form-control" onChange={this.handleChange} defaultValue={amount}/>         
                                                    </div> 
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className='form-group mb-3'>
                                                    <label>Description *</label>
                                                        <CKEditor
                                                            editor={ ClassicEditor }
                                                            data={ description }
                                                            onChange={ ( event, editor ) => {
                                                                let data = editor.getData();
                                                                this.setState({'description': data });
                                                                // console.log( { event, editor, data } );
                                                            } }
                                                        />  
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">From Age *</label>
                                                            <input type="number" id="fromAge" className="form-control" min={0} onChange={this.handleChange} defaultValue={fromAge}/>         
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">To Age *</label>
                                                            <input type="number" id="toAge" className="form-control" min={0} onChange={this.handleChange} defaultValue={toAge}/>         
                                                    </div> 
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Select Plan Type *</label>
                                                        <select id="planType" className="form-control" onChange={this.handleChange}>
                                                            <option id="0" value="0">Select one</option>
                                                            { planOptions }
                                                        </select>              
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Expiry Date:</label>
                                                        <input type="date" id="expiredDate" className="form-control" onChange={this.handleChange} defaultValue={ expiredDate }/>
                                                    </div> 
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Read Story Count</label>
                                                        <input type="number" id="readStoryCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ readStoryCount }/>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Write Story Count</label>
                                                        <input type="number" id="writeStoryCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ writeStoryCount }/>
                                                    </div> 
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Write Poem Count</label>
                                                        <input type="number" id="writePoemCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ writePoemCount }/>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Read Poem Count</label>
                                                        <input type="number" id="readPoemCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ readPoemCount }/>
                                                    </div> 
                                                </div>
                                            </div>

                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Audio Count</label>
                                                        <input type="number" id="audioCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ audioCount }/>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Video Count</label>
                                                        <input type="number" id="videoCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ videoCount }/>
                                                    </div> 
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Mix Count</label>
                                                        <input type="number" id="mixCount" className="form-control" min={0} onChange={this.handleChange} defaultValue={ mixCount }/>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Select Recharge Type</label>
                                                        <select id="rechargeType" className="form-control" onChange={this.handleChange}>
                                                            <option id="0" value="0">Select one</option>
                                                            { rechargeTypeOptions }
                                                        </select>              
                                                    </div> 
                                                </div>
                                            </div>
                                           
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
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
export default AddUpdate;