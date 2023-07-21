import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import '../../css/style.css';

import $ from 'jquery';
import Constant from '../Constant';
import { getAccessToken } from '../../hooks/AccessToken';

class Add extends Component {

/*..................................... default state object ............................................*/
    
    state = {
        name: '',
        venue: '',
        date: '',
        time: '',
        ERROR: true
    } 

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };
  

/*.................. Integrate API for update banner...............................................*/

    handleSubmit = async event => {
        try{
            event.preventDefault();
            let token = getAccessToken();
            let metaData = {
                'name': this.state.name,
                'venue': this.state.venue,
                'date': this.state.date,
                'time': this.state.time
            }

            Axios.post(Constant.apiBasePath + 'event/create', metaData, { headers: { 'token': token }}).then(response => {
            const getResults = response.data.message;
            
                if(response.data.status === Constant.statusSuccess) {
                    $('#gen-message').text(getResults);
                    $('#gen-message').css('color', 'green');
                    setTimeout(function() { window.location.href = '/event-management'; }, 3000 );
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
                                            <li className="breadcrumb-item"><Link to="/event-management">Event Management</Link></li>
                                            <li className="breadcrumb-item active">Add Event</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title-heading">Add Event</h4>
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
                                                        <label htmlFor="updateImage" className="update">Name *</label>
                                                        <input type="text" id="name" className="form-control" onChange={this.handleChange} />   
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Venue *</label>
                                                        <input type="text" id="venue" className="form-control" onChange={this.handleChange} />   
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Date *</label>
                                                        <input type="date" id="date" className="form-control" onChange={this.handleChange} />   
                                                    </div> 
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="updateImage" className="update">Time *</label>
                                                        <input type="time" id="time" className="form-control" onChange={this.handleChange} />   
                                                    </div> 
                                                </div>
                                            </div>
                                              
                                            <button type="submit" className="btn btn-info">Add</button>       
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
export default Add;