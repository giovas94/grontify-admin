import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Orders } from '../../api/orders/orders.js';

import { _ } from 'meteor/stevezhu:lodash';

import OrderDetail from '../components/orders/OrderDetail.jsx';

export default createContainer(({ params: { id } }) => {
  let orderWithOwner = {};
  const subscription = Meteor.subscribe('orderDetail', id);
  const loading = !subscription.ready();
  const order = Orders.findOne(id);

  if (!loading && !!order) {
    let customer = Meteor.users.findOne(order.customerId);
    orderWithOwner = _.assign(order, {customer});
  }

  return {
    loading,
    currentUser: Meteor.user(),
    order: orderWithOwner,
  };
}, OrderDetail);
