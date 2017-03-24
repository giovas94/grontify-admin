import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Users methods (customers)
export const insertCustomers = new ValidatedMethod({
  name: 'customers.insert',
  validate: new SimpleSchema({
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String },
  }).validator(),
  run({ firstName, lastName, mobile, email, password }) {
    const newCustomer = Accounts.createUser({
      email,
      password,
      profile: {
        firstName,
        lastName,
        mobile,
        status: 'activo'
      }
    });

    Roles.addUsersToRoles(newCustomer, 'customer', 'grontify.com');

    return newCustomer;
  }
});

export const findUserByEmail = new ValidatedMethod({
  name: 'customers.findUserByEmail',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email }
  }).validator(),
  run({email}) {
    const customer = Accounts.findUserByEmail(email);


    return customer ? Roles.userIsInRole(customer._id, 'customer', 'grontify.com') : false;
  }
});
