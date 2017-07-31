const main = document.getElementById('main');
const noSupport = document.getElementById('no-support');
const taskSort = document.getElementById('task-sort');
const taskAdd = document.getElementById('task-add');
const taskResult = document.getElementById('task-result');
const numberToAdd = document.getElementById('number-to-add');

if (window.Worker) {
  noSupport.style.display = 'none';

  var myWorker = new Worker('worker.js');

  taskSort.addEventListener('click', function(event) {
    console.log('Sort Task Triggered');
    myWorker.postMessage({ code: 'START_SORT' });
  });

  taskAdd.addEventListener('click', function(event) {
    console.log('Add Task Triggered');
    const number = numberToAdd.value;
    myWorker.postMessage({ code: 'PUSH_NUMBER', number: number });
  });

  myWorker.onmessage = function(e) {
    const { data } = e;
    console.log('Message received from worker: ', data);
    switch (data.code) {
      case 'NAN':
        taskResult.classList.remove('success');
        taskResult.classList.add('error');
        taskResult.textContent = data.message;
        break;
      case 'SORT_END':
        taskResult.classList.remove('error');
        taskResult.classList.add('success');
        taskResult.innerHTML = `
				Initial Sort Time: ${data.initialSortTime}.<br>
				End Sort Time: ${data.endSortTime}.
				`.trim();
        break;
      case 'NUMBER_ADDED':
        taskResult.classList.remove('error');
        taskResult.classList.add('success');
        taskResult.textContent = data.message;
        break;
    }
  };
} else {
  // This browser does not support Web Workers
  main.style.display = 'none';
}
