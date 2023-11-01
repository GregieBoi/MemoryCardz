import React from "react";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";

function Account () {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    //var userId = ud.id;
    var firstName = ud.firstName;

    return(
        <Container>
            <Stack direction="horizontal">
                <div> {firstName}</div>
                <div></div>
                <div></div>
            </Stack>
        </Container>
    );
};

export default Account;