import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ContactMessages } from '../../api/contactMessages/contactMessages.js';

import ContactMessagesPage from '../components/contactMessages/ContactMessagesPage.jsx';

export default createContainer(() => {
  const subscription = Meteor.subscribe('contactMessages');
  const loading = !subscription.ready();
  const messages = ContactMessages.find({}, { sort: { createdAt: -1 } }).fetch();

  return {
    loading,
    currentUser: Meteor.user(),
    messages,
  };
}, ContactMessagesPage);
