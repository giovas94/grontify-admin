import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Products } from './products.js';

export const insert = new ValidatedMethod({
  name: 'products.insert',
  validate: new SimpleSchema({
    name: { type: String, min: 1 },
    category: { type: String },
    unit: { type: String },
    currentPrice: { type: Number, decimal: true },
  }).validator(),
  run({ name, category, unit, currentPrice }) {
    const enteredPrice = currentPrice;

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (category === '' || unit === '') {
      throw new Meteor.Error('Seleccionar categoría y unidad');
    }

    const product = {
      name,
      category,
      unit,
      currentPrice: enteredPrice,
      priceHistory: [{
        price: enteredPrice,
        date: new Date()
      }],
      createdAt: new Date(), // current time
      productStatus: 'activo'
    };

    return Products.insert(product);
  },
});

export const updateProductName = new ValidatedMethod({
  name: 'products.updateProductName',
  validate: new SimpleSchema({
    productId: { type: String },
    updatedProductName: { type: String }
  }).validator(),
  run({ productId, updatedProductName }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { name: updatedProductName } });
  }
});

export const productDescription = new ValidatedMethod({
  name: 'products.description',
  validate: new SimpleSchema({
    productId: { type: String },
    description: { type: String, max: 100 }
  }).validator(),
  run({ productId, description }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { description: description } });
  }
})
