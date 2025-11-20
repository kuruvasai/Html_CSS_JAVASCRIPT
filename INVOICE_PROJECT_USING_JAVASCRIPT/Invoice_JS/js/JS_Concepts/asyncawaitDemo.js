async function handleUserFetch(userId) {
  console.log(`[Async/Await] Calling API for User ID: ${userId}...`);
  try {
    // Await pauses the function until fetchUserData(userId) resolves
    const userData = await fetchUserData(userId);
    
    // This line only runs AFTER the promise resolves (approx. 1 second later)
    console.log(`[Async/Await SUCCESS] Fetched Name: ${userData.name}, Role: ${userData.role}`);
    

    await anotherfucntion();
    

    // You can now use the data directly in the next line!
    // This sequential logic is the main benefit.
    return userData;

  } catch (error) {
    // Errors (rejections) are handled with a standard try/catch block
    console.error(`[Async/Await ERROR] ${error.message}`);
    // You can optionally re-throw or return a default value
    return null; 
  }
}

async function anotherfucntion(){

}

console.log("\n--- Async/Await Example ---");

// 1. Handle Success (User ID 2)
handleUserFetch(2); 

// 2. Handle Failure (User ID 77)
handleUserFetch(77); 

console.log("--- End of async/await setup ---");
// This line prints immediately, but the *function logic* inside handleUserFetch is sequential.