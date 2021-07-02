import koa from "koa";
import fs from "fs";
import path from "path";
import vm from "vm";
import Module from "module";
import koaStatic from "koa-static";
import logger from 'koa-logger';
import babel from 'babel-core';
const devConfig = {
	port: 3000
};

// 使用数据库替换路径获取物料
const runtimePath = __dirname + "/../dist/runtime.js";
const compPath = __dirname + "/../dist/comp.js";
const compCssPath = __dirname + "/../dist/css/comp.css";
const staticPath = "../";

// const deCachedModule = () => {
// 	Object.keys(require.cache).forEach((check) => {
// 		delete require.cache[check];
// 	});
// };

// 使用解释引擎替换现有的模板解释
const runtime = require(runtimePath).default;
const App = fs.readFileSync(compPath);
const AppCss = fs.readFileSync(compCssPath);
const { render } = runtime;
let card = { exports: {} } as any;
let code = `with(1){
		${App}
	}`;
let wrapperCode = Module.wrap(code);
const explinCode = vm.runInThisContext(wrapperCode, {
	filename: "runtime//test",
});
(() => {
	function hackRequire(path: string) {
		if (runtime.modules[path]) {
			return runtime.modules[path];
		}
		return require(path);
	}
	explinCode.call(
		card.exports,
		card.exports,
		hackRequire,
		card,
		__dirname,
		__filename
	);
})();

let caches = '';
fs.readFile('./htttt.html', (err, data) => { caches = data.toString() });
const html = render(card.exports.default, { title: "sucess" }).html;


// 使用后端API进行请求
const fetchData = () => {
	return {
		title: "sucess!",
	}; 
};


let totalHtml = caches;
const { htmlHeader, htmlBody, htmlBottom } = require(__dirname + "/template");
if (!totalHtml) {
	// 重构为模板引擎或者jsx替换html模板
	let header = htmlHeader.replace(
		`<script id="raw-data"></script>`,
		`<script>window._RAW_DATA_=${JSON.stringify(fetchData())}</script>`
	);
	let body = htmlBody.replace(
		"<div id='root'></div>",
		`<div id='root'>${html}</div><style>${AppCss.toString()}</style>`
	);
	let bottom = htmlBottom.replace(
		`<script data-script-${1} ></script>`,
		`<script data-script-${1} defer >
		exports = {};
		process = {env:{NODE_ENV:'browser'}};
require(['runtime'],e=>{
var runtime=e.default;
define('react',[],runtime.modules.react);
require(['comp'],e=>{
var comp=e.default;
var hydrate = runtime.hydrate;
hydrate(comp,_RAW_DATA_,document.getElementById('root'),()=>{});
});});	
</script>`);
	totalHtml = header + body + bottom;
	fs.writeFile('./htttt.html', totalHtml, {}, console.log);
}
// 使用工具类替换
const getQs = (qs:string):Record<string,string>=>{
	let rsQs:Record<string,string> = {};
	qs.substring(qs.indexOf('?')).split('&').map((chunk)=>{
		const a =  chunk.split('=');
		rsQs[a[0]] = a[1];
	})
	return rsQs
}

// 使用单独的服务器逻辑层
let app = new koa();
export function startApp() {
	// console.dir(process.env.TARGET);
	app.use(logger());
	app.use(koaStatic(path.join(__dirname, staticPath)));
	app.use((ctx) => {
		const q = ctx.request.querystring;
		if(q.includes('code')){
			const qs = getQs(q)
			if(qs.code){
				ctx.res.writeHead(200, { });
				console.log(decodeURIComponent(qs.code) + '----->')
				const tr = babel.transform(decodeURIComponent(qs.code).replace(`"`,'').replace(`"`,'')).ast;
				ctx.res.write(JSON.stringify(tr));
				return ctx.res.end();
			}
		}
		console.log(JSON.stringify(ctx.query));
		console.time('ssr');
		ctx.res.writeHead(200, { });
		ctx.res.write(totalHtml);
		ctx.res.end();
		console.timeEnd('ssr');
	});
	app.listen(devConfig.port);
	console.log(`ssr server run in host:http://localhost:${devConfig.port}`)
}
startApp();