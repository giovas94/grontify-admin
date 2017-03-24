import { Meteor } from 'meteor/meteor';

import { Products } from '../products.js';

const MAX_PRODUCTS = 500;

Meteor.publish('products', function productsPublication(limit) {
  if(!this.userId) {
      return this.ready();
  }
  const options = {
    sort: {name: 1},
    limit: Math.min(limit, MAX_PRODUCTS)
  };

  return Products.find({}, options);
});

Meteor.publish('productsCount', function productsCountPubliation() {
  if(!this.userId) {
      return this.ready();
  }

  Counts.publish(this, 'Products.Count', Products.find());
});
