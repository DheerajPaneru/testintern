import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import Constant from './Constant';
import '../css/style.css';
import swal from 'sweetalert';


export default class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          errors: {}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }

      handleChange(event) {
        let target = event.target;
          if (target.name === 'email') {
            this.setState({ email: target.value });
          }
      }

      handleSubmit(event) {
          event.preventDefault();
          this.handleLink();
      }

      handleLink = async event => {
          try {
              const response = await Axios.post(Constant.apiBasePath+'admin/sendEmail',{email:this.state.email});
            const {data} =response;
            if(data.status === Constant.statusSuccess) {
                swal({text:"Link send on your email",icon:"success",successMode:true});
                // window.location.reload(false);
            }
            else {
                swal({text: data.message, icon:"warning",dangerMode:true});
                //  window.location.reload(false);
            }
          }
          catch(err) {
              console.log(err);
          }
      }


    render() {
        return (
               <div className="account-pages mt-5 mb-5">
                 <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="card">

                            <div className="card-header text-center bg-white">
                                <h4 className="appName">Send Link</h4>
                            </div>

                            <div className="card-body p-4">
                                <form action='' onSubmit={this.handleSubmit}>

                                    <div className="form-group">
                                    <Link to="/" className=" float-right"><small>Cancel</small></Link>
                                        <label htmlFor="emailaddress" className='recovery-email'>Email address</label>
                                        <input className="form-control" type="email" id="emailaddress" name="email" placeholder="Enter your email"
                                        onChange={this.handleChange} value={this.state.email}/>
                                    </div>
                                    <div className="form-group mb-0 text-center">
                                        <button className="btn btn-success" type="submit">Send</button>
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