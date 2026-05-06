enum source {
  TMDB = "TMDB", IMDB = "IMDB", MDB = "MDB", OMDB = "OMDB", Local = "local"
}

export const environment = {
  production: true,
  bff: {
    url: '/mdb',
    version: 'v1'
  },
  bffBaseUrl: 'http://localhost:8080',
  runConfig: {
    firebaseMode: false,
    electron: typeof window !== 'undefined' && (window as any).process && (window as any).process.type === 'renderer' || (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1),
    useTestData: false,
  },
  tmdb: {
    url: 'https://api.themoviedb.org/3',
    apiKey: 'a636ce7bd0c125045f4170644b4d3d25'
  },
  yts: {
    url: 'https://yts.mx/api/v2/list_movies.json',
    urlV2: 'https://yts.am/api/v2/list_movies.json'
  },
  torrent: {
    trackers: [`udp://glotorrents.pw:6969/announce`,
      `udp://tracker.opentrackr.org:1337/announce`,
      `udp://torrent.gresille.org:80/announce`,
      `udp://tracker.openbittorrent.com:80`,
      `udp://tracker.coppersurfer.tk:6969`,
      `udp://tracker.leechers-paradise.org:6969`,
      `udp://p4p.arenabg.ch:1337`,
      `udp://tracker.internetwarriors.net:1337`]
  },
  youtube: {
    apiKey: 'AIzaSyAC1kcZu_DoO7mbrMxMuCpO57iaDByGKV0'
  },
  language: 'en',
  location: 'ph',
  dataSource: source.TMDB,
  refreshTokenAllowance: 120,
  publicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBGmHNlgBEADS/47eUHQKq9+ekFv9+xIJQy99k88/PXe8iObLrywZCFViyOSk
20nlTxZAQM6wv5Hzt1qTkgRHtR7wKcn9b3NeVgqcXWjPFS4nC2emWD/vzYR3eFnn
shIv3HCzSLd/4E10b2qfBAAItyjKQbtuxdFii1xhBpWhCKbeYnU4msaFAWmcIrc4
9WEQ/Hz32ENcugfaXoqDAw1PRD3oAzKDbIhxFUprSDMpTckNlopm6qzTYZxLwxb4
lItz1htVBKiQREQQ5TiZj6QWO/Ps6DKln+gMkDyUNRjodiayCkSit2GePc6HfiSB
LL8C85nRAL7f3uPtRwQ0rX7khIzERQUG0iXw2ZNUWFtsjZzNTHzTKFUacT6Tcjt5
DTKmg65i8IN836CrTQwL32g9Npf3LXULZQojidYQ6MI4p012WY16Ws6XGhe55XCc
BoXO3FTHiCkwct4RY1JafvAUqUmgoqw8XCQmeGaOepEPVlko0qTl3CDwQXggLFXh
90CJdC3FGHBGQcs3BmERn2KBNWvF/KAMp49sKHUhGxXZS60vTez3uD3kGfxcR2Ja
BlgOXXG2yvtfa2kCNgDikcE1R7SNpD1xOn1HtjxFMwzDnjA3MQrgDWdRXaNRhCii
bQQIO7eDF5Ox8Gi8OPW3IhNT949KaoH3K7pKBu61wPP8M2WRDmyJVV8BqQARAQAB
tCVNREItUHJvamVjdCA8am9tbWVsLnMuMjAyMEBnbWFpbC5jb20+iQJUBBMBCAA+
FiEE/9JKe9+Jt+ne5tp67Lzg5qxzpgQFAmmHNlgCGwMFCQeGHwAFCwkIBwIGFQoJ
CAsCBBYCAwECHgECF4AACgkQ7Lzg5qxzpgT2ZRAAmOVmkjpfEXAmwSYzWowI6kEU
sbMRpCHdTmn1EhUP1kMv/ThUuMb6+ZgCgOPSRcVhCotxtD2Y7Z1HZMhpKmCkrK0Y
ZpP+Myp1cwcFOJgMjgOWGstZ2IL297GoSf3pwIbQ6cOr64qVhtJosKIS4mW5pknY
/xm9btWbrI8GH2IiA0SoffpNPYwl6gL1Snz3M15oy5q3eyH2qqtuZH1QiyTOOJEp
0wRdwg0DMeTfB3XMT4gaMOgn2dKVBrqMpzkelpdtOCxwU2JnnCxI5R7cAVUdcTe1
Yusb8YmayyXF3kv+2CYeWcCNnVb+EagnTNq7/ss4cuNMp6Uy/SeyBLXP3sx0ej66
j8zvlmiqX9IC40SGfgjd1JYqaOJc9ozjwRVqpxX2TWNzUAH/+1ILYytUu7NeoHAi
n/5Sq2ZXRvknWnlFU7CwFAxF2bIVwmq9Gz8Qvv5s2GwDfd320eUfrBnyl3eaUIIB
AWrhV9R84X+0A/8UKbUYU9+o6VkbV/IgAW/8dsYRa6BzmBl8zNMolqjtHB98BHiM
dCahYGDQHzvZawrXqW0Y4Tkq1KgK4ih97Pz8J4bNl1COy/K0Lc6E22xeemAJ2qRl
yHB5L/QZx4McVmt8ry+o4mme6n/IqsvyOx3ZAk3hRot0akCV06eAvZfA80N7kV6t
TH/iVrMArwyLIgb96Ru5Ag0EaYc2WAEQAKV4FxoOtMmYNkzVTud9fC+3nJ0tJjdq
13OTf5pCr/r91K7F4JGzNA1cNIWVmTOKqt90uovepbLwv0fd0ZSkY2dafUpo0d6o
vLUjosQtyu/QuHSQIy//mbQDdVBnePn4ZpmNaL9XfPMabC3RYD7Ef9l6niQHr/tl
Pp4eGGcL1yz7GpIh5o9uD0teTw6ePRfSln9S7iWuT8ZSObxjV5+R3Zup+z0r5g4i
9ZdmbrveL6EaaU3tkSUmk8OjrUo/iNbCBhhSsUyFrmReLv1AxynkfW2Q8UhsxbGI
xELASwwDQR/9+CVvAYxJG7WUvm3zma2aziBXyVjfQAyUnnfBLOuOk+af7mKktMxc
ni5ibn57QP1UXWUI9F+rfHOb0ttOjZAXfJvKxZSFN3fUW47RdKGEPd6GwriAD0fE
BHRD3LIMYXQvx8kqgyP2v41Iit2AJ+yVfm9iSLKU/cwrtRTdXL3WE23tUcW8JEsj
Zsc+GBT6nF6oRepHuCTNWLtybamo7vRY86SiyRLQ7CDmo2liLeKb8fdVMtgP97qG
iCgYH1JwsyRoeFBQj4uTm/t3dtdV9iu3kWLtnm3fZNUVRTjKOKybn1Tyg/iPQ+8C
9t7xQTpo9i1eb2qVEit1swMutfwTvXiV/Ulm6mv7QzM0VqT7BHzifILu2C1xS2s2
tcu1pRwA/fDvABEBAAGJAjwEGAEIACYWIQT/0kp734m36d7m2nrsvODmrHOmBAUC
aYc2WAIbDAUJB4YfAAAKCRDsvODmrHOmBATNEACeb1kE+bBnstnJzr1df2NZHXsd
9HwyNw3HlyeV0YZSZMHZ32RXRp/3q3ESPmyoZDi54ez17McxOqsh6r7J3dx0bYja
dVrK7FHJJWN16nBwa+UpGP4Ikz68tokoPpGeAwP9Asuv4nFAPUdolFuqaKCfubpa
mudSG5r1QGslL9ntuNsU7Am+oyG8USou7nPX0Brmt1fm873QP/eOgCn9G5WKDJXY
FOsGVpw7LuSuWdjuJ0be+d1g+UViE6wbTS6544PMQjdGeCwwTCtRFt8DWuVZCInh
lcq5CqLE7Ku+omwdTJDxQKDCUVRCojo5lXdi9Qd2W7WSZWBoYYKStee7+gEKVZJM
qFs7D9RFJo3IWZlK4dimAv/HBopkAL15/iKuARbIaFlqwQdzGqYj4gsPdUawMA6T
H1tEip/+kIBdlApP8c5dB2/H5u9FH9qZ5D19A2HSJdAOOBJ/g7x8xjIBGhNYLBOb
FtzKo6TeQrut5RrWr0bmSeQtYjsInCEEA4gIAjAb4hBgBCCTjKh3THfFoGdDG6cU
bKX2DN7RDNEcbMTymf08TyH5t2rVUOxvZ3OhYiNq68lRhN8DRl4k6kwBd9TRmLsI
6WAIsIDIqTt325tCaMkeKpxlAsX3SPh2ZHRwAkyOg/1cqtda9rzWkxm5jLupSBbO
Pz+9owAuQbHR7b4zbw===WowO
-----END PGP PUBLIC KEY BLOCK-----`
};
