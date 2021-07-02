import webpack from "webpack";
import { getConfig } from "./complieUtils/complieConfig";
const entryPaths = [{ comp:"./page/components/index.jsx"}, {runtime: "./page/runtime/index.js"}];
const complieConfig = [...getConfig(entryPaths)] as webpack.Configuration;

const watchOptions = { aggregateTimeout:300, poll:true  }
const compilerHandler = async (err:Error, stats: any) => {
	if (err || stats.hasErrors()) {
		const errorString = stats && stats.toString();
		console.error(errorString);
	}
	console.info(
		stats && stats.toString({
			chunks: true, // 使构建过程更静默无输出
			colors: true, // 在控制台展示颜色
			providedExports: true, // export
		})
	);
}
const compiler = webpack(complieConfig, compilerHandler as any);
compiler.watch(watchOptions, compilerHandler as any);




