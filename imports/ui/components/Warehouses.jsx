import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import Warehouse from './Warehouse.jsx';
import Loading from '../pages/Loading.jsx';

import { createContainer } from 'meteor/react-meteor-data';

import { Warehouses } from '../../api/warehouses/warehouses.js';

class WarehousesPage extends Component {
  constructor(props) {
    super(props);
  }

  renderWarehouses() {
    return this.props.warehouses.map((warehouse) => (
      <Warehouse key={warehouse._id} warehouse={warehouse} />
    ));
  }

  render() {
    return (
      <div>
        <h2 style={{display: "inline-block"}}>Almacenes</h2>
        <Link style={{
            display: 'inline-block',
            marginBottom: '16.936px',
            marginTop: '21.170px',
            float: 'right',
          }}
          to="/warehouses/new"
          className="btn-floating btn-large waves-effect waves-light light-green"
        >
          <i className="material-icons">add</i>
        </Link>


        {this.props.loading ? <Loading /> :
          <div>
            <h4>Listado de almacenes</h4>
            <table className="bordered highlight">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Estatus</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {this.renderWarehouses()}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}

WarehousesPage.propTypes = {
  warehouses: PropTypes.array,
};

export default createContainer(() => {
  const warehousesHandle = Meteor.subscribe('warehouses');
  const loading = !warehousesHandle.ready();
  return {
    loading,
    warehouses: Warehouses.find({}, { sort: { name: 1 } }).fetch(),
    currentUser: Meteor.user(),
  }
}, WarehousesPage);
