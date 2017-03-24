import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router';

import { Meteor } from 'meteor/meteor';
import firebase, { storageRef } from '../../startup/firebase-config.js';

import { createContainer } from 'meteor/react-meteor-data';

import { Products } from '../../api/products/products.js';

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      progressBar: "0",
      editMode: false,
      description: this.props.product.description || '',
    }
  }
  // handleImageSubmit() {
  //   if (this.refs.inputFile.files && this.refs.inputFile.files[0]) {
  //       var reader = new FileReader();
  //
  //       reader.onload = function (e) {
  //           $('#image_upload_preview').attr('src', e.target.result);
  //       }
  //
  //       reader.readAsDataURL(this.refs.inputFile.files[0]);
  //   }
  //   this.setState({ image: this.refs.inputFile.files[0] });
  // }
  onDrop(file) {
    this.setState({
      file
    });

    var uploadTask = storageRef.child(`images/${this.props.product._id}`).put(file[0]);

    uploadTask.on('state_changed',
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({progressBar: progress});
      }.bind(this),
      function(error) {
        console.log(error);
      },
      function() {
        Meteor.call('products.uploadImage', uploadTask.snapshot.metadata.name , uploadTask.snapshot.downloadURL);
        this.setState({file: ''})
      }.bind(this)
    );
  }

  updateProductName(event) {
    console.log(event.target.value);
    let updatedProductName = event.target.value;
    Meteor.call('products.updateProductName', {updatedProductName, productId: this.props.product._id}, (err) => {
      if (!err) {
        console.log('Nombre de producto actualizado!');
      } else {
        console.log(err);
      }
    });
  }

  updateDescription(e) {
    const code = e.keyCode || e.which;

    if (code === 13) {
      let description = this.state.description;
      Meteor.call('products.description', { productId: this.props.product._id, description }, (err) => {
        if (!err) {
          console.log('Descripción del producto actualiada!');
        } else {
          console.log(err);
        }
      })
    }
  }

  renderProduct() {
    var {_id, name, description, category, unit, currentPrice, imageURL} = this.props.product;
    return (
      <div>
        <p>
          <Link to="/products">Regesar al catálogo</Link>
        </p>
        {!this.state.editMode ?
          <h2 onClick={() => this.setState({editMode: true})}>{name}</h2>
        :
          <div className="row">
            <div className="input-field col s12">
              <input id="name" type="text" defaultValue={name}
                type="text" className="validate"
                onBlur={() => this.setState({editMode: false})}
                onChange={this.updateProductName.bind(this)}
                autoFocus/>
              <label className="active" htmlFor="name">
                Editar del producto
              </label>
            </div>
          </div>
        }
        <div className="row">
          <div className="input-field col s12">
            <input id="description" type="text" defaultValue={this.state.description}
              type="text" className="validate" maxLength="100"
              placeholder="Agrega comentarios sobre el producto."
              onKeyPress={this.updateDescription.bind(this)}
              onChange={(event) => this.setState({description: event.target.value})} />
            <small style={{float: 'right'}}>{this.state.description.length}/100</small>
            <label className="active" htmlFor="name">
              Descripción/Observaciones
            </label>
          </div>
        </div>
        <p>ID: {_id}</p>
        <p>Categoría: {category} </p>
        <p>Precio actual: {currentPrice} por {unit}</p>
        {imageURL ? <img src={imageURL} width="200" height="200" /> : ''}
        <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false}>
            {this.state.file ?
              <div>
                <h4>Subiendo imágen...</h4>
                <progress ref="progressBar" value={this.state.progressBar} max="100" />
                <div><img src={this.state.file[0].preview} alt={this.state.file[0].name} width="100" height="100"/></div>
              </div>
            : <div>Arrastra una imágen o da click para seleccionar tu archivo.</div>
            }
        </Dropzone>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.props.currentUser ? this.renderProduct() : ''}
      </div>
    )
  }
}

ProductPage.propTypes = {
  product: PropTypes.object,
};

export default createContainer(( { params: { id } }) => {
  return {
    product: Products.findOne(id),
    currentUser: Meteor.user(),
  };
}, ProductPage);
