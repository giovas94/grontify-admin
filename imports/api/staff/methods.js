import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const insertRoles = new ValidatedMethod({
  name: 'roles.insert',
  validate: new SimpleSchema({
    role: { type: String },
  }).validator(),
  run({role}) {

    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Roles.createRole(role);
  }
});
