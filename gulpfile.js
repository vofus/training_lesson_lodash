var gulp = require('gulp'),
	less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync'),
	babel = require('gulp-babel'),
    rename = require("gulp-rename"),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs');

gulp.task('less', function(){ // Создаем таск "less"
    return gulp.src('src/styles/style.less') // Берем источник
        .pipe(less()) // Преобразуем Less в CSS посредством gulp-less
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist')) // Выгружаем результата в папку
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('minify-css', function() {
  return gulp.src('dist/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('babel', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(babel())
        .pipe(rename('main-es5.js'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: '' // Директория для сервера
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src('dist/scripts/**/*.js')
        .pipe(concat('all_scripts.min.js')) // Собираем их в кучу в новом файле
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('dist')); // Выгружаем в папку
});

gulp.task('watch', ['less', 'minify-css', /*'babel', 'scripts',*/ 'browser-sync'], function() {
	gulp.watch('src/styles/**/*.less', ['less']);
    gulp.watch('dist/style.css', ['minify-css']);
	gulp.watch('src/scripts/**/*.js', ['babel']);
	gulp.watch('*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('dist/scripts/**/*.js', ['scripts', browserSync.reload]); // Наблюдение за JS файлами в папке js
});