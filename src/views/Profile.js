import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, CardBody, CardHeader, CardTitle, CardText, Card, } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { Auth0Client } from "@auth0/auth0-spa-js";
import { getConfig } from "../config";
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [isIdTokenOpen, setIsIdTokenOpen] = useState(true);
  const [isAccessTokenOpen, setIsAccessTokenOpen] = useState(true);
  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const toggleUsers = () => setIsUsersOpen(!isUsersOpen);
  const toggleIdToken = () => setIsIdTokenOpen(!isIdTokenOpen);
  const toggleAccessToken = () => setIsAccessTokenOpen(!isAccessTokenOpen);
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
      <Collapse isOpen={isUsersOpen}>
        <Row>

          <Col md={6}>
            <h2>Auth0ライブラリのuser情報</h2>
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Col>

          <Col md={6}>
            <h2>キーの説明</h2>
            <Highlight>
              <Row className="">
                <Col md={12} className="fw-bold">{'{'}</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>given_name</Col>
                <Col md={9} style={{ color: '#e6db74' }}>名</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>family_name</Col>
                <Col md={9} style={{ color: '#e6db74' }}>姓</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>nickname</Col>
                <Col md={9} style={{ color: '#e6db74' }}>ニックネーム</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>name</Col>
                <Col md={9} style={{ color: '#e6db74' }}>なまえ</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>picture</Col>
                <Col md={9} style={{ color: '#e6db74' }}>写真</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>updated_at</Col>
                <Col md={9} style={{ color: '#e6db74' }}>更新日時</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>email</Col>
                <Col md={9} style={{ color: '#e6db74' }}>メールアドレス</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>email_verified</Col>
                <Col md={9} style={{ color: '#e6db74' }}>メール認証 true false</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold" style={{ color: '#f92672' }}>sub(Subject)</Col>
                <Col md={9} style={{ color: '#e6db74' }}>ID トークン発行者のシステム内において、ユーザーを一意に特定することが可能な識別子</Col>
              </Row>
              <Row className="">
                <Col md={3} className="fw-bold">{'}'}</Col>
                <Col md={9} style={{ color: '#e6db74' }}> </Col>
              </Row>
            </Highlight>
          </Col>
        </Row>
      </Collapse>

      <Button color="info" onClick={toggleUsers} style={{ marginBottom: '1rem' }}>
        Auth0ライブラリのuser情報を{isUsersOpen ? "閉じる" : "開く"}
      </Button>

      <br />
      <Collapse isOpen={isIdTokenOpen}>
        <Row>
          <Col md={12}>
            <h1>IDトークン</h1>

            <Highlight>{idToken}</Highlight>
          </Col>
          <Col md={6}>
            <h2>IDトークンのデコード結果内容
            </h2>
            <Highlight>{JSON.stringify(decodedIdToken, null, 2)}</Highlight>
          </Col>

          <Col md={6}>

            <h2>キーの説明</h2>
            <Highlight>
              <Row className="">
                <Col md={12} className="fw-bold">{'{'}</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>given_name</Col>
                <Col md={8} style={{ color: '#e6db74' }}>名</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>family_name</Col>
                <Col md={8} style={{ color: '#e6db74' }}>姓</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>nickname</Col>
                <Col md={8} style={{ color: '#e6db74' }}>ニックネーム</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>name</Col>
                <Col md={8} style={{ color: '#e6db74' }}>なまえ</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>picture</Col>
                <Col md={8} style={{ color: '#e6db74' }}>写真</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>updated_at</Col>
                <Col md={8} style={{ color: '#e6db74' }}>更新日時</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>email</Col>
                <Col md={8} style={{ color: '#e6db74' }}>メールアドレス</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>email_verified</Col>
                <Col md={8} style={{ color: '#e6db74' }}>メール認証 true false</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>iss(Issuer)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンの発行元</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>aud(Audience)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>IDトークンの発行を依頼したクライアントアプリケーションのクライアントID</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>iat(Issued At)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンが発行された時間。1970年1月1日UTCからの経過秒数で示す。（UNIXタイムスタンプ）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>exp(Expiration Time)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンの期限。1970年1月1日UTCからの経過秒数で示す。（UNIXタイムスタンプ）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>sub(Subject)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>ユーザーの識別子（ID）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>sid(Session Id)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>セッションID（Webサイトなどで通信中の利用者が使用するセッションを識別するID）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>acr<span style={{ fontSize: '0.5em' }}>(Authentication Context Class Reference)</span></Col>
                <Col md={8} style={{ color: '#e6db74' }}>ユーザーの認証プロセスの文脈やセキュリティの強度を示すパラメータ
                  例：urn:authentication:multifactorは多要素認証、「urn:authentication:biometric」は生体認証</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>amr<span style={{ fontSize: '0.5em' }}>(Authentication Methods References)</span></Col>
                <Col md={8} style={{ color: '#e6db74' }}>ユーザーが認証される際に具体的にどのような認証方法が使用されたか<br />
                  例：パスワードベースの認証（pwd）、ワンタイムパスワード（otp）、多要素認証（mfa）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>nonce</Col>
                <Col md={8} style={{ color: '#e6db74' }}>ClientセッションとID Tokenを紐づける文字列値。(リプレイアタック防止のために用いられる)</Col>
              </Row>
              <Row className="">
                <Col md={12} className="fw-bold">{'}'}</Col>
              </Row>
            </Highlight>
          </Col>
        </Row>

        <Col md={12}>
          <h2>IDトークンとは？</h2>
          <Highlight>
            IDトークンとは、"認証"に使うための情報がJWT形式で詰まっているトークンです。<br />
            クライアント（ユーザーのアプリケーション）から、認証サーバー（例：OktaやGoogleなど）を通じて、ユーザーの認証情報を取得するための証明書のようなもの。<br />
            IDトークンには次の情報が紐付いています：<br />
            • 誰が認証されたのか（subクレーム）<br />
            • 認証を実施した認証サーバー（issクレーム）<br />
            • 認証を受けた対象（audクレーム）<br />
            • 認証が行われた日時（iatクレーム）<br />
            • トークンの有効期限（expクレーム）<br />
            IDトークンを用いて認証された情報をクライアントで扱う際には、トークンが有効であることを確認し、その内容に基づいて認証されたユーザーの情報を処理します。<br />
            IDトークンは、ユーザーの個人情報やセッション管理に関わる重要なデータを含むため、適切に管理することが求められます。
          </Highlight>
        </Col>
      </Collapse>

      <Button color="warning" onClick={toggleIdToken} style={{ marginBottom: '1rem' }}>
        IDトークンの情報を{isIdTokenOpen ? "閉じる" : "開く"}
      </Button>

      <br />
      <Collapse isOpen={isAccessTokenOpen}>
        <Row>
          <Col md={12}>
            <h1>アクセストークン</h1>
            <Highlight>{accessToken}</Highlight>
          </Col>

          <Col md={6}>
            <h2>アクセストークンのデコード結果</h2>
            <Highlight>{JSON.stringify(decodedAccessToken, null, 2)}</Highlight>
          </Col>
          <Col md={6}>
            <h2>キーの説明</h2>
            <Highlight>
              <Row className="">
                <Col md={12} className="fw-bold">{'{'}</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>iss(Issuer)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンの発行元</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>sub(Subject)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>ユーザーの識別子（ID）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>aud(Audience)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>JWTを使用してアクセスしようとしているリソースのURL（フル）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>iat(Issued At)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンが発行された時間。1970年1月1日UTCからの経過秒数で示す。（UNIXタイムスタンプ）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>exp(Expiration Time)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>トークンの期限。1970年1月1日UTCからの経過秒数で示す。（UNIXタイムスタンプ）</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>scope</Col>
                <Col md={8} style={{ color: '#e6db74' }}>要求するアクセス範囲</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>gty(Grant Type)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>アプリがアクセストークンを取得する方法。ユーザーのリソース（データ）への限定的なアクセス権を、認証情報を直接渡さずに別のアプリに付与する仕組み。</Col>
              </Row>
              <Row className="">
                <Col md={4} className="fw-bold" style={{ color: '#f92672' }}>azp(Authorized Party)</Col>
                <Col md={8} style={{ color: '#e6db74' }}>発行されたアクセストークンを実際に使うことが認可されているクライアントのID</Col>
              </Row>

              <Row className="">
                <Col md={12} className="fw-bold">{'}'}</Col>
              </Row>
            </Highlight>
          </Col>

          <Col md={12}>
            <h2>アクセストークンとは？</h2>
            <Highlight>
              アクセストークンとは、"認可"に使うための情報がjwt形式で詰まっているもの。<br />
              クライアント(PC)からサーバのAPIやサービス(Google Drive等のサービス)に対して、登録・変更・削除をするためのチケットのようなもの。<br />
              アクセストークンには次の情報が紐付いている<br />
              • どのリソースへ操作を行うことが許可されているか(audクレーム)<br />
              • どのような操作が許可されているか？(create?update?delete?)(scopeクレーム)<br />
              • 有効期限はいつまでか(expクレーム)<br />
              • 発行者(issクレーム)<br />
              • 発行時間(iatクレーム)<br />
              アクセストークンを用いてAPIアクセスする際は、HTTP ヘッダーに下記の指定が必要<br />
              Authorization : Bearer [アクセストークン]<br />
              アクセストークンは不正に取得されると、同じ操作対象・権限でアクセスできてしまうので、有効期限や権限スコープを適切に設定することが重要です。
            </Highlight>
          </Col>
        </Row>
      </Collapse>

      <Button color="danger" onClick={toggleAccessToken} style={{ marginBottom: '1rem' }}>
        アクセストークンの情報を{isAccessTokenOpen ? "閉じる" : "開く"}
      </Button>

      <br />
      参考ページ
      <br />
      <a href="https://dev.classmethod.jp/articles/auth0-access-token-id-token-difference/">
        <FontAwesomeIcon icon="link" className="mr-2" />
        IDトークンとアクセストークンの違い1
      </a>
      <br />

      <a href="https://tech.yyh-gl.dev/blog/id_token_and_access_token/">
        <FontAwesomeIcon icon="link" className="mr-2" />
        IDトークンとアクセストークンの違い2
      </a>
      <br />
      <a href="https://developer.okta.com/docs/guides/build-self-signed-jwt/java/main/">
        <FontAwesomeIcon icon="link" className="mr-2" />
        JWTの内容解説-Okta公式ドキュメント
      </a>

    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
