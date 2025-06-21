import React, { useState } from "react";
import {
  Button as RSButton,
  Container,
  Row,
  Col,
  Input,
  Label,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "reactstrap";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import UploadSingle from "views/ProcessUploads/UploadSingle.js";
import UploadBulk from "views/ProcessUploads/UploadBulk.js";
import FilesTable from "views/ProcessUploads/FilesTable";
import APIRequest from "../../WebServiceCall/APICall";
import * as requestMethods from "../../WebServiceCall/ServiceNames";
import CryptoJS from 'crypto-js';
import { appCred } from "../AppConfig";

const steps = ["Step-1", "Step-2", "Step-3", "Step-4"];


// Encrypt
export function  encryptAPIKey(apiKey, secretKey) {
  return CryptoJS.AES.encrypt(apiKey, secretKey).toString();
}

// Decrypt
export function decryptAPIKey(cipherText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const ProcessWizzard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [uploadType, setUploadType] = useState("single");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);

  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sourceFilePath, setSourceFilePath] = useState("");
  const [FinalPaths, setFinalPaths] = useState([]);
  const [Apikey, setkey] = useState("");


  const addFinalPath = (type, path) => {
    setFinalPaths((prev) => [...prev, { Type: type, Path: path }]);
  };


  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prev) => prev + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setSkipped((prev) => {
      const newSkipped = new Set(prev.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
    setActiveStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const enrichedFiles = files.map((file, index) => ({
        id: prev.length + index + 1, // ensure unique incremental ID
        file, // keep original File object
        fileName: file.name,
        type: file.type,
        uploadDate: new Date().toISOString().split("T")[0],
        completion: 0,
      }));

      return [...prev, ...enrichedFiles];
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // This will result in base64 string
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const handleUpload = async () => {
    debugger;
    const key = appCred.key;
    const decrypted = decryptAPIKey(key, "MARHM");
    setkey(decrypted);

    setIsLoading(true);
    // const formData = new FormData();
    // formData.append("UserID", "razeen.ahmed"); // your custom folder name
    // selectedFiles.forEach((file) => {            
    //   formData.append("files", file.file); // "files" is the field name expected by backend
    // });



    const fileObj = selectedFiles[0]; // assuming one file
    const base64string = await convertToBase64(fileObj.file);
    const fullBase64 = base64string;
    const base64Only = fullBase64.split(',')[1]; // just the base64 content


    const ReqData = {
      InputBucketName: "dscribe-inputbucket",
      SiteId: "LNH",
      PDFBase64: base64Only,
      UserID: "DScribe",
      Password: "XDsLOkfUrSoPzmfo81wBisD1YtXh3rKp4eQ7vZ9jF8w="
    };

    APIRequest(requestMethods.UploadPDFtoGCS, ReqData, false)
      //APIRequest(requestMethods.Test, formData, true)
      .then((data) => {
        debugger;
        if (data.ResponseCode == "200") {
          const NextPath = data.ResponseResult.ResponseResult;
          const publicURL = NextPath.replace("gs://", "https://storage.googleapis.com/");
          console.log(publicURL);
          setSourceFilePath(NextPath);

          addFinalPath("Uploaded", publicURL);


          const newFiles = selectedFiles.map((file) => ({
            fileName: file.file.name,
            url: publicURL,
            //url: URL.createObjectURL(file.file),
            type: file.file.type,
            status: "UPLOADED",
          }));
          debugger;
          newFiles.forEach(addFile); // keeping your existing call


          debugger;
          // Clear file selection and collapse    
          //setSelectedFiles([]);
          handleNext();
          setIsLoading(false);
        }
        console.log("Upload success:", data);
        // Show toast or update status
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Upload error:", err);
      });
  };

  const handleTranscription = () => {
    debugger;
    
    setIsLoading(true);

    const ReqData = {
      OutputBucketName: "dscribe-outputbucket",
      SiteId: "LNH",
      SourceFilePath: sourceFilePath,
      UserID: "DScribe",
      Password: "XDsLOkfUrSoPzmfo81wBisD1YtXh3rKp4eQ7vZ9jF8w="
    };



    APIRequest(requestMethods.PerformOCR, ReqData, false)
      //APIRequest(requestMethods.Test, formData, true)
      .then((data) => {
        debugger;
        if (data.ResponseCode == "200") {
          const NextPath = data.ResponseResult.ResponseResult;
          const publicURL = NextPath.replace("gs://", "https://storage.googleapis.com/");
          console.log(publicURL);
          setSourceFilePath(NextPath);

          addFinalPath("Transcribed", publicURL);

          debugger;
          // Clear file selection and collapse    
          //setSelectedFiles([]);          
          handleNext();
          setIsLoading(false);
        }
        console.log("Upload success:", data);
        // Show toast or update status
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Upload error:", err);
      });
  };

  const GenerateCN = () => {
    debugger;

    setIsLoading(true);
    const ReqData = {
      PromptType: "Beautify",
      SourceFilePath: sourceFilePath,
      OutputBucketName: "dscribe-outputbucket",
      SiteId: "LNH",
      OpenAIAPIKey: Apikey,
      UserID: "DScribe",
      Password: "XDsLOkfUrSoPzmfo81wBisD1YtXh3rKp4eQ7vZ9jF8w=",
      GPTModel: "gpt-4-1106-preview"
    };



    APIRequest(requestMethods.PerformLLMProcessing, ReqData, false)
      //APIRequest(requestMethods.Test, formData, true)
      .then((data) => {
        debugger;
        if (data.ResponseCode == "200") {
          const NextPath = data.ResponseResult.ResponseResult;
          const publicURL = NextPath.replace("gs://", "https://storage.googleapis.com/");
          console.log(publicURL);
          setSourceFilePath(NextPath);
          addFinalPath("Beautify", publicURL);

          debugger;
          handleNext();
          setIsLoading(false);
        }
        console.log("Upload success:", data);
        // Show toast or update status
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Upload error:", err);
      });
  };

  const addFile = (file) => {
    debugger;
    setFilesData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        fileName: file.fileName,
        url: file.url,
        type: file.type,
        status: "UPLOADED",
        uploadDate: new Date().toISOString().split("T")[0],
        completion: 0,
        progressColor: "bg-warning",
      },
    ]);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="d-flex justify-content-end align-items-center mb-3">
              <div className="form-check form-check-inline">
                <Input
                  type="radio"
                  name="uploadType"
                  value="single"
                  checked={uploadType === "single"}
                  onChange={handleUploadTypeChange}
                  className="form-check-input"
                />
                <Label className="form-check-label me-3" check>
                  Single
                </Label>
              </div>
              <div className="form-check form-check-inline">
                <Input
                  type="radio"
                  name="uploadType"
                  value="bulk"
                  checked={uploadType === "bulk"}
                  onChange={handleUploadTypeChange}
                  className="form-check-input"
                />
                <Label className="form-check-label" check>
                  Bulk
                </Label>
              </div>
            </div>

            {uploadType === "single" ? (
              <>
                <UploadSingle
                  handleFileChange={handleFileChange}
                />
              </>
            ) : (
              <>
                <UploadBulk
                  handleFileChange={handleFileChange}
                />
              </>
            )}
          </>
        );
      case 1:
        return (
          <FilesTable
            filesData={filesData}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            FinalPaths={FinalPaths}
          />
        );
      case 2:
        return (
          <FilesTable
            filesData={filesData}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            FinalPaths={FinalPaths}
          />
        );

      case 3:
        return (
          <FilesTable
            filesData={filesData}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            FinalPaths={FinalPaths}
          />
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <Box sx={{ width: "100%" }}>
          <Card className="shadow mt-5">
            <CardHeader>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};


                  labelProps.optional = (
                    <Typography variant="caption">
                      {index === 0
                        ? 'Upload Document'
                        : index == 1
                          ? 'Transcribe Document'
                          : index == 2
                            ? 'Generate Clinical Note'
                            : 'Final Output'}
                    </Typography>
                  );


                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </CardHeader>
            {/* <CardBody></CardBody> */}
            {activeStep === steps.length ? (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you're finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </>
            ) : (
              <>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col lg="12">{renderStepContent(activeStep)}</Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    {/* <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button> */}
                    <Box sx={{ flex: "1 1 auto" }} />
                    {isStepOptional(activeStep) && (
                      <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Reset
                      </Button>
                    )}
                    {/* <Button
                     disabled={
                      activeStep === 0 &&
                      (
                        (uploadType === 'single' && selectedFiles.length === 0)
                      )
                    }
                    onClick={handleNext}>
                    
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button> */}

                    {!isLoading ? (
                      <Button
                        disabled={
                          (activeStep === 0 && selectedFiles.length === 0) ||
                          (activeStep === 1 && uploadType === 'bulk' && selectedFileIds.length === 0)
                        }
                        onClick={() => {
                          if (activeStep === 0) {
                            handleUpload(); // 🔧 Step 0 logic
                          } else if (activeStep === 1) {
                            handleTranscription();  // 🔧 Step 1 logic
                          }
                          else if (activeStep === 2) {
                            GenerateCN();  // 🔧 Step 1 logic
                          }
                          else {
                            handleNext();        // 🔧 Step 2 (Finish)
                          }
                        }}
                      >
                        {
                          activeStep === 0
                            ? "Upload"
                            : activeStep === 1
                              ? "Transcribe"
                              : "Finish"
                        }
                      </Button>
                    ) : (
                      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                    )}
                  </Box>
                </CardFooter>
              </>
            )}
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default ProcessWizzard;
