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

const UploadBulk = ({ handleFileChange }) => {
  


  return (

    <Container fluid>
      <Row>
        <Col lg="8" md="10" className="text-left">
          <Form>
            <FormGroup>
              <Label for="fileUpload">
                Select Multiple File:
              </Label>
              <Input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>            
    </Container>

  );
};

export default UploadBulk;
