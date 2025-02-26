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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UseApiComponent = () => {
    let auth0 = null;
    const { loginWithPopup, logout, user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [apiType, setApiType] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState([{ key: "content-type", value: "application/json" }]);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [response, setResponse] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);

    const configs = getConfig();

    const handleApiTypeChange = (e) => {
        const selectedApiType = e.target.value;
        setApiType(selectedApiType);

        const updatedConfig = {
            method: "",
            endpoint: "",
            headers: [],
            body: [],
        };

        switch (selectedApiType) {
            case "getUsers":
                updatedConfig.method = "GET";
                updatedConfig.endpoint = "users/[特定のユーザーを取得したい場合user_IDを記述]";
                updatedConfig.headers = [{ key: "content-type", value: "application/json" }];
                updatedConfig.body = [];
                break;

            case "updateUser":
                updatedConfig.method = "PATCH";
                updatedConfig.endpoint = "users/[処理対象ユーザーID]";
                updatedConfig.headers = [
                    { key: "Content-Type", value: "application/json" },
                ];
                updatedConfig.body = [
                    { key: "app_metadata.appName1.role", value: "admin" },
                    { key: "app_metadata.appName1.permissions", value: ["read", "write", "delete"] },
                    { key: "app_metadata.appName2.flag", value: "true" },
                ];
                break;

            case "createUser":
                updatedConfig.method = "POST";
                updatedConfig.endpoint = "users";
                updatedConfig.headers = [
                    { key: "Content-Type", value: "application/json" },
                ];
                updatedConfig.body = [
                    { key: "email", value: "newuser@example.com" },
                    { key: "connection", value: "Username-Password-Authentication" },
                    { key: "password", value: "SecurePassword123" },
                    { key: "given_name", value: "テスト" },
                    { key: "family_name", value: "テスト" },
                    { key: "name", value: "テストユーザー" }
                ];

                break;

            case "deleteUser":
                updatedConfig.method = "DELETE";
                updatedConfig.endpoint = "users/[処理対象ユーザーID]";
                updatedConfig.headers = [
                    { key: "Content-Type", value: "application/json" },
                ];
                updatedConfig.body = [];
                break;

            // 他のAPIタイプに応じて設定を追加
            default:
                break;
        }

        setMethod(updatedConfig.method);
        setEndpoint(updatedConfig.endpoint);
        setHeaders(updatedConfig.headers);
        setBody(updatedConfig.body);
    };


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

            // // profile.emailの送り方に対応できていない?
            // const formattedBody = body.reduce((acc, curr) => {
            //     if (curr.key && curr.value) acc[curr.key] = curr.value;
            //     return acc;
            // }, {});

            const setNestedValue = (obj, path, value) => {
                const keys = path.split('.');
                let current = obj;

                keys.slice(0, -1).forEach(key => {
                    current[key] = current[key] || {};
                    current = current[key];
                });

                current[keys[keys.length - 1]] = value;
            };

            // リクエストボディの処理
            const formattedBody = body.reduce((acc, curr) => {
                if (curr.key && curr.value) {
                    setNestedValue(acc, curr.key, curr.value);
                }
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
            // DELETE メソッドでレスポンスボディが空の場合にメッセージを設定
            if (method === "DELETE" && res.status === 204) {
                setResponse({ message: "ユーザーが正常に削除されました。" });
            } else {
                setResponse(res.data);
            }
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
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
                                                <option value="PUT">PUT</option>
                                                <option value="PATCH">PATCH</option>
                                                <option value="DELETE">DELETE</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>

                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="apiType">試行するAPIを選択</Label>
                                            <Input
                                                type="select"
                                                id="apiType"
                                                value={apiType}
                                                onChange={handleApiTypeChange}
                                            >
                                                <option value="">APIを選択してください</option>
                                                <option value="getUsers">ユーザー取得</option>
                                                <option value="updateUser">ユーザー更新</option>
                                                <option value="createUser">ユーザー作成</option>
                                                <option value="deleteUser">ユーザー削除</option>
                                                /* 他のAPIタイプも追加 */
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

            <br />
            参考ページ
            <br />
            <a href="https://auth0.com/docs/api/management/v2/users/get-users" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon="link" className="mr-2" />
                ManagementAPIのエンドポイント集(公式ドキュメント)
            </a>
            <br />
        </Container>
    );
};


export default withAuthenticationRequired(UseApiComponent, {
    onRedirecting: () => <Loading />,
});
