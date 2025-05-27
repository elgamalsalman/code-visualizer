import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import GeneralPageLayout from "src/containers/GeneralPageLayout/GeneralPageLayout";
import Home from "src/pages/Home/Home";
import Register from "src/pages/Auth/Register";
import Login from "src/pages/Auth/Login";
import EmailVerificationSend from "src/pages/Auth/EmailVerificationSend";
import EmailVerificationVerify from "src/pages/Auth/EmailVerificationVerify";
import PasswordResetSend from "src/pages/Auth/PasswordResetSend";
import PasswordResetReset from "src/pages/Auth/PasswordResetReset";
import NotFound from "src/pages/NotFound/NotFound";
import Editor from "src/pages/Editor/Editor";
import { AnonymousRoute, AuthRoute, GeneralRoute } from "./AuthRoutes";

function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GeneralPageLayout />}>
          {/* Authenticated Routes */}
          <Route element={<AuthRoute />}>
            <Route path={"/projects"}>
              <Route path={":project"} element={<Editor />} exact />
            </Route>
          </Route>

          {/* UnAuthenticated Routes */}
          <Route element={<AnonymousRoute />}>
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
              <Route path={"password-reset"}>
                <Route path={"send"} element={<PasswordResetSend />} />
                <Route path={"reset/:token"} element={<PasswordResetReset />} />
              </Route>
            </Route>
          </Route>

          {/* General Routes */}
          <Route element={<GeneralRoute />}>
            <Route index element={<Home />} />
            <Route path={"*"} element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RootRouter;
