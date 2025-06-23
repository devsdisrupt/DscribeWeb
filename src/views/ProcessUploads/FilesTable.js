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
  Table
} from "reactstrap";
import APIRequest from "../../WebServiceCall/APICall";
import * as requestMethods from "../../WebServiceCall/ServiceNames";

const FilesTable = ({ filesData, selectedFileIds, setSelectedFileIds, FinalPaths }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState({ type: '', path: '' });
  const openModal = (type, path) => {
    setModalFile({ type, path });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);




  return (

    <Container fluid>

      {filesData.length === 0 ? (<></>) : (
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>
                <Input
                  type="checkbox"

                  checked={(selectedFileIds.length === filesData.length && filesData.length > 0) || filesData.length === 1}
                  disabled={filesData.length === 1}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFileIds(filesData.map(file => file.id)); // select all
                    } else {
                      setSelectedFileIds([]); // deselect all
                    }
                  }}
                />
              </th>
              <th>ID</th>
              <th>File Name</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filesData.map((item) => (
              <tr>
                <td>
                  <Input
                    type="checkbox"
                    value={item.id}

                    disabled={filesData.length === 1}
                    checked={selectedFileIds.includes(item.id) || filesData.length === 1}
                    onChange={(e) => {
                      const id = item.id;
                      setSelectedFileIds((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((selectedId) => selectedId !== id)
                      );
                    }}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.fileName}</td>
                {/* <td>
                  {FinalPaths.length > 0 && FinalPaths.map((entry, index) => (
                    <a
                      key={index}
                      href={entry.Path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="btn btn-sm btn-outline-primary m-1">
                        {entry.Type}
                      </button>
                    </a>
                  ))}
                </td> */}
                <td>
                  {FinalPaths.length > 0 && FinalPaths.map((entry, index) => (
                    <button
                      key={index}
                      className="btn btn-sm btn-outline-primary m-1"
                      onClick={() => openModal(entry.Type, entry.Path)}
                    >
                      {entry.Type}
                    </button>
                  ))}
                </td>



              </tr>
            ))}

          </tbody>
        </Table>


      )}

      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document" style={{ maxWidth: '95vw', height: '95vh' }}>
            <div className="modal-content" style={{ height: '100%' }}>
              {/* Header */}
              <div className="modal-header">
                <h2 className="modal-title">{modalFile.type}</h2>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true" className="text-primary">&times;</span>
                </button>

              </div>

              {/* Body (fills remaining height) */}
              <div className="modal-body p-0" style={{ flex: 1, overflow: 'hidden' }}>
                <iframe
                  src={modalFile.path}
                  title="Viewer"
                  className="w-100"
                  style={{ height: '100%', border: 'none' }}
                />
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </Container>

  );


};


const TextViewer = ({ path }) => {
  debugger;
  const [content, setContent] = useState('');

  React.useEffect(() => {
    fetch(path)
      .then(res => res.text())
      .then(setContent)
      .catch(() => setContent('Error loading text.'));
  }, [path]);

  return <pre>{content}</pre>;
};

export default FilesTable;
