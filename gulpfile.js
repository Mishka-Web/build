/*
	? Автор: Richer

	! Версии для корректной работы 
	* Gulp 4 - 4.0.2v
	* Node.js - 18.12.1v
	* npm - 8.19.2v
*/

const rootDirLibs = "./node_modules";

/** Настройка библиотек JavaScript и FTP  **/
const CONFIG = {
	ftp: {
		login: "",
		pass: "",
		host: "",
		port: 21,
		localFiles: ["./dist/**/*"],
		remoteFolder: "",
	},
	JS: {
		libs: [rootDirLibs + "/jquery/dist/jquery.min.js"],
	},
};

// Подключение модулей(плагинов)
const { src, dest, parallel, series, watch } = require("gulp"),
	sass = require("gulp-sass")(require("sass")),
	pug = require("gulp-pug"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	imageMin = require("gulp-imagemin"),
	cleanCSS = require("gulp-clean-css"),
	autoPrefixer = require("gulp-autoprefixer"),
	del = require("del"),
	rename = require("gulp-rename"),
	cache = require("gulp-cache"),
	gUtil = require("gulp-util"),
	ftp = require("vinyl-ftp"),
	browser = require("browser-sync").create(); // Создание модуля 'browser-sync'

// Функция для подключения к FTP серверу
function getFtpConn() {
	return ftp.create({
		host: CONFIG.ftp.host,
		port: CONFIG.ftp.port,
		user: CONFIG.ftp.login,
		password: CONFIG.ftp.pass,
		parallel: 10,
		log: gUtil.log,
	});
}

// Отслеживание изменений в 'SASS' файлах и их преобразования в формат 'min.css'.
function styles() {
	return src(["app/scss/main.scss"])
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
		.pipe(
			autoPrefixer({
				overrideBrowserslist: ["last 3 version"],
				grid: true,
			})
		)
		.pipe(
			rename(function (e) {
				e.extname = ".min.css";
			})
		)
		.pipe(dest("app/css"))
		.pipe(browser.stream());
}

// Отслеживание изменений в структуре 'Pug(ex Jade)' файлах.
function html() {
	return src(["app/pug/*.pug", "app/pug/pages/*.pug", "!app/pug/**/_*.pug"])
		.pipe(pug({ pretty: true }))
		.pipe(dest("app/"));
}

// Отслеживание изменений в модулях(JS)
function scripts() {
	return src(...CONFIG.JS.libs)
		.pipe(concat("libs.min.js"))
		.pipe(uglify())
		.pipe(dest("app/js"))
		.pipe(browser.stream());
}

// Сжатие и кэширование изображений
function images() {
	return src("app/img/**/*").pipe(cache(imageMin())).pipe(dest("dist/img/"));
}

// Удаление всех элементов в папке dist/
function cleanDist() {
	return del("dist/");
}

// Сборка всех элементов для работы веб-приложения в папку
function build() {
	return src(
		[
			"app/js/libs.min.js",
			"app/js/common.js",
			"app/css/main.min.css",
			"app/*.html",
			"app/fonts/**/*",
		],
		{ base: "app" }
	).pipe(dest("dist/"));
}

// Инициализация и настройка параметров модуля 'browser-sync'
function browserSync() {
	browser.init({
		server: {
			baseDir: "app",
		},
		notify: false,
	});
}

// Отслеживание изменений в файлах и папках(вложенных)
function watching() {
	watch(
		["app/scss/main.scss", "app/scss/**/*.scss"],
		{ usePolling: true },
		styles
	);

	watch("app/libs/**/libs.min.js", { usePolling: true }, scripts).on(
		"change",
		browser.reload
	);

	watch(["app/pug/*.pug", "app/pug/**/*.pug"], { usePolling: true }, html);

	watch("app/*.html", { usePolling: true }).on("change", browser.reload);
}

// Деплой проекта
function deploy() {
	const conn = getFtpConn();
	return src(CONFIG.ftp.localFiles, { base: "dist/", buffer: false })
		.pipe(conn.newer(CONFIG.ftp.remoteFolder))
		.pipe(conn.dest(CONFIG.ftp.remoteFolder));
}

// Задачи gulp
exports.deploy = series(cleanDist, images, build, deploy);

exports.build = series(cleanDist, images, build);

exports.default = parallel(html, styles, scripts, browserSync, watching);
