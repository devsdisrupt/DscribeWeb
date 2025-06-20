import React, { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Collapse,
} from "reactstrap";
import APIRequest from "../../WebServiceCall/APICall";
import * as requestMethods from "../../WebServiceCall/ServiceNames";

const DocumentProcess = ({ addFile, handleGenerateOCR, handleGenerateAI, filesData }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setIsOpen(false); // Reset collapse
  };

  const handleUpload = () => {
    debugger;
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      debugger;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result; // base64 or text
        console.log(content);
      }
      formData.append("files", file); // "files" is the field name expected by backend
    });

    APIRequest(requestMethods.Upload, formData, true)
      .then((data) => {
        console.log("Upload success:", data);
        // Show toast or update status
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });

    // --- Current functionality ---
    const newFiles = selectedFiles.map((file) => ({
      fileName: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      status: "UPLOADED",
    }));
    debugger;
    newFiles.forEach(addFile); // keeping your existing call
    debugger;
    // Clear file selection and collapse    
    setSelectedFiles([]);
    setIsOpen(false);
  };

  const hasOCRFiles = filesData.some((file) => file.status === "OCR");
  const hasUploadedFiles = filesData.some((file) => file.status === "UPLOADED"
  );
  const hasAIFiles = filesData.every((file) => file.status === "AI");

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <Row>
          <Col lg="8" md="10" className="text-left">
            <Form>
              <FormGroup>
                <Label for="fileUpload" className="text-white">
                  Select files
                </Label>
                <Input
                  id="fileUpload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </FormGroup>

              {selectedFiles.length > 0 && (
                <FormGroup>
                  <div className="d-flex align-items-center justify-content-between">
                    <Label className="text-white mb-0">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                    </Label>
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {isOpen ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <Collapse isOpen={isOpen}>
                    <ul className="text-white mt-2">
                      {selectedFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </Collapse>
                </FormGroup>
              )}

              <div className="d-flex gap-2 mt-3">
                <Button
                  color="primary"
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0}
                >
                  Upload
                </Button>

                <Button
                  color="danger"
                  onClick={() => {
                    setSelectedFiles([]);
                    setIsOpen(false);
                  }}
                  disabled={selectedFiles.length === 0}
                >
                  Remove Selection
                </Button>
                <Button
                  color="warning"
                  onClick={handleGenerateOCR}
                  disabled={!hasUploadedFiles}
                >
                  <i class="fa-solid fa-wand-sparkles"></i>
                  Generate OCR
                </Button>
                <Button
                  color="success"
                  onClick={handleGenerateAI}
                  disabled={!hasOCRFiles}
                >
                  Generate AI Note
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DocumentProcess;
