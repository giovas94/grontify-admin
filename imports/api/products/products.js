import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Products = new Mongo.Collection('products');

Meteor.methods({
  // 'products.remove'(productId) {
  //   check(productId, String);
  //
  //   if (! this.userId) {
  //     throw new Meteor.Error('not-authorized');
  //   }
  //
  //   Products.remove(productId);
  // },
  'products.updateStatus'(productId, status) {
    check(productId, String);
    check(status, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { productStatus: status } });
  },
  'products.updateCategory'(productId, category) {
    check(productId, String);
    check(category, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { category: category } });
  },
  'products.updatePrice'(productId, newPrice) {
    check(productId, String);
    check(newPrice, Number);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const myProduct = Products.findOne(productId);
    if (myProduct.currentPrice === newPrice || isNaN(newPrice)) {
      return;
    }

    Products.update(productId,
      {
        $push: { priceHistory: { price: newPrice, date: new Date() }},
        $set: {currentPrice: newPrice}
      }
    );
  },
  'products.uploadImage'(productId, imageURL) {
    check(productId, String);
    check(imageURL, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Products.update(productId, { $set: { imageURL: imageURL } });
  }
});

Products.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Products.publicFields = {
  name: 1,
  category: 1,
  description: 1,
  unit: 1,
  currentPrice: 1,
  createdAt: 1,
  productStatus: 1,
  priceHistory: 1,
  imageURL: 1
};
