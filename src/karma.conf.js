// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../coverage/mdb-electron"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
    },
    browserConsoleLogOptions: {
      terminal: true,
      level: "",
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
    files:[
       { pattern: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' },
       { pattern: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' },

    // {pattern:"../node_modules/jquery/dist/jquery.min.js ../node_modules/jquery/dist/jquery.min.js"},
    // {pattern:"../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"},
    // files:[  { pattern: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' },
    // files:[  { pattern: '../node_modules/jquery/dist/jquery.min.js', watched: false },
    // { pattern: './src/test.ts', watched: false }
  ]
  });
};
