import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <h1 className="mb-4">Okta CIC検証アプリ</h1>

    <p className="lead">
      <a href="https://reactjs.org">React.js</a>を使ったOkta CIC検証のためのサンプルSPA

      <a href="https://manage.cic-demo-platform.auth0app.com/dashboard/pi/moccasin-roadrunner-19215"
        target="_blank" rel="noopener noreferrer">Okta管理画面へのリンク</a>
    </p>

  </div>
);

export default Hero;
