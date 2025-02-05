import React from "react";

import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Hero = () => (
  <div className="text-center hero my-4">
    <h2 className="mb-4">注力技術 Okta検証環境アプリ</h2>

    <p className="lead">
      React.jsを使ったOktaCIC検証のためのサンプルSPA
      <br></br>このアプリではOktaCICのユーザー情報に含まれている値の詳細を確認、APIを試行できます。
      <br></br>
      <a href="https://manage.cic-demo-platform.auth0app.com/dashboard/pi/moccasin-roadrunner-19215"
        target="_blank" rel="noopener noreferrer" className="d-block mb-2"
        style={{ fontSize: '50px' }}
      >
        <FontAwesomeIcon icon="cog" className="mr-2" />
        Okta管理画面
      </a>

      <NavLink to="/profile" rel="noopener noreferrer" className="d-block mb-2" activeClassName="router-link-exact-active"
        style={{ fontSize: '50px' }}
      >
        <FontAwesomeIcon icon="user" className="mr-2" />
        プロフィール画面
      </NavLink>

      <NavLink to="/useapi" rel="noopener noreferrer" className="d-block mb-2" activeClassName="router-link-exact-active"
        style={{ fontSize: '50px' }}
      >
        <FontAwesomeIcon icon="globe" className="mr-2" />
        API試行画面
      </NavLink>
    </p>

  </div>
);

export default Hero;
