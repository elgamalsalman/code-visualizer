import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "src/pages/Home/Home";
import Register from "src/pages/Register/Register";
import Login from "src/pages/Login/Login";
import NotFound from "src/pages/NotFound/NotFound";
import Editor from "src/pages/Editor/Editor";

function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"}>
          <Route>
            <Route index element={<Home />} />
            <Route path={"register"} element={<Register />} />
            <Route path={"login"} element={<Login />} />
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
