import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "src/pages/Home/Home";
import Register from "src/pages/Auth/Register";
import Login from "src/pages/Auth/Login";
import EmailVerificationSend from "src/pages/Auth/EmailVerificationSend";
import EmailVerificationVerify from "src/pages/Auth/EmailVerificationVerify";
import NotFound from "src/pages/NotFound/NotFound";
import Editor from "src/pages/Editor/Editor";

function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"}>
          <Route>
            <Route index element={<Home />} />
            <Route path={"auth"}>
              <Route path={"register"} element={<Register />} />
              <Route path={"login"} element={<Login />} />
              <Route path={"email-verification"}>
                <Route path={"send"} element={<EmailVerificationSend />} />
                <Route
                  path={"verify/:token"}
                  element={<EmailVerificationVerify />}
                />
              </Route>
            </Route>
            <Route path={"*"} element={<NotFound />} />
          </Route>
          <Route path={"/projects"}>
            <Route path={":project"} element={<Editor />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RootRouter;
