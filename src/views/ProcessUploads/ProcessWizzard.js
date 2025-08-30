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
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const steps = ["Step-1", "Step-2", "Step-3"];


// Encrypt
export function encryptAPIKey(apiKey, secretKey) {
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
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const [sourceFilePath, setSourceFilePath] = useState("");
  const [FinalPaths, setFinalPaths] = useState([]);
  const [Apikey, setkey] = useState("");
  const [completedSteps, setCompletedSteps] = useState(new Set());



  const addFinalPath = (type, path) => {
    setFinalPaths((prev) => [...prev, { Type: type, Path: path }]);
  };

  const downloadAllFiles = async () => {
    debugger;
    setIsLoadingDownload(true);
    console.log("Download started");
    const zip = new JSZip();

    for (let i = 0; i < FinalPaths.length; i++) {
      const file = FinalPaths[i];

      try {
        const response = await axios.get(file.Path, {
          responseType: "blob",
        });

        const contentType = response.headers["content-type"] || (
          file.Path.endsWith(".txt") ? "text/plain" :
            file.Path.endsWith(".pdf") ? "application/pdf" :
              "application/octet-stream"
        );

        const extension = file.Path.endsWith(".txt") ? ".txt" : ".pdf";
        //const fileName = `${file.Type || "File"}_${i + 1}${extension}`;
        const fileName = `${i + 1}-${file.Type || "File"}${extension}`;


        // Add file to zip
        zip.file(fileName, response.data);
        console.log(`Added to zip: ${fileName}`);

      } catch (error) {
        setIsLoadingDownload(false);
        console.error(`Download failed for ${file.Path}:`, error);
      }
    }

    // Generate and trigger ZIP download
    try {
      const content = await zip.generateAsync({ type: "blob" });
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '');
      const fileName = `D'scribe-${formattedDate}.zip`;
      saveAs(content, fileName);
      console.log("ZIP download triggered.");
      setIsLoadingDownload(false);
    } catch (zipError) {
      setIsLoadingDownload(false);
      console.error("Failed to generate ZIP:", zipError);
    }
  };

  const CustomStepIcon = (props) => {
    debugger;
    const { active, completed, icon } = props;

    const getColor = () => {
      if (completed) return "#4caf50"; // green
      if (active) return "#1976d2";   // primary blue
      return "#cfd8dc";               // grey
    };

    return (
      <div
        style={{
          backgroundColor: getColor(),
          color: "white",
          borderRadius: "50%",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        {completed ? "✓" : icon}
      </div>
    );
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
    setSelectedFiles([]);
    setFilesData([]);
    setSelectedFileIds([]);
    setIsLoading(false);
    setIsLoadingDownload(false);
    setSourceFilePath("");
    setFinalPaths([]);
    setkey("");
    setCompletedSteps(new Set()); // ✅ Reset completed steps
    setActiveStep(0);
  };

  const handleFileChange = (e) => {
    debugger;
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

          addFinalPath("Source", publicURL);


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
          setCompletedSteps(prev => new Set(prev).add(activeStep));
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
          setCompletedSteps(prev => new Set(prev).add(activeStep));
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
      GPTModel: appCred.gptModel
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
          addFinalPath("Refined Text", publicURL);

          const ReqData = {
            PromptType: "DateWiseClassification",
            SourceFilePath: sourceFilePath,
            OutputBucketName: "dscribe-outputbucket",
            SiteId: "LNH",
            OpenAIAPIKey: Apikey,
            UserID: "DScribe",
            Password: "XDsLOkfUrSoPzmfo81wBisD1YtXh3rKp4eQ7vZ9jF8w=",
            //GPTModel: "gpt-4-1106-preview"
            GPTModel: appCred.gptModel
          };
          APIRequest(requestMethods.PerformLLMProcessing, ReqData, false)
            //APIRequest(requestMethods.Test, formData, true)
            .then((data) => {
              debugger;
              if (data.ResponseCode == "200") {
                const NextPath = data.ResponseResult.ResponseResult;
                const publicURL = NextPath.replace("gs://", "https://storage.googleapis.com/");
                console.log(publicURL);
                addFinalPath("Date Wise", publicURL);
                debugger;
                const ReqData = {
                  PromptType: "ClinicalDocumentGeneration",
                  SourceFilePath: sourceFilePath,
                  OutputBucketName: "dscribe-outputbucket",
                  SiteId: "LNH",
                  OpenAIAPIKey: Apikey,
                  UserID: "DScribe",
                  Password: "XDsLOkfUrSoPzmfo81wBisD1YtXh3rKp4eQ7vZ9jF8w=",
                  //GPTModel: "gpt-4-1106-preview"
                  GPTModel: appCred.gptModel
                };
                APIRequest(requestMethods.PerformLLMProcessing, ReqData, false)
                  //APIRequest(requestMethods.Test, formData, true)
                  .then((data) => {
                    debugger;
                    if (data.ResponseCode == "200") {
                      const NextPath = data.ResponseResult.ResponseResult;
                      const publicURL = NextPath.replace("gs://", "https://storage.googleapis.com/");
                      console.log(publicURL);
                      addFinalPath("Clinical Document", publicURL);
                      debugger;
                      setCompletedSteps(prev => new Set(prev).add(activeStep));
                      //handleNext();
                      setIsLoading(false);
                    }
                    console.log("Upload success:", data);
                    // Show toast or update status
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    console.error("Upload error:", err);
                  });

              }
              console.log("Upload success:", data);
              // Show toast or update status
            })
            .catch((err) => {
              setIsLoading(false);
              console.error("Upload error:", err);
            });

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
                  disabled // <- disables the radio button
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
          {/* <Card className="shadow mt-5"> */}
          <Card className="shadow mt-5" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>

            <CardHeader>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                style={{ flexWrap: 'wrap', rowGap: '1rem' }} // ✅ allow wrapping and spacing
              >
                {steps.map((label, index) => {
                  debugger;
                  const stepProps = {};
                  const labelProps = {};

                  //const isCompleted = index < activeStep;
                  const isCompleted = completedSteps.has(index);

                  stepProps.completed = completedSteps.has(index);



                  labelProps.optional = (
                    <Typography variant="caption">
                      {isCompleted
                        ? (index === 0
                          ? 'Uploaded'
                          : index === 1
                            ? 'Transcribed'
                            : index === 2
                              ? 'Note Generated'
                              : 'Completed')
                        : (index === 0
                          ? 'Upload Document'
                          : index === 1
                            ? 'Transcribe Document'
                            : index === 2
                              ? 'Generate Clinical Note'
                              : 'Final Output')}
                    </Typography>
                  );


                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (

                    // <Step key={label} {...stepProps}>
                    //   <StepLabel {...labelProps}>{label}</StepLabel>
                    // </Step>

                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps} StepIconComponent={CustomStepIcon}>
                        {label}
                      </StepLabel>
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
                {/* <CardBody> */}
                <CardBody style={{ overflowX: 'auto' }}>

                  <Row className="justify-content-center">
                    {/* <Col lg="12">{renderStepContent(activeStep)}</Col> */}
                    <Col xs="12">{renderStepContent(activeStep)}</Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />

                    {activeStep !== 0 && (
                      <Button color="inherit" onClick={handleReset} sx={{ mr: 1 }}>
                        Reset
                      </Button>
                    )}

                    {(activeStep === 2 && completedSteps.has(2)) && (
                      !isLoadingDownload ? (
                        <Button
                          style={{ backgroundColor: "#1976d2", borderColor: "#1976d2" }}
                          className="fw-bold text-white border-0 hover-darker mr-2"
                          onClick={downloadAllFiles}
                        >
                          <i className="fas fa-download pr-1"></i>
                          Download
                        </Button>
                      ) : (
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                      )
                    )}


                    {/* {!isLoading ? (
                      <Button
                        color="success"
                        size="lg"
                        className="fw-bold bg-success text-white border-0 hover-darker"
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
                              : activeStep === 1
                              ? "Finish"
                              : ""
                        }
                      </Button>
                    ) : (
                      <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                    )} */}

                    {/* {activeStep !== 3 && ( */}
                    {activeStep !== 3 && !(activeStep === 2 && completedSteps.has(2)) && (
                      !isLoading ? (
                        <Button
                          color="success"
                          size="lg"
                          className={`fw-bold text-white border-0 hover-darker ${
                            (activeStep === 0 && selectedFiles.length === 0) ||
                            (activeStep === 1 && uploadType === 'bulk' && selectedFileIds.length === 0)
                              ? 'bg-light'
                              : 'bg-success'
                          }`}
                          disabled={
                            (activeStep === 0 && selectedFiles.length === 0) ||
                            (activeStep === 1 && uploadType === 'bulk' && selectedFileIds.length === 0)
                          }
                          onClick={() => {
                            if (activeStep === 0) {
                              handleUpload();
                            } else if (activeStep === 1) {
                              handleTranscription();
                            } else if (activeStep === 2) {
                              GenerateCN();
                            } else {
                              handleNext();
                            }
                          }}
                        >
                          {
                            activeStep === 0
                              ? "Upload"
                              : activeStep === 1
                                ? "Transcribe"
                                : activeStep === 2 && !completedSteps.has(2) ? "Generate"
                                  : ""
                          }
                        </Button>
                      ) : (
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                      )
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
