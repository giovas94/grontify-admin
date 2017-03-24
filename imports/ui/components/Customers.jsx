import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Link } from 'react-router';

import Loading from '../pages/Loading.jsx';
import ListCustomers from './customers/ListCustomers.jsx';

import { createContainer } from 'meteor/react-meteor-data';

class Customers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Clientes</h1>
        <div className="row">
            <div>
              <div id="users" className="col s12">
                {this.props.loading ? <Loading /> :
                  <ListCustomers users={this.props.users} />
                }
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  const staffHandle = Meteor.subscribe('customers');
  const loading = !staffHandle.ready();
  return {
    loading,
    users: Meteor.users.find({}).fetch(),
    currentUser: Meteor.user(),
  }
}, Customers);
