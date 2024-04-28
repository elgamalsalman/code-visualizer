import React from "react";
import "./App.css";

import Editor from '@monaco-editor/react';

import Header from 'components/Header/Header';
import Tile from 'components/Tile/Tile';
import TabGroup from 'components/TabGroup/TabGroup';
import Tab from 'components/TabGroup/Tab';
import Console from 'components/Console/Console';
import Grapher from 'components/Grapher/Grapher';

const App = () => {
  return (
		<div className="app">
			<Header />
			<Tile className="editor-tile">
				<TabGroup
					tabs={[(
						<Tab key="main.cpp" title="main.cpp">
							<Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />
						</Tab>
					)]}
				/>
			</Tile>
			<Tile className="output-tile">
				<TabGroup
					tabs={[(
						<Tab key="Console" title="Console">
							<Console />
						</Tab>
					),(
						<Tab key="Grapher" title="Grapher">
							<Grapher />
						</Tab>
					)]}
				/>
			</Tile>
		</div>
  );
};

export default App;