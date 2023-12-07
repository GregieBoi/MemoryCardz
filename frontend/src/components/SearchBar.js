import React, { useCallback } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { createSearchParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const onSubmit = useCallback((data) => {
        navigate({
            pathname: "/search",
            search: `?${createSearchParams({query:data.search})}`
        })
    }, []);


    return (
        <div style={{ backgroundColor: "#494949", borderRadius: 5 }}>
            <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    style={{
                        width: '100%',
                        paddingRight: '100px !important',
                        boxSizing: 'border-box',
                        border: 'none',
                        background: 'none'
                    }}
                    {...register("search")}
                />
                <Button className="search-button" variant="no-outline" type="submit" style={{
                }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} pull="right" style={{ color: '#DD2020' }} />
                </Button>
            </Form>
        </div>
    );
};

export default SearchBar;