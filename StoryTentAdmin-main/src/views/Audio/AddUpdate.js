import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import Constant from '../Constant';
import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';


class AddUpdate extends Component {

/*..................................... default state object ............................................*/
    state = {
        title: '',
        description: '',
        categoryId: '',
        thumbnail: null,
        audio: null,
        GetData: {},
        CategoryList: [],
        ERROR: true,
        isLoading: false,
        disabled: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleFile = (e) => {
        this.setState({
            [e.target.id]: e.target.files[0]
        });
        
        if(e.target.id === 'audio') {
            let audio = document.createElement('audio');
            let file = e.target.files[0];

            if(e.target.files && file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    audio.src = e.target.result;
                    audio.addEventListener('loadedmetadata', function() {
                        let seconds = audio.duration;
                        let minutes = parseInt(Math.floor(seconds / 60));
                        minutes = (minutes < 10) ? '0' + minutes : minutes;
                        seconds = (seconds - minutes * 60).toFixed(0);
                        seconds = (seconds < 10) ? '0' + seconds : seconds;
                        let duration = minutes + ':' + seconds;
                        $("#duration").val(duration);
                    }, false);
                };

                reader.readAsDataURL(file);
            }
        }
    }


/*.................. Integrate API for add, update data...............................................*/

    handleSubmit = async event => {
        try{
            let token = getAccessToken();
            event.preventDefault();
            let id = this.props.match.params.id;
            let form_data = new FormData();
            let duration = $('#duration').val();

            if (id === undefined) {
                if(this.state.thumbnail === null) {
                    $("#error-thumbnail-msg").text('thumbnail is required');
                    $("#error-thumbnail-msg").css("color", "red");
                    return false;
                }
                else{
                    $("#error-thumbnail-msg").text('');
                }

                if(this.state.audio === null) {
                    $("#error-audio-msg").text('audio is required');
                    $("#error-audio-msg").css("color", "red");
                    return false;
                }
                else{
                    $("#error-audio-msg").text('');
                }
    
                let thumbName = this.state.thumbnail.name;
                let thumb_extension = thumbName.split('.').pop();

                let audioName = this.state.audio.name;
                let audio_extension = audioName.split('.').pop();
    
                if(thumb_extension !== 'jpg' && thumb_extension !== 'png') {
                    $("#error-thumbnail-msg").text('Only jpg and png file type are allow !');
                    $("#error-thumbnail-msg").css("color", "red");
                    return false;
                }

                if(audio_extension !== 'mp3') {
                    $("#error-audio-msg").text('Only mp3 file type is allow !');
                    $("#error-audio-msg").css("color", "red");
                    return false;
                }

                form_data.append('title', this.state.title);
                form_data.append('thumbnail', this.state.thumbnail, this.state.thumbnail.name);
                form_data.append('audio', this.state.audio, this.state.audio.name);
                form_data.append('description', this.state.description);
                form_data.append('categoryId', this.state.categoryId);
                form_data.append('duration', duration);
                
                this.setState({ 'isLoading': true, disabled: true });

                Axios.post(Constant.apiBasePath + 'audio/create', form_data, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    this.setState({ 'isLoading': false, disabled: false });

                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/audio-management'; }, 3000 );
                    }
                    else{
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'red');
                    }
                }).catch(error => {
                    if (error.response === undefined) {
                        $('#gen-message').text('API is not working');
                        $('#gen-message').css('color', 'red');
                        return false;
                    }
                    else{
                        $('#gen-message').text(error.response.data.message);
                        $('#gen-message').css('color', 'red');
                        return false;
                    }
                });
            }
            else {

                let { GetData } = this.state;
                (this.state.title) ? form_data.append('title', this.state.title) : form_data.append('title', GetData.title);
                (this.state.thumbnail) ? form_data.append('thumbnail', this.state.thumbnail, this.state.thumbnail.name) : form_data.append('thumbnail', GetData.thumbnail);
                (this.state.description) ? form_data.append('description', this.state.description) : form_data.append('description', GetData.description);
                (this.state.categoryId) ? form_data.append('categoryId', this.state.categoryId) : form_data.append('categoryId', GetData.categoryId);
                (this.state.audio) ? form_data.append('audio', this.state.audio, this.state.audio.name) : form_data.append('audioURL', GetData.audioURL);
                (duration) ? form_data.append('duration', duration) : form_data.append('duration', GetData.duration);
                form_data.append('shortURLId', GetData.shortURLId);
                
                this.setState({ 'isLoading': true, disabled: true });

                Axios.put(Constant.apiBasePath + 'audio/update/' + id, form_data, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    this.setState({ 'isLoading': false, disabled: false });

                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/audio-management'; }, 3000 );
                    }
                }).catch(error => {
                    if (error.response === undefined) {
                        $('#gen-message').text('API is not working');
                        $('#gen-message').css('color', 'red');
                        return false;
                    }
                    else{
                        $('#gen-message').text(error.response.data.message);
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

    
    // get donation data by id

    async getGetData(id) {
        let token = getAccessToken();

        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'audio/getDataById/' + id,
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
                this.setState({ GetData: data.data[0], ERROR: false });
            }
            else {
                $('#gen-message').text(data.message);
                $('#gen-message').css('color', 'red');
            }
        }).catch(error => ('Something Error'));

    }

    //----------------------------------get category data----------------------------------\\

    async getCategoryData() {
        let token = getAccessToken();

        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'category/getDataForDropdown',
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
                this.setState({ CategoryList: data.data, ERROR: false });
            }
            else {
                $('#gen-message').text(data.message);
                $('#gen-message').css('color', 'red');
            }
        }).catch(error => ('Something Error'));

    }

