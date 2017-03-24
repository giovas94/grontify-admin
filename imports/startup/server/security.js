import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

Meteor.users.deny({
  update() { return true; },
  remove() { return true; }
});
