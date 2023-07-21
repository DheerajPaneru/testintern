import React ,{Component} from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';
import '../css/custom.css';

class NotFoundPage extends Component{
    render(){
        return (
                 <div>
                 <Link to="/">
            <img src="images/pageNotFound.jpg"  />
            </Link>
            </div>
        );
    }
}
export default NotFoundPage;