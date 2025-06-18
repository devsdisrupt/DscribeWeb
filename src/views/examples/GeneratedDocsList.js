import React, { useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Table,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import _ from "lodash";


const GeneratedDocsList = ({ filesData, deleteFile, handleGenerateOCRSingle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filesData.length / itemsPerPage);
  const currentData = filesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (url, type) => {
    setSelectedFileURL(url);
    setSelectedFileType(type);
    setModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  return (
    <>
      <Row>
        <div className="col">
          
          <Card className="shadow mt-5">
            <CardHeader className="border-0">
              <h3 className="mb-0">Generated Documents</h3>
            </CardHeader>

            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>File Name</th>
                  <th>Status</th>
                  <th>Upload Date</th>
                  {/* <th>Progress</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No files uploaded.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr key={item.id}>
                      <th>{item.id}</th>
                      <td title={item.fileName}>
                        {_.truncate(item.fileName, { length: 40 })}
                      </td>
                      <td>
                        <Badge className="badge-dot mr-4">
                          <i
                            className={`bg-${item.status === "completed"
                                ? "success"
                                : item.status === "pending"
                                  ? "warning"
                                  : "danger"
                              }`}
                          />
                          {item.status}
                        </Badge>
                      </td>
                      <td>{item.uploadDate}</td>
                      {/* <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">{item.completion}%</span>
                          <div>
                            <Progress
                              max="100"
                              value={item.completion}
                              barClassName={item.progressColor}
                            />
                          </div>
                        </div>
                      </td> */}
                      <td className="text-right">
                        <Button
                          size="sm"
                          color="info"
                          className="mr-2"
                          onClick={() => handleView(item.url, item.type)}
                        >
                          <i className="fas fa-eye" />
                        </Button>
                        <Button
                          size="sm"
                          color="info"
                          className="mr-2"
                          // disabled= {!hasUploadedFiles}
                          onClick={() => handleGenerateOCRSingle(item)}
                        >
                          <i class="fa-solid fa-wand-sparkles"></i>
                        </Button>
                        <Button
                          size="sm"
                          color="default"
                          className="mr-2"
                          disabled = {item.status === "UPLOADED"}

                          onClick={() => handleView(item.url, item.type)}
                        >
                          <i class="fa-solid fa-microchip"></i>
                        </Button>
                        <Button
                          size="sm"
                          color="danger"                          
                          onClick={() => deleteFile(item.id)}                          
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <CardFooter className="py-4">
              <nav aria-label="...">
                <Pagination className="pagination justify-content-end mb-0">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    >
                      <i className="fas fa-angle-left" />
                      <span className="sr-only">Previous</span>
                    </PaginationLink>
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem active={currentPage === i + 1} key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    >
                      <i className="fas fa-angle-right" />
                      <span className="sr-only">Next</span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </nav>
            </CardFooter>
          </Card>
        </div>
      </Row>

      {/* Modal for Preview */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} size="xl">
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Preview File
        </ModalHeader>
        <ModalBody>
          {selectedFileURL ? (
            selectedFileType === "application/pdf" ? (
              <iframe
                src={selectedFileURL}
                style={{ width: "100%", height: "500px" }}
                frameBorder="0"
                title="PDF Preview"
              />
            ) : selectedFileType.startsWith("image/") ? (
              <img
                src={selectedFileURL}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "500px" }}
              />
            ) : (
              <div className="text-center">
                <i className="fas fa-file-alt fa-2x text-muted mb-3" />
                <p className="text-muted">Preview not available for this file type.</p>
              </div>
            )
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
};

export default GeneratedDocsList;
