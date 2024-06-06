import React, { useState } from 'react';
import { StlViewer } from 'react-stl-viewer';

const FileUploadAndView = () => {
    const [stlUrl, setStlUrl] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const worker = new Worker('worker.js');

            worker.addEventListener('message', (e) => {
                if (e.data.status === 'done') {
                    const blob = new Blob([e.data.data], { type: 'application/vnd.ms-pki.stl' });
                    setStlUrl(URL.createObjectURL(blob));
                }
            });

            worker.postMessage(file);
        }
    };

    return (
        <div>
            <input type="file" accept=".stl" onChange={handleFileUpload} />
            {stlUrl && (
                <StlViewer
                    url={stlUrl}
                    width={400}
                    height={400}
                    modelColor="#B92C2C"
                    backgroundColor="#EAEAEA"
                    rotate={true}
                    orbitControls={true}
                />
            )}
        </div>
    );
};

export default FileUploadAndView;
