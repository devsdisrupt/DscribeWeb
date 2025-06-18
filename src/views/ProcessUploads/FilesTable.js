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

const FilesTable = ({ filesData, selectedFileIds, setSelectedFileIds }) => {



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
                    checked={selectedFileIds.includes(item.id)|| filesData.length === 1}
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

              </tr>
            ))}

          </tbody>
        </Table>
      )}
    </Container>

  );
};

export default FilesTable;
