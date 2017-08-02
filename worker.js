// Array where values will be stored
let array = [];
// Flag which let us stop the sorting
var stopSort = false;
// Size of the chunks we're going to generate
const chunkSize = 1000;

// This method fills the array
const fillArray = () => {
  for (let i = 0; i < 100000; i++) {
    array.push(parseInt(Math.random() * (100000 - 0) + 0, 10));
  }
  console.log('Filling the Array Task had just finished');
};

// IIF to fill the array the moment the Web Worker is instantiated
(function() {
  console.log('Web Worker has been instantiated');
  console.log('Time to fill the array');
  fillArray();
})();

// Function to handle the sort
const sortCompare = (a, b) => {
  return a - b;
};

// This is the function that does all the magic
const asyncBubbleSort = () => {
  // Send the client a message back telling the sort had just started
  postMessage({
    code: 'SORT_START',
    message: 'Started working on the array sort'
  });
  // Get the initial sort time
  const initialSortTime = new Date().getTime();
  // Here we will be storing the chunks
  let sortedArray = [];
  // Amount of chunks processed
  let chunksProcessed = 0;
  // Generate an iterator based on chunks amount
  const sortInterval = setInterval(function() {
    if (stopSort) {
      console.log('Sort is stopped. We should return and wait');
      return;
    }
    // Splice from the origin array the amount of elements we want the chunk to have
    let chunk = array.splice(0, chunkSize);
    // If there's nothing to sort, let's end the sorting function
    if (chunk.length === 0) {
      // Get the end time of the sorting process
      const endSortTime = new Date().getTime();
      console.log('The chunk is empty. Add more numbers to the array');
      console.log('Chunks processed: ', chunksProcessed);
      console.log('Sorted Array: ', sortedArray);
      // Clear the interval to stop the functionality
      clearInterval(sortInterval);
      /**
       * Here we set the original array back again with the sorted array values
       * Just in case we want to trigger again manually the sort button
       */
      array = sortedArray;
      /**
       * Send a message to the client telling the sort had just ended with 
       * the values needed to be displayed at the UI.
       */
      postMessage({
        code: 'SORT_END',
        initialSortTime: initialSortTime,
        endSortTime: endSortTime,
        spentTime: endSortTime - initialSortTime
      });
      return;
    }
    // Push the chunk to the array
    sortedArray.push(...chunk);
    // Sort the array
    sortedArray.sort(sortCompare);
    console.log('Chunk added to the array: ', chunk);
    chunksProcessed++;
  }, 100);
};

// This function adds a new number to the array
const arrayAdd = number => {
  initialAddTime = new Date().getTime();
  console.log(`Add number ${number} to the array`);
  stopSort = true;
  const newNumber = parseInt(number, 10);
  if (isNaN(newNumber)) {
    stopSort = false;
    return postMessage({
      code: 'NAN',
      message: 'There was an error while trying to parsing the given data.'
    });
  }
  array.push(newNumber);
  endAddTime = new Date().getTime();
  stopSort = false;
  return postMessage({
    code: 'ADD_END',
    number: newNumber,
    initialAddTime: initialAddTime,
    endAddTime: endAddTime,
    spentTime: endAddTime - initialAddTime
  });
};

// Here we handle the messages received by the client
onmessage = function(e) {
  const { code, number } = e.data;
  switch (code) {
    case 'START_SORT':
      console.log('START_SORT cmd received.');
      asyncBubbleSort();
      break;
    case 'ADD_NUMBER':
      console.log('ADD_NUMBER cmd received');
      arrayAdd(number);
      break;
  }
};
