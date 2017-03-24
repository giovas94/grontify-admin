import '../imports/startup/server/security.js';
import '../imports/startup/server/fixures.js';
import '../imports/startup/server/openpay-config.js';
import '../imports/startup/server/mail-url.js';

import '../imports/api/products/methods.js';
import '../imports/api/products/server/publications.js';

import '../imports/api/purchases/methods.js';
import '../imports/api/purchases/server/publications.js';

import '../imports/api/warehouses/methods.js';
import '../imports/api/warehouses/server/publications.js';

import '../imports/api/cars/methods.js';
import '../imports/api/cars/server/publications.js';

//Staff
import '../imports/api/staff/methods.js';
import '../imports/api/staff/server/publications.js';
import '../imports/api/staff/server/usersMethods.js';

//Customers
import '/imports/api/customers/server/methods.js';
import '/imports/api/customers/server/publications.js';


//Orders (Mandados)
import '../imports/api/orders/methods.js';
import '../imports/api/orders/server/publications.js';

//ContactMessages (Mensajes de contacto)
import '../imports/api/contactMessages/methods.js';
import '../imports/api/contactMessages/server/publications.js';

//OrderNotes
import '../imports/api/notes/methods.js';
import '../imports/api/notes/server/publications.js';

//ShippingTypes
import '../imports/api/shippingTypes/methods.js';
import '../imports/api/shippingTypes/server/publications.js';
