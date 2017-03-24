import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';

moment.locale('es');

export class ContactMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingMessage: false,
    }
  }
  componentDidMount() {
    $('.collapsible').collapsible();
  }
  render() {
    const { message, changeStatus } = this.props;
    return (
      <li className="collection-item avatar">
        <i className={`material-icons circle ${!message.status || message.status === 'open' ? 'amber' : 'light-green'}`} style={{cursor: 'pointer'}} onDoubleClick={() => changeStatus(message._id)}>mail</i>
        <span className="title">{message.subject} <small>{moment(message.createdAt).fromNow()}</small></span>
        <p>{message.name}<br/>Tel {!message.phone ? 'NA' : message.phone} Email {message.email}</p>
        <ul className="collapsible" data-collapsible="expandable">
          <li>
            <div className="collapsible-header" onClick={() => this.setState({showingMessage: !this.state.showingMessage})}><i className="material-icons ">{this.state.showingMessage ? 'remove' : 'add'}</i>{this.state.showingMessage ? 'Ocultar' : 'Ver'} mensaje</div>
            <div className="collapsible-body"><p>{message.message}</p></div>
          </li>
        </ul>
      </li>
    )
  }
}
