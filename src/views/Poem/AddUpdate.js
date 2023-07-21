import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import Constant from '../Constant';
import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import { getCategory, getContest } from '../../service/CommonServices';
import Select from 'react-select';


class AddUpdate extends Component {

/*..................................... default state object ............................................*/
    state = {
        name: '',
        description: '',
        thumbnail: '',
        selectedOption: [],
        contestId: '',
        duration: '',
        isAdultContent: false,
        document: [],
        GetData: {},
        categoryList: [],
        contestList: [],
        ERROR: true
    }

    handleChange = (e) => {
        if(e.target.id === 'isAdultContent') {
            this.setState({
                [e.target.id]: e.target.checked
            })
        }
        else {
            this.setState({
                [e.target.id]: e.target.value
            });
        }
    };

    handleMultiSelect = selectedOption => {
        this.setState({ selectedOption: selectedOption });
    };

    uploadThumbnail = async (e) => {
        let file = e.target.files[0];
        if(file) {
            let token = localStorage.getItem('loginDetails');
            let formData = new FormData();
            formData.append('poem', file, file.name);
            let { data } = await Axios.post(Constant.apiBasePath + 'poem/uploadFileOnS3', formData, { headers: { 'token': token }});
            if(data.status === Constant.statusSuccess) {
                this.setState({ 'thumbnail': data.location });
            }
            else {
                alert(data.message);
                return false;
            }
        }
        else{
            $('#thumbnailRequired').text('Thumbnail is required');
            setTimeout(function() { $('#thumbnailRequired').text(''); }, 3000);
        }
    }

    uploadDocument = async (e) => {
        let file = e.target.files[0];
        if(file) {
            let token = localStorage.getItem('loginDetails');
            let formData = new FormData();
            formData.append('poemDocument', file, file.name);
            let { data } = await Axios.post(Constant.apiBasePath + 'poem/uploadFileInArray', formData, { headers: { 'token': token }});
            if(data.status === Constant.statusSuccess) {
                this.setState({ 'document': data.documents });
            }
            else {
                alert(data.message);
                return false;
            }
        }
    }

    //----------------------------------Change status-----------------------------------------------\\

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            let token = getAccessToken();
            let id = this.props.match.params.id;
            let categoryId = [];

            if(this.state.selectedOption.length > 0) {
                categoryId = this.state.selectedOption.map(el => {
                    return el.value;
                });
            }

            if(id === undefined) {
                let metaData = {
                    'name': this.state.name,
                    'description': this.state.description,
                    'thumbnail': this.state.thumbnail,
                    'categoryId': categoryId,
                    'contestId': this.state.contestId,
                    'document': this.state.document,
                    'duration': this.state.duration,
                    'isAdultContent': this.state.isAdultContent
                }
            
                const response = await Axios.post(Constant.apiBasePath+'poem/create', metaData, { headers: { 'token': token }});
                let {data} = response;
                if(data.status === Constant.statusSuccess) {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'green');
                    setTimeout(function() { window.location.href = '/poem-management'; }, 2000 );
                }
                else {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'red');
                }
            }
            else{
                let getData = this.state.GetData;
                let metaData = {
                    'id': id,
                    'name': (this.state.name) ? this.state.name : getData.name,
                    'description': (this.state.description) ? this.state.description : getData.description,
                    'thumbnail': (this.state.thumbnail) ? this.state.thumbnail : getData.thumbnail,
                    'categoryId': (categoryId) ? categoryId : getData.categoryId,
                    'contestId': (this.state.contestId) ? this.state.contestId : getData.contestId,
                    'document': (this.state.document) ? this.state.document : getData.document,
                    'duration': (this.state.duration) ? this.state.duration : getData.duration,
                    'isAdultContent': (this.state.isAdultContent) ? this.state.isAdultContent: getData.isAdultContent
                }
            
                const response = await Axios.post(Constant.apiBasePath+'poem/create', metaData, { headers: { 'token': token }});
                let {data} = response;
                if(data.status === Constant.statusSuccess) {
                    $('#gen-message').text(data.message);
                    $('#gen-message').css('color', 'green');
                    setTimeout(function() { window.location.href = '/poem-management'; }, 2000 );
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

    
    // get data by id

    async getDataById(id) {
        let token = localStorage.getItem('loginDetails');

        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'poem/getDataById/' + id,
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token
                
            },
            json: true
        }

        Axios(req).then(response => {
            const {data} = response;
            if (data.status === Constant.statusSuccess) {
                let getData = data.data[0];
                let categoryIds = getData.categoryId;
                let selectedOption = [];

                selectedOption = categoryIds.map(el => {
                    let category = this.state.categoryList.find(element => { return (element._id === el)});
                    if(category) {
                        return { value: category._id, label: category.name };
                    }
                    else{
                        return null;
                    }
                });

                var filtered = selectedOption.filter(function (el) {
                    return el != null;
                });

                this.setState({ GetData: getData, selectedOption: filtered, ERROR: false });
            }
            else {
                $('#gen-message').text(data.message);
                $('#gen-message').css('color', 'red');
            }
        }).catch(error => ('Something Error'));

    }


