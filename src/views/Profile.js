import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { Auth0Client } from "@auth0/auth0-spa-js";
import { getConfig } from "../config";
import { jwtDecode } from 'jwt-decode';

export const ProfileComponent = () => {
  let auth0 = null;

  const {
    getIdTokenClaims,
    loginWithPopup,
    getAccessTokenSilently,
    user,
    logout,
  } = useAuth0();

  const config = getConfig();
  const [token, setToken] = useState("")
  const [idToken, setIdToken] = useState(null);
  const [decodedIdToken, setDecodedIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [decodedAccessToken, setDecodedAccessToken] = useState(null);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    });

  const getToken = (async () => {
    const idToken = await getIdTokenClaims({
      // audience: 'https://dev-tohogas-auth.jp.auth0.com/api/v2/' // ここにAPIの識別子を指定
    });
    console.log("IDトークンを発行します")
    console.log(idToken.__raw)
    setIdToken(idToken.__raw)
    const decoded = jwtDecode(idToken.__raw);
    setDecodedIdToken(decoded)
  })

  const getAccessToken = async () => {
    const token = await getAccessTokenSilently()
    console.log("アクセストークンを発行します")
    console.log(config.accessTokenUrl)
    await axios.get(
      config.accessTokenUrl
    ).then(response => {
      console.log("アクセストークンをデコードします")
      console.log(response.data.access_token)
      setAccessToken(response.data.access_token)
      const decoded = jwtDecode(response.data.access_token);
      setDecodedAccessToken(decoded);
      console.log(decoded)
    })
      .catch(error => console.log('error', error));

  };

  // const getMaster = async () => {
  //   const token = await getAccessTokenSilently()
  //   console.log(token)
  //   await axios.post(
  //     "https://mdwlvhtcdk.execute-api.ap-northeast-1.amazonaws.com/resendVerificationEmail",
  //     {

  //     },
  //     { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
  //   ).then(response => {
  //     console.log(response.data)

  //   })
  //     .catch(error => console.log('error', error));


  // };


  // const authenticateUser = async () => {
  //   const a0 = new Auth0Client({
  //     domain: config.domain,
  //     clientId: config.clientId,
  //   });
  //   await a0.loginWithPopup({
  //     max_age: 0,
  //     scope: "openid",
  //   });
  //   return await a0.getIdTokenClaims();
  // };

  // const linkAccounts = async () => {

  //   //    const accessToken = await auth0.getTokenSilently();

  //   const {
  //     __raw: targetUserIdToken,
  //     email_verified,
  //     email,
  //   } = await authenticateUser();

  //   const token = await getAccessTokenSilently()
  //   setAccessToken(token)
  //   setAccessToken(targetUserIdToken)

  //   await loginWithPopup({
  //     prompt: 'login', // 常にログインを促す
  //     max_age: 0,
  //     connection: 'google-oauth2'
  //   });


  //   const tokenClaims = await getIdTokenClaims();
  //   const idToken = tokenClaims.__raw; // IDトークン本体は `__raw` に格納されている
  //   setIdToken(idToken);

  //   const user_id_child = "google-oauth2|106105577515094295701"
  //   const response = await fetch(`https://mdwlvhtcdk.execute-api.ap-northeast-1.amazonaws.com/linkSocial`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       link_with: idToken,
  //       user_id_child: user_id_child,
  //       provider: 'google-oauth2',
  //     }),
  //   });

  //   if (response.ok) {
  //     console.log('アカウントがリンクされました');
  //   } else {
  //     console.error('アカウントのリンクに失敗しました');
  //   }
  // };



  useEffect(() => {
    getToken();
    getAccessToken();
  }, []);

  return (
    <Container className="mb-5">
      <h1>プロフィール画面</h1>
      <br />
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
        {user.sub.match("auth0|.*") &&
          <>
            {/* <button onClick={() => IPfilter()}>IP制限</button> */}
            {/* / <button onClick={() => handleLinkAccount()}>Google連携</button> */}
            {/* <button onClick={() => changePassword()}>パスワード変更</button> */}
            <button onClick={() => getToken()}>IDトークン</button>
            <button onClick={() => getAccessToken(user.sub)}>アクセストークン</button>
            {/* <button onClick={() => getMaster()}>検証用メール再送信</button> */}
            {/* <button onClick={() => linkAccounts()}>ソーシャルアカウントの連携</button> */}
          </>
        }

      </Row>
      <Row>
        <Col md={6}>
          <h2>Auth0ライブラリのuser情報</h2>
          <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
        </Col>

        <Col md={6}>
          <Highlight>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">nickname</Col>
              <Col md={9}>ニックネーム</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">name</Col>
              <Col md={9}>なまえ</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">picture</Col>
              <Col md={9}>写真</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">updated_at</Col>
              <Col md={9}>更新日時</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">email</Col>
              <Col md={9}>メールアドレス</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">email_verified</Col>
              <Col md={9}>メール認証 true false</Col>
            </Row>
            <Row className="py-2 border-bottom">
              <Col md={3} className="fw-bold">sub</Col>
              <Col md={9}>sub??</Col>
            </Row>
          </Highlight>
        </Col>
      </Row>

      {idToken &&
        <Row>
          <Col md={6}>
            <h2>IDトークン</h2>
            <Highlight>{idToken}</Highlight>
            <h2>デコード結果</h2>
            <Highlight>{JSON.stringify(decodedIdToken, null, 2)}</Highlight>
          </Col>
        </Row>




      }
      {accessToken &&
        <Row>
          <Col md={6}>
            <h2>アクセストークン</h2>
            <Highlight>{accessToken}</Highlight>
            <h2>デコード結果</h2>
            <Highlight>{JSON.stringify(decodedAccessToken, null, 2)}</Highlight>
          </Col>
        </Row>
      }

    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
