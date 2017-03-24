import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Purchases } from '../purchases.js';
import { Products } from '../../products/products.js';

Meteor.publishComposite('purchases.perProduct', function purchasesPerProduct(productId) {
  new SimpleSchema({
    productId: {type: String},
  }).validate({ productId });

  const userId = this.userId;

  if(!userId) {
    return this.ready();
  }

  return {
    find() {
      const query = {
        _id: productId,
      };

      const options = {
        fields: { _id: 1 },
      };

      return Products.find(query, options);
    },

    children: [{
      find(product) {
        return Purchases.find({ productId: product._id }, { fields: Purchases.publicFields });
      }
    }]
  }
})
