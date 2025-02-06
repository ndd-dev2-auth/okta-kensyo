import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    Container,
    Collapse,
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
    const [headers, setHeaders] = useState([{ key: "content-type", value: "application/json" }]);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [response, setResponse] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);


    const [isApi1Open, setIsApi1Open] = useState(false);
    const [isApi2Open, setIsApi2Open] = useState(false);
    const [isApi3Open, setIsApi3Open] = useState(false);



    const configs = getConfig();

    const handleAddHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };
    const handleRemoveHeader = (index) => {
        const updatedHeader = headers.filter((_, i) => i !== index);
        setHeaders(updatedHeader);
    };
    const handleAddBody = () => {
        setBody([...body, { key: "", value: "" }]);
    };

    const handleRemoveBody = (index) => {
        const updatedBody = body.filter((_, i) => i !== index);
        setBody(updatedBody);
    };

    const handleHeaderChange = (index, field, value) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index][field] = value;
        setHeaders(updatedHeaders);
    };

    const handleBodyChange = (index, field, value) => {
        const updatedBody = [...body];
        updatedBody[index][field] = value;
        setBody(updatedBody);
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
        setError(null); // Reset error state
        setResponse(null); // Reset response state
        try {
            // const token = await getAccessTokenSilently();


            const formattedHeaders = headers.reduce((acc, curr) => {
                if (curr.key && curr.value) acc[curr.key] = curr.value;
                return acc;
            }, {});
            formattedHeaders.Authorization = `Bearer ${accessToken}`;

            const formattedBody = body.reduce((acc, curr) => {
                if (curr.key && curr.value) acc[curr.key] = curr.value;
                return acc;
            }, {});



            const config = {
                method,
                url: configs.audience + endpoint,
                headers: formattedHeaders,
                data: method === "GET" || method === "DELETE" ? null : formattedBody,
            };
            console.log(config)
            const res = await axios(config);
            setResponse(res.data);
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
        }
    };


    useEffect(() => {
        getAccessToken();
    }, []);

    return (
        <Container className="mt-4">

            <div>
                {/* API1 Button and Accordion */}
                <Button color="primary" onClick={() => setIsApi1Open(!isApi1Open)} block>
                    API1
                </Button>
                <Collapse isOpen={isApi1Open}>
                    <Card>
                        <CardBody>
                            {/* API1 Content */}
                            <p>API1の情報をここに表示</p>
                        </CardBody>
                    </Card>
                </Collapse>

                {/* API2 Button and Accordion */}
                <Button color="primary" onClick={() => setIsApi2Open(!isApi2Open)} block>
                    API2
                </Button>
                <Collapse isOpen={isApi2Open}>
                    <Card>
                        <CardBody>
                            {/* API2 Content */}
                            <p>API2の情報をここに表示</p>
                        </CardBody>
                    </Card>
                </Collapse>

                {/* API3 Button and Accordion */}
                <Button color="primary" onClick={() => setIsApi3Open(!isApi3Open)} block>
                    API3
                </Button>
                <Collapse isOpen={isApi3Open}>
                    <Card>
                        <CardBody>
                            {/* API3 Content */}
                            <p>API3の情報をここに表示</p>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>

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
                                            <Label for="endpoint">エンドポイント：{configs.audience}</Label>

                                            <Input
                                                type="text"
                                                id="endpoint"
                                                value={endpoint}
                                                onChange={(e) => setEndpoint(e.target.value)}
                                                placeholder="users"
                                            />

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
                                        <Col md={2}>
                                            <Button color="danger" onClick={() => handleRemoveHeader(index)}>
                                                削除
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button color="secondary" className="mt-2" onClick={handleAddHeader}>
                                    ヘッダーを追加
                                </Button>

                                <h3 className="mt-4">リクエストボディ</h3>
                                {body.map((item, index) => (
                                    <Row key={index} className="align-items-center">
                                        <Col md={5}>
                                            <Input
                                                type="text"
                                                placeholder="Key"
                                                value={item.key}
                                                onChange={(e) => handleBodyChange(index, "key", e.target.value)}
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Input
                                                type="text"
                                                placeholder="Value"
                                                value={item.value}
                                                onChange={(e) => handleBodyChange(index, "value", e.target.value)}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Button color="danger" onClick={() => handleRemoveBody(index)}>
                                                削除
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button color="secondary" className="mt-2" onClick={handleAddBody}>
                                    ボディを追加
                                </Button>
                                <h3 className="mt-4">送信</h3>
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
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </CardFooter>
                )}
                {error && (
                    <CardFooter>
                        <h3>エラー</h3>
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    </CardFooter>
                )}
            </Card>
        </Container>
    );
};


export default withAuthenticationRequired(UseApiComponent, {
    onRedirecting: () => <Loading />,
});
