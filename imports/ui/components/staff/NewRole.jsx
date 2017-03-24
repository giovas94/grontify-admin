import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { insertRoles } from '../../../api/staff/methods.js';


export default class NewRole extends Component {
  constructor (props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();

    const role = this.refs.roleName.value.trim();

    insertRoles.call({role}, (err, result) => {
      if(!err) {
        Materialize.toast('Rol ingresado correctamente', 4000);
        ReactDOM.findDOMNode(this.refs.roleName).value = '';
        this.context.router.replace('/staff#roles');
      } else {
        console.log(err.reason);
      }
    });
  }

  render() {
    return (
      <div className="row">
        <h3>Nuevo rol de usuario</h3>

        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s4 m6 l8">
              <i className="material-icons prefix">store</i>
              <input type="text" ref="roleName" className="validate" required/>
              <label htmlFor="roleName">Nombre</label>
            </div>
            <div className="input-field col s4 m3 l2">
              <button className="btn waves-effect waves-light light-green" type="submit" name="action">Guardar
                <i className="material-icons right">check</i>
              </button>
            </div>
            <div className="input-field col s4 m3 l2">
              <Link className="waves-effect waves-teal btn-flat" to="/staff#roles">Cancelar
                <i className="material-icons right">close</i>
              </Link>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

NewRole.contextTypes = {
  router: React.PropTypes.object,
};
