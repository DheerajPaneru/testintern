import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { getTokenDetails } from './views/Utilities/CommonFunctions';

const AdminAccess = ({ component: Component, ...rest }) => {

  let token = localStorage.getItem('loginDetails');
  let getDetails = getTokenDetails(token);
  
  return (
    <Route
      {...rest}
      render={props =>
          (getDetails.email !== undefined ) ?
            (
              <Component {...props} />
            ) :
            (<Redirect to="/" />)
      }
    />
  )
}

export default AdminAccess