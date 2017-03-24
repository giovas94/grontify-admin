import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ContactMessages } from '../contactMessages';


Meteor.publish('contactMessages', function() {
  if(!this.userId) {
    return this.ready();
  }

  return ContactMessages.find({});
});
