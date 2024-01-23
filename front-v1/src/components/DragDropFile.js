import React, { useState, useRef } from 'react';
import '../css/dragdrop.css';



const DragDropFile = ({ name, id,selectedFile,setSelectedFile }) => {
  // 
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if(file){
      document.getElementById(name+"P").textContent=file.name;
    }else{
      document.getElementById(name+"P").textContent="drag and drop file here"
    }
    
    // Handle the file change
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    if(file){
      document.getElementById(name+"P").textContent=file.name;
    }else{
      document.getElementById(name+"P").textContent="drag and drop file here"
    }
    // Set file input value
    fileInputRef.current.files = event.dataTransfer.files;
    // Handle the dropped file
  };

  return (
    <label htmlFor={id} style={{width:"100%",height:"100%"}}>
    <div
      className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>

      File Upload:
      <input type="file" id={id} name={name} ref={fileInputRef} onChange={handleFileInputChange } style={{opacity: 0,position:'absolute'}}/>
      <p id={name+'P'} >drag and drop file here</p>
    </div>
      </label>
  );
};
export default DragDropFile;