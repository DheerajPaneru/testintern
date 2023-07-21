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
        redirectURL: '',
        image: null,
        ERROR: true
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleImageChange = (e) => {
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
                    $("#error-image-msg").text('Icon is required');
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
                form_data.append('redirectURL', this.state.redirectURL);
                form_data.append('socialIcon', this.state.image, this.state.image.name);

                Axios.post(Constant.apiBasePath + 'social-media', form_data, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/social-media'; }, 3000 );
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
                let metaData = {
                    'name': (this.state.name) ? this.state.name : GetData.name
                }

                Axios.put(Constant.apiBasePath + 'social-media/' + id, metaData, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/tags-management'}, 3000 );
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
            url: Constant.apiBasePath + 'social-media/' + id,
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
                
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/social-media">Social Media</Link></li>
                                            <li className="breadcrumb-item active">Add</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">Create Social Media</h4>
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
                                                    <input type="text" id="title" className="form-control" onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Redirect URL *</label>
                                                    <input type="text" id="redirectURL" className="form-control" onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Upload Icon  *</label>
                                                    <input type="file" id="image" className="form-control" onChange={this.handleImageChange}/>
                                                    <p id="error-image-msg"></p>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-info">Submit</button>       
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