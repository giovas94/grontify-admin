import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';

export default class User extends Component {
  constructor(props) {
    super(props);
  }

  updateRoles(e) {
    Meteor.call('users.updateRoles', {userId: this.props.user._id, roles: e.target.value})
  }

  updateStatus(e) {
    Meteor.call('users.updateStatus', {userId: this.props.user._id, status: e.target.value})
  }

  handleOptions() {
    return this.props.roles.map((role) => (
      <option key={role._id} value={role.name}>{role.name}</option>
    ))
  }


  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.emails ? user.emails[0].address : user.username}</td>
        <td>
          <select className="browser-default" ref="roles"
          value={user.roles && user.roles.admin_grontify_com ? user.roles.admin_grontify_com[0] : ""}
          onChange={this.updateRoles.bind(this)}>
            <option value="" disabled>Selecciona...</option>
            {this.handleOptions()}
          </select>
        </td>
        <td>
          <input style={{width: '50%', marginRight: '1rem'}} type="text" ref="newPassword" placeholder="Nueva contraseña" />
          <button className="btn waves-effect waves-light light-green" type="submit">
            <i className="material-icons">check</i>
          </button>
        </td>
        <td></td>
        <td>
          <select className="browser-default" ref="status"
            onChange={this.updateStatus.bind(this)}
            value={user.profile ? user.profile.status : ''}>
            <option value="" disabled>Selecciona...</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </td>
      </tr>
    )
  }
}

User.propTypes = {
  user: PropTypes.object.isRequired,
  roles: PropTypes.array,
}
