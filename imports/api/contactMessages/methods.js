import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {moment} from 'meteor/momentjs:moment';

import { ContactMessages } from './contactMessages';

export const contactMessageUpdateStatus = new ValidatedMethod({
  name: 'contactMessages.updateStatus',
  validate: new SimpleSchema({
    messageId: { type: String }
  }).validator(),
  run({ messageId }) {
    let newStatus = 'open';

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const message = ContactMessages.findOne(messageId);

    if (message && (!message.status || message.status === 'open')) {
      newStatus = 'attended';
    }

    ContactMessages.update(messageId, { $set: { status: newStatus, updatedAt: new Date(), updatedBy: this.userId } });
  }
});
