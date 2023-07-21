import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import Constant from '../Constant';
import $ from 'jquery';



class AddUpdatePlan extends Component {

/*..................................... default state object ............................................*/
    state = {
        name: '',
        description: '',
        fileURL: '',
        price: '',
        duration: '',
        PlanData: {},
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


/*.................. Integrate API for add, update plan...............................................*/

    handleSubmit = async event => {
        try{
            let token = localStorage.getItem('loginDetails');
            event.preventDefault();
            let id = this.props.match.params.id;
            if (id === undefined) {

                /* Call input fields validation function and show message */

                let checkValidation = this.inputFieldValidation();

                if(this.state.name === '' || this.state.description === '' || this.state.fileURL === '' || this.state.price === '' || this.state.duration === '') {
                   return false;
                }
 
                let metaData = {
                    'name': this.state.name,
                    'description': this.state.description,
                    'fileURL': this.state.fileURL,
                    'price': this.state.price,
                    'duration': this.state.duration
                }

                Axios.post(Constant.apiBasePath + 'create-plan', metaData, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.reload(); }, 3000 );
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

                let { PlanData } = this.state;
                let metaData = {
                    'name': (this.state.name) ? this.state.name : PlanData.name,
                    'description': (this.state.description) ? this.state.description : PlanData.description,
                    'price': (this.state.price) ? this.state.price.value : PlanData.price,
                    'duration': (this.state.duration) ? this.state.duration : PlanData.duration,
                    'fileURL': (this.state.fileURL) ? this.state.fileURL : PlanData.fileURL
                }
                Axios.put(Constant.apiBasePath + 'plan/' + id, metaData, { headers: { 'token': token }}).then(response => {
                    let data = response.data;
                    if(data.status === Constant.statusSuccess) {
                        $('#gen-message').text(data.message);
                        $('#gen-message').css('color', 'green');
                        setTimeout(function() { window.location.href = '/plan-management'}, 3000 );
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

    async getPlanData(id) {
        let token = localStorage.getItem('loginDetails');

        let req = {
            method: 'GET',
            url: Constant.apiBasePath + 'plan/' + id,
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
                this.setState({ PlanData: data.data, ERROR: false });
            }
            else {
                $('#gen-message').text(data.message);
                $('#gen-message').css('color', 'red');
            }
        }).catch(error => ('Something Error'));

    }

    /* upload file on s3 */

    uploadPDFOnS3 = async (e) => {
        $(':input[type="submit"]').prop('disabled', true);
        $(':input[type="submit"]').css('cursor', 'progress');
        let id = e.target.id;
        let formData = new FormData();
        formData.append('planFile', e.target.files[0], e.target.files[0].name);
        let {data} = await Axios.post(Constant.apiBasePath + 'uploadPlanFileOnS3', formData);

        if(data.status === Constant.statusSuccess) {
            $(':input[type="submit"]').prop('disabled', false);
            $(':input[type="submit"]').css('cursor', 'pointer');
            this.setState({ 'fileURL': data.location, Error: true });
        }
        else{
            $("#gen-message").text(data.message);
            $("#gen-message").css("color", "red");
            return false;
        }
    }


/*---------------------------Reload function------------------------------------------ */

    componentDidMount() {    
        // get plan data by id
        if(this.props.match.params.id) {
            this.getPlanData(this.props.match.params.id);
        }
    }

    inputFieldValidation = () => {
        if(this.state.name === '') {
            $("#nameRequired").text('name is required');
            $("#nameRequired").css("color", "red");
        }
        else{
            $("#nameRequired").text('');
        }

        if(this.state.description === '') {
            $("#descriptionRequired").text('description is required');
            $("#descriptionRequired").css("color", "red");
        }
        else{
            $("#descriptionRequired").text('');
        }

        if(this.state.price === '') {
            $("#priceRequired").text('price is required');
            $("#priceRequired").css("color", "red");
        }
        else{
            $("#priceRequired").text('');
        }

        if(this.state.duration === '') {
            $("#durationRequired").text('duration is required');
            $("#durationRequired").css("color", "red");
        }
        else{
            $("#durationRequired").text('');
        }

        if(this.state.fileURL === '') {
            $("#fileRequired").text('please upload your file');
            $("#fileRequired").css("color", "red");
        }
        else{
            $("#fileRequired").text('');
        }
    }
    
    

/*.................................end API .................................................................*/

    render() {
        const { PlanData } = this.state;
        let btnVal = 'Add';
        let heading = 'Add Plan';
        let name = '';
        let description = '';
        let price = '';
        let duration = '';
       
        if(PlanData.name != undefined) {
            name = PlanData.name;
            description = PlanData.description;
            price = PlanData.price;
            duration = PlanData.duration;
            btnVal = 'Update';
            heading = 'Update Price';
        }
                
        return (
                <div className="content-page">
                    <div className="content">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/plan-management">Plan Management</Link></li>
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
                                                    <label htmlFor="state" className="state">Name *</label>
                                                    <input type="text" id="name" className="form-control" onChange={this.handleChange} defaultValue={name}/>
                                                    <p id="nameRequired"></p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Description *</label>
                                                    <textarea id="description" className="form-control" onChange={this.handleChange} defaultValue={description} rows="4" cols="50"/>
                                                    <p id="descriptionRequired"></p>
                                                </div> 
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Price *</label>
                                                    <input type="number" id="price" className="form-control" onChange={this.handleChange} defaultValue={price}/>
                                                    <p id="priceRequired"></p>
                                                </div> 
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="state" className="state">Month plan *</label>
                                                    <select id="duration" className="form-control" onChange={this.handleChange}>
                                                        <option id="0" value="0">Select one</option>
                                                        <option id="1" value="1 month">1 month</option>
                                                        <option id="2" value="2 month">2 month</option>
                                                        <option id="3" value="3 month">3 months</option>
                                                    </select>
                                                    <p id="durationRequired"></p>
                                                </div> 
                                            </div>
                                        </div>
                                        {
                                            (name === '') 
                                            ?
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label htmlFor="state" className="state">Upload file png|jpg|gif|svg|jpeg *</label>
                                                            <input type="file" id="fileURL" accept='.png,.jpg,.gif,.svg,.jpeg' className="form-control" onChange={this.uploadPDFOnS3}/>
                                                            <p id="fileRequired"></p>
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
export default AddUpdatePlan;