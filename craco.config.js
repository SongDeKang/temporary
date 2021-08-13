const path = require('path');
const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require('craco-antd');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const pathResolve = pathUrl => path.join(__dirname, pathUrl);

const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');

module.exports = {
	webpack: {
		// 别名配置
		alias: {
			'@': pathResolve('src'),
		},
		plugins: [
			new CircularDependencyPlugin({
				exclude: /node_modules/,
				include: /src/,
				failOnError: true,
				allowAsyncCycles: false,
				cwd: process.cwd(),
			}),
			// 查看打包的进度
			new SimpleProgressWebpackPlugin(),
			...whenProd(
				() => [
					new UglifyJsPlugin({
						uglifyOptions: {
							// 删除注释
							output: {
								comments: false,
							},
							compress: {
								drop_console: true, // 删除所有调式带有console的
								drop_debugger: true,
								pure_funcs: ['console.log'], // 删除console.log
							},
						},
					}),
				],
				[]
			),
		],
		configure: (webpackConfig, { env, paths }) => {
			paths.appBuild = 'dist';
			webpackConfig.output = {
				...webpackConfig.output,
				path: path.resolve(__dirname, 'dist'),
				// publicPath: "/",
			};
			return webpackConfig;
		},
	},
	plugins: [
		{ plugin: CracoAntDesignPlugin },
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						// modifyVars: { '@primary-color': '#1DA57A' },
						javascriptEnabled: true,
					},
				},
			},
		},
	],
};
