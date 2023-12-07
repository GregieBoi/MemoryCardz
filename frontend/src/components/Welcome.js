import React from "react";
import Container from "react-bootstrap/esm/Container";

function Welcome() {
    var _ud = localStorage.getItem('user');
    var ud = JSON.parse(_ud);
    //var userId = ud.id;
    var firstName = ud.firstName;
    
    return (
        <Container >
            <div className="p-5" id="welcomeText" >Welcome back, {firstName}! Here's what's new this week:</div>
        </Container>
    );
};

export default Welcome;