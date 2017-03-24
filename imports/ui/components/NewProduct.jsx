import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { insert } from '../../api/products/methods.js';


export default class NewProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productCategory: "",
      productUnit: "",
    };
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.category)).material_select();
    $(ReactDOM.findDOMNode(this.refs.unit)).material_select();
  }

  selectProductCategory() {
    this.setState({
      productCategory: ReactDOM.findDOMNode(this.refs.category).value
    });
  }

  selectProductUnit() {
    this.setState({
      productUnit: ReactDOM.findDOMNode(this.refs.unit).value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const category = ReactDOM.findDOMNode(this.refs.category).value.trim();
    const unit = ReactDOM.findDOMNode(this.refs.unit).value.trim();
    const currentPrice = parseFloat(ReactDOM.findDOMNode(this.refs.currentPrice).value);

    insert.call({name, category, unit, currentPrice});

    // Clear form
    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.currentPrice).value = '';
    $(ReactDOM.findDOMNode(this.refs.category)).prop('selectedIndex', 0); //Sets the first option as selected
    $(ReactDOM.findDOMNode(this.refs.category)).material_select();        //Update material select
    $(ReactDOM.findDOMNode(this.refs.unit)).prop('selectedIndex', 0); //Sets the first option as selected
    $(ReactDOM.findDOMNode(this.refs.unit)).material_select();        //Update material select
    this.setState({
      productCategory: "",
      productUnit: "",
    });
    this.props.toggleForm();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} >
        <div className="row">
          <div className="input-field col s12">
            <input type="text" ref="name" className="validate" required/>
            <label htmlFor="name">Nombre del producto</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <select
              ref="category"
              value={this.state.productCategory}
              onChange={this.selectProductCategory.bind(this)}
            >
              <option value="" disabled>Selecciona</option>
              <option value="frutas">Frutas</option>
              <option value="verduras">Verduras</option>
            </select>
            <label>Selecciona la categoría</label>
          </div>
          <div className="input-field col s6">
            <select
              ref="unit"
              value={this.state.productUnit}
              onChange={this.selectProductUnit.bind(this)}
            >
              <option value="" disabled>Selecciona</option>
              <option value="kilogramo">Kilogramo</option>
              <option value="pieza">Pieza</option>
              <option value="manojo">Manojo</option>
            </select>
            <label>Selecciona la unidad</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input type="number" step=".01" ref="currentPrice" className="validate" />
            <label htmlFor="name">Precio actual</label>
          </div>
        </div>

        <button className="btn waves-effect waves-light light-green" type="submit">Agregar producto</button>
      </form>
    )
  }
}
