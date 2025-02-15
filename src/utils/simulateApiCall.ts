/**
 * Simulates an asynchronous API call with a callback function.
 *
 * @param cb - The callback function that provides the data.
 * @returns A Promise that resolves with the data from the callback.
 * @throws If an error occurs during the callback execution.
 */
const simulateApiCall = <T>(cb: () => T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = cb();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    }, 5000);
  });
};

export default simulateApiCall;
