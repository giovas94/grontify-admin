import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <div className="row">
          <div className="col s12 m12">
            <div className="card light-green darken-1">
              <div className="card-content white-text">
                <span className="card-title">Mandados del día <b className="right">{this.props.todayOrders}</b></span>
              </div>
            </div>
          </div>

          <div className="col s12 m6">
            <div className="card cyan darken-1">
              <div className="card-content white-text">
                <span className="card-title">Mandados totales <b className="right">{this.props.totalOrders}</b></span>
              </div>
            </div>
          </div>

          <div className="col s12 m6">
            <div className="card amber darken-1">
              <div className="card-content white-text">
                <span className="card-title">Mandados pendientes <b className="right">{this.props.pendingOrders}</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default createContainer(() => {
  const totalOrdersSubs = Meteor.subscribe('totalOrders');
  const pendingOrdersSubs = Meteor.subscribe('pendingOrders');
  const todayOrdersSubs = Meteor.subscribe('todayOrders');
  const loading = !totalOrdersSubs.ready() && !pendingOrdersSubs.ready();
  return {
    loading,
    totalOrders: Counts.get('total-orders'),
    pendingOrders: Counts.get('pending-orders'),
    todayOrders: Counts.get('today-orders')
  };
}, Dashboard);
