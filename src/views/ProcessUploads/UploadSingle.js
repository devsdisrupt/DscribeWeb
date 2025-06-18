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
  Table,
} from "reactstrap";
import APIRequest from "../../WebServiceCall/APICall";
import * as requestMethods from "../../WebServiceCall/ServiceNames";

const UploadSingle = ({ handleFileChange}) => {
  

  return (

    <Container fluid>
      <Row>
        <Col lg="8" md="10" className="text-left">
          <Form>
            <FormGroup>
              <Label for="fileUpload">
                Select Single File:
              </Label>
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      
      
    </Container>

  );
};

export default UploadSingle;
