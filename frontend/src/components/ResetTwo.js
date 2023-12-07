import React, { createRef, useCallback, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import decode from "jwt-decode";
import TokenStorage from '../tokenStorage.js';
import { useLocation } from 'react-router-dom';

function ResetTwo() {
    const passRef = createRef();
    const resetRef = createRef();
    const [message,setMessage] = useState('');

    const location = useLocation();
    const verificationToken = location.state?.verificationToken;
    const resetEmail = location.state?.resetEmail;
    
    var bp = require('./Path.js');
    const navigate = useNavigate();

    const doResetTwo = async event => {
        event.preventDefault();
        
        const activationNumber =  resetRef.current?.value;
        const newPassword = passRef.current?.value;

        if (activationNumber != verificationToken) {
            setMessage('Invalid reset code. Please try again!');
        }
        else {
            setMessage('Successfully changed password!');
            // at this point, call api that changes old password into new one for respective user.
            const form3 = {
                email: resetEmail,
                newPassword: newPassword
            }

            const response3 = await fetch(bp.buildPath('api/changePassword'), {
                method: 'POST',
                body: JSON.stringify(form3),
                headers: { 'Content-Type': 'application/json' }
            });

            // navigate back to the login screen
            navigate("/");
        }
    };

    return (
        <Container className="justify-content-md-center" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
            <Container style={{ justifyContent: "center", alignItems: "center", height: "80vh", width: "30vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                <Form onSubmit={doResetTwo}>
                    <h1>Enter the password reset code and your new password!</h1><br />
                    <Form.Group className="mb-3" controlId="formGroupFirst">
                        <Form.Label>Reset Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter reset code" ref={resetRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupSecond">
                        <Form.Label>New password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your new password" ref={passRef} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <br />
                <p>Already have an account? <Link to="/">Log in</Link>!</p>
                <span id="resetTwoResult">{message}</span>
            </Container>
        </Container>
    );

};

export default ResetTwo;