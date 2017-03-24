import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Warehouses } from '../warehouses.js';

Meteor.publish('warehouses', function warehousesPublication() {
  const userId = this.userId;

  if(!userId) {
    return this.ready();
  }
  
  return Warehouses.find();
});
