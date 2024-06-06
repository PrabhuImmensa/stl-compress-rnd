import React, { useState } from 'react';
import { STLViewer, StlViewer } from 'react-stl-viewer';
import pako from 'pako';
import StlContainer from './StlContainer';
import FileUploadAndView from './FileUploadAndView';

function App() {
  const [compressedUrl, setCompressedUrl] = useState('');
  const [stlUrl, setStlUrl] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
    console.log(reader.onloadstart,'onloadstart')
    console.log(reader.onprogress,'onprogress')
    console.log(reader.readyState,'readyState')
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const compressedData = pako.gzip(new Uint8Array(arrayBuffer));
        const blob = new Blob([compressedData], { type: 'application/gzip' });
        const url = URL.createObjectURL(blob);
        setCompressedUrl(url);
        decompressSTL(url);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const decompressSTL = async (compressedUrl) => {
    const response = await fetch(compressedUrl);
    const compressedData = await response.arrayBuffer();
    const decompressedData = pako.ungzip(new Uint8Array(compressedData));
    const blob = new Blob([decompressedData], { type: 'application/vnd.ms-pki.stl' });
    console.log(blob, 'blob')
    setStlUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="App">
      <FileUploadAndView/>
      <form action="http://localhost:4000/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept=".stl" required />
        <button type="submit">Upload and Compress</button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <input type="file" accept=".stl" onChange={handleFileUpload} />

      {/* <StlContainer /> */}

      {stlUrl && (
        <StlViewer
          url={stlUrl}
          width={800}
          height={800}
          modelColor="#B92C2C"
          backgroundColor="#EAEAEA"
          rotate={true}
          orbitControls={true}
          style={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
          }}
        />
      )}
    </div>
  );
}

export default App;
