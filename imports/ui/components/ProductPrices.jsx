import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { moment } from 'meteor/momentjs:moment';

import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products/products.js';

class ProductPrices extends Component {
  constructor(props) {
    super(props);
  }

  renderPrices() {
    var sortedArr = this.props.product.priceHistory.sort(function(a, b) {
      // var dateA=new Date(a.date), dateB=new Date(b.date);
      return b.date-a.date;
    });
    return sortedArr.map((product, index) => (
      <tr key={index}>
        <td>{moment(product.date).format('DD/MM/YYYY @hh:mm:ss a')}</td>
        <td>{product.price}</td>
      </tr>
    ));
  }

  handleSubmit(event) {
    event.preventDefault();

    const newPrice = parseFloat(ReactDOM.findDOMNode(this.refs.newPrice).value);

    Meteor.call('products.updatePrice', this.props.product._id, newPrice);
  }


  render() {
    return (
      <div>
        <h2>{this.props.product.name}</h2>
        <p>
          <Link to="/products">Ir al catálogo</Link>
        </p>
        <form onSubmit={this.handleSubmit.bind(this)} >
          <label>
            Actualizar precio
            <input type="number" step="any" ref="newPrice" placeholder="Ingresa nuevo precio" />
          </label>
          <button className="btn waves-effect waves-light light-green" type="submit">Guardar nuevo precio</button>
        </form>

        <h3>Historial de precios</h3>

        <ul>
          {this.props.product.priceHistory ?
            <table className="bordered highlight">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {this.renderPrices()}
              </tbody>
            </table>
          :
            <div>No hay registros.</div>
          }
        </ul>
      </div>
    )
  }
}

ProductPrices.propTypes = {
  product: PropTypes.object,
};

export default createContainer(( { params: { id } }) => {
  return {
    product: Products.findOne(id),
    currentUser: Meteor.user(),
  };
}, ProductPrices);
