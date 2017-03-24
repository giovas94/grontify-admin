import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products/products.js';

import Product from './Product.jsx';
import NewProduct from './NewProduct.jsx';

let limit = new ReactiveVar(5);
let searchQueryName = new ReactiveVar("");
let searchQueryCategory = new ReactiveVar("");

class ProductsCatalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
    };
  }

  componentWillUnmount() {
    searchQueryName.set('');
    searchQueryCategory.set('');
  }

  toggleForm() {
    this.setState({showForm: !this.state.showForm});
  }

  renderProducts() {
    return this.props.products.map((product) => (
      <Product key={product._id} product={product} />
    ));
  }

  render() {
    return (
      <div>
        { this.props.currentUser ?
          <div>
            <div>
              <h2 style={{display: "inline-block"}}>Productos</h2>
              <a style={{
                    display: 'inline-block',
                    marginBottom: '16.936px',
                    marginTop: '21.170px',
                    float: 'right',
                  }}
                className="btn-floating btn-large waves-effect waves-light light-green"
                onClick={this.toggleForm.bind(this)}
              >
              {this.state.showForm ?
                <i className="material-icons">remove</i>
              : <i className="material-icons">add</i> }
              </a>
            </div>

            {this.state.showForm ?
              <div>
                <h4>Nuevo producto</h4>
                <NewProduct toggleForm={this.toggleForm.bind(this)} />
              </div>
            :
              ''
            }

            <br/>
            <h4>Catálogo</h4>
            <table className="bordered highlight">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="hide-on-small-only">Categoría</th>
                  <th>Precio Público</th>
                  <th>Unidad</th>
                  <th>Estatus</th>
                  <th>Ir A</th>
                  {/* <th>Eliminar</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th><input placeholder="Buscar" ref="nameSearch" type="text"
                    onChange={(e) => { searchQueryName.set(e.target.value) }} /> </th>
                  <th className="hide-on-small-only"><input placeholder="Buscar" ref="categorySearch" type="text"
                    onChange={(e) => { searchQueryCategory.set(e.target.value) }} /></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                { !this.props.products.length ?
                  <tr className="col s12">
                    <th colSpan="6">No hay productos ingresados</th>
                  </tr>
                :
                  this.renderProducts()
                }
              </tbody>
            </table>

            <br/>
            {this.props.productsCount > limit.get() ?
              <div style={{textAlign: 'center'}}>
                <a className="waves-effect waves-light btn center-align light-green"
                  onClick={() => {limit.set(limit.get() + 5)}}>
                  Cargar más...
                </a>
              </div>
            :
              ''
            }
          </div>
        :
          <h3>No tienes permisos para ver esta página.</h3>
        }
      </div>
    )
  }
}

ProductsCatalog.propTypes = {
  products: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  let regexName = new RegExp(searchQueryName.get(), 'i');
  let regexCategory = new RegExp(searchQueryCategory.get(), 'i');
  Meteor.subscribe('productsCount');
  return {
    products: Products.find({name: regexName, category: regexCategory}, {limit: limit.get()}).fetch(),
    productsCount: Counts.get('Products.Count'),
    currentUser: Meteor.user(),
  };
}, ProductsCatalog);
