type TaskFn = () => Promise<any>;

/**
 * Run multiple tasks concurrently.
 * @param tasks - An array of asynchronous tasks.
 */
export const runConcurrently = async (tasks: TaskFn[]) => {
  try {
    return await Promise.all(tasks.map(task => task()));
  } catch (error) {
    console.error('Error running tasks concurrently:', error);
    throw error;
  }
};

/**
 * Run a task repeatedly at a specified interval.
 * @param task - The asynchronous task to run.
 * @param interval - The interval (in ms) between executions.
 * @returns A function to stop the loop.
 */
export const runWithInterval = (task: TaskFn, interval: number): (() => void) => {
  const intervalId = setInterval(async () => {
    try {
      await task();
    } catch (error) {
      console.error('Error in looped API call:', error);
      clearInterval(intervalId);
    }
  }, interval);

  return () => clearInterval(intervalId); // Return a function to stop the loop
};
