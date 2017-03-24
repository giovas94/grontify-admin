import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const OrderNotes = new Mongo.Collection('orderNotes');

OrderNotes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

OrderNotes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
