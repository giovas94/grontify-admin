import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Orders } from '../../api/orders/orders.js';

import OrdersPage from '../components/orders/OrdersPage.jsx';

let idFilter = new ReactiveVar('');
let dateQuery = new ReactiveVar(moment().startOf('day').toDate());

export default createContainer(() => {
  const subscription = Meteor.subscribe('orders', dateQuery.get(), idFilter.get());
  const loading = !subscription.ready();
  const orders = Orders.find({}, { sort: { shippingCost: -1, shippingDate: 1, createdAt: 1 } }).fetch();

  let ordersWithOwner = [];

  if (!loading && orders.length) {
    ordersWithOwner = _.map(orders, (order) => {
      let customer = Meteor.users.findOne(order.customerId);
      order.customer = customer;

      return order;
    });
  }

  return {
    loading,
    currentUser: Meteor.user(),
    orders: ordersWithOwner,
    dateQuery,
    idFilter,
  };
}, OrdersPage);
