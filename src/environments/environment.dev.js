window["environment"] = {
  production: false,
  name: "dev",
  language: "en",
  bff: {
    uri: "http://localhost:8086",
    version: "v1"
  },
  bffBaseUrl: "",
  runConfig: {
    firebaseMode: false,
    electron: location.protocol === "http:" || location.protocol === "https:" ? false : true,
    useTestData: false
  }
};
