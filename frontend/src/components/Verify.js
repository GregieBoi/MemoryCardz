import React, { createRef, useCallback, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import decode from "jwt-decode";
import TokenStorage from '../tokenStorage.js';
import { useLocation } from 'react-router-dom';

function Verify() {
    const activationRef = createRef();
    const [message,setMessage] = useState('');

    const location = useLocation();
    const { form, verificationToken } = location.state;
    
    var bp = require('./Path.js');
    const navigate = useNavigate();

    const doVerify = async event => {
        event.preventDefault();
        
        const activationNumber =  activationRef.current?.value;

        if (activationNumber != verificationToken) {
            setMessage('Invalid activation code. Please try again!');
            console.log('activation number and verification token dont match');
        }
        else {
            setMessage('Email successfully verified!');
            console.log('now we are calling register api');

            const response = await fetch(bp.buildPath('api/register'), {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' }
            });

            var res = JSON.parse(await response.text());
            TokenStorage.storeToken(res);
            const { JWT:{accessToken} } = res;
            const decoded = decode(accessToken, { complete: true });

            var ud = decoded;
            var userId = ud.userId;

            if (userId <= 0) {
                setMessage('Failed to create new account');
            }
            else {
                setMessage('');
                navigate("/home");
            }
        }
    };

    return (
        <Container className="justify-content-md-center" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
            <Container style={{ justifyContent: "center", alignItems: "center", height: "70vh", width: "30vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                <Form onSubmit={doVerify}>
                    <h1>Check your email for you account activation number!</h1><br />
                    <Form.Group className="mb-3" controlId="formGroupFirst">
                        <Form.Label>Activation code</Form.Label>
                        <Form.Control type="text" placeholder="Enter activation code" ref={activationRef} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <br />
                <p>Already have an account? <Link to="/">Log in</Link>!</p>
                <span id="verifyResult">{message}</span>
            </Container>
        </Container>
    );

};

export default Verify;