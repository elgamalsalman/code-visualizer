import React, { useState } from "react";
import './TabGroup.css';

import TabHead from 'components/TabHead/TabHead';

const onTabClose = () => {
	// TODO
};

const TabGroup = ({tabs}) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);

	// assert that the children are tabs
	tabs.forEach(child => {
		if (child.type.name !== "Tab") {
			console.error("TabGroup's tabs are not all Tab components");
		}
	});

	// active tab management
	const activeTabTitle = tabs[activeTabIndex].props.title;
	const getActiveTabHandler = tabIndex => {
		return () => {
			setActiveTabIndex(tabIndex);
		};
	};

	// get list of tab heads
	let i = -1;
	const tabGroupHeads = tabs.map(child => {
		i++;
		const {title, type} = child.props;
		return <TabHead
							key={title}
					  	title={title}
					  	type={type}
							isActive={title === activeTabTitle}
							onClick={getActiveTabHandler(i)}
							onClose={onTabClose}
					 />
	});

  return (
		<div>
			<div className="tab-group-header">
				{tabGroupHeads}
			</div>
			{tabs}
		</div>
  );
};

export default TabGroup;