/*---------------------------Reload function------------------------------------------ */

    componentDidMount() {    
        // get data by id
        if(this.props.match.params.id) {
            this.getGetData(this.props.match.params.id);
        }
        this.getCategoryData();
    }


/*.................................end API .................................................................*/

    render() {
        const { GetData, CategoryList } = this.state;
        let title = '';
        let thumbnail = '';
        let description = '';
        let audioURL = '';

        let btnVal = 'Add';
        let heading = 'Add Audio';
        let categoryOptions = [];
        
        if(GetData.title !== undefined) {
            title = GetData.title;
            thumbnail = GetData.thumbnail;
            description = GetData.description;
            audioURL = GetData.audioURL;

            btnVal = 'Update';
            heading = 'Update Audio';

            if(CategoryList.length > 0) {
                categoryOptions = CategoryList.map(el => {
                    if(el._id === GetData.categoryId) {
                        return <option id={ el._id } value={el._id} selected="selected">{ el.name }</option>
                    }
                    else{
                        return <option id={ el._id } value={el._id}>{ el.name }</option>
                    }
                });
            }
        }
        else{
            if(CategoryList.length > 0) {
                categoryOptions = CategoryList.map(el => {
                    return <option id={ el._id } value={el._id}>{ el.name }</option>
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
                                            <li className="breadcrumb-item"><Link to="/audio-management">Audio Management</Link></li>
                                            <li className="breadcrumb-item active">Add New Audio</li>
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
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Title *</label>
                                                    <input type="text" id="title" className="form-control" onChange={this.handleChange} defaultValue={title}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Description *</label>
                                                    <textarea id="description" rows="4" cols="50" className="form-control" onChange={this.handleChange} defaultValue={description}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Select category *</label>
                                                    <select id="categoryId" className="form-control" onChange={this.handleChange}>
                                                        <option id="0" value="0">Select one</option>
                                                        { categoryOptions }
                                                    </select>
                                                </div>
                                            </div>

                                            {
                                                (!thumbnail == '')
                                                ?
                                                    <>
                                                        <div className="col-md-5">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state">Upload thumbnail *</label>
                                                                <input type="file" id="thumbnail" className="form-control" accept="image/*"  onChange={this.handleFile}/>
                                                                <p id="error-thumbnail-msg"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-1">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state"></label>
                                                                <img src={thumbnail} className="form-control" alt="StoryTent" style={{ width: 50, height: 50 }}/>
                                                            </div>
                                                        </div>
                                                    </>
                                            :
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label htmlFor="state" className="state">Upload thumbnail *</label>
                                                            <input type="file" id="thumbnail" className="form-control" accept="image/*"  onChange={this.handleFile}/>
                                                            <p id="error-thumbnail-msg"/>
                                                        </div>
                                                    </div>
                                            }

                                            {
                                                (!audioURL == '')
                                                ?
                                                    <>
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state">Upload audio *</label>
                                                                <input type="file" id="audio" className="form-control" accept="audio/mp3,audio/mpeg,audio/*"  onChange={this.handleFile}/>
                                                                <p id="error-audio-msg"/>
                                                                <input type="hidden" id="duration" className='form-control'/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state"></label>
                                                                <audio controls>
                                                                    <source src={audioURL} type="audio/mpeg"/>
                                                                    Your browser does not support the audio tag.
                                                                </audio>
                                                            </div>
                                                        </div>
                                                        
                                                    </>
                                            :
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label htmlFor="state" className="state">Upload audio *</label>
                                                            <input type="file" id="audio" className="form-control" accept='audio/mp3,audio/mpeg,audio/*' onChange={this.handleFile}/>
                                                            <p id="error-audio-msg"/>
                                                            <input type="hidden" id="duration" className='form-control'/>
                                                        </div>
                                                    </div>
                                            }

                                        </div>

                                        <button type="submit" className="btn btn-info" disabled={ this.state.disabled }>{btnVal}</button>  
                                        {
                                            (this.state.isLoading)
                                            ?
                                            <div className="content-loader"><img src="images/loader.gif"/></div>
                                            :
                                            ''
                                        }     
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