import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';

import { ContactMessage } from './ContactMessage';

export default class ContactMessagesPage extends Component {
  changeStatus(messageId) {
    console.log(messageId);

    Meteor.call('contactMessages.updateStatus', {messageId}, (err, res) => {
      if (!err) {
        Materialize.toast('Status actualizado!', 4000);
      } else {
        console.log(err);
      }
    });
  }
  render() {
    return (
      <div>
        <h2>Mensajes de contacto</h2>
        <div className="col s12">
          <ul className="collection with-header">
            <li className="collection-header"><h4>Últimos mensajes</h4></li>
            {this.props.messages.map((message) => (
              <ContactMessage key={message._id} message={message} changeStatus={this.changeStatus.bind(this)} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}


ContactMessagesPage.propTypes = {
  loading: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.array,
}
