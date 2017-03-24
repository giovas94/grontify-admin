import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const productsHandle = Meteor.subscribe('products');
  const loading = !productsHandle.ready();
  return {
    loading,
    currentUser: Meteor.user(),
  };
}, App);
