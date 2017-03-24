import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products/products.js';
import { insert } from '../../api/purchases/methods.js';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

class NewPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: "",
      selectedProductUnit: "",
    }
  }

  renderProducts() {
    var newArray = [];
    this.props.products.forEach(function(product) { newArray.push({"value": product._id, "label": product.name, "unit": product.unit }); });
    return newArray;
  }

  handleChange(product) {
    this.setState({selectedProduct: product.value, selectedProductUnit: product.unit});
  }

  handleSubmit(event) {
    event.preventDefault();

    const productId = this.state.selectedProduct;
    const purchaseQuantity = parseFloat(ReactDOM.findDOMNode(this.refs.purchaseQuantity).value);
    const purchasePrice = parseFloat(ReactDOM.findDOMNode(this.refs.purchasePrice).value);

    insert.call({productId, purchaseQuantity, purchasePrice}, (err, result) => {
      if(!err) {
        console.log(result);
        this.context.router.replace(`/products/${productId}/inventory`);
      }
      console.log(err.reason);
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.purchaseQuantity).value = '';
    ReactDOM.findDOMNode(this.refs.purchasePrice).value = '';
    this.setState({
      selectedProduct: "",
      selectedProductUnit: "",
    });

  }

  render() {
    return (
      <div>
        <h2>Registrar compra</h2>
        <form onSubmit={this.handleSubmit.bind(this)} >
          <h4>Selecciona un producto</h4>
          <Select
            name="products-select"
            resetValue=""
            placeholder="Selecciona un producto..."
            value={this.state.selectedProduct}
            options={this.renderProducts()}
            onChange={this.handleChange.bind(this)}
            matchProp="label"
          />
          <br/>
          {this.state.selectedProduct ?
            <div>
              <div className="row">
                <div className="input-field col s9 m10">
                  <input type="number" id="purchaseQuantity" ref="purchaseQuantity"/>
                  <label htmlFor="purchaseQuantity">Cantidad comprada</label>
                </div>
                <div className="input-field col s3 m2">
                  <span style={{paddingTop: '1rem', position:'fixed'}}>{this.state.selectedProductUnit+"s"}</span>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input type="number" id="purchasePrice" ref="purchasePrice" step=".01"/>
                  <label htmlFor="purchasePrice">Precio total de compra</label>
                </div>
              </div>
              <br/>
              <button className="btn waves-effect waves-light light-green" type="submit">
                Guardar compra<i className="material-icons right">check</i>
              </button>
            </div>
          :
            ""
          }
        </form>
      </div>
    )
  }
}

NewPurchase.propTypes = {
  products: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

NewPurchase.contextTypes = {
  router: React.PropTypes.object,
};

export default createContainer(() => {
  return {
    products: Products.find({}, {fields: {name: 1, unit: 1}, sort: { name: 1 } }).fetch(),
    currentUser: Meteor.user(),
  }
},NewPurchase);
