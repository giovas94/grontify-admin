import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';
import { moment } from 'meteor/momentjs:moment';


import { update, updateName } from '../../api/warehouses/methods.js';

export default class Warehouse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editableMode: false,
    }

    this.throttledUpdate = _.throttle(value => {
      if (value) {
        updateName.call({
          warehouseId: this.props.warehouse._id,
          newName: value
        });
      }
    }, 300);
  }

  updateName(event) {
    this.throttledUpdate(event.target.value);
  }

  updateStatus() {
    update.call({warehouseId: this.props.warehouse._id, status: ReactDOM.findDOMNode(this.refs.status).value});
  }

  enableEditMode() {
    this.setState({editableMode: true})
  }

  disableEditMode() {
    this.setState({editableMode: false})
  }

  render() {
    const warehouse = this.props.warehouse;
    return (
      <tr>
        <td>
          { this.state.editableMode  ?
            <input type="text" defaultValue={warehouse.name} onBlur={this.disableEditMode.bind(this)} onChange={this.updateName.bind(this)}/>
          :
            <span onClick={this.enableEditMode.bind(this)}>{warehouse.name}</span>
          }
        </td>
        <td>{moment(warehouse.createdAt).format('DD/MM/YYYY @hh:mm:ss a')}</td>
        <td>
          { this.state.editableMode  ?
            <select className="browser-default" ref="status" value={warehouse.status}
            onBlur={this.disableEditMode.bind(this)}
            onChange={this.updateStatus.bind(this)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          :
            warehouse.status === 'activo' ?
              <i className="material-icons" onClick={this.enableEditMode.bind(this)}>check</i>
            :
              <i className="material-icons" onClick={this.enableEditMode.bind(this)}>remove_circle</i>
          }
        </td>
        <td>
          <a className="waves-effect waves-teal btn-flat"
            onClick={() => {this.setState({editableMode: !this.state.editableMode}) }} >
            {this.state.editableMode ?
              <i className="material-icons">close</i>
            :
              <i className="material-icons">create</i>
            }
          </a>
        </td>
      </tr>
    )
  }
}

Warehouse.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  warehouse: PropTypes.object.isRequired,
};
