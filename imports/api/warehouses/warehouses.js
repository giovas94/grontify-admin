import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class WarehousesCollection extends Mongo.Collection {
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

export const Warehouses = new WarehousesCollection('Warehouses');

Warehouses.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Warehouses.publicFields = {
  name: 1,
  createdAt: 1,
};
