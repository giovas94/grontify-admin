import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Cars } from './cars.js';

export const insert = new ValidatedMethod({
  name: 'cars.insert',
  validate: new SimpleSchema({
    licensePlate: {type: String, min: 3},
    model: {type: String, min: 2},
    brand: {type: String},
    year: {type: Number}
  }).validator(),
  run({ licensePlate, model, brand, year }) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const car = {
      licensePlate,
      model,
      brand,
      year,
      createdAt: new Date(),
      status: 'activo'
    };

    return Cars.insert(car);
  }
});

export const updateStatus = new ValidatedMethod({
  name: 'cars.updateStatus',
  validate: new SimpleSchema({
    carId: {type: String},
    newStatus: {type: String}
  }).validator(),
  run({carId, newStatus}) {
    let newAssingedUser = '';
    const currentAssignedUser = Cars.findOne(carId).assignedUser;

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (newStatus === 'activo') {
      newAssingedUser = currentAssignedUser;
    }

    return Cars.update(carId, { $set: { status: newStatus, assignedUser: newAssingedUser } });
  }
});

export const updateAssignedUser = new ValidatedMethod({
  name: 'cars.updateAssignedUser',
  validate: new SimpleSchema({
    carId: { type: String },
    userId: { type: String }
  }).validator(),
  run({carId, userId}) {
    const userStatus = Meteor.users.findOne(userId).profile.status;
    const carStatus = Cars.findOne(carId).status;
    const carHasUser = Cars.findOne({assignedUser: userId});

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if(carStatus !== 'activo') {
      throw new Meteor.Error('Vehículo no activo');
    }

    if(carHasUser) {
      throw new Meteor.Error('El usuario seleccionado ya tiene un vehículo asignado');
    }

    if(userStatus !== 'activo') {
      throw new Meteor.Error('Usuario seleccionado no activo');
    }

    return Cars.update(carId, { $set: { assignedUser: userId } });
  }
});

export const removeAssingedUser = new ValidatedMethod({
  name: 'cars.removeAssingedUser',
  validate: new SimpleSchema({
    carId: { type:String },
  }).validator(),
  run({carId}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Cars.update(carId, { $set: { assignedUser: '' } });
  }
});
