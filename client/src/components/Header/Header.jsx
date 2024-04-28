import React from "react";
import "./Header.css";

import RunButton from "components/RunButton/RunButton";

const Header = () => {
  return (
    <header className="header">
			<RunButton />
    </header>
  );
};

export default Header;