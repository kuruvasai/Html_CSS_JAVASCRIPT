function getUser(id, callback) {
  setTimeout(() => {
    const user = { id: id, name: "Alice" };
    callback(null, user);
  }, 1000);
}

function getOrders(userId, callback) {
  setTimeout(() => {
    const orders = [{ id: 1, userId: userId, item: "Laptop" }];
    callback(null, orders);
  }, 800);
}

function getOrderDetails(orderId, callback) {
  setTimeout(() => {
    const details = { orderId: orderId, price: 1200 };
    callback(null, details);
  }, 500);
}

getUser(1, function(err, user) {
  if (err) 
    return console.error(err);
  getOrders(user.id, function(err, orders){
    if (err) 
        return console.error(err);
    orders.forEach(order => {
      getOrderDetails(order.id, (err, details) => {
        if (err) return console.error(err);
        console.log(`User: ${user.name}, Order: ${order.item}, Price: ${details.price}`);
      });
    });
  });
});