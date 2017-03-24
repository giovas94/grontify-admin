import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { browserHistory } from 'react-router';

export class ShippingType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editionMode: false
    }
  }
  _handleUpdateShippingCost(event) {
    const newCost = parseFloat(event.target.value);

    if (event.key === 'Enter' && !isNaN(newCost)) {
      Meteor.call('shippingTypes.updateCost', {shippingTypeId: this.props.type._id, newCost}, (err) => {
        if (!err) {
          this.setState({editionMode: false});
          Materialize.toast('Costo de envío actualizado!', 4000);
        } else {
          console.log(err);
        }
      });
    }
  }
  render() {
    const { type } = this.props;
    return (
      <li className="collection-item">
        <div style={{marginBottom:0}} className="row">
          {type.name}
          {this.state.editionMode ?
            <div className="secondary-content">
              <input type="number" step=".01" ref="newCost" placeholder="Ingresa nuevo costo" onKeyPress={this._handleUpdateShippingCost.bind(this)} onBlur={() => this.setState({editionMode: false})} autoFocus/>
            </div>
          :
            <a href="#!" className="secondary-content" onClick={() => this.setState({editionMode: true})}>Costo actual {accounting.formatMoney(type.currentCost)}</a>
          }
        </div>
      </li>
    )
  }
}
