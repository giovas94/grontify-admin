import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

export default class ListRoles extends Component {
  constructor(props) {
    super(props);
  }

  renderRoles() {
    return this.props.roles.map((role) => (
      <tr key={role._id}>
        <td>{role.name}</td>
        <td></td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <div>
          <h3 style={{display: "inline-block"}}>Roles de usuario</h3>
          <Link to="roles/new" className="waves-effect waves-light btn light-green"
            style={{
              display: 'inline-block',
              marginBottom: '16.936px',
              marginTop: '26.170px',
              float: 'right',
            }}>
            <i className="material-icons left">add</i>
            Nuevo
          </Link>
        </div>
        <table className="bordered highlight">
          <thead>
            <tr>
              <th>Roles</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.props.roles.length > 0 ? this.renderRoles() :
            <tr>
              <td colSpan="2">No hay registros.</td>
            </tr>
          }
          </tbody>
        </table>
      </div>
    )
  }
}
