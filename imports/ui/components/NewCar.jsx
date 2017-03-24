import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { insert } from '../../api/cars/methods.js';

export default class NewCar extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const licensePlate = ReactDOM.findDOMNode(this.refs.licensePlate).value.trim();
    const model = ReactDOM.findDOMNode(this.refs.model).value;
    const brand = ReactDOM.findDOMNode(this.refs.brand).value;
    const year = parseInt(ReactDOM.findDOMNode(this.refs.year).value);

    insert.call({licensePlate, model, brand, year}, (err, result) => {
      if (!err) {
        console.log(result);
        this.context.router.replace('/cars');
      } else {
        console.log(err.reason);
      }
    });

    ReactDOM.findDOMNode(this.refs.licensePlate).value = '';
    ReactDOM.findDOMNode(this.refs.model).value = '';
    ReactDOM.findDOMNode(this.refs.brand).value = '';
    ReactDOM.findDOMNode(this.refs.year).value = '';

  }

  render() {
    return (
      <div className="row">
        <h3>Nuevo vehículo</h3>

        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">drive_eta</i>
              <input type="text" ref="licensePlate" className="validate" required/>
              <label htmlFor="licensePlate">Placas</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input type="text" ref="brand" className="validate" required/>
              <label htmlFor="brand">Marca</label>
            </div>
            <div className="input-field col s4">
              <input type="text" ref="model" className="validate" required/>
              <label htmlFor="model">Modelo</label>
            </div>
            <div className="input-field col s4">
              <input type="number" min="0" maxLength="4" ref="year" className="validate" required/>
              <label htmlFor="year">Año</label>
            </div>
          </div>

          <div className="row">
            <Link style={{float: "right"}} className="waves-effect waves-teal btn-flat" to="/cars">Cancelar
              <i className="material-icons right">close</i>
            </Link>
            <button style={{float: "right"}} className="btn waves-effect waves-light light-green" type="submit">Guardar
              <i className="material-icons right">check</i>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

NewCar.contextTypes = {
  router: React.PropTypes.object,
};
