import React, { createRef, useCallback, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import decode from "jwt-decode";
import TokenStorage from '../tokenStorage.js';
import { useLocation } from 'react-router-dom';

function ResetOne() {
    const emailRef = createRef();
    const [message,setMessage] = useState('');

    const location = useLocation();
    //const verificationToken = location.state?.verificationToken;
    
    var bp = require('./Path.js');
    const navigate = useNavigate();

    const doResetOne = async event => {
        event.preventDefault();

        // first, make sure the email exists in our database
        const formEmail = {
            email: emailRef.current?.value
        }

        const response = await fetch(bp.buildPath('api/emailCheck'), {
            method: 'POST',
            body: JSON.stringify(formEmail),
            headers: { 'Content-Type': 'application/json' }
        });


        var res = JSON.parse(await response.text());
        var emailFree = -1;

        console.log('the res is: ', res);

        if (res.exists) {
            // setMessage(res.error);
            emailFree = 1;
            console.log('email already exists in database');
        } else {
            console.log('email does not exist in database');
        }

        if (emailFree == -1) {
            setMessage('Request failed, no user uses this email!');
        }
        else {
            const resetEmail =  emailRef.current?.value;

            // after inputting reset email, redirect to password reset page and send email
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            const form2 = {
                email: resetEmail,
                verificationToken: verificationToken
            }

            const response2 = await fetch(bp.buildPath('api/emailReset'), {
                method: 'POST',
                body: JSON.stringify(form2),
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage('');
            navigate("/resetTwo", { state: {verificationToken, resetEmail}});
        }
    };

    return (
        <Container className="justify-content-md-center" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
            <Container style={{ justifyContent: "center", alignItems: "center", height: "70vh", width: "30vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                <Form onSubmit={doResetOne}>
                    <h1>What email did you use for this account?</h1><br />
                    <Form.Group className="mb-3" controlId="formGroupFirst">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter recovery email" ref={emailRef} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <br />
                <p>Already have an account? <Link to="/">Log in</Link>!</p>
                <span id="resetOneResult">{message}</span>
            </Container>
        </Container>
    );

};

export default ResetOne;