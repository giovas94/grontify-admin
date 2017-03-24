import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';

import {moment} from 'meteor/momentjs:moment';

import { updateStatus, updateAssignedUser, removeAssingedUser } from '../../api/cars/methods.js';

export default class Car extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editableMode: false,
    }
  }

  updateStatus() {
    updateStatus.call({carId: this.props.car._id, newStatus: ReactDOM.findDOMNode(this.refs.status).value});
  }

  updateAssignedUser(e) {
    updateAssignedUser.call({carId: this.props.car._id, userId: e.target.value});
  }

  removeAssingedUser() {
    removeAssingedUser.call({carId: this.props.car._id});
  }

  enableEditMode() {
    this.setState({editableMode: true});
  }

  disableEditMode() {
    this.setState({editableMode: false})
  }

  handleOptions() {
    return this.props.users.map((user, index) => {
      let disabled = false;
      if (_.contains(this.props.usersWithCarrArr, user._id)) {
        disabled = true;
      }
      return <option key={index} value={user._id} disabled={disabled}>{user.emails ? user.emails[0].address : user.username }</option>
    })
  }

  render() {
    const car = this.props.car;
    return (
      <tr>
        <td>{car.licensePlate}</td>
        <td>{moment(car.createdAt).format('DD/MM/YYYY')}</td>
        <td className="hide-on-small-only">{car.brand}</td>
        <td>{car.model}</td>
        <td className="hide-on-small-only">{car.year}</td>
        <td>
          { this.state.editableMode  ?
            <select className="browser-default" ref="status" value={car.status}
            onBlur={this.disableEditMode.bind(this)}
            onChange={this.updateStatus.bind(this)}
            autoFocus
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          :
            car.status === 'activo' ?
              <i className="material-icons" onClick={this.enableEditMode.bind(this)}>check</i>
            :
              <i className="material-icons" onClick={this.enableEditMode.bind(this)}>remove_circle</i>
          }
        </td>
        <td>
          {car.status === 'activo' ?
            <div>
              <select className="browser-default" ref="user"
              style={{display: 'inline-block', width: '60%'}}
              value={car.assignedUser ? car.assignedUser : ''}
              onChange={this.updateAssignedUser.bind(this)}
              >
                <option value="" disabled>Selecciona...</option>
                {this.handleOptions()}
              </select>
              <a style={{display: 'inline-block'}}
                className="waves-effect waves-teal btn-flat"
                onClick={this.removeAssingedUser.bind(this)}
              >
                <i className="material-icons">close</i>
              </a>
            </div>
          :
            'Vehículo inactivo'
          }
        </td>
      </tr>
    )
  }
}

Car.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  car: PropTypes.object.isRequired,
  users: PropTypes.array,
};
