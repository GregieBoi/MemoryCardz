import React from "react";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/esm/Stack";
import Row from "react-bootstrap/esm/Row";

function NumberTile(props) {
    const {
        label = "",
        value = 0
    } = props;

    return (
        <Container style={{ height: '100%', minWidth:88 }}>
            <Stack direction="vertical" style={{padding:12, justifyContent:'center', height:'100%'}}>
                <Row style={{justifyContent:'center', fontSize: '36px'}} >
                    {value}
                </Row>
                <Row style={{justifyContent:'center'}}>
                    {label}
                </Row>
            </Stack>
        </Container>
    );
};

export default NumberTile;