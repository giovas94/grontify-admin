import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import User from './User.jsx';

export default class ListStaff extends Component {
  constructor(props) {
    super(props);
  }

  renderUsers() {
    return this.props.users.map((user) => (
      <User key={user._id} user={user} roles={this.props.roles} />
    ));
  }

  render() {
    return (
      <div>
        <div>
        <h3 style={{display: "inline-block"}}>Listado</h3>
        <Link className="waves-effect waves-light btn light-green"
          style={{
            display: 'inline-block',
            marginBottom: '16.936px',
            marginTop: '26.170px',
            float: 'right',
          }}
          to="staff/new"
        >
          <i className="material-icons left">add</i>
          Nuevo
        </Link>
        </div>
        <table className="bordered highlight responsive-table">
          <thead>
            <tr>
              <th>Usuario/Email</th>
              <th>Roles/Permisos</th>
              <th>Cambiar Contraseña</th>
              <th>Conectado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.props.users.length > 0 ? this.renderUsers() :
              <tr>
                <td colSpan="6">No hay registros.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    )
  }
}
