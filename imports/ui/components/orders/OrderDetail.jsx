import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { sweetAlert } from 'meteor/kevohagan:sweetalert';
import { Link, browserHistory } from 'react-router';

import Loading from '../../pages/Loading.jsx';
import Collapsible from './Collapsible.jsx';
import OrderNotesWidget from './notes/OrderNotes.jsx';

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderStatus: this.props.order.status,
      editStatus: false,
      editShippingDate: false,
      charge: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order.customerId) {
      Meteor.call('getCharge', { customerId: nextProps.order.customerId, orderId: nextProps.order._id }, (err, result) => {
        if(!err) {
          this.setState({charge: result[0]});
        } else {
          console.log(err);
        }
      });
    }
  }

  handleUpdateStatus(event) {
    let transactionId = '';
    if (!this.props.order.usedCard.paymentMethod && this.props.order.usedCard.id) {
      transactionId = this.state.charge.id
    }
    Meteor.call('orders.updateStatus', {orderId: this.props.order._id, newStatus: event.target.value, transactionId }, (err, result) => {
      if (!err) {
        Materialize.toast('Estatus actualizado!', 4000);
      } else {
        Materialize.toast(err.error, 4000);
        console.log(err);
      }
    });
  }

  handleUpdateShippingDate(event) {
    let newShippingDate = moment(event.target.value).toDate();

    Meteor.call('orders.updateShippingDate', {orderId: this.props.order._id, newShippingDate}, (err) => {
      if (!err) {
        Materialize.toast('Fecha de entrega actualizada!', 4000);
        console.log('Updated!');
      } else {
        console.log(err);
      }
    })
  }

  handleCancelOrder(event) {

    swal({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sí, quiero cancelar la orden!",
      cancelButtonText: "No, no quiero cancelar la orden!",
      closeOnConfirm: false
    },
    function(isConfirm){
      if (isConfirm) {
        let transactionId = '';
        if (!this.props.order.usedCard.paymentMethod && this.props.order.usedCard.id) {
          transactionId = this.state.charge.id
        }
        Meteor.call('orders.cancelOrder', { orderId: this.props.order._id, transactionId: transactionId }, (err, res) => {
          if (!err) {
            swal("Mandado cancelado!", "El mandado seleccionado ha sido cancelado.", "success");
            // console.log('Updated!');
          } else {
            swal(err.reason, err.message, "error");
            // console.log(err);
          }
        })
      }
    }.bind(this));
  }

  render() {
    const { order, charge } = this.props;
    return (
      <div>
        {this.props.loading ?
          <Loading />
        :
          <div>
            <h2>Detalle del mandado <span style={{fontSize: 'small'}}>{order._id}</span></h2>
            <Link style={{marginBottom: '1rem', display: 'flex', alignItems: 'center'}} to="/orders"><i className="material-icons">keyboard_arrow_left</i> <span>Regresar</span></Link>

            <div className="row">
              <div className="col s12">
                <div className="z-depth-1" style={{padding: '1rem'}}>
                  <p>
                    Fecha {moment(order.createdAt).format('DD/MM/YYYY hh:mm:ss a')}
                  </p>

                  <p>
                    Subtotal {accounting.formatMoney(order.secureSubtotal)} <br/>
                    Envío <small>{order.shippingType}</small> {accounting.formatMoney(order.shippingCost)}<br/>
                    Descuento {accounting.formatMoney(order.shippingDiscount + order.orderDiscount)}<br/>
                    <b>Total {accounting.formatMoney(order.total)}</b>
                  </p>
                  <div>
                    {!this.state.editStatus ?
                      <button className="waves-effect waves-light btn light-green" style={{margin: '1rem 1rem 0 0'}} onClick={() => this.setState({editStatus: true})}>Estatus {order.status}</button>
                    :
                      <div>
                        <label>Estatus del mandado</label>
                        <select ref="status" className="browser-default" value={order.status} onChange={this.handleUpdateStatus.bind(this)} onBlur={() => this.setState({editStatus: false})} autoFocus>
                          <option value="" disabled>Modificar estatus</option>
                          <option value="created">Created</option>
                          <option value="processed">Processed</option>
                          <option value="sent">Sent</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    }

                    {!this.state.editShippingDate ?
                      <button className={`waves-effect waves-light btn ${order.shippingType !== 'programado' || order.status === 'delivered' || order.status === 'canceled' ? 'disabled' : ''}`} style={{margin: '1rem 1rem 0 0'}} disabled={order.shippingType !== 'programado' || order.status === 'delivered' || order.status === 'canceled'} onClick={() => this.setState({editShippingDate: true})}>Fecha de entrega {moment(order.shippingDate).format('DD/MM/YYYY @ HH:mm')}</button>
                    :
                      <input type="date" className="datepicker" id="date" min={moment(order.shippingDate).add(1,'d').format('YYYY-MM-DD')} value={moment(order.shippingDate).format('YYYY-MM-DD')} onChange={this.handleUpdateShippingDate.bind(this)} onBlur={() => this.setState({editShippingDate: false})} autoFocus/>
                    }

                    <button className={`waves-effect waves-light btn red ${order.status === 'delivered' || order.status === 'canceled' ? 'disabled' : ''}`} style={{margin: '1rem 1rem 0 0'}} disabled={order.status === 'delivered' || order.status === 'canceled'} onClick={this.handleCancelOrder.bind(this)}>Cancelar orden</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s12 m6">
                <Collapsible order={order} charge={this.state.charge}/>
              </div>
              <div className="col s12 m6">
                <OrderNotesWidget orderId={order._id} />
              </div>
              <div className="col s12 m12">
                {/* <div className="z-depth-1" style={{padding: '1rem'}}> */}
                  <ul className="collection with-header z-depth-1">
                    <li className="collection-header"><h4>Productos</h4></li>
                    {order.products.map((product) => (
                      <li key={product._id} className="collection-item">
                        <div>
                          <b>{product.name}</b> x {product.qty} {product.unit === 'kilogramo' ? 'kg' : product.unit === 'pieza' ? 'pza' : 'mjo'} {accounting.formatMoney(product.currentPrice)}
                          <span className="secondary-content">Importe {accounting.formatMoney(product.qty * product.currentPrice)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                {/* </div> */}
              </div>

            </div>
          </div>
        }
      </div>
    )
  }
}
