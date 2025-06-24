import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as requestMethods from "../../WebServiceCall/ServiceNames";
import APIRequest from "../../WebServiceCall/APICall";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const requestData = { userid: email, password: password };    
    

    if (email.toLowerCase() === "admin" && password.toLowerCase() === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin/ProcessFiles", { replace: true });
      //navigate("/admin/index");
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <>
      <Col lg="4" md="6">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent text-center pt-3 pb-1">
            <img
              alt="..."
              src={require("../../assets/img/brand/argon-react-blue.png")}
              style={{
                maxWidth: "100%",
                width: "100px",
                height: "auto",
              }}
            />
            <p className="text-gray " style={{ fontSize: "0.75rem" }}>AI-Powered Medical Transcriber</p>
          </CardHeader>
          <CardBody className="px-3 py-3 mt-3">
            {error && (
              <div className="text-danger text-center mb-2">
                <small>{error}</small>
              </div>
            )}
            <Form role="form" onSubmit={handleSignIn}>
              <FormGroup className="mb-2">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                  bsSize="sm"
                    placeholder="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-2">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                  bsSize="sm"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox mb-2">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted text-align-left" style={{ fontSize: "0.75rem" }}>Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-2 mt-3" color="primary" type="submit" size="sm">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-2">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: "0.75rem" }}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: "0.75rem" }}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row> */}
      </Col>
    </>
  );
};

export default Login;
