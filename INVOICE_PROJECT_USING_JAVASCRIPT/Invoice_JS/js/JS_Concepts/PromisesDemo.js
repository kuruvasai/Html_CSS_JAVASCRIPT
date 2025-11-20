// Function that simulates an asynchronous API call
function fetchUserData(userId) {
  console.log(`[Promise] Attempting to fetch data for User ID: ${userId}...`);

  return new Promise((resolve, reject) => {
    // Simulate a network delay of 1 second
    setTimeout(() => {
      if (userId === 1) {
        // Success: Resolve the promise with the user data
        const userData = {
          id: userId,
          name: "Alice",
          role: "Developer"
        };
        resolve(userData);
      } else if (userId === 2) {
        // Success: Resolve for another user
        const userData = {
          id: userId,
          name: "Bob",
          role: "Designer"
        };
        resolve(userData);
      } else {
        // Failure: Reject the promise with an error
        reject(new Error(`User with ID ${userId} not found.`));
      }
    }, 1000); // 1000 milliseconds = 1 second
  });
}

console.log("--- Standard Promise (.then/.catch) Example ---");

// 1. Handle Success (User ID 1)
fetchUserData(1)
  .then(data => {
    console.log(`[Promise SUCCESS] Fetched Name: ${data.name}, Role: ${data.role}`);
  })
  .catch(error => {
    console.error(`[Promise ERROR] ${error.message}`);
  });

// 2. Handle Failure (User ID 99) - This demonstrates the .catch() block
fetchUserData(99)
  .then(data => {
    // This part is skipped on error
    console.log(`[Promise SUCCESS] Fetched Name: ${data.name}`);
  })
  .catch(error => {
    // This part runs on error
    console.error(`[Promise ERROR] ${error.message}`);
  });

console.log("--- End of .then() setup ---");
// This line prints immediately because the fetches are non-blocking!