/*
    ? Author: Mihail Rachev

	! Версии для корректной работы 
    * Gulp 4 - 4.0.2v
	* Node.js - 18.12.1v
	* npm - 8.19.2v
*/

// Подключение модулей(плагинов)
const { src, dest, parallel, series, watch } = require("gulp"),
	concat = require("gulp-concat"),
	rename = require("gulp-rename"),
	csso = require("gulp-csso"),
	imagemin = require("gulp-imagemin"),
	autoprefixer = require("gulp-autoprefixer"),
	sass = require("gulp-sass")(require("sass")),
	notify = require("gulp-notify"),
	pug = require("gulp-pug"),
	uglify = require("gulp-uglify"),
	del = require("del"),
	cache = require("gulp-cache"),
	gutil = require("gulp-util"),
	ftp = require("vinyl-ftp");

// Создание модуля 'browser-sync'
const browser = require("browser-sync").create();

/** Конфигурация для FTP **/
const login = "";
const password = "";
const host = "";
const port = 21;
const localFilesGlob = ["./dist/**/*"];
const remoteFolder = "/www";

// Функция для подключения к FTP серверу
function getFtpConn() {
	return ftp.create({
		host: host,
		port: port,
		user: login,
		password: password,
		log: gutil.log,
	});
}

// Отслеживание изменений в 'SASS' файлах и их преобразования в формат 'min.css'.
function styles() {
	return src(["app/scss/**/*.scss"])
		.pipe(
			sass().on(
				"error",
				notify.onError({
					message: "<%= error.message %>",
					title: "Sass Error!",
				})
			)
		)
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(
			rename(function (e) {
				e.extname = ".min.css";
			})
		)
		.pipe(csso())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 10 version"],
				grid: true,
			})
		)
		.pipe(dest("app/css"))
		.pipe(browser.stream());
}

// Отслеживание изменений в структуре 'Pug(Jade)' файлах.
function html() {
	return src(["app/pug/*.pug", "!app/pug/**/_*.pug"])
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(dest("app/"));
}

// Отслеживание изменений в скриптах(JS)
function scripts() {
	return src(["app/libs/jquery/jquery.min.js", "app/js/common.js"])
		.pipe(concat("scripts.min.js"))
		.pipe(uglify())
		.pipe(dest("app/js"))
		.pipe(browser.reload({ stream: true }));
}

// Сжатие и кэширование изображений
function images() {
	return src("app/img/**/*").pipe(cache(imagemin())).pipe(dest("dist/img/"));
}

// Удаление всех элементов в папке dist/
function cleanDist() {
	return del("dist");
}

// Инициализация и настройка параметров модуля 'browserSync'
function browserSync() {
	browser.init({
		server: {
			baseDir: "app",
		},
		notify: false,
	});
}

// Сборка всех элементов для работы приложения в папку
function build() {
	return src(
		[
			"app/js/scripts.min.js",
			"app/css/main.min.css",
			"app/*.html",
			"app/fonts/**/*",
		],
		{ base: "app" }
	).pipe(dest("dist/"));
}

// Деплой проекта
function deploy() {
	const conn = getFtpConn();

	return src(localFilesGlob, { base: "dist/", buffer: false })
		.pipe(conn.newer(remoteFolder))
		.pipe(conn.dest(remoteFolder));
}

// Отслеживание изменений в файлах и папках(вложенных)
function watching() {
	watch(
		[
			"app/scss/*.scss",
			"app/scss/base/**/*.scss",
			"app/scss/components/**/*.scss",
			"app/scss/layout/**/*.scss",
			"app/scss/utils/**/*.scss",
			"app/scss/**/*.scss",
		],
		styles
	);

	watch(["app/libs/**/*.js", "app/js/common.js"], scripts).on(
		"change",
		browser.reload
	);

	watch(
		[
			"app/pug/*.pug",
			"app/pug/components/**/*.pug",
			"app/pug/layout/**/*.pug",
			"app/pug/sample/**/*.pug",
			"app/pug/utils/**/*.pug",
			"app/pug/**/*.pug",
		],
		html
	);

	watch("app/*.html").on("change", browser.reload);

	watch("app/**/*", series(cleanDist, build));
}

// Задачи gulp
exports.deploy = series(build, deploy);

exports.build = series(cleanDist, images, build);

exports.default = parallel(html, styles, scripts, browserSync, watching);

exports.cleanDist = cleanDist;

exports.clearCache = () => {
	return cache.clearAll();
};
