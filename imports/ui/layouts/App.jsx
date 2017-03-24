import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { Products } from '../../api/products/products.js';

import Product from '../components/Product.jsx';
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';
import Loading from '../pages/Loading.jsx';

// App component - represents the whole App
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(".button-collapse").sideNav({
      draggable: true
    });

    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  }

  logout() {
    Meteor.logout();

    this.context.router.push('/');

    Materialize.toast('Bye!, Logout exitoso.', 4000)
  }

  setActive(pathname) {
    return (this.props.location.pathname === pathname ? 'active' : '')
  }

  render() {
    return (
      <div className="page-flexbox-wrapper">
        {/* <!-- Dropdown Structure --> */}
        <ul id="nav-dropdown" className="dropdown-content">
          <li className={this.setActive('/warehouses')}><Link to="/warehouses"><i className="material-icons left">store</i>Almacenes</Link></li>
          <li className={this.setActive('/staff')}><Link to="/staff"><i className="material-icons left">supervisor_account</i>Colaboradores</Link></li>
          <li className={this.setActive('/shipping')}><Link to="/shipping"><i className="material-icons left">local_shipping</i>Envíos</Link></li>
          <li className={this.setActive('/cars')}><Link to="/cars"><i className="material-icons left">drive_eta</i>Vehículos</Link></li>
        </ul>
        <nav>
          <div className="nav-wrapper cyan darken-3">
            <Link to="/home" className="brand-logo"><img src="https://res.cloudinary.com/grontify/image/upload/v1476989047/logo/grontify-logo-HQ.png" height="50px" alt="Grontify" /></Link>
            <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
            <ul className="right hide-on-med-and-down">
              <li className={this.setActive('/home')}><Link to="/home"><i className="material-icons left">dashboard</i>Dashboard</Link></li>
              <li className={this.setActive('/products')}><Link to="/products"><i className="material-icons left">view_list</i>Catálogo</Link></li>
              <li className={this.setActive('/customers')}><Link to="/customers"><i className="material-icons left">person</i>Clientes</Link></li>
              <li className={this.setActive('/purchases/new')}><Link to="/purchases/new"><i className="material-icons left">money_off</i>Compras</Link></li>
              <li className={this.setActive('/orders')}><Link to="/orders"><i className="material-icons left">monetization_on</i>Ordenes</Link></li>
              <li className={this.setActive('/contact-messages')}><Link to="/contact-messages"><i className="material-icons left">mail</i>Mensajes</Link></li>
              <li>
                <a className="dropdown-button" href="#!" data-activates="nav-dropdown">
                  <i className="material-icons">business</i>
                </a>
              </li>
              <li><a href="#" className="" onClick={this.logout.bind(this)}><i className="material-icons left">exit_to_app</i>Salir</a></li>
            </ul>
            <ul className="side-nav" id="mobile-demo">
              <li><Link to="/"><i className="material-icons left">home</i>Home</Link></li>
              <li className={this.setActive('/home')}><Link className="waves-effect" to="/home"><i className="material-icons left">dashboard</i>Dashboard</Link></li>
              <li className={this.setActive('/products')}><Link className="waves-effect" to="/products"><i className="material-icons left">view_list</i>Catálogo</Link></li>
              <li className={this.setActive('/customers')}><Link className="waves-effect" to="/customers"><i className="material-icons left">person</i>Clientes</Link></li>
              <li className={this.setActive('/purchases/new')}><Link className="waves-effect" to="/purchases/new"><i className="material-icons left">money_off</i>Compras</Link></li>
              <li className={this.setActive('/orders')}><Link className="waves-effect" to="/orders"><i className="material-icons left">monetization_on</i>Ordenes</Link></li>
              <li className={this.setActive('/contact-messages')}><Link className="waves-effect" to="/contact-messages"><i className="material-icons left">mail</i>Mensajes contacto</Link></li>
              <li className="divider"></li>
              <li className={this.setActive('/warehouses')}><Link className="waves-effect" to="/warehouses"><i className="material-icons left">store</i>Almacenes</Link></li>
              <li className={this.setActive('/staff')}><Link className="waves-effect" to="/staff"><i className="material-icons left">supervisor_account</i>Colaboradores</Link></li>
              <li className={this.setActive('/shipping')}><Link className="waves-effect" to="/shipping"><i className="material-icons left">local_shipping</i>Envíos</Link></li>
              <li className={this.setActive('/cars')}><Link className="waves-effect" to="/cars"><i className="material-icons left">drive_eta</i>Vehículos</Link></li>
              <li className="divider"></li>
              <li><a href="#" className="" onClick={this.logout.bind(this)}><i className="material-icons left">exit_to_app</i>Salir</a></li>
            </ul>
          </div>
        </nav>
        <main className="container">
          {this.props.loading ? <Loading/> : this.props.children}
        </main>
        <footer className="page-footer cyan darken-3">
          <div className="footer-copyright">
            <div className="container">
            Grontify SAS de CV © 2016 Copyright
            <a className="grey-text text-lighten-4 right" href="#!">Bernav Enterprises</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  loading: PropTypes.bool,
  currentUser: PropTypes.object,
};

App.contextTypes = {
  router: React.PropTypes.object
};
