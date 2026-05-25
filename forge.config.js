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
      /^\/node_modules\/@angular/,
      /^\/node_modules\/@ngxs/,
      /^\/out/,
      /^\/plans/,
      /^\/scripts/,
      /^\/src\/(?!assets)/, // Exclude all src EXCEPT the assets folder (which contains scripts/configs/DBs)
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
      /\.map$/
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
