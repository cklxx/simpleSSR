import React, { useEffect,useState,useRef } from "react";
let ref = { current:0 };
export default function foo() {
	useEffect(() => {
		return () => {
			console.log('推出',ref.current);
		};
	}, []);
	return (
		<a
			onClick={(e) => {
                ref.current = ref.current + 1;
			}}
            style={{ width: '100%' }}
		>
			<h1 id="title">大是大非组件:{ref.current}</h1>
		</a>
	);
}
