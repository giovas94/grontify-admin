import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { errors: {} };
  }

  onSubmit(event) {
    event.preventDefault();
    const user = this.refs.account.value;
    const password = this.refs.password.value;
    const errors = {};

    if (!user) {
      errors.user = 'Username or email required'
      Materialize.toast(errors.user, 4000)
    }

    if (!password) {
      errors.password = 'Password required'
      Materialize.toast(errors.password, 4000)
    }

    this.setState({errors});
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.call('users.isStaffUser', {email: user} , (err, result) => {
      if (!err) {
        if (result) {
          Meteor.loginWithPassword(user, password, err => {
            if (err) {
              this.setState({
                errors: { none: err.reason },
              });
              Materialize.toast(err.reason, 4000)
            } else {
              Materialize.toast('Ingresado correctamente!', 4000)
              this.context.router.push('/home');
            }
          });
        }
      } else {
        console.log(err.reason);
      }
    })
  }

  render() {
    return (
      <div className="container">
        <div>
          <div className="row">
            <div className="col s12 center-align">
              <img src="https://res.cloudinary.com/grontify/image/upload/v1477066907/mascot/grontify-mascot-HQ.png" width="100px" style={{marginTop: '1rem'}} alt="Grontify mascot"/>
            </div>
          </div>
          <h1 className="center-align">Ingresar al sistema</h1>
          <form className="col s12" onSubmit={this.onSubmit.bind(this)}>
            <div className="row">
              <div className="input-field col s12 m6 offset-m3">
                <i className="material-icons prefix">account_box</i>
                <input type="email" id="account" ref="account" />
                <label htmlFor="account">Usuario</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12 m6 offset-m3">
                <i className="material-icons prefix">lock</i>
                <input type="password" id="lock" ref="password" />
                <label htmlFor="lock">Contraseña</label>
              </div>
            </div>

            <div className="row">
              <div className="col s12 m6 offset-m3">
                <button className="btn waves-effect waves-light light-green right" type="submit" name="action">Ingresar
                  <i className="material-icons right">send</i>
                </button>
                <br/><br/>
                <Link className="right" to="retrieve">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object,
};
