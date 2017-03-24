import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Warehouses } from './warehouses.js';

export const insert = new ValidatedMethod({
  name: 'warehouses.insert',
  validate: new SimpleSchema({
    name: { type: String, min: 3 }
  }).validator(),
  run({ name }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const warehouse = {
      name,
      createdAt: new Date(),
      status: 'activo'
    };

    return Warehouses.insert(warehouse);
  }
});

export const update = new ValidatedMethod({
  name: 'warehouses.updateStatus',
  validate: new SimpleSchema({
    warehouseId: {type: String},
    status: {type: String}
  }).validator(),
  run({ warehouseId, status }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Warehouses.update(warehouseId, { $set: { status: status } });
  }
});

export const updateName = new ValidatedMethod({
  name: 'warehouses.updateName',
  validate: new SimpleSchema({
    warehouseId: {type: String},
    newName: {type: String}
  }).validator(),
  run({ warehouseId, newName }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Warehouses.update(warehouseId, { $set: { name: newName } });
  }
});
