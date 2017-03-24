import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Link } from 'react-router';

import Loading from '../pages/Loading.jsx';
import ListStaff from './staff/ListStaff.jsx';
import ListRoles from './staff/ListRoles.jsx';

import { createContainer } from 'meteor/react-meteor-data';

class Staff extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('ul.tabs').tabs();
  }

  // renderUsers() {
  //   console.log(Roles.getAllRoles());
  //   return this.props.users.map((user) => (
  //     <tr key={user._id}>
  //       <td>{user.username ? user.username : '---'}</td>
  //       <td>{user.emails ? user.emails[0].address : '---'}</td>
  //       <td></td>
  //       <td></td>
  //       <td></td>
  //       <td></td>
  //     </tr>
  //   ));
  // }

  render() {
    return (
      <div>
        <h1>Colaboradores</h1>
        <div className="row">
          <div className="col s12">
            <ul className="tabs z-depth-3">
              <li className="tab col s3"><a className="active" href="#users">Listado de colaboradores</a></li>
              <li className="tab col s3"><a href="#roles">Roles de usuario</a></li>
            </ul>
          </div>
            <div>
              <div id="users" className="col s12">
                {this.props.loading ? <Loading /> :
                  <ListStaff users={this.props.users} roles={this.props.roles} />
                }
              </div>
              <div id="roles" className="col s12">
                <ListRoles roles={this.props.roles} />
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  const staffHandle = Meteor.subscribe('allUsers');
  const loading = !staffHandle.ready();
  return {
    loading,
    users: Meteor.users.find({}).fetch(),
    roles: Roles.getAllRoles().fetch(),//Meteor.roles.find({}).fetch(),
    currentUser: Meteor.user(),
  }
}, Staff);
