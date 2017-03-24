import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class CarsCollection extends Mongo.Collection {
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

export const Cars = new CarsCollection('Cars');

Cars.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Cars.publicFields = {
  createdAt: 1,
  status: 1,
  licensePlate: 1,
  model: 1,
  brand: 1,
  year: 1
};
