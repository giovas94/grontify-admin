import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {moment} from 'meteor/momentjs:moment';

import { Orders } from '../orders/orders';
import { OrderNotes } from './notes';

export const newNote = new ValidatedMethod({
  name: 'orderNotes.insert',
  validate: new SimpleSchema({
    orderId: { type: String },
    text: { type: String }
  }).validator(),
  run({ orderId, text }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (text === '') {
      throw new Meteor.Error('Texto requerido', 'Ingresa texto a la nota.');
    }

    const order = Orders.findOne(orderId, { fields: { _id: 1 } });
    const user = Meteor.users.findOne(this.userId);

    let createdBy = {};
    createdBy.userId = this.userId;
    createdBy.displayName = user.profile.name.first + ' ' + user.profile.name.last;

    if (order) {
      OrderNotes.insert({
        text,
        orderId,
        createdAt: new Date(),
        createdBy
      });
      // console.log(order);
      // console.log('Owner ', user);
    } else {
      throw new Meteor.Error('Error en orden', 'No existe una orden con el id proporcionado.');
    }
  }
});
