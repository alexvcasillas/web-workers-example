// DOM Objects to manipulate
const main = document.getElementById('main');
const noSupport = document.getElementById('no-support');
const taskSort = document.getElementById('task-sort');
const taskAdd = document.getElementById('task-add');
const sortResult = document.getElementById('sort-result');
const addResult = document.getElementById('add-result');
const numberToAdd = document.getElementById('number-to-add');
const progress = document.getElementById('working');

// Check if the browser supports Web Workers
if (window.Worker) {
  // Hide no support section
  noSupport.style.display = 'none';
  // Instantiate the Web Worker
  var myWorker = new Worker('worker.js');
  // Sort Task Button Listener
  taskSort.addEventListener('click', function(event) {
    taskSort.classList.add('disabled');
    console.log('Sort Task Triggered');
    myWorker.postMessage({ code: 'START_SORT' });
  });
  // Add Number Listener
  taskAdd.addEventListener('click', function(event) {
    console.log('Add Task Triggered');
    const number =
      numberToAdd.value === ''
        ? parseInt(Math.random() * (100000 - 0) + 0, 10)
        : numberToAdd.value;
    myWorker.postMessage({ code: 'ADD_NUMBER', number: number });
  });

  // Automatically add a number to the worker every second
  const autoAddInterval = setInterval(function() {
    myWorker.postMessage({
      code: 'ADD_NUMBER',
      number: parseInt(Math.random() * (100000 - 0) + 0, 10)
    });
  }, 1000);

  // Here we handle the messages we got back from the worker
  myWorker.onmessage = function(e) {
    const { data } = e;
    console.log('Message received from worker: ', data);
    switch (data.code) {
      case 'NAN':
        addResult.classList.remove('success');
        addResult.classList.add('error');
        addResult.textContent = data.message;
        break;
      case 'SORT_START':
        progress.classList.add('show');
        sortResult.classList.remove('error');
        sortResult.classList.add('success');
        sortResult.textContent = data.message;
        break;
      case 'SORT_END':
        progress.classList.remove('show');
        taskSort.classList.remove('disabled');
        clearInterval(autoAddInterval); // Clear the auto-add number interval :)
        sortResult.classList.remove('error');
        sortResult.classList.add('success');
        addResult.style.display = 'none';
        sortResult.innerHTML = `Time Spent sorting: ${data.spentTime} ms`.trim();
        break;
      case 'NUMBER_ADDED':
        addResult.classList.remove('error');
        addResult.classList.add('success');
        addResult.textContent = data.message;
        break;
      case 'ADD_END':
        addResult.classList.remove('error');
        addResult.classList.add('success');
        addResult.textContent = `Time Spent Adding number ${data.number}: ${data.spentTime} ms`.trim();
    }
  };
} else {
  // This browser does not support Web Workers
  main.style.display = 'none';
}
