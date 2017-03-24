import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ShippingTypes } from '../../api/shippingTypes/shippingTypes.js';

import ShippingTypesPage from '../components/shippingTypes/ShippingTypesPage.jsx';


export default createContainer(() => {
  const subscription = Meteor.subscribe('shippingTypes');
  const loading = !subscription.ready();
  const shippingTypes = ShippingTypes.find({}, { sort: { currentCost: -1 } }).fetch();

  return {
    loading,
    currentUser: Meteor.user(),
    shippingTypes,
  };
}, ShippingTypesPage);
