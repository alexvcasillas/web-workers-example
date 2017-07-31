let array = [];
let initalSortTime, endSortTime;

const fillArray = () => {
  for (let i = 0; i < 100000; i++) {
    array.push(parseInt(Math.random() * (100000 - 0) + 0, 10));
  }
  console.log('Filling the Array Task had just finished');
};

(function() {
  console.log('Web Worker has been instantiated');
  console.log('Time to fill the array');
  fillArray();
})();

const sortCompare = (a, b) => {
  return a - b;
};

const arraySort = () => {
  initialSortTime = new Date();
  array.sort(sortCompare);
  endSortTime = new Date();
  console.log(array);
  postMessage({
    code: 'SORT_END',
    initialSortTime: initialSortTime,
    endSortTime: endSortTime
  });
};

const arrayAdd = number => {
  const newNumber = parseInt(number, 10);
  if (isNaN(newNumber))
    return postMessage({
      code: 'NAN',
      message: 'There was an error while trying to parsing the given data.'
    });
  array.push(newNumber);
  postMessage({
    code: 'NUMBER_ADDED',
    message: `Number ${newNumber} added to the array`
  });
};

onmessage = function(e) {
  const { code, number } = e.data;
  switch (code) {
    case 'START_SORT':
      arraySort();
      break;
    case 'PUSH_NUMBER':
      arrayAdd(number);
      break;
  }
};
