import React, {Component, PropTypes} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

class Inicio extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div style={{textAlign: 'center'}}>
          <img src="https://res.cloudinary.com/grontify/image/upload/v1476989047/logo/grontify-logo-HQ.png"
           alt="Grontify" style={{marginTop: "1rem", width: '100%', maxWidth: '450px'}}/>
          <h1>Management Panel</h1>
          {!this.props.currentUser ? <Link className="waves-effect cyan btn" to="/login"><i className="material-icons">perm_identity</i></Link> : <Link className="waves-effect cyan darken-4 btn" to="/home"><i className="material-icons">dashboard</i></Link>}
          <br/><br/>
          <a href="https://www.grontify.com">Ir al sitio web para clientes</a>
        </div>
      </div>
    )
  }
}

Inicio.propTypes = {
  currentUser: PropTypes.object,
};

Inicio.contextTypes = {
  router: React.PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Inicio);
