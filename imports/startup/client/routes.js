import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// router components
import AppContainer from '../../ui/containers/AppContainer.jsx';

import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';
import Inicio from '../../ui/pages/Inicio.jsx';
import Login from '../../ui/pages/Login.jsx';
import RecoverPassword from '../../ui/pages/RecoverPassword.jsx';
import Dashboard from '../../ui/components/Dashboard.jsx';

import ProductsCatalog from '../../ui/components/ProductsCatalog.jsx';
import ProductPage from '../../ui/components/ProductPage.jsx';
import ProductPrices from '../../ui/components/ProductPrices.jsx';

import WarehousesPage from '../../ui/components/Warehouses.jsx';
import NewWarehouse from '../../ui/components/NewWarehouse.jsx';

import CarsPage from '../../ui/components/Cars.jsx';
import NewCar from '../../ui/components/NewCar.jsx';

import ProductInventory from '../../ui/components/ProductInventory.jsx';
import NewPurchase from '../../ui/components/NewPurchase.jsx';

import Staff from '../../ui/components/Staff.jsx';
import NewRole from '../../ui/components/staff/NewRole.jsx';
import NewUser from '../../ui/components/staff/NewUser.jsx';

import Customers from '../../ui/components/Customers.jsx';

import OrdersContainer from '../../ui/containers/OrdersContainer.jsx';
import OrderDetailContainer from '../../ui/containers/OrderDetailContainer.jsx';

import ContactMessagesContainer from '../../ui/containers/ContactMessagesContainer.jsx';

// import ShippingTypesPage from '../../ui/components/shippingTypes/ShippingTypesPage.jsx';
import ShippingTypesContainer from '../../ui/containers/ShippingTypesContainer.jsx';

var requireLogin = (nextState, replace, next) => {
  if (!Meteor.userId()) {
    replace('/login');
  }

  next();
};

var redirectIfLoggedIn = (nextState, replace, next) => {
  if (Meteor.userId()) {
    replace('/home');
  }

  next();
};

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Inicio} />
    <Route path="/login" component={Login} onEnter={redirectIfLoggedIn} />
    <Route path="/retrieve" component={RecoverPassword} onEnter={redirectIfLoggedIn} />
    <Route path="/home" component={AppContainer}>
      <IndexRoute component={Dashboard} onEnter={requireLogin} />
    </Route>
    <Route component={AppContainer}>

      <Route path="products" component={ProductsCatalog} onEnter={requireLogin} />
      <Route path="/products/:id" component={ProductPage} onEnter={requireLogin} />
      <Route path="/products/:id/prices" component={ProductPrices} onEnter={requireLogin} />
      <Route path="/products/:id/inventory" component={ProductInventory} onEnter={requireLogin} />

      <Route path="customers" component={Customers} onEnter={requireLogin} />

      <Route path="warehouses" component={WarehousesPage} onEnter={requireLogin} />
      <Route path="warehouses/new" component={NewWarehouse} />

      <Route path="purchases/new" component={NewPurchase} onEnter={requireLogin} />

      <Route path="cars" component={CarsPage} onEnter={requireLogin} />
      <Route path="cars/new" component={NewCar} onEnter={requireLogin} />

      <Route path="orders" component={OrdersContainer} onEnter={requireLogin} />
      <Route path="orders/detail/:id" component={OrderDetailContainer} onEnter={requireLogin} />

      <Route path="staff" component={Staff} onEnter={requireLogin} />
      <Route path="staff/new" component={NewUser} onEnter={requireLogin} />

      <Route path="roles/new" component={NewRole} onEnter={requireLogin} />

      <Route path="contact-messages" component={ContactMessagesContainer} onEnter={requireLogin}/>
      <Route path="shipping" component={ShippingTypesContainer} onEnter={requireLogin}/>

    </Route>
    <Route path="*" component={NotFoundPage} />
  </Router>
);
