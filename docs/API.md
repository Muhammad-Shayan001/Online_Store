# API Documentation

## Authentication
- **POST** `/api/users/login`: Login user.
- **POST** `/api/users/register`: Register new user.
- **POST** `/api/users/logout`: Logout (client-side token clear).

## Products
- **GET** `/api/products`: List all products.
- **GET** `/api/products/:id`: Get single product details.
- **POST** `/api/products`: Create product (Admin).
- **PUT** `/api/products/:id`: Update product (Admin).
- **DELETE** `/api/products/:id`: Remove product (Admin).
- **POST** `/api/products/:id/reviews`: Add review (Member).

## Orders
- **POST** `/api/orders`: Create new order.
- **GET** `/api/orders/myorders`: Get logged-in user's orders.
- **GET** `/api/orders/:id`: Get specific order.
- **PUT** `/api/orders/:id/pay`: Mark order as paid.
- **PUT** `/api/orders/:id/deliver`: Mark order as delivered (Admin).

## Support Tickets
- **POST** `/api/tickets`: Create support ticket (Public).
- **GET** `/api/tickets`: List all tickets (Admin).
- **PUT** `/api/tickets/:id`: Update ticket status/response (Admin).

## data Models
Refer to `backend/models/*.js` for Mongoose definitions.
