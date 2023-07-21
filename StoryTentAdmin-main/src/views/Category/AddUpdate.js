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
        contestType: 0,
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
                form_data.append('icon', this.state.image, this.state.image.name);  
                form_data.append('contestType', this.state.contestType);
                Axios.post(Constant.apiBasePath + 'category/create', form_data, { headers: { 'token': token }}).then(response => {
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
                (this.state.image) ? form_data.append('icon', this.state.image, this.state.image.name) : form_data.append('icon', getData.icon);   
                form_data.append('contestType', this.state.contestType);
             
                Axios.patch(Constant.apiBasePath + 'category/edit/' + id, form_data, { headers: { 'token': token }}).then(response => {
                    const getResults = response.data.message;

                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/category-management'; }, 3000 );
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
            url: Constant.apiBasePath + 'category/getDataById/' + id,
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
        let btnVal = 'Add';
        let heading = 'Add Category';
        
        if(getData.name !== undefined) {
            name = getData.name;
            image = (getData.icon === undefined) ? '' : getData.icon;
            btnVal = 'Update';
            heading = 'Update Category';
        }
        
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/category-management">Category Management</Link></li>
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
                                                        <label htmlFor="update" className="update">Type of category *</label>
                                                            <select id="contestType" className="form-control" onChange={this.handleChange}>
                                                                <option id="0" value="0">For General</option>
                                                                <option id="1" value="1">For Contest</option>
                                                            </select>         
                                                    </div> 
                                                </div>
                                            </div>
                               
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Image *</label>
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


