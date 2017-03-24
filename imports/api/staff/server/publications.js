import { Meteor } from 'meteor/meteor';

Meteor.publish('allUsers', function() {
  if(!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({'roles.admin_grontify_com': { $exists: true }}, { fields: {"emails.address": 1, "username": 1, "roles": 1, "profile.status": 1} });
});

Meteor.publish(null, function (){
  if(!this.userId) {
      return this.ready();
  }

  return Meteor.roles.find({})
});
