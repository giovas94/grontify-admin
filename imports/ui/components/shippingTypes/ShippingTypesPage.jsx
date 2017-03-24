import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Loading from '../../pages/Loading.jsx';
import { ShippingType } from './ShippingType.jsx';

export default class ShippingTypesPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      showForm: false
    }
  }
  _handleNewShippingType() {
    const name = this.refs.name.value;
    const cost = parseFloat(this.refs.cost.value);

    Meteor.call('shippingTypes.insert', {name, cost}, (err) => {
      if (!err) {
        this.refs.name.value = '';
        this.refs.cost.value = '';
        this.setState({showForm: false});
        Materialize.toast('Tipo de envío agregado correctamente!', 4000);
      } else {
        console.log(err);
      }
    });
  }
  render() {
    return (
      <div>
        <h2>Envíos</h2>
        {this.props.loading ?
          <Loading />
        :
          <ul className="collection with-header">
            <li className="collection-header">
              <div className="row">
                <div className="col s12">
                  <h4 style={{display: 'inline-block'}}>Tipos de envío</h4>
                  <button style={{display: 'inline-block',
                  float: 'right',
                  marginBottom: '13.680px',
                  marginTop: '17.100px'}}
                  className="btn light-green waves-effect waves-light"
                  onClick={() => this.setState({showForm: !this.state.showForm})}>
                    <i className="material-icons">{this.state.showForm ? 'remove' :'add'}</i>
                  </button>
                </div>
                {!this.state.showForm ? ''
                :
                  <div className="input-field col s12">
                    <div className="row">
                      <div className="col s6 m4">
                        <input ref="name" type="text" id="name" placeholder="Tipo de envío"/>
                      </div>
                      <div className="col s6 m4">
                        <input ref="cost" type="text" id="cost" placeholder="Costo"/>
                      </div>
                      <div className="col s12 m4">
                        <button className={`waves-effect waves-light btn light-green`} onClick={this._handleNewShippingType.bind(this)}>Agregar</button>
                      </div>
                    </div>

                  </div>
                }
              </div>
            </li>
            {!this.props.shippingTypes.length ?
              <li className="collection-item">No hay registros</li>
            :
              this.props.shippingTypes.map((type) => (
                <ShippingType key={type._id} type={type} />
              ))
            }
          </ul>
        }
      </div>
    )
  }
}

ShippingTypesPage.propTypes = {
  loading: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  shippingTypes: React.PropTypes.array,
}
