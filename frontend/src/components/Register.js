import React, { createRef, useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import decode from "jwt-decode";
import TokenStorage from '../tokenStorage.js';
import { useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form"

function Register() {
    const [message, setMessage] = useState('');

    var bp = require('./Path.js');
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm();

    const doRegister = async data => {

        const form = {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            password: data.password
        }

        const formEmail = {
            email: data.email
        }

        const response = await fetch(bp.buildPath('api/emailCheck'), {
            method: 'POST',
            body: JSON.stringify(formEmail),
            headers: { 'Content-Type': 'application/json' }
        });


        var res = JSON.parse(await response.text());
        var emailFree = -1;

        if (res.exists) {
            // setMessage(res.error);
            console.log('email already exists in database');
        } else {
            emailFree = 1;
            console.log('email does not exist in database');
        }

        if (emailFree == -1) {
            setMessage('Failed to create new account, email already exists');
        }
        else {
            // after clicking register, redirect to email verification page and send email
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            const form2 = {
                email: data.email,
                verificationToken: verificationToken
            }

            const response2 = await fetch(bp.buildPath('api/emailVerify'), {
                method: 'POST',
                body: JSON.stringify(form2),
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage('');
            navigate("/verification", { state: { verificationToken, form } });
        }
    };
    console.log(formState.errors, "oihgasfhiasfrgsajlnasjlgasfnjfgjnls");
    return (
        <Container className="justify-content-md-center" style={{ marginTop: "5vh", marginBottom: "5vh" }}>
            <Container style={{ justifyContent: "center", alignItems: "center", height: "90vh", width: "30vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                <Form onSubmit={handleSubmit(doRegister)} noValidate={true}>
                    <h1>Create New User</h1><br />
                    <Form.Group className="mb-3" controlId="formGroupFirst">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control isInvalid={!!formState.errors.firstName} type="text" placeholder="Enter first name" {...register("firstName", { required: true, minLength: 1 })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupLast">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control isInvalid={!!formState.errors.lastName} type="text" placeholder="Enter last name" {...register("lastName", { required: true, minLength: 1 })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control isInvalid={!!formState.errors.username} type="text" placeholder="Enter username" {...register("username", { required: true, minLength: 4 })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>E-mail Address</Form.Label>
                        <Form.Control isInvalid={!!formState.errors.email} type="email" placeholder="Enter e-mail address" {...register("email", {
                            required: true, pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Entered value does not match email format",
                            }
                        })} />
                        <Form.Control.Feedback type='invalid'>{formState.errors.email?.message || ''}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control isInvalid={!!formState.errors.password} type="password" placeholder="Enter password" {...register("password", { required: true, minLength: 4, validate:(value) => {
                            if(!/[!@#$^&*?]/g.test(value)){
                                return "Your password must contain a special character (!@#$^&*?).";
                            }
                            if(!/[A-Z]/g.test(value)){
                                return "Your password must contain a capital letter.";
                            }
                            return true;
                        } })} />
                        <Form.Control.Feedback type='invalid'>{formState.errors.password?.message || ''}</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <br />
                <p>Already have an account? <Link to="/">Log in</Link>!</p>
                <span id="registerResult">{message}</span>
            </Container>
        </Container>
    );

};

export default Register;