import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { Products } from '../../api/products/products.js';

// Product component - represents a single product item
export default class Product extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  }

  updateProductStatus() {
    Meteor.call('products.updateStatus',
      this.props.product._id,
      ReactDOM.findDOMNode(this.refs.productStatus).value
    )
  }

  updateProductCategory() {
    Meteor.call('products.updateCategory',
      this.props.product._id,
      ReactDOM.findDOMNode(this.refs.productCategory).value
    )
  }

  updatePrice() {
    Meteor.call('products.updatePrice',
      this.props.product._id,
      parseFloat(ReactDOM.findDOMNode(this.refs.currentPrice).value)
    )
  }

  deleteThisProduct() {
    Meteor.call('products.remove', this.props.product._id);
  }

  render() {
    const product = this.props.product;

    return (
      <tr>
        <td><strong>{product.name}</strong></td>
        <td className="hide-on-small-only">
          <select
            ref="productCategory"
            value={product.category}
            onChange={this.updateProductCategory.bind(this)}
            className="browser-default"
          >
            <option value="frutas">Frutas</option>
            <option value="verduras">Verduras</option>
          </select>
        </td>
        <td>{accounting.formatMoney(product.currentPrice)}</td>
        <td>{product.unit}</td>
        <td>
          <select
            ref="productStatus"
            value={product.productStatus}
            onChange={this.updateProductStatus.bind(this)}
            className="browser-default"
          >
            <option value="activo">Activo</option>
            <option value="agotado">Agotado</option>
            <option value="fuera-temporada">Fuera de temporada</option>
          </select>
        </td>
        <td>
          <a href="#" className="dropdown-button btn light-green"
            data-beloworigin="true"
            data-activates={"dropdown"+product._id}>
            <i className="material-icons">expand_more</i>
          </a>

          <ul id={"dropdown"+product._id} className="dropdown-content">
            <li><Link to={`/products/${product._id}`}>Detalle</Link></li>
            <li><Link to={`/products/${product._id}/inventory`}>Inventario</Link></li>
            <li><Link to={`/products/${product._id}/prices`}>Precios</Link></li>
          </ul>
        </td>
        {/* <td>
          <button className="delete btn waves-effect waves-light" onClick={this.deleteThisProduct.bind(this)}>
            <i className="material-icons">delete</i>
          </button>
        </td> */}
      </tr>
    );
  }
}

Product.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  product: PropTypes.object.isRequired,
};
