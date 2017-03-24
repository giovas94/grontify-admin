import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Loading from '../../pages/Loading.jsx';
import { Order } from './Order.jsx';

export default class OrdersPage extends Component {
  componentDidMount() {
    $.extend($.fn.pickadate.defaults, {
      monthsFull: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
      weekdaysFull: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      weekdaysShort: [ 'dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab' ],
      today: 'hoy',
      clear: 'borrar',
      close: 'cerrar',
      firstDay: 1,
      format: 'd !de mmmm !de yyyy',
      formatSubmit: 'yyyy/mm/dd'
    })

    $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 10,
      max: true,
      onSet: function(context) {
        let selectedDate = moment(context.select).toDate();
        this.props.dateQuery.set(selectedDate);
      }.bind(this)
    });
  }
  render() {
    return (
      <div>
        <h2>Mandados - Ordenes</h2>
        <div className="row">
          <div className="input-field col s12 m6">
            <i className="material-icons prefix">date_range</i>
            <input type="date" className="datepicker" data-value={moment(this.props.dateQuery.get()).format('YYYY/MM/DD')} id="date" />
          </div>
          <div className="input-field col s12 m6">
            <i className="material-icons prefix">search</i>
            <input type="text" id="search" value={this.props.idFilter.get()} onChange={(event) => ( this.props.idFilter.set(event.target.value) )}/>
            <label htmlFor="search">Buscar por ID</label>
          </div>
        </div>
        <div className="row">
        {this.props.loading ?
          <Loading />
        :
          this.props.orders.length ?
            <table className="bordered highlight responsive-table">
              <thead>
                <tr>
                  <th>Orden ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Importe</th>
                  <th>Envío</th>
                  <th>Total</th>
                  <th>Estatus</th>
                  <th>Fecha de entrega</th>
                </tr>
              </thead>
              <tbody style={{cursor: 'pointer'}}>
                { this.props.orders.map((order) => (
                  <Order key={order._id} order={order} />
                )) }
              </tbody>
            </table>
          :
            <div className="col s12">
              <p className="z-depth-2" style={{padding: '1rem'}}>No se encontraron ordenes.</p>
            </div>
        }
        </div>
      </div>
    )
  }
}

OrdersPage.propTypes = {
  loading: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  orders: React.PropTypes.array,
}
