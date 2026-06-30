window["environment"] = {
  production: false,
  name: "ci",
  language: "en",
  bff: {
    uri: location.protocol === "http:" || location.protocol === "https:" ? "" : "http://localhost:8086",
    version: "v1"
  },
  bffBaseUrl: "http://localhost:8086",
  runConfig: {
    firebaseMode: false,
    electron: location.protocol === "http:" || location.protocol === "https:" ? false : true,
    useTestData: false
  }
};
