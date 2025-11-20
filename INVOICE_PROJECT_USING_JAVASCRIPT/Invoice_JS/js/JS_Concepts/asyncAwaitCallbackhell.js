function getUserPromise(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { id: id, name: "Alice" };
      resolve(user);
    }, 1000);
  });
}

function getOrdersPromise(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = [{ id: 1, userId: userId, item: "Laptop" }];
      resolve(orders);
    }, 800);
  });
}

function getOrderDetailsPromise(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = { orderId: orderId, price: 1200 };
      resolve(details);
    }, 500);
  });
}

async function fetchUserData() {
  try {
    const user = await getUserPromise(1);
    const orders = await getOrdersPromise(user.id);

    for (const order of orders) {
      const details = await getOrderDetailsPromise(order.id);
      console.log(`User: ${user.name}, Order: ${order.item}, Price: ${details.price}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

fetchUserData();