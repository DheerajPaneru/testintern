import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import $ from 'jquery';
import Constant from '../Constant';
import { getAccessToken } from '../../hooks/AccessToken';

class AddUpdate extends Component {

/*..................................... default state object ............................................*/
    
    state = {
        name: '',
        image: null,
        about: 0,
        getData: {},
        selectArea: 0,
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
    };
  

/*.................. Integrate API for update banner...............................................*/

    handleSubmit = async event => {
        try{
            event.preventDefault();
            let token = getAccessToken();
            let id = this.props.match.params.id;
            const form_data = new FormData();
           
            if(id === undefined) {
                if(this.state.image === null) {
                    $("#error-banner-msg").text('File is required');
                    $("#error-banner-msg").css("color", "red");
                    return false;
                }
    
                let fileName = this.state.image.name;
                let extension = fileName.split('.').pop();
    
                if(extension !== 'jpg' && extension !== 'png') {
                    $("#error-banner-msg").text('Only jpg and png file type are allow !');
                    $("#error-banner-msg").css("color", "red");
                    return false;
                }

                form_data.append('name', this.state.name);  
                form_data.append('image', this.state.image, this.state.image.name);  
                form_data.append('about', this.state.about);
                Axios.post(Constant.apiBasePath + 'contest/create', form_data, { headers: { 'token': token }}).then(response => {
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

            else {
                let getData = this.state.getData;
                (this.state.name) ? form_data.append('name', this.state.name) : form_data.append('name', getData.name); 
                (this.state.image) ? form_data.append('image', this.state.image, this.state.image.name) : form_data.append('image', getData.image);   
                (this.state.about) ? form_data.append('about', this.state.about) : form_data.append('about', getData.about); 
             
                Axios.patch(Constant.apiBasePath + 'contest/edit/' + id, form_data, { headers: { 'token': token }}).then(response => {
                    const getResults = response.data.message;

                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/contest-management'; }, 3000 );
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

    getgetData(id){
        let token = getAccessToken();
        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'contest/getDataById/' + id,
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
                this.setState({ getData: data.data[0], ERROR: false });
            }
            else {
                this.setState({ getData: '', ERROR: false });
            }
        }).catch(error => ('Something Error'));

    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id !== undefined) {
            this.getgetData(id);
        }
    }
    

/*.................................end API .................................................................*/

    render() {
        const { getData } = this.state;
        let name = '';
        let image = '';
        let about = '';
        let btnVal = 'Add';
        let heading = 'Add Contest';
        
        if(getData.name !== undefined) {
            name = getData.name;
            image = (getData.image === undefined) ? '' : getData.image;
            about = getData.about;
            btnVal = 'Update';
            heading = 'Update Contest';
        }
        
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/contest-management">Contest Management</Link></li>
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
                                        <form onSubmit={this.handleSubmit}>
                                            <p id="gen-message"></p>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Name *</label>
                                                            <input type="text" id="name" className="form-control" onChange={this.handleChange} 
                                                            defaultValue={name} />         
                                                    </div> 
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">About *</label>
                                                        <textarea id="about" rows="4" cols="50" className="form-control" onChange={this.handleChange} defaultValue={about}></textarea>
                                                    </div> 
                                                </div>
                                            </div>
                               
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Image * <strong>Image resolution should be 250 * 560</strong></label>
                                                        <input type="file" id="image" name="image" accept="image/png, image/jpg"  className="form-control" onChange={this.handleImageChange} 
                                                        />   
                                                        <p id="error-banner-msg"></p>
                                                    </div> 
                                                </div> 
                                            </div>
                                                {
                                                    (getData.name !== undefined) ?

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-3" id="">
                                                                <label className="label1" htmlFor="Image">Old Image :</label>
                                                                <img src={image} alt="ind" id="background-img" width="80" height="60" className="oldImage"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    ''
                                                }

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
