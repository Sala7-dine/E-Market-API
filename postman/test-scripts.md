# Postman Test Scripts for E-Market API

Copy these test scripts into the "Tests" tab of each corresponding request in Postman.

## Authentication Endpoints

### POST /api/auth/register
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Response has accessToken", () => pm.expect(pm.response.json()).to.have.property('accessToken'));
pm.test("Response has refreshToken", () => pm.expect(pm.response.json()).to.have.property('refreshToken'));
pm.test("Response has user object", () => pm.expect(pm.response.json()).to.have.property('user'));
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### POST /api/auth/login
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response has accessToken", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('accessToken');
    pm.environment.set('accessToken', json.accessToken);
});
pm.test("Response has refreshToken", () => pm.expect(pm.response.json()).to.have.property('refreshToken'));
pm.test("User has valid role", () => {
    const user = pm.response.json().user;
    pm.expect(['user', 'seller', 'admin']).to.include(user.role);
});
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### POST /api/auth/refresh
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("New accessToken received", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('accessToken');
    pm.environment.set('accessToken', json.accessToken);
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### POST /api/auth/logout
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Success message received", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## User Endpoints

### GET /api/users
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Users have required fields", () => {
    const users = pm.response.json();
    if (users.length > 0) {
        pm.expect(users[0]).to.have.property('email');
        pm.expect(users[0]).to.have.property('role');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### POST /api/users/create
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("User created with ID", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('userId', json._id);
});
pm.test("Password not exposed", () => pm.expect(pm.response.json()).to.not.have.property('password'));
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### GET /api/users/me
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("User profile returned", () => {
    const user = pm.response.json();
    pm.expect(user).to.have.property('email');
    pm.expect(user).to.have.property('role');
});
pm.test("Password not exposed", () => pm.expect(pm.response.json()).to.not.have.property('password'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PATCH /api/users/me
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Profile updated", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### PUT /api/users/update/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("User updated", () => pm.expect(pm.response.json()).to.have.property('_id'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### DELETE /api/users/delete/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Delete confirmation", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Product Endpoints

### GET /api/products
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Products have required fields", () => {
    const products = pm.response.json();
    if (products.length > 0) {
        pm.expect(products[0]).to.have.property('title');
        pm.expect(products[0]).to.have.property('prix');
        pm.expect(products[0]).to.have.property('stock');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### POST /api/products/create
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Product created with ID", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('productId', json._id);
});
pm.test("Product has images array", () => pm.expect(pm.response.json()).to.have.property('images'));
pm.test("Product has createdBy", () => pm.expect(pm.response.json()).to.have.property('createdBy'));
pm.test("Response time < 3s", () => pm.expect(pm.response.responseTime).to.be.below(3000));
```

### PUT /api/products/update/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Product updated", () => pm.expect(pm.response.json()).to.have.property('_id'));
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### DELETE /api/products/delete/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Delete confirmation", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### GET /api/products/search
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response has products array", () => pm.expect(pm.response.json()).to.have.property('products'));
pm.test("Response has pagination", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('page');
    pm.expect(json).to.have.property('limit');
    pm.expect(json).to.have.property('total');
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### POST /api/products/:productId/reviews
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Review added", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Product averageRating updated", () => pm.expect(pm.response.json().product).to.have.property('averageRating'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### GET /api/products/:productId/reviews
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Reviews array returned", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Reviews have required fields", () => {
    const reviews = pm.response.json();
    if (reviews.length > 0) {
        pm.expect(reviews[0]).to.have.property('rating');
        pm.expect(reviews[0]).to.have.property('comment');
        pm.expect(reviews[0]).to.have.property('user');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Category Endpoints

### GET /api/categories
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Categories have name", () => {
    const categories = pm.response.json();
    if (categories.length > 0) {
        pm.expect(categories[0]).to.have.property('name');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### POST /api/categories/create
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Category created with ID", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('categoryId', json._id);
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PUT /api/categories/update/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Category updated", () => pm.expect(pm.response.json()).to.have.property('_id'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### DELETE /api/categories/delete/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Delete confirmation", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Cart Endpoints

### POST /api/cart/addtocart
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Cart item added", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('cartId', json._id);
});
pm.test("Cart has products array", () => pm.expect(pm.response.json()).to.have.property('products'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### GET /api/cart/getcarts
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Cart has products", () => {
    const carts = pm.response.json();
    if (carts.length > 0) {
        pm.expect(carts[0]).to.have.property('products');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PUT /api/cart/updateCart/:id
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Cart updated", () => pm.expect(pm.response.json()).to.have.property('_id'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### DELETE /api/cart/deleteProduct/:productId
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Product removed from cart", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Order Endpoints

### POST /api/orders/addOrder/:cartId
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Order created with ID", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('orderId', json._id);
});
pm.test("Order has status", () => {
    const status = pm.response.json().status;
    pm.expect(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).to.include(status);
});
pm.test("Order has totalPrice", () => pm.expect(pm.response.json()).to.have.property('totalPrice'));
pm.test("Response time < 2s", () => pm.expect(pm.response.responseTime).to.be.below(2000));
```

### GET /api/orders/getOrder
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Orders have required fields", () => {
    const orders = pm.response.json();
    if (orders.length > 0) {
        pm.expect(orders[0]).to.have.property('status');
        pm.expect(orders[0]).to.have.property('totalPrice');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PUT /api/orders/updateStatus/:orderId
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Order status updated", () => pm.expect(pm.response.json()).to.have.property('status'));
pm.test("Valid status", () => {
    const status = pm.response.json().status;
    pm.expect(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).to.include(status);
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Coupon Endpoints

### POST /api/coupons/createCoupon
```javascript
pm.test("Status code is 201", () => pm.response.to.have.status(201));
pm.test("Coupon created with ID", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('_id');
    pm.environment.set('couponId', json._id);
});
pm.test("Coupon has code", () => pm.expect(pm.response.json()).to.have.property('code'));
pm.test("Coupon has discount", () => pm.expect(pm.response.json()).to.have.property('discount'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### GET /api/coupons/getAllCoupon
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Coupons have required fields", () => {
    const coupons = pm.response.json();
    if (coupons.length > 0) {
        pm.expect(coupons[0]).to.have.property('code');
        pm.expect(coupons[0]).to.have.property('discount');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### GET /api/coupons/getAllUserCoupon
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PUT /api/coupons/updateCoupon/:couponId
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Coupon updated", () => pm.expect(pm.response.json()).to.have.property('_id'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### DELETE /api/coupons/deleteCoupon/:couponId
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Delete confirmation", () => pm.expect(pm.response.json()).to.have.property('message'));
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Notification Endpoints

### GET /api/notifications
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
pm.test("Notifications have required fields", () => {
    const notifications = pm.response.json();
    if (notifications.length > 0) {
        pm.expect(notifications[0]).to.have.property('message');
        pm.expect(notifications[0]).to.have.property('type');
        pm.expect(notifications[0]).to.have.property('read');
    }
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

### PATCH /api/notifications/:id/read
```javascript
pm.test("Status code is 200", () => pm.response.to.have.status(200));
pm.test("Notification marked as read", () => {
    const json = pm.response.json();
    pm.expect(json.read).to.be.true;
});
pm.test("Response time < 1s", () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Collection-Level Test Script

Add this to your collection's "Tests" tab to run on every request:

```javascript
// Global tests for all requests
pm.test("Response has valid JSON", () => {
    pm.response.to.be.json;
});

pm.test("No server errors (5xx)", () => {
    pm.expect(pm.response.code).to.be.below(500);
});

// Log response for debugging
console.log(`${pm.info.requestName}: ${pm.response.code} - ${pm.response.responseTime}ms`);
```

---

## Pre-request Script for Auto-Login

Add this to your collection's "Pre-request Script" tab:

```javascript
// Auto-login if no accessToken exists
if (!pm.environment.get('accessToken')) {
    pm.sendRequest({
        url: pm.variables.replaceIn('{{baseURL}}/api/auth/login'),
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: 'salahdaha7@gmail.com',
                password: 'salah1234'
            })
        }
    }, (err, res) => {
        if (!err && res.json().accessToken) {
            pm.environment.set('accessToken', res.json().accessToken);
        }
    });
}
```
