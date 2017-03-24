import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/stevezhu:lodash';

import Loading from '../../pages/Loading.jsx';

import { ShippingAddress } from './ShippingAddress.jsx';

export default class Collapsible extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   charge: {}
    // }
  }
  componentDidMount() {
    $('.collapsible').collapsible();

    // Meteor.call('getCharge', { customerId: this.props.order.customerId, orderId: this.props.order._id }, (err, result) => {
    //   if(!err) {
    //     this.setState({charge: result[0]})
    //   } else {
    //     console.log(err);
    //   }
    // });
  }

  render() {
    const { order } = this.props;
    return (
      <ul className="collapsible" data-collapsible="accordion">
        <li>
          <div className="collapsible-header active"><i className="material-icons">face</i>Cliente</div>
          <div className="collapsible-body">
            <p>Nombre {order.customer.profile.name} {order.customer.profile.last_name}<br/>
              Teléfono {!order.customer.profile.phone ? '' : order.customer.profile.phone }<br/>
              Email {order.customer.emails ? order.customer.emails[0].address : ''}
            </p>
          </div>
        </li>
        <li>
          <div className="collapsible-header"><i className="material-icons">place</i>Entrega</div>
          <div className="collapsible-body">
            <ShippingAddress shippingAddress={order.shippingAddress} addresses={order.customer.profile.addresses} />
          </div>
        </li>
        <li>
          <div className="collapsible-header"><i className="material-icons">payment</i>Pago</div>
          <div className="collapsible-body">
            <div>
              {order.usedCard.paymentMethod && order.usedCard.paymentMethod === 'efectivo' ?
                <p>
                  {order.usedCard['payment-description']}
                </p>
              :
                <p>
                  {order.usedCard.bank_name}<br/>{order.usedCard.card_number}<br/>
                  {order.usedCard.expiration_month} / {order.usedCard.expiration_year}
                </p>
              }
            </div>
          </div>
        </li>
        <li>
          <div className="collapsible-header"><i className="material-icons">build</i>Cargo</div>
          <div className="collapsible-body">
            <pre>
              <p>
                {!this.props.charge ? '{no se obtuvieron datos}' : JSON.stringify(this.props.charge, undefined, 2)}
              </p>
            </pre>
          </div>
        </li>
      </ul>
    )
  }
}
