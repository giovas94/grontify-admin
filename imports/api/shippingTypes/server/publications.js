import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ShippingTypes } from '../shippingTypes';


Meteor.publish('shippingTypes', function() {
  if(!this.userId) {
    return this.ready();
  }

  return ShippingTypes.find({});
});
