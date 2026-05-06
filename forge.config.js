module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'mdb',
    ignore: [
      /^\/\.angular/,
      /^\/\.git/,
      /^\/\.github/,
      /^\/\.husky/,
      /^\/\.playwright-mcp/,
      /^\/\.storybook/,
      /^\/\.vscode/,
      /^\/e2e/,
      /^\/node_modules\/@angular/, // Angular source (bundled in dist)
      /^\/node_modules\/@ngxs/,     // NGXS source (bundled in dist)
      /^\/out/,
      /^\/plans/,
      /^\/scripts/,
      /^\/src\/(?!assets\/scripts|assets\/config|assets\/db)/, // Ignore all src except critical runtime scripts and DBs
      /^\/test-results/,
      /\.lighthouserc\.json$/,
      /angular\.json$/,
      /browserslistrc$/,
      /editorconfig$/,
      /karma\.conf\.js$/,
      /package-lock\.json$/,
      /prettierrc$/,
      /tsconfig.*\.json$/,
      /tslint\.json$/,
      /\.md$/,
      /\.map$/ // Exclude source maps from production
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mdb',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
      },
    },
  ],
  plugins: [],
};
