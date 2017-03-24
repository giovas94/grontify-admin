import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {moment} from 'meteor/momentjs:moment';

import { handleUserEmails } from '../../modules/handleUserEmails';

import openpay from '../../startup/server/openpay-config';
import Future from 'fibers/future';

import { Orders } from './orders';

export const cancelOrder = new ValidatedMethod({
  name: 'orders.cancelOrder',
  validate: new SimpleSchema({
    orderId: { type: String },
    transactionId: { type: String }
  }).validator(),
  run({ orderId, transactionId }) {
    var futureConfirm = new Future();
    var futureRefund = new Future();

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const order = Orders.findOne(orderId, { fields: { customerId: 1, shippingCost: 1, shippingType: 1, total: 1, status: 1 } });
    const user = Meteor.users.findOne({ _id: order.customerId });
    const openpayId = user.openpay_id;

    if (transactionId !== '') {
      if (order.status === 'sent') {
        console.log('Confirma cargo por ' + order.shippingCost);

        openpay.customers.charges.capture(openpayId, transactionId, {'amount': order.shippingCost}, (error, charge) => {
          if (error) {
            futureConfirm.throw(new Meteor.Error(error.http_code, error.description, error.error_code));
          } else {
            futureConfirm.return(charge);
          }
        });

        if (futureConfirm.wait()) {
          Orders.update(orderId, { $set: { status: 'canceled' } });
        }

        return futureConfirm.wait();

      } else if (order.status === 'delivered' || order.status === 'canceled') {

        throw new Meteor.Error('Error al cancelar mandado', 'No es posible cancelar porque fue entregado o ya está cancelado el mandado.');

      } else {
        console.log('Devolver cargo por ' + order.total);

        openpay.customers.charges.refund(openpayId, transactionId, { description: `Devolución por cancelación de orden ${order._id}`, amount: order.total }, (error, charge) => {
          if (error) {
            futureRefund.throw(new Meteor.Error(error.http_code, error.description, error.error_code));
          } else {
            futureRefund.return(charge);
          }
        });

        if (futureRefund.wait()) {
          Orders.update(orderId, { $set: { status: 'canceled' } });
        }

        return futureRefund.wait();
      }
    } else {
      if (order.status === 'sent') {
        throw new Meteor.Error('Error al cancelar mandado', 'No es posible cancelar porque tu mandado ya está en camino.');
      } else if (order.status === 'delivered' || order.status === 'canceled') {
        throw new Meteor.Error('Error al cancelar mandado', 'No es posible cancelar porque fue entregado o ya está cancelado el mandado.');
      } else {
        Orders.update(orderId, { $set: { status: 'canceled' } });

        Email.send({
          from: "Grontify <contacto@grontify.com>",
          to: handleUserEmails(user),
          bcc: 'grontify@gmail.com',
          subject: `Grontify | Cancelación de pedido ${orderId}`,
          text: `Tu mandado ha sido cancelado.
          \nPuedes checar el estatus de tu pedido en ${Meteor.absoluteUrl('order/'+orderId, {secure: true, rootUrl: 'http://www.grontify.com'})}
          \nTienes alguna duda, escríbenos a contacto@grontify.com o mándanos mensaje al whatsapp 55 3555-2173.
          \n\nSaludos, \n -Grontify frutas y verduras a domicilio.`
        });
      }
    }
  }
});

