import React, { useState } from "react";
import ProcessWizzard from "views/ProcessUploads/ProcessWizzard.js";


const GenerateNotes = () => {
  const [filesData, setFilesData] = useState([]);

  const deleteFile = (id) => {
    setFilesData((prev) => prev.filter((file) => file.id !== id));
  };

  const handleGenerateOCR = () => {
    debugger;
    setFilesData((prev) =>
      prev.map((file) =>
        file.status === "UPLOADED" ? { ...file, status: "OCR" } : file
      )
    );
  };

  const handleGenerateOCRSingle = async (item) => {
    debugger;
    setFilesData((prev) =>
      prev.map((file) =>
        file.id === item.id && file.status === "UPLOADED"
          ? { ...file, status: "OCR" }
          : file
      )
    );

    //const base64String = await convertToBase64(item.file); // original File object
  };
  
  const handleGenerateAI = () => {
    debugger;
    setFilesData((prev) =>
      prev.map((file) =>
        file.status === "OCR" ? { ...file, status: "AI" } : file
      )
    );
  };

  const handleGenerateAISingle = (id) => {
    setFilesData((prev) =>
      prev.map((file) =>
        file.id === id && file.status === "OCR"
          ? { ...file, status: "AI" }
          : file
      )
    );
  };


  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.readAsDataURL(file); // read file as base64
      reader.onload = () => resolve(reader.result); // result contains base64 string
      reader.onerror = (error) => reject(error);
    });
  };
  
  return (
    <>
    <ProcessWizzard/>            
    </>
  );
};

export default GenerateNotes;
