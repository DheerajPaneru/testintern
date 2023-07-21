import React, { Component } from 'react'
import Axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import '../../css/style.css';

import $ from 'jquery';
import Constant from '../Constant';
import { getAccessToken } from '../../hooks/AccessToken';


class AddUpdateCMS extends Component {

/*..................................... default state object ............................................*/
    
    state = {
        pageName: '',
        image: null,
        content: '',
        parentId:'',
        cmsData:{},
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
            let parentId = this.props.match.params.id;
            let type = this.props.match.params.type;
           
            if(type === 'add') {
                let pageName = $("#pageName").val();
                let content = this.state.content;

                if(pageName === ''){
                    $('#pageNameError').text("pageName is required");
                    $('#pageNameError').show();
                    return false;
                }
                else if(pageName.length > 30){
                    $('#pageNameError').text("pageName less then equal to 30 characters");
                    $('#pageNameError').show();
                    return false;
                }
                if(content === ''){
                    $('#contentError').text("content is required");
                    $('#contentError').show();
                    return false;
                }
                // else if(content.length > 250){
                //     $('#contentError').text("content less then equal to 250 characters");
                //     $('#contentError').show();
                //     return false;
                // }
                else{
                    $('#pageNameError').hide();
                    $('#contentError').hide();
                }

                let requestData = {
                    title: pageName,
                    parentId: parentId,
                    content: content
                }        
                
                Axios.post(Constant.apiBasePath + 'createCMS/2', requestData, { headers: { 'token': token }}).then(response => {
                const getResults = response.data.message;
                
                    if(response.data.status === Constant.statusSuccess) {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.reload(); }, 3000 );
                    }
    
                    else {
                        $('#gen-message').text(getResults);
                        $('#gen-message').css('color', 'red');
                    }
    
                });
            }

            else {
                let contentId = this.props.match.params.contentId;
                let cmsData = this.state.cmsData;
             
                let requestData = {
                    'title': (this.state.pageName) ? this.state.pageName : cmsData.title,             
                    'content': (this.state.content) ? this.state.content : cmsData.content, 
                    'parentId': cmsData.parentId   
                }
                                               
                Axios.put(Constant.apiBasePath+'updateCMS/' + contentId+'/2', requestData, { headers: { 'token': token } }).then(response => {
                const getResults = response.data.message;

                if(response.data.status === Constant.statusSuccess) {
                    $('#gen-message').text(getResults);
                    $('#gen-message').css('color', 'green');
                    let id = this.props.match.params.id;
                    setTimeout(function() { window.location.href = '/view-cms/'+ id; }, 3000 );
                }
                else {
                    $('#gen-message').text(getResults);
                    $('#gen-message').css('color', 'red');
                }
                });
            }

        }
        catch(err) {
            console.log(err);
        }       
    }


    getCmsContent(id, type){
        let token = getAccessToken();
        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'getCmsById/' + id + '/' + type,
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
                this.setState({ cmsData: data.data[0], ERROR: false });
            }
            else {
                this.setState({ cmsData: '', ERROR: false });
            }
        }).catch(error => ('Something Error'));

    }
   

    componentDidMount() {
        let contentId = this.props.match.params.contentId;
        if(contentId !== undefined){
            this.getCmsContent(this.props.match.params.contentId, 2);
        }
        else{
            this.getCmsContent(this.props.match.params.id, 1);
        }
    }
   
/*.................................end API .................................................................*/

    render() {
        const { cmsData} = this.state;
        let pageName = '';
        let content = '';
        let image = '';
        let btnVal = 'Add';

        let heading = 'Add Content';
        let pageType = 'add';
        let pageId = this.props.match.params.id;
        let pageTitle = '';

        if(cmsData.title !== undefined) {
            pageName = cmsData.title;
            content = cmsData.content;
            image = (cmsData.image === undefined) ? '' : cmsData.image;
            btnVal = 'Update';
            heading = 'Update Content';
            pageType = 'edit';
        }

        if(cmsData.pageTitle !== undefined) {
            pageTitle = cmsData.pageTitle;
        }

        
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb mt-1 mb-2">
                                            <li className="breadcrumb-item"><Link to={'/view-cms/'+pageId}>CMS Management</Link></li>
                                            <li className="breadcrumb-item active">{heading}</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">{heading}</h4>
                                </div>
                                <p id="gen-message"></p>
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body"> 
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Page Name *</label>
                                                            {
                                                                (pageTitle === '')
                                                                ?
                                                                <input type="text" id="pageName" className="form-control" onChange={this.handleChange} defaultValue={pageName} /> 
                                                                :
                                                                <input type="text" id="pageName" className="form-control" onChange={this.handleChange} value={pageTitle} />
                                                            }        
                                                        <p id="pageNameError" style={{display:'none',color:'red'}}></p>
                                                    </div> 
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="update" className="update">Content *</label>
                                                        <textarea id="content" rows="4" cols="50" className="form-control" onChange={this.handleChange} defaultValue={content}></textarea>
                                                        <p id="contentError" style={{display:'none',color:'red'}}></p>
                                                    </div>
                                                    {/* <div className="form-group mb-3">
                                                       <label htmlFor="updateImage" className="update">Image *</label>
                                                            <input type="file" id="image" name="image" accept="image/png, image/jpg"  className="form-control" onChange={this.handleImageChange} 
                                                            />   
                                                            <p id="error-banner-msg"></p>
                                                    </div> 
                                                    {
                                                        (cmsData.title !== undefined) ?

                                                        <div className="form-group mb-3" id="">
                                                            <label className="label1" htmlFor="Image">Old Image :</label>
                                                            <img src={image} alt="ind" id="background-img" width="80" height="60" className="oldImage"/>
                                                        </div>
                                                        :
                                                        ''
                                                    } */}
                                                    
                                                     <button type="submit" className="btn btn-info">{btnVal}</button>
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
export default AddUpdateCMS;
