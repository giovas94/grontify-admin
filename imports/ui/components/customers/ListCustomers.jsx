import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import User from './User.jsx';

export default class ListCustomers extends Component {
  constructor(props) {
    super(props);
  }

  renderUsers() {
    return this.props.users.map((user) => {
      if (user._id !== Meteor.userId()) {
        return <User key={user._id} user={user}/>
      }
    });
  }

  render() {
    return (
      <div>
        <div>
        <h3 style={{display: "inline-block"}}>Listado de clientes</h3>
        </div>
        <table className="bordered highlight responsive-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
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
