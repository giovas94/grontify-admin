import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


//Server -users methods
export const insertUsers = new ValidatedMethod({
  name: 'users.insert',
  validate: new SimpleSchema({
    name: { type: String },
    lastName: { type: String },
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String },
    roles: { type: String },
    address: { type: Object },
    "address.street": { type: String },
    "address.line_1": { type: String },
    "address.line_2": { type: String },
    "address.state": { type: String },
    "address.zipCode": { type: String, regEx: SimpleSchema.RegEx.ZipCode },

  }).validator(),
  run({name, lastName, email, password, roles, address}) {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const newUser = Accounts.createUser({
      email,
      password,
      profile: {
        name,
        lastName,
        address,
        status: 'activo'
      }
    });

    Roles.setUserRoles(newUser, roles, 'admin.grontify.com');

    return newUser;
  }
});


export const updateUsersRoles = new ValidatedMethod({
  name: 'users.updateRoles',
  validate: new SimpleSchema({
    userId: { type: String },
    roles: { type: String }
  }).validator(),
  run({userId, roles}) {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Roles.setUserRoles(userId, roles, 'admin.grontify.com');
  }
});

export const updateStatus = new ValidatedMethod({
  name: 'users.updateStatus',
  validate: new SimpleSchema({
    userId: { type: String },
    status: { type: String },
  }).validator(),
  run({userId, status}) {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({"_id": userId}, {$set: { "profile.status": status }});
  }
})

export const isStaffUser = new ValidatedMethod({
  name: 'users.isStaffUser',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email }
  }).validator(),
  run({email}) {
    const user = Accounts.findUserByEmail(email);

    const isStaff = Roles.getGroupsForUser(user._id)[0] === 'admin_grontify_com'

    return user ? isStaff : false;
  }
});
