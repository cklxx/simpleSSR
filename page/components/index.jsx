import React, { useEffect, useState } from "react";
import "./index.css";
import Foo from "./foo.jsx";
import Editor from "@monaco-editor/react";
function App(props) {
	const [cout, set] = useState(0);
	const [code, setCode] = useState(0);

	useEffect(() => {
		console.log(cout);
		() => {
			console.log(cout);
		};
	}, [cout]);
	const getTrCode = (code) => {
		const babel = require('@babel/standalone');
		const trCode = babel.transform(code, { presets: ["es2015"] }).code.toString();
		return trCode;
	}
	let timer = null;
	let first = true;
	function handleEditorChange(value, event) {
		if (first) {
			timer = setTimeout(() => { }, 1000);
			first = false;
		}
		if (timer) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				const trCode = getTrCode(value);
				setCode(trCode);
			}, 1000);
		}
	}
	console.log({ cout });
	return (
		<a
			onClick={() => {
				set(cout + 1);
				console.log(cout);
			}}
		>
			<h1 id="title">SSR DEMO@CKL</h1>
			<h2>{props.title}</h2>
			<h3>couttt:{cout}</h3>
			<h4>code:{code}</h4>
			<div
				style={{
					height: 'calc(100vh - 160px)'
				}}>
				<Editor
					height="90vh"
					defaultLanguage="javascript"
					defaultValue="// some comment"
					onChange={handleEditorChange}
				/>
			</div>
			{cout < 5 && <Foo />}
		</a>
	);
}

export default App;
