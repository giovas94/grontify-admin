import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';

import Car from './Car.jsx';
import Loading from '../pages/Loading.jsx';


import { createContainer } from 'meteor/react-meteor-data';

import { Cars } from '../../api/cars/cars.js';

class CarsPage extends Component {
  constructor(props) {
    super(props);
  }

  renderCars() {
    return this.props.cars.map((car) => (
      <Car key={car._id} car={car} users={this.props.users} usersWithCarrArr={this.props.usersWithCarrArr} />
    ));
  }

  render() {
    return (
      <div>
        <h2 style={{display: "inline-block"}}>Vehículos</h2>
        <Link style={{
            display: 'inline-block',
            marginBottom: '16.936px',
            marginTop: '21.170px',
            float: 'right',
          }}
          to="/cars/new"
          className="btn-floating btn-large waves-effect waves-light light-green"
        >
          <i className="material-icons">add</i>
        </Link>

        {this.props.loading ? <Loading />
        :
          <div>
            <h4>Listado de vehículos</h4>
            <table className="bordered highlight">
              <thead>
                <tr>
                  <th>Placas</th>
                  <th>Fecha de alta</th>
                  <th className="hide-on-small-only">Marca</th>
                  <th>Modelo</th>
                  <th className="hide-on-small-only">Año</th>
                  <th>Estatus</th>
                  <th>Asignar repartidor</th>
                </tr>
              </thead>
              <tbody>
                {this.renderCars()}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}

CarsPage.propTypes = {
  cars: PropTypes.array
};

export default createContainer(() => {
  const carsHandle = Meteor.subscribe('cars');
  const usersHandle = Meteor.subscribe('allUsers');
  const loading = !carsHandle.ready() && !usersHandle.ready();

  // Selectable users
  const usersWithCar = Cars.find({assignedUser: { $exists: true }}, { fields: { assignedUser: 1 } }).fetch();
  const usersWithCarrArr = _.pluck(usersWithCar, 'assignedUser');
  //const selectableUsers = Meteor.users.find({ _id: { $nin: usersArr }, 'profile.status': "activo"}).fetch();

  return {
    loading,
    cars: Cars.find({}).fetch(),
    users: Meteor.users.find({"profile.status": "activo"}, {fields: {"username": 1, "emails": 1}}).fetch(),
    usersWithCarrArr,
    currentUser: Meteor.user(),
  }
}, CarsPage);
