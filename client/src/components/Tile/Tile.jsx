import React from "react";
import "./Tile.css";

const Tile = ({ children }) => {
	return (
		<div className="tile">
			{ children }
		</div>
	);
};

export default Tile;
