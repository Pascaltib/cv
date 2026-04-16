export interface Song {
  id: string // YouTube video ID
  title: string
  duration?: string
}

export interface Album {
  name: string
  year?: string
  coverUrl?: string
  songs: Song[]
}

export interface Artist {
  name: string
  photoUrl?: string
  albums: Album[]
}

export const musicLibrary: Artist[] = [
  {
    name: "Daft Punk",
    albums: [
      {
        name: "Discovery",
        year: "2001",
        songs: [
          { id: "FGBhQbmPwH8", title: "One More Time", duration: "5:20" },
          { id: "L93-7vRfxNs", title: "Aerodynamic", duration: "3:32" },
          { id: "QOngRDVtEQI", title: "Digital Love", duration: "4:58" },
          { id: "gAjR4_CbPpQ", title: "Harder, Better, Faster, Stronger", duration: "3:45" },
        ],
      },
      {
        name: "Random Access Memories",
        year: "2013",
        songs: [
          { id: "5NV6Rdv1a3I", title: "Get Lucky", duration: "6:09" },
          { id: "a5uQMwRMHcs", title: "Instant Crush", duration: "5:37" },
          { id: "NF-kLy44Hls", title: "Lose Yourself to Dance", duration: "5:53" },
        ],
      },
    ],
  },
  {
    name: "Tame Impala",
    albums: [
      {
        name: "Currents",
        year: "2015",
        songs: [
          { id: "pFptt7Cargc", title: "Let It Happen", duration: "7:47" },
          { id: "sBzrzS1Ag_g", title: "The Less I Know the Better", duration: "3:36" },
          { id: "GHe8kKO8uds", title: "Eventually", duration: "5:19" },
        ],
      },
    ],
  },
  {
    name: "Justice",
    albums: [
      {
        name: "†",
        year: "2007",
        songs: [
          { id: "sy1dYFGkPUE", title: "D.A.N.C.E.", duration: "4:02" },
          { id: "VKzWLUQizz8", title: "Genesis", duration: "3:53" },
          { id: "dXokkMPhRrY", title: "Phantom Pt. II", duration: "4:28" },
        ],
      },
    ],
  },
  {
    name: "Nox Vahn",
    albums: [
      {
        name: "Come Together",
        year: "2020",
        songs: [
          { id: "wULG18MXKz4", title: "Come Together", duration: "5:30" },
        ],
      },
    ],
  },
  {
    name: "Kavinsky",
    albums: [
      {
        name: "OutRun",
        year: "2013",
        songs: [
          { id: "MV_3Dpw-BRY", title: "Nightcall", duration: "4:17" },
        ],
      },
    ],
  },
  {
    name: "RÜFÜS DU SOL",
    albums: [
      {
        name: "Bloom",
        year: "2016",
        songs: [
          { id: "Tx9zMFodNtA", title: "Innerbloom", duration: "9:38" },
        ],
      },
    ],
  },
  {
    name: "Moderat",
    albums: [
      {
        name: "II",
        year: "2013",
        songs: [
          { id: "3NPxqXMZq7o", title: "Bad Kingdom", duration: "5:28" },
        ],
      },
    ],
  },
  {
    name: "Bonobo",
    albums: [
      {
        name: "Migration",
        year: "2017",
        songs: [
          { id: "S0Q4gqBUs7c", title: "Kerala", duration: "4:03" },
        ],
      },
    ],
  },
  {
    name: "Bicep",
    albums: [
      {
        name: "Bicep",
        year: "2017",
        songs: [
          { id: "A7ZxRs45tTg", title: "Glue", duration: "3:18" },
        ],
      },
    ],
  },
]
