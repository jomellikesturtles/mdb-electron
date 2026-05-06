module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'mdb',
    ignore: [
      /^\/src/, // Source files (already bundled in dist/)
      /^\/e2e/, // End-to-end tests
      /^\/node_modules/, // Forge prunes this, but explicit ignore can help
      /\.md$/, // Markdown documentation
      /tsconfig\.json/,
      /tslint\.json/
    ]
    // Add icons here later
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
