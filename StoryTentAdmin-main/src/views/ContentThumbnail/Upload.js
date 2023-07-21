import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import $ from 'jquery';
import Constant from '../Constant';
import { getAccessToken } from '../../hooks/AccessToken';

class Upload extends Component {

/*..................................... default state object ............................................*/
    
    state = {
        image: null,
        title: '',
        ERROR: true
    } 

    handleChange = (e) => {
        this.setState({ 
            [e.target.id]: e.target.value
        });
    }

    handleImageChange = (e) => {
        this.setState({
            [e.target.id]: e.target.files[0]
        })
    };
  

/*.................. Integrate API for update banner...............................................*/

    handleSubmit = async event => {
        try{
            event.preventDefault();
            let token = getAccessToken();
            const form_data = new FormData();
            
            let title = this.state.title;
            if(title === '') {
                $("#title-error-msg").text('title is required');
        
                return false;
            }
            if(this.state.image === null) {
                $("#thumbnail-error-msg").text('Thumbnail is required');
                return false;
            }

            let fileName = this.state.image.name;
            let extension = fileName.split('.').pop();

            if(extension !== 'jpg' && extension !== 'png') {
                $("#thumbnail-error-msg").text('Only jpg and png file type are allow !');
                return false;
            }

            form_data.append('contentThumbnail', this.state.image, this.state.image.name); 
            form_data.append('title', title);  
            Axios.post(Constant.apiBasePath + 'content-thumbnail/upload', form_data, { headers: { 'token': token }}).then(response => {
            const getResults = response.data.message;
            
                if(response.data.status === Constant.statusSuccess) {
                    $('#gen-message').text(getResults);
                    $('#gen-message').css('color', 'green');
                    setTimeout(function() { window.location.reload(); }, 3000 );
                }

                else {
                    $('#gen-message').text(getResults);
                    $('#gen-message').css('color', 'red');
                    return false;
                }

            });
        }
        catch(err) {
            console.log(err);
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
                                            <li className="breadcrumb-item"><Link to="/thumbnail-management">Thumbnail Management</Link></li>
                                            <li className="breadcrumb-item active">Upload Thumbnail</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">Upload Thumbnail</h4>
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
                                                        <label htmlFor='updateImage' className='update'>Title *</label>
                                                        <input type="text" id="title" className="form-control" onChange={ this.handleChange } defaultValue={ this.state.title } />
                                                        <p id="title-error-msg" className='text-danger'></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Thumbnail *</label>
                                                        <input type="file" id="image" name="image" accept="image/png, image/jpg"  className="form-control" onChange={this.handleImageChange} 
                                                        />   
                                                        <p id="thumbnail-error-msg" className='text-danger'></p>
                                                    </div> 
                                                </div> 
                                            </div>
                                              
                                            <button type="submit" className="btn btn-info">Upload</button>       
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
export default Upload;


