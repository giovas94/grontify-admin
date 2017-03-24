import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { Roles } from 'meteor/alanning:roles';

import { createContainer } from 'meteor/react-meteor-data';

//import { insertUsers } from '../../../api/staff/server/publications.js';

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: ''
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = this.refs.name.value.trim();
    const lastName = this.refs.last_name.value.trim();
    const email = this.refs.email.value.trim();
    const password = this.refs.password.value.trim();
    const roles = this.refs.roles.value;
    const address = {
      street: this.refs.street.value.trim(),
      line_1: this.refs.address_1.value.trim(),
      line_2: this.refs.address_2.value.trim(),
      state: this.refs.state.value.trim(),
      zipCode: this.refs.zip_code.value.trim(),
    };

    Meteor.call('users.insert', {name, lastName, email, password, roles, address}, (err, result) => {
      if(!err) {
        Materialize.toast('Usuario ingresado correctamente', 4000);
        this.context.router.replace('/staff#users');
      } else {
        console.log(err);
      }
    });
  }

  componentDidMount() {
    $('select').material_select();
  }

  changeSelect(e) {
    this.setState({roles: e.target.value});
  }

  handleOptions() {
    return this.props.roles.map((role) => (
      <option key={role._id} value={role.name}>{role.name}</option>
    ))
  }

  render() {
    return (
      <div>
        <h2>Alta de usuario</h2>
        <div className="row" >
          <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="input-field col s6" >
                <input id="name" ref="name" type="text" />
                <label htmlFor="name">Nombre(s)</label>
              </div>
              <div className="input-field col s6" >
                <input id="last_name" ref="last_name" type="text" />
                <label htmlFor="last_name">Apellido(s)</label>
              </div>
            </div>
            <div className="row" >
              <div className="input-field col s6" >
                <input id="email" ref="email" type="text" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s6" >
                <input id="password" ref="password" type="text" />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div className="row" >
              <div className="input-field col s12">
                <select ref="roles" value={this.state.roles} onChange={this.changeSelect.bind(this)}>
                  <option value="" disabled>Selecciona...</option>
                  {this.handleOptions()}
                </select>
                <label>Asignar rol de usuario</label>
              </div>
            </div>
            <div className="row">
              <ul className="collection with-header">
                <li className="collection-header"><h4>Dirección</h4></li>
                <li className="collection-item">
                  <input id="street" ref="street" type="text" />
                  <label htmlFor="street">Calle y número</label>
                </li>
                <li className="collection-item">
                  <input id="address_1" ref="address_1" type="text" />
                  <label htmlFor="address_1">Colonia</label>
                </li>
                <li className="collection-item">
                  <input id="address_2" ref="address_2" type="text" />
                  <label htmlFor="address_2">Delegación/Municipio</label>
                </li>
                <li className="collection-item">
                  <input id="state" ref="state" type="text" />
                  <label htmlFor="state">Estado</label>
                </li>
                <li className="collection-item">
                  <input id="zip_code" ref="zip_code" type="text" />
                  <label htmlFor="zip_code">Código Postal</label>
                </li>
              </ul>
            </div>
            <div className="row">
              <Link style={{float: "right"}} className="waves-effect waves-teal btn-flat" to="/staff#users">Cancelar
                <i className="material-icons right">close</i>
              </Link>
              <button style={{float: "right"}} className="btn waves-effect waves-light light-green" type="submit">Enviar
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

NewUser.contextTypes = {
  router: React.PropTypes.object,
};

export default createContainer(() => {
  return {
    roles: Roles.getAllRoles().fetch(),//Meteor.roles.find({}).fetch(),
    currentUser: Meteor.user(),
  }
}, NewUser);
