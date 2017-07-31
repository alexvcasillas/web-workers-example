if (window.Worker) {
  // Check if Browser supports the Worker api.
  // Requires script name as input
  var myWorker = new Worker('worker.js');

  myWorker.postMessage('Hello from the main');

  myWorker.onmessage = function(e) {
    console.log('Message received from worker: ', e.data);
  };
}
