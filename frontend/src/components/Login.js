import React, { useRef, useState } from 'react';
import decode from "jwt-decode";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

function Login() {
  var bp = require('./Path.js');

  const loginName = useRef();
  const loginPassword = useRef();

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const doLogin = async event => {
    event.preventDefault();

    const obj = {
      username: loginName.current?.value,
      password: loginPassword.current?.value
    };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(bp.buildPath('api/login'),
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

      var res = JSON.parse(await response.text());
      console.log(JSON.stringify(res, null, 4));
      var storage = require('../tokenStorage.js');
      storage.storeToken(res);
      const { JWT:{accessToken} } = res;
      const decoded = decode(accessToken, { complete: true });

      try {
        var ud = decoded;
        var userId = ud.userId;
        var firstName = ud.firstName;
        var lastName = ud.lastName;

        if (userId <= 0) {
          setMessage('User/Password combination incorrect');
        }
        else {
          var user = { firstName: firstName, lastName: lastName, id: userId }
          localStorage.setItem('user_data', JSON.stringify(user));

          setMessage('');
          navigate("/home");
        }
      }
      catch (e) {
        console.error(e);
        return ("");
      }
    }
    catch (e) {
      console.error(e);
      return ("");
    }
  };

  return (
    <Container className="justify-content-md-center" style={{ marginTop: "15vh" }}>
      <Container style={{ justifyContent: "center", alignItems: "center", height: "70vh", width: "30vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
        <Form onSubmit={doLogin} style={{fontSize: '24px'}}>
          <h1>Sign In</h1><br /><br />
          <Form.Group className="mb-3" controlId="formGroupUser" >
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" style={{fontSize: '24px'}} ref={loginName} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword" >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" style={{fontSize: '24px'}} ref={loginPassword} />
          </Form.Group>
          <Button variant="primary" className="button-block" type="submit">Submit</Button>
        </Form>
        <br />
        <p>Don't have an account? Make one <a href="/register">here</a>!</p>
        <span id="loginResult">{message}</span>
      </Container>
    </Container>
  );
};

export default Login;
