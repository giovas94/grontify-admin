import React,  { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, browserHistory } from 'react-router';
import { _ } from 'meteor/stevezhu:lodash';

import { createContainer } from 'meteor/react-meteor-data';
import { OrderNotes } from '../../../../api/notes/notes.js';


class OrderNotesWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noteText: '',
      showForm: false
    }
  }

  _handleNewNote(event) {
    event.preventDefault();

    Meteor.call('orderNotes.insert', {orderId: this.props.orderId, text: this.state.noteText}, (err) => {
      if (!err) {
        Materialize.toast('Nota agregada!', 4000);
        this.setState({noteText: '', showForm: false});
      } else {
        console.log(err);
      }
    });
  }

  render() {
    return (
      <div>
        {this.props.loading ?
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        :
          <ul className="collection with-header">
            <li className="collection-header">
              <div className="row">
                <div className="col s12">
                  <h4 style={{display: 'inline-block'}}>Notas</h4>
                  <button style={{display: 'inline-block',
                  float: 'right',
                  marginBottom: '13.680px',
                  marginTop: '17.100px'}}
                  className="btn waves-effect waves-light light-green"
                  onClick={() => this.setState({showForm: !this.state.showForm})}>
                    <i className="material-icons">{this.state.showForm ? 'remove' :'add'}</i>
                  </button>
                </div>
                {!this.state.showForm ? ''
                :
                  <div className="input-field col s12">
                    <textarea ref="note" id="note" className="materialize-textarea" onChange={(event) => this.setState({noteText: event.target.value})} value={this.state.noteText}></textarea>
                    <button className={`waves-effect waves-light btn green ${!this.state.noteText ? 'disabled': ''}`} onClick={this._handleNewNote.bind(this)} disabled={!this.state.noteText}>Agregar</button>
                  </div>
                }
              </div>
            </li>
            {!this.props.notes.length ?
              <li className="collection-item">No hay notas.</li>
            :
              this.props.notes.map((note) => (
                <li className="collection-item" key={note._id}>
                  {note.text} <br/>
                  <small>{note.createdBy.displayName} | {moment(note.createdAt).fromNow()}</small>
                </li>
              ))
            }
          </ul>
        }
      </div>
    )
  }
}

export default createContainer(props => {
  const subscription = Meteor.subscribe('orderNotes', props.orderId);
  const loading = !subscription.ready();
  const notes = OrderNotes.find({}, {sort: { createdAt: -1 }}).fetch();

  return {
    loading,
    notes,
  };
}, OrderNotesWidget);
