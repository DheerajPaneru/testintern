import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import $ from 'jquery';
import Constant from '../Constant';

class AddUpdateBanner extends Component {

/*..................................... default state object ............................................*/
    
    state = {
        name: '',
        description: '',
        image: null,
        bannerData: {},
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
                form_data.append('description', this.state.description);       
                form_data.append('position', this.state.selectArea);     
                form_data.append('duration', this.state.duration);     
                form_data.append('image', this.state.image, this.state.image.name);  
                Axios.post(Constant.apiBasePath + 'banner', form_data).then(response => {
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
                let bannerData = this.state.bannerData;
                (this.state.name) ? form_data.append('name', this.state.name) : form_data.append('name', bannerData.name); 
                (this.state.description) ? form_data.append('description', this.state.description) : form_data.append('description', bannerData.description);             
                (this.state.selectArea) ? form_data.append('position', this.state.selectArea) : form_data.append('position', bannerData.position);
                (this.state.image) ? form_data.append('image', this.state.image, this.state.image.name) : form_data.append('image', bannerData.image);   
             
                Axios.put(Constant.apiBasePath + 'banner/' + id, form_data).then(response => {
                    const getResults = response.data.message;

                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/banner-management'; }, 3000 );
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

    getBannerData(id){
        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'banner/' + id,
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                
            },
            json: true
        }
        Axios(req).then(response => {
            const {data} = response;
            if (data.status === Constant.statusSuccess) {
                this.setState({ bannerData: data.data, ERROR: false });
            }
            else {
                this.setState({ bannerData: '', ERROR: false });
            }
        }).catch(error => ('Something Error'));

    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id !== undefined) {
            this.getBannerData(id);
        }
    }
    

/*.................................end API .................................................................*/

    render() {
        const { bannerData } = this.state;
        let name = '';
        let description = '';
        let image = '';
        let btnVal = 'Add';
        let heading = 'Add Banner';
        let Options = '';
        let duration = '';
        
        if(bannerData.name !== undefined) {
            name = bannerData.name;
            description = bannerData.description;
            image = (bannerData.image === undefined) ? '' : bannerData.image;
            duration = bannerData.duration;
            btnVal = 'Update';
            heading = 'Update Banner';

            if(bannerData.position === 1) {
                Options = <><option value="1" selected="selected">Home top</option><option value="2">Home Middle</option><option value="3">Home Bottom</option></>
            }
            else if(bannerData.position === 2) {
                Options = <><option value="1">Home top</option><option value="2" selected="selected">Home Middle</option><option value="3">Home Bottom</option></>
            }
            else {
                Options = <><option value="1">Home top</option><option value="2">Home Middle</option><option value="3" selected="selected">Home Bottom</option></>
            }
        }
        else{
            Options = <><option value="1">Home top</option><option value="2">Home Middle</option><option value="3">Home Bottom</option></>
        }

        
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/banner-management">Banner Management</Link></li>
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
                                                        <label htmlFor="update" className="update">Description:</label>
                                                        <textarea id="description" rows="4" cols="50" className="form-control" onChange={this.handleChange} defaultValue={description}></textarea>
                                                    </div> 
                                                </div>
                                            </div>
                                                {/* <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="banner area" className="bannerArea">Banner Location *</label>
                                                        <select id="selectArea" className="form-control" onChange={this.handleChange}>
                                                            <option value="0">Select One</option>
                                                            { Options }
                                                        </select>
                                                    </div>
                                                </div> */}
                                                   
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Image *</label>
                                                        <input type="file" id="image" name="image" accept="image/png, image/jpg"  className="form-control" onChange={this.handleImageChange} 
                                                        />   
                                                        <p id="error-banner-msg"></p>
                                                    </div> 
                                                </div>
                                                        
                                                {/* <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Duration (Duration should be in this format mm:ss)</label>
                                                            <input type="text" id="duration" className="form-control" onChange={this.handleChange} placeholder="mm:ss"
                                                            defaultValue={duration}/>         
                                                    </div>
                                                </div> */}
                                                
                                            </div>
                                                {
                                                    (bannerData.name !== undefined) ?

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
export default AddUpdateBanner;


