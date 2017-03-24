import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PurchasesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Purchases = new PurchasesCollection('Purchases');

Purchases.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Purchases.schema = new SimpleSchema({
  productId: {
    type: String
  }
});

Purchases.publicFields = {
  productId: 1,
  purchaseQuantity: 1,
  purchasePrice: 1,
  createdAt: 1,
  createdBy: 1,
  purchaseStatus: 1
};
