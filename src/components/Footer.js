import React from "react";
import { Container, Row, Col } from "reactstrap";


const mixStyles = function () {
  var res = {};
  for (var i = 0; i < arguments.length; ++i) {
    if (arguments[i]) Object.assign(res, arguments[i]);
  }
  return res;
}

const Styles = {
  bgRed: {
    backgroundColor: "red",
  },
  bgBlue: {
    backgroundColor: "blue",
  },
  fontSize16: {
    fontSize: "12px",
  },
  fontSize20: {
    fontSize: "20px",
  }
}

const Footer = () => (
  <footer className="bg-light p-3 text-center">

    <Container>
      <br />
      <Row>

        <Col className="bg-light">
          <p style={Styles.fontSize16}>Copyright (c) 認証チーム. All Rights Reserved.</p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
