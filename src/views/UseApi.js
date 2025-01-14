import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Table,
} from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { Auth0Client } from "@auth0/auth0-spa-js";
import { getConfig } from "../config";
import { jwtDecode } from 'jwt-decode';
import { config } from "@fortawesome/fontawesome-svg-core";

export const UseApiComponent = () => {
    let auth0 = null;
    const { loginWithPopup, logout, user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [endpoint, setEndpoint] = useState("");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [body, setBody] = useState({});
    const [response, setResponse] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const configs = getConfig();


    const handleAddHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const handleHeaderChange = (index, field, value) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index][field] = value;
        setHeaders(updatedHeaders);
    };

    const getAccessToken = async () => {

        await axios.get(
            configs.accessTokenUrl
        ).then(response => {

            setAccessToken(response.data.access_token)

        })
            .catch(error => console.log('error', error));

    };

    const handleRequest = async () => {
        try {
            // const token = await getAccessTokenSilently();


            const formattedHeaders = headers.reduce((acc, curr) => {
                if (curr.key && curr.value) acc[curr.key] = curr.value;
                return acc;
            }, {});
            formattedHeaders.Authorization = `Bearer ${accessToken}`;
            console.log(formattedHeaders)
            const config = {
                method,
                url: configs.audience + endpoint,
                headers: formattedHeaders,
                data: body,
            };

            const res = await axios(config);
            setResponse(res.data);
        } catch (err) {
            setResponse(err.response ? err.response.data : err.message);
        }
    };


    useEffect(() => {
        getAccessToken();
    }, []);

    return (
        <Container className="mt-4">
            <Card>
                <CardHeader>
                    <h1 className="text-center">Auth0 Management API Tester</h1>
                </CardHeader>
                <CardBody>
                    {!isAuthenticated ? (
                        <div className="text-center">
                            <Button color="primary" onClick={() => loginWithPopup()}>
                                Login
                            </Button>
                        </div>
                    ) : (
                        <>

                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="endpoint">エンドポイント</Label>
                                            <Label for="endpoint">{config.audience}
                                                <Input
                                                    type="text"
                                                    id="endpoint"
                                                    value={endpoint}
                                                    onChange={(e) => setEndpoint(e.target.value)}
                                                    placeholder="users"
                                                />
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="method">メソッド</Label>
                                            <Input
                                                type="select"
                                                id="method"
                                                value={method}
                                                onChange={(e) => setMethod(e.target.value)}
                                            >
                                                <option value="GET">GET</option>
                                                <option value="POST">POST</option>
                                                <option value="PATCH">PATCH</option>
                                                <option value="DELETE">DELETE</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <h3>ヘッダー</h3>
                                {headers.map((header, index) => (
                                    <Row key={index} className="align-items-center">
                                        <Col md={5}>
                                            <Input
                                                type="text"
                                                placeholder="Key"
                                                value={header.key}
                                                onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Input
                                                type="text"
                                                placeholder="Value"
                                                value={header.value}
                                                onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Button color="secondary" className="mt-2" onClick={handleAddHeader}>
                                    ヘッダーを追加
                                </Button>

                                <h3 className="mt-4">リクエストボディ</h3>
                                <FormGroup>
                                    <Input
                                        type="textarea"
                                        rows="6"
                                        value={JSON.stringify(body, null, 2)}
                                        onChange={(e) => setBody(JSON.parse(e.target.value))}
                                    />
                                </FormGroup>
                                <Button color="primary" onClick={handleRequest}>
                                    送信
                                </Button>
                            </Form>
                        </>
                    )}
                </CardBody>
                {response && (
                    <CardFooter>
                        <h3>レスポンス</h3>
                        <Table striped>
                            <tbody>
                                <tr>
                                    <td>
                                        <pre>{JSON.stringify(response, null, 2)}</pre>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </CardFooter>
                )}
            </Card>
        </Container>
    );
};


export default withAuthenticationRequired(UseApiComponent, {
    onRedirecting: () => <Loading />,
});
