import { Meteor } from 'meteor/meteor';

Meteor.publish('customers', function() {
  if(!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({'roles.grontify_com': { $exists: true }}, { fields: {"emails.address": 1, "username": 1, "roles": 1,"profile.name":1, "profile.last_name":1, "profile.status": 1, "profile.phone": 1, "createdAt": 1, "services.facebook.email": 1} });
});
