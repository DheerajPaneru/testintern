import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../Constant';
import '../../css/style.css';

import $ from 'jquery';
import { getAccessToken } from '../../hooks/AccessToken';
import { Link } from 'react-router-dom';


class PostList extends Component {
      
    state = {
        ERROR: true,
        DataList: [],
        pageNo: 1,
        length: 1
    }



//----------------------------------Integrate API for show data list----------------------------------\\

handleSubmit = async (event) => {
    try {
        let token = getAccessToken();
        let user_id = this.props.match.params.user_id;
        let metaData = {};
        const response = await Axios.get(Constant.apiBasePath + 'story/getDataForApp?user_id=' + user_id, metaData, { headers: { 'token': token }});
        const data = response.data;
        if(data.status === Constant.statusSuccess) {
            this.setState({ DataList: data.data, pageNo: 1, length: 1, ERROR: false });
        }
        else{
            alert(data.message);
        }
    }
    catch(err) {
        console.log(err);
    }
}

//--------------------------------------------Reload component----------------------------------------------// 

componentDidMount() {
    this.handleSubmit(this.state.pageNo);
}

//-------------------------------------------End API-------------------------------------------------------\\     

render() {
const {DataList, length, pageNo} = this.state;

    let i = (pageNo - 1) * Constant.perPage;
    let bodyData = '';

    if(DataList.length > 0) {
        bodyData = DataList.map(el => {
            i++;
            return <tr><td>{i}</td><td>{el._id}</td><td>{el.name}</td><td><img src={el.thumbnail} alt="india" style={{width:100,height:80}}/></td><td>{el.likes.length}</td><td>{el.createdAt}</td>
            </tr>
        })
    }

    let previous = 0;
    let next = 0;
    let customLength = 0

    if(pageNo !== 0) {
        previous = pageNo - 1;
        next = pageNo + 1;
    }

    if(length !== 0) {
        customLength = length;
    }

    if(length < 2) {
        $(".pagination").hide();
    }
    else{
        $(".pagination").show();
    }

    
        return (
                <div className="content-page teacher-management-page">
                   <div className="content">
                        <div className="row">
                            <div className="col-10">
                                <div className="page-title-box">
                                    <h4 className="page-title-heading">User Story List</h4>
                                </div>
                            </div>
                        </div> 

                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <p id="gen-message"></p>
                                        <div className="tab-content mt-3">
                                            <div className="tab-pane table-responsive show active" id="buttons-table-preview">
                                                <table id="complex-header-datatable" className="table table-x-scroll dt-responsive nowrap teacher-table">
                                                   <thead>
                                                       <tr>
                                                            <th>S.No.</th>
                                                            <th>Id</th>
                                                            <th>Title</th>
                                                            <th>Thumbnail</th>
                                                            <th>Likes</th>
                                                            <th>Date</th>
                                                       </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bodyData}
                                                    </tbody>
                                                </table> 
                                                <div className='d-flex justify-content-between align-items-center showingCount'>
                                                    <div className="pagination">
                                                        {
                                                            (pageNo <= 1) ?
                                                        <a className="default-previous">Previous</a>
                                                        :
                                                        <a className="paginate-link" onClick={() => this.handleSubmit(previous)}>Previous</a>
                                                        }
                                                        
                                                        <a>{pageNo}</a>
                                                        {
                                                            (pageNo >= customLength)
                                                            ?
                                                        <a className="active default-next">Next</a>
                                                        :
                                                        <a className="paginate-link" class="active" onClick={() => this.handleSubmit(next)}>Next</a>

                                                        }
                                                    </div>
                                                </div>
                                            </div>                                          
                                        </div> 
                                    </div>   
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
        )
    }    
        
}
export default PostList;