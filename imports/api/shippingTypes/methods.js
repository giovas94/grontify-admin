import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {moment} from 'meteor/momentjs:moment';

import { ShippingTypes } from './shippingTypes';

export const insertShippingType = new ValidatedMethod({
  name: 'shippingTypes.insert',
  validate: new SimpleSchema({
    name: { type: String },
    cost: { type: Number, decimal: true }
  }).validator(),
  run({ name, cost }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newShippingType = {
      name,
      currentCost: cost,
      costHistory: [{
        cost: cost,
        date: new Date()
      }],
      createdAt: new Date()
    }

    // console.log(newShippingType);
    ShippingTypes.insert(newShippingType);
  }
});


export const updateShippingCost = new ValidatedMethod({
  name: 'shippingTypes.updateCost',
  validate: new SimpleSchema({
    shippingTypeId: { type: String },
    newCost: { type: Number, decimal: true }
  }).validator(),
  run({ shippingTypeId, newCost }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const myShippingtype = ShippingTypes.findOne(shippingTypeId);
    if (myShippingtype.currentCost === newCost) {
      return;
    }

    if (isNaN(newCost)) {
      throw new Meteor.Error('Error de validación', 'El nuevo costo debe ser un número');
    }

    ShippingTypes.update(shippingTypeId,
      {
        $set: { currentCost: newCost, updatedAt: new Date() },
        $push: { costHistory: { cost: newCost, date: new Date() }},
      }
    )
  }
});
