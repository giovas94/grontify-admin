import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Purchases } from './purchases.js';
import { Products } from '../products/products.js';

export const insert = new ValidatedMethod({
  name: 'purchases.insert',
  validate: new SimpleSchema({
    productId: { type: String },
    purchaseQuantity: { type: Number },
    purchasePrice: { type: Number }
  }).validator(),
  run({ productId, purchaseQuantity, purchasePrice }) {
    const product = Products.findOne(productId);

    if (!product) {
      throw new Meteor.Error('El producto ingresado no existe.');
    }

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const purchase = {
      productId,
      purchaseQuantity,
      purchasePrice,
      createdAt: new Date(),
      createdBy: this.userId,
      purchaseStatus: 'pendiente'
    };

    return Purchases.insert(purchase);
  },
});

export const updateStatus = new ValidatedMethod({
  name: 'purchases.updateStatus',
  validate: new SimpleSchema({
    purchaseId: {type: String},
    newStatus: {type: String}
  }).validator(),
  run({purchaseId, newStatus}) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Purchases.update(purchaseId, { $set: { purchaseStatus: newStatus } });
  }
});
