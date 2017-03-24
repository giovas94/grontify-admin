import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { insert } from '../../api/warehouses/methods.js';

export default class NewWarehouse extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();

    insert.call({name}, function(err, result) {
      if (!err) {
        alert('Ok!, Nuevo almacén ingresado.');
      }
    });

    ReactDOM.findDOMNode(this.refs.name).value = '';

    this.context.router.replace('/warehouses');
  }

  render() {
    return (
      <div className="row">
        <h3>Nuevo almacén</h3>

        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s4 m6 l8">
              <i className="material-icons prefix">store</i>
              <input type="text" ref="name" className="validate" required/>
              <label htmlFor="name">Nombre</label>
            </div>
            <div className="input-field col s4 m3 l2">
              <button className="btn waves-effect waves-light light-green" type="submit" name="action">Guardar
                <i className="material-icons right">check</i>
              </button>
            </div>
            <div className="input-field col s4 m3 l2">
              <Link className="waves-effect waves-teal btn-flat" to="/warehouses">Cancelar
                <i className="material-icons right">close</i>
              </Link>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

NewWarehouse.contextTypes = {
  router: React.PropTypes.object,
};
