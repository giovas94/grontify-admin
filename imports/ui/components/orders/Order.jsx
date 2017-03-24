import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { browserHistory } from 'react-router';

moment.locale('es');

export class Order extends Component {
  goToDetail() {
    browserHistory.push(`/orders/detail/${this.props.order._id}`);
  }
  render() {
    const { order } = this.props;
    return (
      <tr onClick={this.goToDetail.bind(this)}>
        <th>{order._id}</th>
        <th>{order.customer.profile.name} {order.customer.profile.last_name}<br/><small>{order.customer.emails ? order.customer.emails[0].address : ''}</small></th>
        <th>{moment(order.createdAt).format('LLL')}</th>
        <th>{accounting.formatMoney(order.secureSubtotal)}</th>
        <th>{accounting.formatMoney(order.shippingCost)}<br/><small>{order.shippingType}</small></th>
        <th>{accounting.formatMoney(order.total)}</th>
        <th>{order.status}</th>
        <th>{moment(order.shippingDate).format('DD/MM/YYYY @ HH:mm')}</th>
      </tr>
    )
  }
}
