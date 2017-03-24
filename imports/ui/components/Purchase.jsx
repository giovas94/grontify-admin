import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { moment } from 'meteor/momentjs:moment';

import { updateStatus } from '../../api/purchases/methods.js';

export default class Purchase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    }
  }

  updateStatus(event) {
    updateStatus.call({purchaseId: this.props.purchase._id, newStatus: event.target.value});
  }

  enableEditMode() {
    this.setState({editMode: true});
  }

  disableEditMode() {
    this.setState({editMode: false});
  }

  render() {
    const purchase = this.props.purchase;

    return (
      <tr>
        <td>{purchase._id}</td>
        <td>{moment(purchase.createdAt).format('DD/MM/YYYY @hh:mm:ss a')}</td>
        <td>{purchase.purchaseQuantity}</td>
        <td>{purchase.purchasePrice}</td>
        <td>
          {this.state.editMode ?
            <select className="browser-default" ref="status" value={purchase.purchaseStatus}
            onBlur={this.disableEditMode.bind(this)}
            onChange={this.updateStatus.bind(this)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
              <option value="verificada">Verificada</option>
              <option value="pagada">Pagada</option>
            </select>
          :
            <span onClick={this.enableEditMode.bind(this)}>{purchase.purchaseStatus}</span>
          }
        </td>
      </tr>
    )
  }
}

Purchase.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  purchase: PropTypes.object.isRequired,
}
