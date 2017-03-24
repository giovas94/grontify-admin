import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products/products.js';
import { Purchases } from '../../api/purchases/purchases.js';

import Purchase from './Purchase.jsx';
import Loading from '../pages/Loading.jsx';


class ProductInventory extends Component {
  constructor(props) {
    super(props);
  }

  renderTable() {
    return this.props.purchases.map((purchase) => (
      <Purchase key={purchase._id} purchase={purchase} />
    ));
  }

  render() {
    return (
      <div>
        <h2>{this.props.product.name}</h2>
        <p>
          <Link to="/products">Ir al catálogo</Link>
        </p>
        <h3>Inventario</h3>
        {this.props.loadingPurchases ?
          <Loading />
        :
          <div>
            <h4>Compras</h4>
            {this.props.purchases.length !== 0 ?
              <table className="bordered highlight">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cantidad ({this.props.product.unit}s)</th>
                    <th>Precio de compra</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderTable()}
                </tbody>
              </table>
            :
              <div>No hay registros.</div>
            }

          </div>
        }
      </div>

    )
  }
}

ProductInventory.propTypes = {
  loadingPurchases: PropTypes.bool,
  purchases: PropTypes.array,
  product: PropTypes.object,
  currentUser: PropTypes.object,
};

export default createContainer(( { params: { id } }) => {
  const purchasesHandle = Meteor.subscribe('purchases.perProduct', id);
  const loadingPurchases = !purchasesHandle.ready();
  return {
    loadingPurchases,
    purchases: Purchases.find({}, { sort: { createdAt: -1 } }).fetch(),
    product: Products.findOne(id),
    currentUser: Meteor.user(),
  };
}, ProductInventory);
