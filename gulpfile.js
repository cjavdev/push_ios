var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  traceur = require('gulp-traceur'),
  concat = require('gulp-concat'),
  watch = require('gulp-watch');

var gulpTraceurCmdline = require('gulp-traceur-cmdline');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: [
    './js/app.js',
    './js/config.js',
    './js/base/BaseCtrl.js',
    './js/utils/filters.js',
    './js/utils/Contacts.js',
    './js/utils/Model.js',
    './js/utils/EventBus.js',
    './js/auth/User.js',
    './js/auth/LoginCtrl.js',
    './js/auth/AccountCtrl.js',
    './js/friends/Friend.js',
    './js/friends/FriendRequest.js',
    './js/friends/FriendsCtrl.js',
    './js/friends/FriendRequestsCtrl.js',
    './js/workouts/Workout.js',
    './js/workouts/WorkoutSet.js',
    './js/workouts/WorkoutCtrl.js',
    './js/workouts/WorkoutsCtrl.js',
  ]
};

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(traceur())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/js'));
});

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['scripts']);
});
