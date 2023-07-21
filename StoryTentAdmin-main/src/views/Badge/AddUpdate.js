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
        subTitle: '',
        noOfPoems: 0,
        noOfStories: 0,
        likes: 0,
        type: '',
        mixCount: 0,
        image: null,
        GetData: {},
        ERROR: true
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleImage = (e) => {
        this.setState({
            [e.target.id]: e.target.files[0]
        })
    }

/*.................. Integrate API for add, update data...............................................*/

    handleSubmit = async event => {
        try{
            let token = getAccessToken();
            event.preventDefault();
            let id = this.props.match.params.id;
            let form_data = new FormData();

            if (id === undefined) {
                if(this.state.image === null) {
                    $("#error-image-msg").text('File is required');
                    $("#error-image-msg").css("color", "red");
                    return false;
                }
    
                let fileName = this.state.image.name;
                let extension = fileName.split('.').pop();
    
                if(extension !== 'jpg' && extension !== 'png') {
                    $("#error-image-msg").text('Only jpg and png file type are allow !');
                    $("#error-image-msg").css("color", "red");
                    return false;
                }

                form_data.append('title', this.state.title);
                form_data.append('subTitle', this.state.subTitle);
                form_data.append('badgeIcon', this.state.image, this.state.image.name);
                form_data.append('type', this.state.type);
                form_data.append('count', this.state.count);
                form_data.append('noOfStories', this.state.noOfStories);
                form_data.append('noOfPoems', this.state.noOfPoems);
                
                Axios.post(Constant.apiBasePath + 'badge/create', form_data, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/badge-management'; }, 3000 );
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
                (this.state.subTitle) ? form_data.append('subTitle', this.state.subTitle) : form_data.append('subTitle', GetData.subTitle);
                (this.state.image) ? form_data.append('badgeIcon', this.state.image, this.state.image.name) : form_data.append('badgeIcon', GetData.image);
                (this.state.type) ? form_data.append('type', this.state.type) : form_data.append('type', GetData.type);
                (this.state.count) ? form_data.append('count', this.state.count) : form_data.append('count', GetData.count);
                (this.state.noOfPoems) ? form_data.append('noOfPoems', this.state.noOfPoems) : form_data.append('noOfPoems', GetData.noOfPoems);
                (this.state.noOfStories) ? form_data.append('noOfStories', this.state.noOfStories) : form_data.append('noOfStories', GetData.noOfStories);

                Axios.patch(Constant.apiBasePath + 'badge/edit/' + id, form_data, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/badge-management'; }, 3000 );
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
            url: Constant.apiBasePath + 'badge/getDataById/' + id,
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


/*---------------------------Reload function------------------------------------------ */

    componentDidMount() {    
        // get data by id
        if(this.props.match.params.id) {
            this.getGetData(this.props.match.params.id);
        }
    }


/*.................................end API .................................................................*/

    render() {
        const { GetData } = this.state;
        let title = '';
        let subTitle = '';
        let image = '';
        let type = '';
        let count = '';
        let noOfStories = '';
        let noOfPoems = '';
        let mixCount = '';

        let btnVal = 'Add';
        let heading = 'Add Badge';
        let types = <>
            <option id="0" value="0">Select one</option>
            <option id="1" value="1">Writer</option>
            <option id="2" value="2">Reader</option>
        </>
        
        if(GetData.title !== undefined) {
            title = GetData.title;
            subTitle = GetData.subTitle;
            image = GetData.image;
            type = GetData.type;
            count = GetData.count;
            noOfPoems = GetData.noOfPoems;
            noOfStories = GetData.noOfStories;
            mixCount= GetData.mixCount;

            btnVal = 'Update';
            heading = 'Update Badge';
            if(type === 1) {
                types = <>
                    <option id="0" value="0">Select one</option>
                    <option id="1" value="1" selected>Writer</option>
                    <option id="2" value="2">Reader</option>
                </>
            }
            else{
                types = <>
                <option id="0" value="0">Select one</option>
                <option id="1" value="1">Writer</option>
                <option id="2" value="2" selected>Reader</option>
            </>
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
                                            <li className="breadcrumb-item"><Link to="/badge-management">Badge Management</Link></li>
                                            <li className="breadcrumb-item active">Add New Badge</li>
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
                                                    <label htmlFor="state" className="state">Writer/Reader *</label>
                                                    <select id="type" className="form-control" onChange={this.handleChange}>
                                                        { types }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">No of Stories *</label>
                                                    <input type="number" id="noOfStories" className="form-control" onChange={this.handleChange} defaultValue={noOfStories}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">No of Poems *</label>
                                                    <input type="text" id="noOfPoems" className="form-control" onChange={this.handleChange} defaultValue={noOfPoems}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Title *</label>
                                                    <input type="text" id="title" className="form-control" onChange={this.handleChange} defaultValue={title}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Sub Title *</label>
                                                    <input type="text" id="subTitle" className="form-control" onChange={this.handleChange} defaultValue={subTitle}/>
                                                </div>
                                            </div>
                                            {
                                                (!image == '')
                                                ?
                                                    <>
                                                        <div className="col-md-5">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state">Upload Image *</label>
                                                                <input type="file" id="image" className="form-control" onChange={this.handleImage}/>
                                                                <p id="error-image-msg"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-1">
                                                            <div className="form-group mb-3">
                                                                <label htmlFor="state" className="state">Image</label>
                                                                <img src={image} className="form-control" alt="StoryTent" style={{ width: 50, height: 50 }}/>
                                                            </div>
                                                        </div>
                                                    </>
                                            :
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label htmlFor="state" className="state">Upload Image *</label>
                                                            <input type="file" id="image" className="form-control" onChange={this.handleImage}/>
                                                            <p id="error-image-msg"/>
                                                        </div>
                                                    </div>
                                            }
                                            
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Likes Count</label>
                                                    <input type="number" id="count" className="form-control" onChange={this.handleChange} defaultValue={count}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label htmlFor="state" className="state">Count of works</label>
                                                <input type="number" id="mixCount" className="form-control" onChange={this.handleChange} defaultValue={mixCount}/>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-info">{btnVal}</button>       
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