/*---------------------------Reload function------------------------------------------ */

    componentDidMount() {    
    
        // get category and contest

        getCategory().then(data => {
            this.setState({ 'categoryList': data });
        });

        getContest().then(data => {
            this.setState({ 'contestList': data });
        });

        // get data by id
        if(this.props.match.params.id) {
            this.getDataById(this.props.match.params.id);
        }
    }

/*.................................end API .................................................................*/

    render() {
        const { GetData, selectedOption, categoryList, contestList } = this.state;
       
        let name = '';
        let description = '';
        let thumbnail = '';
        let document = [];
        let heading = 'Create Poem';
        let btnVal = 'Upload';
        let contestOptions = [];
        let categoryOptions = [];
        let duration = '';
        let isAdultContent = this.state.isAdultContent;
       
        if(GetData.name != undefined) {
            name = GetData.name;
            description = GetData.description;
            thumbnail = GetData.thumbnail;
            duration = GetData.duration;
            isAdultContent = GetData.isAdultContent;
            heading = 'Update Poem';
            btnVal = 'Update';

            contestOptions = contestList.map(list => {
                if(list._id === GetData.contestId) {
                    return <option id={list._id} value={list._id} selected>{ list.name }</option>
                }
                else {
                    return <option id={list._id} value={list._id}>{ list.name }</option>
                }
            });
            categoryOptions = categoryList.map(list => {
                return {value: list._id, label: list.name }
            });
        }
        else{
            if(contestList.length > 0) {
                contestOptions = contestList.map(list => {
                    return <option id={list._id} value={list._id}>{ list.name }</option>
                });
            }
            if(categoryList.length > 0) {
                categoryOptions = categoryList.map(list => {
                    return {value: list._id, label: list.name }
                });
            }
        }
                
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/poem-management">Poem Management</Link></li>
                                            <li className="breadcrumb-item active">{ heading }</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">{ heading }</h4>
                                </div>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body"> 
                                    <form onSubmit={this.handleSubmit}>
                                        <p id="gen-message"></p>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Name *</label>
                                                    <input type="text" id="name" className="form-control" onChange={this.handleChange} defaultValue={name}/>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Description *</label>
                                                    <textarea id="description" className="form-control" onChange={this.handleChange} defaultValue={description} rows="4" cols="50"/>
                                                </div> 
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Select Categories *</label>
                                                    <Select
                                                    options={categoryOptions}
                                                    isMulti
                                                    name="selectedOption"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={this.handleMultiSelect}
                                                    value={selectedOption}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor='state' className='state'>Select Contest</label>
                                                    <select id="contestId" className='form-control' onChange={this.handleChange}>
                                                        <option value="0" selected>Select one</option>
                                                        { contestOptions }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Upload Thumbnail *</label>
                                                    <input type="file" className='form-control' id="thumbnail" onChange={this.uploadThumbnail}/>
                                                    <p id="thumbnailRequired" className='text-danger'></p>
                                                </div> 
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Upload Document</label>
                                                    <input type="file" className='form-control' id="document" onChange={this.uploadDocument}/>
                                                </div> 
                                            </div>
                                        </div>

                                        <div className='row'>
                                        {
                                            (thumbnail)
                                            ?
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="state" className="state">Thumbnail *</label>
                                                        <img src={thumbnail} alt="Story-Tent" style={{width: 50, height: 50}}/>
                                                    </div> 
                                                </div>
                                            :
                                            null
                                        }
                                            
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Duration *</label>
                                                    <input type="text" id="duration" className="form-control" onChange={this.handleChange} defaultValue={duration}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <div class="checkbox checkboxcreate"><input type="checkbox" name="isAdultContent" class="form-check-input" id="isAdultContent" defaultChecked= { isAdultContent } onChange={this.handleChange}/><label class="form-check-label" for="exampleCheck1">Is this content for above 18?</label></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button type="submit" className="btn btn-info">{ btnVal }</button>       
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