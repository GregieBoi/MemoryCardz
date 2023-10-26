import React, { createRef, useCallback, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import decode from "jwt-decode";

function Register() {
    const firstNameRef = createRef();
    const lastNameRef = createRef();
    const usernameRef = createRef();
    const emailRef = createRef();
    const passwordRef = createRef();
    const [message,setMessage] = useState('');
    
    var bp = require('./Path.js');
    const navigate = useNavigate();

    const doRegister = useCallback(async (event) => {
        event.preventDefault();
        const form = {
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        }

        const response = await fetch(bp.buildPath('api/register'), {
            method: 'POST',
            body: JSON.stringify(form),
            headers: { 'Content-Type': 'application/json' }
        });

        var res = JSON.parse(await response.text());
        var storage = require('../tokenStorage.js');
        storage.storeToken(res);
        const { accessToken } = res;
        const decoded = decode(accessToken, { complete: true });

        var ud = decoded;
        var userId = ud.userId;
        var firstName = ud.firstName;
        var lastName = ud.lastName;

        if (userId <= 0) {
            setMessage('Failed to create new account');
        }
        else {
            var user = { firstName: firstName, lastName: lastName, id: userId }
            localStorage.setItem('user_data', JSON.stringify(user));

            setMessage('');
            navigate("/home");
        }

    }, []);

    return (
        <Container className="justify-content-md-center" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
            <Container style={{ justifyContent: "center", alignItems: "center", height: "60vh", width: 500 }} className="bg-light text-black p-5">
                <Form onSubmit={doRegister}>
                    <h1>Create New User</h1><br />
                    <Form.Group className="mb-3" controlId="formGroupFirst">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" ref={firstNameRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupLast">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" ref={lastNameRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" ref={usernameRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>E-mail Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter e-mail address" ref={emailRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <br />
                <p>Already have an account? <Link to="/">Log in</Link>!</p>
            </Container>
        </Container>
    );

};

export default Register;