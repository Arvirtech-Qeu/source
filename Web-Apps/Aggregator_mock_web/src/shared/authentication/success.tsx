import React from 'react'

import { Link } from 'react-router-dom'
import { all_routes } from "../../tech/router/all_routes";
import ImageWithBasePath from "../../tech/core/common/imageWithBasePath";


const Success = () => {
  const route = all_routes
  return (
    <div className="account-content">
    <div className="login-wrapper account-bg reset-bg">
      <div className="login-content">
        <form>
          <div className="login-user-info">
            <div className="login-logo success-login-logo">
              <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
            </div>
            <div className="login-heading text-center">
              <i className="ti ti-circle-check-filled" />
              <h4>Success</h4>
              <p className="verfy-mail-content mb-0">Your Passwrod Reset Successfully!</p>
            </div>
            <div className="form-wrap">
              <Link to={route.login} className="btn btn-primary">Back to Login</Link>
            </div>
            <div className="login-social-link">
              <div className="copyright-text">
                <p>Copyright ©2024 - QBOX</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Success