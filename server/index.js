const express = require('express');
const multer = require('multer');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const app = express();
const port = 4000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    const inputFile = req.file.path; // The uploaded file path
    const { filename } = req.file; // Get filename from request body

    const outputFile = path.join('uploads', filename + '.stl.gz'); // Output compressed file path

    const compressSTL = (inputFile, outputFile) => {
        fs.readFile(inputFile, (err, data) => {
            if (err) {
                res.status(500).send('Error reading file: ' + err.message);
                return;
            }
            zlib.gzip(data, (err, compressedData) => {
                if (err) {
                    res.status(500).send('Error compressing file: ' + err.message);
                    return;
                }
                fs.writeFile(outputFile, compressedData, (err) => {
                    if (err) {
                        res.status(500).send('Error writing compressed file: ' + err.message);
                        return;
                    }
                    res.send('File uploaded and compressed successfully!');
                });
            });
        });
    };

    compressSTL(inputFile, outputFile);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
