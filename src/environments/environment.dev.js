window["environment"] = {
  production: false,
  name: "dev",
  language: "en",
  bff: {
    uri: location.protocol === "http:" || location.protocol === "https:" ? "" : "http://localhost:5001",
    version: "v1"
  },
  bffBaseUrl: "http://localhost:5001",
  runConfig: {
    firebaseMode: false,
    electron: location.protocol === "http:" || location.protocol === "https:" ? false : true,
    useTestData: false
  }
};
