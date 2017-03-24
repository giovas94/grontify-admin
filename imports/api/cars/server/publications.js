import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Cars } from '../cars.js';

Meteor.publish('cars', function carsPublication() {
  const userId = this.userId;

  if(!userId) {
    return this.ready();
  }

  return Cars.find();
});
