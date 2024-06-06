// worker.js
self.addEventListener('message', function (e) {
    const file = e.data;

    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        // Process STL file (parsing, etc.) here
        self.postMessage({ status: 'done', data: arrayBuffer });
    };

    reader.readAsArrayBuffer(file);
});
