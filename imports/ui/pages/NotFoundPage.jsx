import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => (
  <div>
    <div>
      <h2>404 - Page Not Found!</h2>
      <Link to="/">Ir a Inicio</Link>
    </div>
  </div>
);

export default NotFoundPage;
