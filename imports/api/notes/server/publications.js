import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { OrderNotes } from '../notes';


Meteor.publish('orderNotes', function(orderId) {
  if(!this.userId) {
    return this.ready();
  }

  return OrderNotes.find({orderId});
});
