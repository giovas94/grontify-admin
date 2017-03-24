import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Orders } from '../orders';


Meteor.publishComposite('orders', function orders(dateQuery, idFilter) {
  new SimpleSchema({
    dateQuery: {type: Date},
    idFilter: {type: String}
  }).validate({ dateQuery, idFilter });

  if(!this.userId) {
    return this.ready();
  }

  return {
    find: function() {
      return Orders.find(
        {
          _id: { $regex: idFilter, $options: 'i' },
          createdAt:  { $gte:  dateQuery, $lt: moment(dateQuery).add(1,'d').toDate() }
        },
        {
          sort: { shippingCost: -1, shippingDate: 1, createdAt: 1 }
        });
    },
    children: [
      {
        find: function(order) {
          return Meteor.users.find(
            { _id: order.customerId },
            { limit: 1, fields: { profile: 1, emails: 1 } })
        }
      }
    ]
  }
});

Meteor.publishComposite('orderDetail', function orderDetail(id) {
  new SimpleSchema({
    id: {type: String}
  }).validate({ id });

  if(!this.userId) {
    return this.ready();
  }

  return {
    find: function() {
      return Orders.find(id, { limit: 1 });
    },
    children: [{
      find: function(order) {
        return Meteor.users.find(
          { _id: order.customerId },
          { limit: 1, fields: { profile: 1, emails: 1 } }
        )
      }
    }]
  }
});

//
// Meteor.publish('orderDetail', function(id) {
//   if(!this.userId) {
//     return this.ready();
//   }
//
//   return Orders.find(id, {limit: 1});
//
// });

Meteor.publish('totalOrders', function() {
  Counts.publish(this, 'total-orders', Orders.find());
});

Meteor.publish('pendingOrders', function() {
  Counts.publish(this, 'pending-orders', Orders.find({'status': { $nin: ['delivered', 'canceled'] } }));
});

Meteor.publish('todayOrders', function() {
  Counts.publish(this, 'today-orders', Orders.find({'createdAt': { $gte: moment().startOf('day').toDate() }}));
});