export const updateOrderStatus = new ValidatedMethod({
  name: 'orders.updateStatus',
  validate: new SimpleSchema({
    orderId: { type: String },
    newStatus: { type: String },
    transactionId: { type: String },
  }).validator(),
  run({orderId, newStatus, transactionId}) {
    var future = new Future();

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const order = Orders.findOne(orderId, { fields: { customerId: 1, total: 1, status: 1 } });
    const user = Meteor.users.findOne({_id: order.customerId});
    const openpayId = user.openpay_id;

    if (order.status === 'delivered') {
      throw new Meteor.Error('El mandado ha sido entregado, no es posible modificar el estatus.');
    }

    if (order.status === 'canceled') {
      throw new Meteor.Error('El mandado fue cancelado, no es posible modificar el estatus.');
    }

    if (newStatus === 'delivered') {

      if (transactionId !== '') {
        openpay.customers.charges.capture(openpayId, transactionId, {'amount': order.total}, (error, result) => {
          if (error) {
            future.throw(new Meteor.Error(error.http_code, error.description, error.error_code));
          } else {
            future.return(result);
          }
        });

        if (future.wait()) {
          Orders.update(orderId, { $set: { status: newStatus } });

          Email.send({
            from: "Grontify <contacto@grontify.com>",
            to: handleUserEmails(user),
            bcc: 'grontify@gmail.com',
            subject: `Grontify | Entregamos tu pedido ${orderId}`,
            text: `Tu mandado ha sido entregado!
            \n\nEsperamos que el producto recibido sea de la calidad que esperabas.
            \nNos encantaría recibir tus comentarios acerca del servicio que te proporcionamos.
            \n- ¿Qué te parecieron las frutas y verduras recibidas, fueron de la calidad esperada?
            \n- ¿El pedido llegó a tiempo?
            \n- ¿Sobre el repartidor, tienes algún comentario?
            \n- ¿Qué nos sugieres para mejorar el servicio?
            \nPuedes ver el detalle de tu mandado en: ${Meteor.absoluteUrl('order/'+orderId, {secure: true, rootUrl: 'http://www.grontify.com'})}
            \nTienes alguna duda, escríbenos a contacto@grontify.com o mándanos mensaje al whatsapp 55 3555-2173.
            \n\nSaludos, \n-Grontify frutas y verduras a domicilio. \nTel. (55) 5264 8901`
          });
        }

        return future.wait();
      } else {
        Orders.update(orderId, { $set: { status: newStatus } });

        Email.send({
          from: "Grontify <contacto@grontify.com>",
          to: handleUserEmails(user),
          bcc: 'grontify@gmail.com',
          subject: `Grontify | Entregamos tu pedido ${orderId}`,
          text: `Tu mandado ha sido entregado!
          \n\nEsperamos que el producto recibido sea de la calidad que esperabas.
          \nNos encantaría recibir tus comentarios acerca del servicio que te proporcionamos.
          \n- ¿Qué te parecieron las frutas y verduras recibidas, fueron de la calidad esperada?
          \n- ¿El pedido llegó a tiempo?
          \n- ¿Sobre el repartidor, tienes algún comentario?
          \n- ¿Qué nos sugieres para mejorar el servicio?
          \nPuedes ver el detalle de tu mandado en: ${Meteor.absoluteUrl('order/'+orderId, {secure: true, rootUrl: 'http://www.grontify.com'})}
          \nTienes alguna duda, escríbenos a contacto@grontify.com o mándanos mensaje al whatsapp 55 3555-2173.
          \n\nSaludos, \n-Grontify frutas y verduras a domicilio. \nTel. (55) 5264 8901`
        });
      }

    } else if (newStatus === 'sent') {
      Orders.update(orderId, { $set: { status: newStatus } });

      Email.send({
        from: "Grontify <contacto@grontify.com>",
        to: handleUserEmails(user),
        bcc: 'grontify@gmail.com',
        subject: `Grontify | Tu pedido va en camino ${orderId}`,
        text: `Tu mandado ha sido enviado, llegará pronto!
        \n\nTus frutas y verduras ya están en camino, en menos de 1 hora el pedido estará en tu domicilio.
        \nPuedes ver el detalle de tu mandado en: ${Meteor.absoluteUrl('order/'+orderId, {secure: true, rootUrl: 'http://www.grontify.com'})}
        \nTienes alguna duda, escríbenos a contacto@grontify.com o mándanos mensaje al whatsapp 55 3555-2173.
        \n\nSaludos, \n -Grontify frutas y verduras a domicilio. \nTel. (55) 5264 8901`
      });

    } else {
      Orders.update(orderId, { $set: { status: newStatus } });

      Email.send({
        from: "Grontify <contacto@grontify.com>",
        to: handleUserEmails(user),
        bcc: 'grontify@gmail.com',
        subject: `Grontify | Tu pedido cambio de estatus a procesado ${orderId}`,
        text: `Tu mandado ha sido procesado!
        \n\nEsto quiere decir que tu pedido ya fue recibido y verificado por nuestro equipo operativo.
        \nEn breve nuestro personal estará seleccionando las mejores frutas y verduras para tí.
        \nTe notificaremos cuando tu mandado haya sido enviado.
        \nPuedes ver el detalle de tu mandado en: ${Meteor.absoluteUrl('order/'+orderId, {secure: true, rootUrl: 'http://www.grontify.com'})}
        \nTienes alguna duda, escríbenos a contacto@grontify.com o mándanos mensaje al whatsapp 55 3555-2173.
        \n\nSaludos, \n -Grontify frutas y verduras a domicilio. \nTel. (55) 5264 8901`
      });

    }

  }
});

export const updateShippingDate = new ValidatedMethod({
  name: 'orders.updateShippingDate',
  validate: new SimpleSchema({
    orderId: { type: String },
    newShippingDate: { type: Date }
  }).validator(),
  run({orderId, newShippingDate}) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const order = Orders.findOne(orderId, { fields: { customerId: 1, total: 1, status: 1, shippingType: 1 } });

    if (moment(newShippingDate).diff(moment(), 'days') < 0) {
      throw new Meteor.Error('Error en fecha', 'La nueva fecha de entrega debe ser una fecha próxima.');
    }

    if (order.status === 'delivered') {
      throw new Meteor.Error('El mandado ha sido entregado, no es posible modificar la fecha de entrega.');
    }

    if (order.status === 'canceled') {
      throw new Meteor.Error('El mandado fue cancelado, no es posible modificar la fecha de entrega.');
    }

    if (order.shippingType !== 'programado') {
      throw new Meteor.Error('Error en cambio de fecha', 'No es posible cambiar la fecha de entrega para ordenes express y estándar. Se sugiere cancelar la orden y generar una nueva con tipo de envío programado.');
    }

    Orders.update(orderId, { $set: { shippingDate: moment(newShippingDate).hours(16).toDate() }})
  }
});

export const getCharge = new ValidatedMethod({
  name: 'getCharge',
  validate: new SimpleSchema({
    customerId: { type: String },
    orderId: { type: String }
  }).validator(),
  run({customerId, orderId}) {
    var future = new Future();

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const openpayId = Meteor.users.find({_id: customerId}, {fields: { openpay_id: 1 }}).fetch()[0].openpay_id;

    openpay.customers.charges.list(openpayId, {order_id: orderId}, (error, charge) => {
      if (error) {
        future.throw(new Meteor.Error(error.http_code, error.description, error.error_code));
      } else {
        future.return(charge);
      }
    });

    return future.wait();
  }
})
