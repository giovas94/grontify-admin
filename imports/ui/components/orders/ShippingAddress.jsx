import React from 'react';
import { _ } from 'meteor/stevezhu:lodash';

export const ShippingAddress = ({shippingAddress, addresses}) => {
  const address = _.find(addresses, { id: shippingAddress });

  return (
    <p>
      {address.street} {address.noExt} {address.noInt ? '-' : ''} {address.noInt}<br/>
      {address.line1}<br/>
      {address.line2}<br/>
      {address.state} {address.postalCode}
    </p>
  )
}
