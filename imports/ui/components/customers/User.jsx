import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';

export default class User extends Component {
  constructor(props) {
    super(props);
  }

  handleEmails(user) {
    if (user && user.emails) {
      return user.emails[0].address
    } else if (user.services && user.services.facebook && user.services.facebook.email) {
      return user.services.facebook.email
    } {
      return ''
    }
  }

  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.profile.name} {user.profile.last_name ? user.profile.last_name : ''}</td>
        <td>{this.handleEmails(user)}</td>
        <td>{user.profile && user.profile.phone ? user.profile.phone : ''}</td>
      </tr>
    )
  }
}

User.propTypes = {
  user: PropTypes.object.isRequired
}
