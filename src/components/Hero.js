import React from "react";
import {
  Row,
  Col,
} from "reactstrap";

import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Hero = () => (
  <div className="text-left hero my-4">
    <h2 className="mb-3">注力技術 Okta検証環境アプリ</h2>

    <p className="mb-5">

      <br></br>このアプリではOktaCICのユーザー情報に含まれている値の詳細を確認、APIを試行できます。
    </p>

    <Row className="d-flex justify-content-between">
      <Col md={12} className="mb-4">
        <h2 className="mb-3">
          <a href="https://manage.cic-demo-platform.auth0app.com/dashboard/pi/moccasin-roadrunner-19215"
            target="_blank" rel="noopener noreferrer" className="d-block mb-2"
          >
            <FontAwesomeIcon icon="cog" className="mr-2" />
            Okta管理画面
          </a>
        </h2>
        <p>接続されているテナントに登録されているユーザーの確認、編集等するための管理画面です。</p>
        <p>
          ※Oktaの設定を変更したい場合はパートナーアカウント作成後、テナント招待を受けてください。(下記参考資料：パートナーアカウント作成方法を確認)
        </p>
      </Col>
    </Row>

    <Row className="d-flex justify-content-between">
      <Col md={12} className="mb-4">
        <h2 className="mb-3">
          <NavLink to="/profile" rel="noopener noreferrer" className="d-block mb-2" activeClassName="router-link-exact-active">
            <FontAwesomeIcon icon="user" className="mr-2" />
            プロフィール画面
          </NavLink>
        </h2>
        <p>ログインしたユーザーのIDトークン、アクセストークンおよびその詳細を確認できます。</p>
      </Col>
    </Row>

    <Row className="d-flex justify-content-between">
      <Col md={12} className="mb-4">
        <h2 className="mb-3">

          <NavLink to="/useapi" rel="noopener noreferrer" className="d-block mb-2" activeClassName="router-link-exact-active">
            <FontAwesomeIcon icon="globe" className="mr-2" />
            API試行画面
          </NavLink>
        </h2>
        <p>接続されているテナントに対してManagementAPIを試行できます。</p>
      </Col>
    </Row>
  </div>
);

export default Hero;
