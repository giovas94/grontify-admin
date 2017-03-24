import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js'

import '../imports/startup/accounts-config.js';
import '../imports/startup/firebase-config.js';
import '../imports/startup/client/openpay-config.js';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('root'));
});
