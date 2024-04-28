import React from "react";
import "./TabHead.css";

import { XMarkIcon, CodeBracketIcon, CommandLineIcon, ShareIcon } from "@heroicons/react/24/outline";

const get_type_icon = (type) => {
	const icon_classes = "tab-head-icon";
	if (type === "code") {
		return <CodeBracketIcon className={icon_classes} />;
	} else if (type === "console") {
		return <CommandLineIcon className={icon_classes} />;
	} else if (type === "grapher") {
		return <ShareIcon className={icon_classes} />;
	} else {
		return null;
	}
};

const TabHead = ({title, type, isActive, onClick, onClose}) => {
	const icon = get_type_icon(type);

  return (
		<div className={`tab-head ${type} ${isActive ? "active-tab-head" : ""}`}>
			<div onClick={onClick} className="tab-head-title-and-icon">
				{icon}
				<span className="tab-head-title">{title}</span>
			</div>
			<button onClick={onClose} className="tab-head-close-button">
				<XMarkIcon className="tab-head-icon" />
			</button>
		</div>
  );
};

export default TabHead;