const baseData = [
  // Fleisch
  {name:"Schweinefleisch (mager)",category:"Fleisch",purin:150,protein:22.8,kcal:121,carbs:0.0,fiber:0.0,fat:3.5},
  {name:"Schweinefleisch (fett)",category:"Fleisch",purin:120,protein:15.1,kcal:290,carbs:0.0,fiber:0.0,fat:24.0},
  {name:"Schweinebauch",category:"Fleisch",purin:100,protein:14.6,kcal:395,carbs:0.0,fiber:0.0,fat:34.5},
  {name:"Schweinekotelett",category:"Fleisch",purin:145,protein:21.5,kcal:175,carbs:0.0,fiber:0.0,fat:8.0},
  {name:"Schweinefilet",category:"Fleisch",purin:158,protein:22.3,kcal:109,carbs:0.0,fiber:0.0,fat:2.4},
  {name:"Schweineschulter",category:"Fleisch",purin:135,protein:20.2,kcal:200,carbs:0.0,fiber:0.0,fat:10.5},
  {name:"Schweinshaxe",category:"Fleisch",purin:140,protein:19.8,kcal:230,carbs:0.0,fiber:0.0,fat:14.0},
  {name:"Rindfleisch (mager)",category:"Fleisch",purin:133,protein:21.9,kcal:125,carbs:0.0,fiber:0.0,fat:4.2},
  {name:"Rindfleisch (fett)",category:"Fleisch",purin:110,protein:17.4,kcal:268,carbs:0.0,fiber:0.0,fat:20.0},
  {name:"Rinderhack",category:"Fleisch",purin:120,protein:17.9,kcal:220,carbs:0.0,fiber:0.0,fat:15.0},
  {name:"Rindersteak",category:"Fleisch",purin:145,protein:21.5,kcal:158,carbs:0.0,fiber:0.0,fat:7.0},
  {name:"Rinderfilet",category:"Fleisch",purin:150,protein:22.1,kcal:130,carbs:0.0,fiber:0.0,fat:4.0},
  {name:"Rindergulasch",category:"Fleisch",purin:128,protein:20.5,kcal:165,carbs:0.0,fiber:0.0,fat:7.5},
  {name:"Kalbfleisch (mager)",category:"Fleisch",purin:140,protein:21.3,kcal:108,carbs:0.0,fiber:0.0,fat:2.7},
  {name:"Kalbsschnitzel",category:"Fleisch",purin:150,protein:21.8,kcal:115,carbs:0.0,fiber:0.0,fat:3.2},
  {name:"Kalbsfilet",category:"Fleisch",purin:160,protein:22.5,kcal:110,carbs:0.0,fiber:0.0,fat:2.5},
  {name:"Lammfleisch",category:"Fleisch",purin:182,protein:20.8,kcal:206,carbs:0.0,fiber:0.0,fat:13.0},
  {name:"Lammkeule",category:"Fleisch",purin:175,protein:21.2,kcal:185,carbs:0.0,fiber:0.0,fat:10.5},
  {name:"Lammkotelett",category:"Fleisch",purin:180,protein:19.9,kcal:230,carbs:0.0,fiber:0.0,fat:15.5},
  {name:"Hühnerbrust",category:"Fleisch",purin:175,protein:23.1,kcal:108,carbs:0.0,fiber:0.0,fat:1.9},
  {name:"Hähnchenschenkel",category:"Fleisch",purin:110,protein:18.5,kcal:182,carbs:0.0,fiber:0.0,fat:10.5},
  {name:"Hühnerflügel",category:"Fleisch",purin:137,protein:18.3,kcal:220,carbs:0.0,fiber:0.0,fat:13.5},
  {name:"Hühnerhals",category:"Fleisch",purin:120,protein:16.4,kcal:245,carbs:0.0,fiber:0.0,fat:17.0},
  {name:"Putenbrust",category:"Fleisch",purin:150,protein:24.1,kcal:107,carbs:0.0,fiber:0.0,fat:1.5},
  {name:"Putenkeule",category:"Fleisch",purin:140,protein:20.7,kcal:160,carbs:0.0,fiber:0.0,fat:7.5},
  {name:"Entenfleisch",category:"Fleisch",purin:138,protein:19.1,kcal:247,carbs:0.0,fiber:0.0,fat:17.2},
  {name:"Entenbrust",category:"Fleisch",purin:145,protein:19.7,kcal:220,carbs:0.0,fiber:0.0,fat:14.0},
  {name:"Gänsefleisch",category:"Fleisch",purin:165,protein:22.8,kcal:337,carbs:0.0,fiber:0.0,fat:26.0},
  {name:"Gänsebrust",category:"Fleisch",purin:170,protein:23.0,kcal:310,carbs:0.0,fiber:0.0,fat:23.0},
  {name:"Kaninchenfleisch",category:"Fleisch",purin:132,protein:21.0,kcal:136,carbs:0.0,fiber:0.0,fat:5.0},
  {name:"Wildschwein",category:"Fleisch",purin:166,protein:21.5,kcal:114,carbs:0.0,fiber:0.0,fat:3.3},
  {name:"Hirschfleisch",category:"Fleisch",purin:138,protein:22.5,kcal:120,carbs:0.0,fiber:0.0,fat:2.9},
  {name:"Rehfleisch",category:"Fleisch",purin:162,protein:22.0,kcal:116,carbs:0.0,fiber:0.0,fat:3.2},
  {name:"Hasenfleisch",category:"Fleisch",purin:151,protein:22.8,kcal:124,carbs:0.0,fiber:0.0,fat:3.5},
  {name:"Fasanenfleisch",category:"Fleisch",purin:175,protein:24.3,kcal:144,carbs:0.0,fiber:0.0,fat:5.2},
  {name:"Taubenfleisch",category:"Fleisch",purin:180,protein:22.1,kcal:142,carbs:0.0,fiber:0.0,fat:6.0},
  {name:"Straußenfleisch",category:"Fleisch",purin:145,protein:22.2,kcal:105,carbs:0.0,fiber:0.0,fat:1.8},
  {name:"Pferdefleisch",category:"Fleisch",purin:200,protein:21.8,kcal:133,carbs:0.5,fiber:0.0,fat:4.6},
  // Innereien
  {name:"Rinderleber",category:"Innereien",purin:554,protein:20.4,kcal:135,carbs:3.8,fiber:0.0,fat:4.7},
  {name:"Schweineleber",category:"Innereien",purin:515,protein:21.4,kcal:140,carbs:2.6,fiber:0.0,fat:5.2},
  {name:"Kalbsleber",category:"Innereien",purin:460,protein:19.8,kcal:136,carbs:3.0,fiber:0.0,fat:5.0},
  {name:"Hühnerleber",category:"Innereien",purin:312,protein:18.5,kcal:135,carbs:1.5,fiber:0.0,fat:6.5},
  {name:"Entenleber",category:"Innereien",purin:398,protein:18.9,kcal:145,carbs:2.0,fiber:0.0,fat:6.8},
  {name:"Niere (Rind)",category:"Innereien",purin:269,protein:16.8,kcal:100,carbs:0.9,fiber:0.0,fat:3.1},
  {name:"Niere (Schwein)",category:"Innereien",purin:334,protein:17.1,kcal:103,carbs:0.8,fiber:0.0,fat:3.5},
  {name:"Niere (Kalb)",category:"Innereien",purin:290,protein:17.4,kcal:100,carbs:0.9,fiber:0.0,fat:3.0},
  {name:"Herz (Rind)",category:"Innereien",purin:256,protein:17.1,kcal:112,carbs:0.5,fiber:0.0,fat:4.8},
  {name:"Herz (Schwein)",category:"Innereien",purin:265,protein:17.5,kcal:118,carbs:0.5,fiber:0.0,fat:5.2},
  {name:"Herz (Kalb)",category:"Innereien",purin:241,protein:17.0,kcal:108,carbs:0.4,fiber:0.0,fat:4.5},
  {name:"Zunge (Rind)",category:"Innereien",purin:160,protein:16.0,kcal:244,carbs:0.0,fiber:0.0,fat:18.0},
  {name:"Zunge (Schwein)",category:"Innereien",purin:136,protein:15.7,kcal:218,carbs:0.0,fiber:0.0,fat:16.0},
  {name:"Hirn (Rind)",category:"Innereien",purin:195,protein:10.5,kcal:125,carbs:0.8,fiber:0.0,fat:9.5},
  {name:"Hirn (Kalb)",category:"Innereien",purin:183,protein:10.2,kcal:120,carbs:0.8,fiber:0.0,fat:9.0},
  {name:"Milz",category:"Innereien",purin:444,protein:18.0,kcal:105,carbs:0.0,fiber:0.0,fat:3.5},
  {name:"Pansen",category:"Innereien",purin:175,protein:14.8,kcal:87,carbs:0.0,fiber:0.0,fat:3.5},
  {name:"Kaldaunen",category:"Innereien",purin:168,protein:14.5,kcal:85,carbs:0.0,fiber:0.0,fat:3.2},
  {name:"Thymus (Kalb)",category:"Innereien",purin:825,protein:15.8,kcal:150,carbs:0.0,fiber:0.0,fat:9.0},
  {name:"Lunge (Rind)",category:"Innereien",purin:399,protein:16.3,kcal:92,carbs:0.0,fiber:0.0,fat:2.5},
  // Fisch & Meeresfrüchte
  {name:"Thunfisch (frisch)",category:"Fisch",purin:257,protein:23.3,kcal:103,carbs:0.0,fiber:0.0,fat:0.5},
  {name:"Thunfisch (Dose)",category:"Fisch",purin:116,protein:25.5,kcal:116,carbs:0.0,fiber:0.0,fat:1.0},
  {name:"Sardinen (in Öl)",category:"Fisch",purin:345,protein:19.8,kcal:208,carbs:0.0,fiber:0.0,fat:14.5},
  {name:"Sardinen (frisch)",category:"Fisch",purin:480,protein:20.6,kcal:165,carbs:0.0,fiber:0.0,fat:9.6},
  {name:"Hering (frisch)",category:"Fisch",purin:210,protein:18.0,kcal:213,carbs:0.0,fiber:0.0,fat:15.1},
  {name:"Hering (geräuchert)",category:"Fisch",purin:219,protein:21.5,kcal:234,carbs:0.0,fiber:0.0,fat:15.5},
  {name:"Bismarckhering",category:"Fisch",purin:200,protein:14.0,kcal:150,carbs:4.0,fiber:0.0,fat:8.5},
  {name:"Matjes",category:"Fisch",purin:239,protein:13.5,kcal:259,carbs:0.0,fiber:0.0,fat:22.0},
  {name:"Lachs (frisch)",category:"Fisch",purin:170,protein:20.0,kcal:202,carbs:0.0,fiber:0.0,fat:13.0},
  {name:"Lachs (geräuchert)",category:"Fisch",purin:174,protein:23.5,kcal:179,carbs:0.0,fiber:0.0,fat:9.5},
  {name:"Lachsforelle",category:"Fisch",purin:168,protein:19.5,kcal:185,carbs:0.0,fiber:0.0,fat:11.5},
  {name:"Forelle",category:"Fisch",purin:297,protein:19.5,kcal:119,carbs:0.0,fiber:0.0,fat:4.3},
  {name:"Regenbogenforelle",category:"Fisch",purin:280,protein:20.0,kcal:128,carbs:0.0,fiber:0.0,fat:5.0},
  {name:"Kabeljau",category:"Fisch",purin:109,protein:17.9,kcal:82,carbs:0.0,fiber:0.0,fat:0.7},
  {name:"Dorsch",category:"Fisch",purin:105,protein:17.5,kcal:80,carbs:0.0,fiber:0.0,fat:0.6},
  {name:"Seelachs",category:"Fisch",purin:139,protein:17.1,kcal:90,carbs:0.0,fiber:0.0,fat:1.5},
  {name:"Scholle",category:"Fisch",purin:131,protein:17.5,kcal:91,carbs:0.0,fiber:0.0,fat:1.9},
  {name:"Makrele (frisch)",category:"Fisch",purin:194,protein:18.7,kcal:237,carbs:0.0,fiber:0.0,fat:17.0},
  {name:"Makrele (geräuchert)",category:"Fisch",purin:207,protein:22.8,kcal:305,carbs:0.0,fiber:0.0,fat:22.0},
  {name:"Karpfen",category:"Fisch",purin:160,protein:18.0,kcal:119,carbs:0.0,fiber:0.0,fat:5.0},
  {name:"Seezunge",category:"Fisch",purin:131,protein:17.9,kcal:85,carbs:0.0,fiber:0.0,fat:1.2},
  {name:"Rotbarsch",category:"Fisch",purin:130,protein:19.0,kcal:97,carbs:0.0,fiber:0.0,fat:2.5},
  {name:"Zander",category:"Fisch",purin:140,protein:19.5,kcal:84,carbs:0.0,fiber:0.0,fat:0.8},
  {name:"Hecht",category:"Fisch",purin:135,protein:18.9,kcal:88,carbs:0.0,fiber:0.0,fat:1.2},
  {name:"Barsch",category:"Fisch",purin:130,protein:18.5,kcal:82,carbs:0.0,fiber:0.0,fat:0.8},
  {name:"Aal",category:"Fisch",purin:92,protein:13.6,kcal:278,carbs:0.0,fiber:0.0,fat:23.0},
  {name:"Aal (geräuchert)",category:"Fisch",purin:99,protein:18.9,kcal:330,carbs:0.0,fiber:0.0,fat:27.0},
  {name:"Wels",category:"Fisch",purin:140,protein:17.7,kcal:108,carbs:0.0,fiber:0.0,fat:3.8},
  {name:"Schwertfisch",category:"Fisch",purin:164,protein:20.3,kcal:121,carbs:0.0,fiber:0.0,fat:5.0},
  {name:"Heilbutt",category:"Fisch",purin:133,protein:20.9,kcal:110,carbs:0.0,fiber:0.0,fat:3.0},
  {name:"Seehecht",category:"Fisch",purin:119,protein:17.0,kcal:80,carbs:0.0,fiber:0.0,fat:1.0},
  {name:"Anchovis",category:"Fisch",purin:321,protein:20.4,kcal:131,carbs:0.0,fiber:0.0,fat:4.8},
  {name:"Sprotten",category:"Fisch",purin:300,protein:19.0,kcal:193,carbs:0.0,fiber:0.0,fat:12.5},
  {name:"Bückling",category:"Fisch",purin:219,protein:23.9,kcal:265,carbs:0.0,fiber:0.0,fat:17.5},
  {name:"Rollmops",category:"Fisch",purin:193,protein:13.0,kcal:145,carbs:4.5,fiber:0.0,fat:8.5},
  {name:"Garnelen",category:"Fisch",purin:147,protein:17.6,kcal:89,carbs:0.0,fiber:0.0,fat:1.5},
  {name:"Nordseekrabben",category:"Fisch",purin:152,protein:19.1,kcal:94,carbs:0.0,fiber:0.0,fat:1.5},
  {name:"Krabben",category:"Fisch",purin:108,protein:15.5,kcal:84,carbs:0.5,fiber:0.0,fat:1.8},
  {name:"Hummer",category:"Fisch",purin:118,protein:16.5,kcal:90,carbs:0.5,fiber:0.0,fat:1.9},
  {name:"Languste",category:"Fisch",purin:118,protein:16.8,kcal:91,carbs:0.5,fiber:0.0,fat:2.0},
  {name:"Muscheln",category:"Fisch",purin:112,protein:11.5,kcal:86,carbs:3.7,fiber:0.0,fat:2.0},
  {name:"Miesmuscheln",category:"Fisch",purin:154,protein:11.9,kcal:86,carbs:3.7,fiber:0.0,fat:2.2},
  {name:"Austern",category:"Fisch",purin:90,protein:9.0,kcal:70,carbs:4.0,fiber:0.0,fat:1.5},
  {name:"Jakobsmuscheln",category:"Fisch",purin:136,protein:15.3,kcal:88,carbs:3.2,fiber:0.0,fat:0.8},
  {name:"Tintenfisch",category:"Fisch",purin:97,protein:16.4,kcal:92,carbs:1.5,fiber:0.0,fat:1.7},
  {name:"Oktopus",category:"Fisch",purin:89,protein:14.9,kcal:82,carbs:2.0,fiber:0.0,fat:1.0},
  {name:"Kaviar",category:"Fisch",purin:144,protein:24.6,kcal:264,carbs:4.0,fiber:0.0,fat:17.9},
  {name:"Fischrogen (allgemein)",category:"Fisch",purin:150,protein:22.0,kcal:220,carbs:3.0,fiber:0.0,fat:14.0},
  {name:"Stockfisch (getrocknet)",category:"Fisch",purin:193,protein:80.0,kcal:355,carbs:0.0,fiber:0.0,fat:2.5},
  {name:"Scholle (paniert)",category:"Fisch",purin:110,protein:14.5,kcal:180,carbs:10.0,fiber:0.3,fat:7.5},
  // Wurst & Aufschnitt
  {name:"Salami",category:"Wurst",purin:130,protein:22.5,kcal:425,carbs:0.8,fiber:0.0,fat:36.0},
  {name:"Salami (Mailänder)",category:"Wurst",purin:133,protein:22.9,kcal:430,carbs:0.8,fiber:0.0,fat:36.5},
  {name:"Leberwurst",category:"Wurst",purin:165,protein:14.8,kcal:330,carbs:2.5,fiber:0.0,fat:28.0},
  {name:"Grobe Leberwurst",category:"Wurst",purin:170,protein:15.2,kcal:340,carbs:2.0,fiber:0.0,fat:29.0},
  {name:"Schinken (gegart)",category:"Wurst",purin:131,protein:20.5,kcal:120,carbs:0.5,fiber:0.0,fat:4.2},
  {name:"Schinken (roh, Schwarzwälder)",category:"Wurst",purin:142,protein:23.8,kcal:180,carbs:0.0,fiber:0.0,fat:8.5},
  {name:"Parmaschinken",category:"Wurst",purin:138,protein:25.9,kcal:268,carbs:0.0,fiber:0.0,fat:17.0},
  {name:"Serranoschinken",category:"Wurst",purin:134,protein:28.4,kcal:235,carbs:0.0,fiber:0.0,fat:13.0},
  {name:"Fleischwurst",category:"Wurst",purin:95,protein:12.5,kcal:285,carbs:2.5,fiber:0.0,fat:24.5},
  {name:"Bierwurst",category:"Wurst",purin:90,protein:12.0,kcal:270,carbs:2.0,fiber:0.0,fat:23.0},
  {name:"Frankfurter",category:"Wurst",purin:88,protein:11.8,kcal:280,carbs:1.5,fiber:0.0,fat:24.5},
  {name:"Wiener Würstchen",category:"Wurst",purin:87,protein:11.5,kcal:275,carbs:1.5,fiber:0.0,fat:24.0},
  {name:"Bockwurst",category:"Wurst",purin:90,protein:12.2,kcal:283,carbs:1.5,fiber:0.0,fat:24.5},
  {name:"Blutwurst",category:"Wurst",purin:53,protein:9.5,kcal:305,carbs:3.5,fiber:0.0,fat:27.0},
  {name:"Bratwurst",category:"Wurst",purin:124,protein:14.0,kcal:305,carbs:2.0,fiber:0.0,fat:26.5},
  {name:"Nürnberger Bratwurst",category:"Wurst",purin:130,protein:14.8,kcal:310,carbs:2.0,fiber:0.0,fat:27.0},
  {name:"Cervelat",category:"Wurst",purin:114,protein:19.5,kcal:355,carbs:1.0,fiber:0.0,fat:30.0},
  {name:"Mettwurst",category:"Wurst",purin:132,protein:17.2,kcal:370,carbs:1.0,fiber:0.0,fat:32.0},
  {name:"Teewurst",category:"Wurst",purin:127,protein:15.4,kcal:390,carbs:1.0,fiber:0.0,fat:34.0},
  {name:"Mortadella",category:"Wurst",purin:90,protein:13.5,kcal:310,carbs:2.0,fiber:0.0,fat:27.5},
  {name:"Kochsalami",category:"Wurst",purin:105,protein:16.0,kcal:300,carbs:1.5,fiber:0.0,fat:25.5},
  {name:"Jagdwurst",category:"Wurst",purin:98,protein:13.8,kcal:280,carbs:1.5,fiber:0.0,fat:24.0},
  {name:"Lyoner",category:"Wurst",purin:91,protein:12.7,kcal:265,carbs:2.0,fiber:0.0,fat:22.5},
  {name:"Weißwurst",category:"Wurst",purin:102,protein:12.0,kcal:285,carbs:2.5,fiber:0.0,fat:24.5},
  {name:"Chorizo",category:"Wurst",purin:150,protein:21.0,kcal:455,carbs:1.5,fiber:0.0,fat:40.0},
  {name:"Pepperoni (Wurst)",category:"Wurst",purin:145,protein:20.5,kcal:440,carbs:1.5,fiber:0.0,fat:38.5},
  {name:"Speck (geräuchert)",category:"Wurst",purin:125,protein:13.3,kcal:430,carbs:0.0,fiber:0.0,fat:39.0},
  {name:"Bacon",category:"Wurst",purin:130,protein:12.6,kcal:458,carbs:0.0,fiber:0.0,fat:42.0},
  {name:"Landjäger",category:"Wurst",purin:145,protein:23.5,kcal:410,carbs:1.0,fiber:0.0,fat:34.0},
  {name:"Plockwurst",category:"Wurst",purin:138,protein:21.0,kcal:395,carbs:0.8,fiber:0.0,fat:33.5},
  {name:"Presssack",category:"Wurst",purin:60,protein:11.0,kcal:195,carbs:2.5,fiber:0.0,fat:15.5},
  // Gemüse & Hülsenfrüchte
  {name:"Erbsen (getrocknet)",category:"Gemüse",purin:195,protein:23.0,kcal:342,carbs:53.0,fiber:16.6,fat:1.5},
  {name:"Erbsen (frisch)",category:"Gemüse",purin:84,protein:6.9,kcal:81,carbs:12.5,fiber:5.1,fat:0.4},
  {name:"Erbsen (Dose)",category:"Gemüse",purin:45,protein:5.0,kcal:65,carbs:10.0,fiber:4.1,fat:0.3},
  {name:"Linsen (getrocknet)",category:"Gemüse",purin:222,protein:24.0,kcal:353,carbs:52.5,fiber:11.7,fat:1.4},
  {name:"Linsen (gekocht)",category:"Gemüse",purin:109,protein:9.0,kcal:116,carbs:20.0,fiber:4.9,fat:0.5},
  {name:"Bohnen (getrocknet)",category:"Gemüse",purin:190,protein:21.4,kcal:335,carbs:47.5,fiber:15.7,fat:1.5},
  {name:"Bohnen (Kidneybohnen)",category:"Gemüse",purin:163,protein:22.5,kcal:333,carbs:47.0,fiber:15.2,fat:1.3},
  {name:"Grüne Bohnen",category:"Gemüse",purin:37,protein:1.8,kcal:31,carbs:5.2,fiber:3.4,fat:0.2},
  {name:"Sojabohnen",category:"Gemüse",purin:190,protein:36.5,kcal:416,carbs:9.0,fiber:9.3,fat:19.9},
  {name:"Sojasprossen",category:"Gemüse",purin:80,protein:4.4,kcal:53,carbs:5.3,fiber:1.8,fat:1.5},
  {name:"Kichererbsen (getrocknet)",category:"Gemüse",purin:109,protein:20.5,kcal:364,carbs:51.0,fiber:17.4,fat:5.0},
  {name:"Kichererbsen (Dose)",category:"Gemüse",purin:60,protein:8.9,kcal:164,carbs:27.4,fiber:7.6,fat:2.6},
  {name:"Lupinensamen",category:"Gemüse",purin:166,protein:36.7,kcal:371,carbs:10.0,fiber:18.9,fat:10.0},
  {name:"Mungobohnen",category:"Gemüse",purin:222,protein:23.9,kcal:347,carbs:46.3,fiber:16.3,fat:1.2},
  {name:"Spinat (roh)",category:"Gemüse",purin:57,protein:2.5,kcal:23,carbs:1.4,fiber:2.6,fat:0.4},
  {name:"Spinat (gefroren)",category:"Gemüse",purin:57,protein:2.5,kcal:22,carbs:1.4,fiber:2.6,fat:0.4},
  {name:"Spargel (weiß)",category:"Gemüse",purin:23,protein:1.9,kcal:20,carbs:2.2,fiber:1.8,fat:0.1},
  {name:"Spargel (grün)",category:"Gemüse",purin:29,protein:2.2,kcal:22,carbs:2.5,fiber:2.1,fat:0.2},
  {name:"Blumenkohl",category:"Gemüse",purin:51,protein:2.5,kcal:25,carbs:2.8,fiber:2.5,fat:0.3},
  {name:"Brokkoli",category:"Gemüse",purin:70,protein:3.3,kcal:34,carbs:4.0,fiber:3.3,fat:0.4},
  {name:"Pilze (Champignons)",category:"Gemüse",purin:58,protein:3.1,kcal:22,carbs:0.6,fiber:1.7,fat:0.3},
  {name:"Steinpilze",category:"Gemüse",purin:92,protein:3.7,kcal:22,carbs:0.8,fiber:3.8,fat:0.5},
  {name:"Pfifferlinge",category:"Gemüse",purin:74,protein:1.8,kcal:21,carbs:1.9,fiber:3.5,fat:0.5},
  {name:"Shiitake",category:"Gemüse",purin:168,protein:2.2,kcal:34,carbs:6.8,fiber:2.5,fat:0.5},
  {name:"Austernpilze",category:"Gemüse",purin:50,protein:3.3,kcal:33,carbs:5.6,fiber:2.3,fat:0.4},
  {name:"Tomaten",category:"Gemüse",purin:11,protein:0.9,kcal:18,carbs:3.1,fiber:1.2,fat:0.2},
  {name:"Tomaten (Dose)",category:"Gemüse",purin:11,protein:1.2,kcal:20,carbs:3.5,fiber:1.3,fat:0.2},
  {name:"Karotten",category:"Gemüse",purin:17,protein:0.9,kcal:36,carbs:7.5,fiber:2.9,fat:0.2},
  {name:"Kartoffeln",category:"Gemüse",purin:16,protein:2.0,kcal:70,carbs:14.8,fiber:2.1,fat:0.1},
  {name:"Süßkartoffeln",category:"Gemüse",purin:11,protein:1.6,kcal:86,carbs:20.0,fiber:3.0,fat:0.1},
  {name:"Zwiebeln",category:"Gemüse",purin:4,protein:1.0,kcal:40,carbs:8.5,fiber:1.7,fat:0.1},
  {name:"Frühlingszwiebeln",category:"Gemüse",purin:8,protein:1.8,kcal:32,carbs:5.3,fiber:2.6,fat:0.2},
  {name:"Knoblauch",category:"Gemüse",purin:8,protein:6.1,kcal:149,carbs:28.5,fiber:2.1,fat:0.5},
  {name:"Paprika (rot)",category:"Gemüse",purin:19,protein:1.0,kcal:31,carbs:6.0,fiber:2.1,fat:0.3},
  {name:"Paprika (gelb)",category:"Gemüse",purin:18,protein:1.0,kcal:27,carbs:5.0,fiber:1.7,fat:0.2},
  {name:"Paprika (grün)",category:"Gemüse",purin:21,protein:0.9,kcal:20,carbs:3.5,fiber:1.8,fat:0.2},
  {name:"Gurken",category:"Gemüse",purin:7,protein:0.6,kcal:13,carbs:2.0,fiber:0.7,fat:0.1},
  {name:"Salat (Kopfsalat)",category:"Gemüse",purin:13,protein:1.1,kcal:13,carbs:1.2,fiber:1.3,fat:0.2},
  {name:"Salat (Rucola)",category:"Gemüse",purin:24,protein:2.6,kcal:25,carbs:2.1,fiber:1.6,fat:0.7},
  {name:"Salat (Eisberg)",category:"Gemüse",purin:10,protein:0.9,kcal:13,carbs:1.8,fiber:1.2,fat:0.2},
  {name:"Salat (Feldsalat)",category:"Gemüse",purin:22,protein:2.0,kcal:18,carbs:1.6,fiber:1.9,fat:0.4},
  {name:"Weißkohl",category:"Gemüse",purin:22,protein:1.5,kcal:25,carbs:4.3,fiber:2.5,fat:0.2},
  {name:"Rotkohl",category:"Gemüse",purin:25,protein:1.5,kcal:27,carbs:5.0,fiber:2.5,fat:0.2},
  {name:"Grünkohl",category:"Gemüse",purin:48,protein:4.3,kcal:50,carbs:5.0,fiber:4.2,fat:1.0},
  {name:"Wirsing",category:"Gemüse",purin:20,protein:2.2,kcal:28,carbs:3.5,fiber:3.4,fat:0.4},
  {name:"Rosenkohl",category:"Gemüse",purin:69,protein:4.5,kcal:43,carbs:4.5,fiber:4.1,fat:0.5},
  {name:"Chinakohl",category:"Gemüse",purin:21,protein:1.2,kcal:13,carbs:1.5,fiber:1.2,fat:0.2},
  {name:"Spitzkohl",category:"Gemüse",purin:22,protein:1.8,kcal:25,carbs:4.0,fiber:2.3,fat:0.2},
  {name:"Lauch",category:"Gemüse",purin:17,protein:2.0,kcal:30,carbs:4.5,fiber:1.8,fat:0.3},
  {name:"Zucchini",category:"Gemüse",purin:24,protein:1.2,kcal:17,carbs:2.1,fiber:1.1,fat:0.3},
  {name:"Aubergine",category:"Gemüse",purin:21,protein:1.0,kcal:20,carbs:2.8,fiber:3.4,fat:0.2},
  {name:"Rote Beete",category:"Gemüse",purin:19,protein:1.6,kcal:43,carbs:9.0,fiber:2.5,fat:0.1},
  {name:"Fenchel",category:"Gemüse",purin:14,protein:1.3,kcal:26,carbs:4.2,fiber:3.1,fat:0.3},
  {name:"Sellerie (Stange)",category:"Gemüse",purin:12,protein:0.7,kcal:14,carbs:2.0,fiber:1.8,fat:0.2},
  {name:"Sellerie (Knollen)",category:"Gemüse",purin:30,protein:1.8,kcal:42,carbs:7.0,fiber:3.7,fat:0.3},
  {name:"Radieschen",category:"Gemüse",purin:15,protein:0.7,kcal:15,carbs:2.3,fiber:1.4,fat:0.1},
  {name:"Rettich",category:"Gemüse",purin:14,protein:1.0,kcal:16,carbs:2.5,fiber:1.8,fat:0.1},
  {name:"Kohlrabi",category:"Gemüse",purin:25,protein:2.6,kcal:27,carbs:3.5,fiber:1.9,fat:0.2},
  {name:"Pastinake",category:"Gemüse",purin:20,protein:1.3,kcal:65,carbs:13.5,fiber:4.9,fat:0.3},
  {name:"Petersilienwurzel",category:"Gemüse",purin:22,protein:1.5,kcal:53,carbs:10.0,fiber:4.5,fat:0.5},
  {name:"Artischocken",category:"Gemüse",purin:78,protein:3.3,kcal:53,carbs:8.7,fiber:8.6,fat:0.2},
  {name:"Brokkoli-Rabi",category:"Gemüse",purin:65,protein:3.9,kcal:43,carbs:5.5,fiber:3.5,fat:0.5},
  {name:"Mangold",category:"Gemüse",purin:57,protein:1.8,kcal:19,carbs:2.0,fiber:1.6,fat:0.2},
  {name:"Pak Choi",category:"Gemüse",purin:18,protein:1.5,kcal:13,carbs:1.3,fiber:1.0,fat:0.2},
  {name:"Kürbis",category:"Gemüse",purin:44,protein:1.1,kcal:26,carbs:4.5,fiber:1.1,fat:0.2},
  {name:"Butternut-Kürbis",category:"Gemüse",purin:38,protein:1.0,kcal:45,carbs:10.0,fiber:2.0,fat:0.1},
  {name:"Mais (Kolben)",category:"Gemüse",purin:52,protein:3.4,kcal:103,carbs:19.0,fiber:2.3,fat:1.5},
  {name:"Mais (Dose)",category:"Gemüse",purin:48,protein:3.2,kcal:85,carbs:16.0,fiber:1.8,fat:1.2},
  {name:"Meerrettich",category:"Gemüse",purin:34,protein:3.0,kcal:59,carbs:10.0,fiber:3.3,fat:0.5},
  {name:"Portulak",category:"Gemüse",purin:36,protein:1.7,kcal:20,carbs:2.0,fiber:0.9,fat:0.4},
  {name:"Blattspinat (Baby)",category:"Gemüse",purin:55,protein:2.3,kcal:23,carbs:1.5,fiber:2.2,fat:0.4},
  // Getreide & Backwaren
  {name:"Weißbrot",category:"Getreide",purin:14,protein:7.0,kcal:265,carbs:50.0,fiber:2.4,fat:2.5},
  {name:"Toastbrot",category:"Getreide",purin:15,protein:7.8,kcal:248,carbs:46.5,fiber:2.1,fat:2.5},
  {name:"Graubrot",category:"Getreide",purin:27,protein:7.5,kcal:230,carbs:43.0,fiber:4.5,fat:1.5},
  {name:"Vollkornbrot",category:"Getreide",purin:51,protein:8.5,kcal:216,carbs:38.0,fiber:7.9,fat:2.5},
  {name:"Roggenbrot",category:"Getreide",purin:60,protein:8.0,kcal:225,carbs:42.0,fiber:6.2,fat:1.7},
  {name:"Pumpernickel",category:"Getreide",purin:65,protein:8.8,kcal:185,carbs:34.0,fiber:7.5,fat:1.5},
  {name:"Laugenbrezeln",category:"Getreide",purin:18,protein:7.5,kcal:275,carbs:52.0,fiber:2.0,fat:2.5},
  {name:"Croissant",category:"Getreide",purin:20,protein:7.6,kcal:406,carbs:46.0,fiber:1.5,fat:21.0},
  {name:"Brötchen (Weiß)",category:"Getreide",purin:14,protein:7.2,kcal:270,carbs:51.0,fiber:2.2,fat:2.5},
  {name:"Brötchen (Vollkorn)",category:"Getreide",purin:48,protein:8.9,kcal:240,carbs:42.0,fiber:6.8,fat:3.0},
  {name:"Haferflocken (zart)",category:"Getreide",purin:94,protein:13.5,kcal:372,carbs:59.0,fiber:9.7,fat:7.0},
  {name:"Haferflocken (kernig)",category:"Getreide",purin:94,protein:13.5,kcal:372,carbs:59.0,fiber:9.7,fat:7.0},
  {name:"Haferkleie",category:"Getreide",purin:94,protein:17.3,kcal:295,carbs:50.0,fiber:15.4,fat:7.0},
  {name:"Weizenmehl (Type 405)",category:"Getreide",purin:22,protein:10.4,kcal:348,carbs:72.0,fiber:3.1,fat:1.0},
  {name:"Weizenmehl (Vollkorn)",category:"Getreide",purin:45,protein:13.2,kcal:340,carbs:65.0,fiber:9.6,fat:2.2},
  {name:"Dinkelmehl",category:"Getreide",purin:48,protein:14.6,kcal:338,carbs:62.0,fiber:8.9,fat:2.5},
  {name:"Dinkel (Korn)",category:"Getreide",purin:67,protein:14.6,kcal:338,carbs:62.0,fiber:9.2,fat:2.5},
  {name:"Reis (weiß)",category:"Getreide",purin:25,protein:6.7,kcal:350,carbs:78.0,fiber:0.4,fat:0.6},
  {name:"Reis (Vollkorn)",category:"Getreide",purin:37,protein:7.5,kcal:360,carbs:76.5,fiber:3.5,fat:2.2},
  {name:"Basmatireis",category:"Getreide",purin:25,protein:7.0,kcal:349,carbs:77.0,fiber:0.6,fat:0.6},
  {name:"Risotto-Reis",category:"Getreide",purin:26,protein:6.8,kcal:348,carbs:78.0,fiber:0.5,fat:0.5},
  {name:"Reis (Jasmin)",category:"Getreide",purin:24,protein:6.5,kcal:350,carbs:78.5,fiber:0.4,fat:0.6},
  {name:"Nudeln (Weizen, gekocht)",category:"Getreide",purin:21,protein:5.0,kcal:131,carbs:25.8,fiber:1.8,fat:0.8},
  {name:"Nudeln (Vollkorn, gekocht)",category:"Getreide",purin:40,protein:6.0,kcal:138,carbs:26.0,fiber:4.5,fat:1.2},
  {name:"Nudeln (Eier)",category:"Getreide",purin:28,protein:5.5,kcal:142,carbs:26.5,fiber:2.1,fat:1.5},
  {name:"Spaghetti",category:"Getreide",purin:21,protein:5.0,kcal:131,carbs:25.8,fiber:1.8,fat:0.8},
  {name:"Gnocchi",category:"Getreide",purin:18,protein:3.8,kcal:150,carbs:30.0,fiber:1.2,fat:1.2},
  {name:"Cornflakes",category:"Getreide",purin:32,protein:7.0,kcal:357,carbs:80.0,fiber:3.3,fat:0.7},
  {name:"Müsli (ohne Trockenfrüchte)",category:"Getreide",purin:55,protein:9.5,kcal:365,carbs:64.0,fiber:7.5,fat:7.0},
  {name:"Müsli (mit Trockenfrüchten)",category:"Getreide",purin:58,protein:9.0,kcal:355,carbs:68.0,fiber:6.8,fat:6.0},
  {name:"Roggen (Korn)",category:"Getreide",purin:51,protein:10.3,kcal:333,carbs:65.5,fiber:13.2,fat:1.7},
  {name:"Gerste (Korn)",category:"Getreide",purin:52,protein:9.9,kcal:336,carbs:67.0,fiber:10.3,fat:1.7},
  {name:"Graupen (Gerste)",category:"Getreide",purin:48,protein:9.6,kcal:352,carbs:73.0,fiber:8.9,fat:1.5},
  {name:"Hirse (Korn)",category:"Getreide",purin:62,protein:10.6,kcal:378,carbs:72.0,fiber:8.5,fat:3.9},
  {name:"Quinoa",category:"Getreide",purin:119,protein:14.1,kcal:368,carbs:57.0,fiber:7.0,fat:6.1},
  {name:"Buchweizen",category:"Getreide",purin:91,protein:13.3,kcal:343,carbs:62.0,fiber:10.0,fat:3.4},
  {name:"Amaranth",category:"Getreide",purin:73,protein:14.0,kcal:371,carbs:61.0,fiber:6.7,fat:6.5},
  {name:"Polenta",category:"Getreide",purin:50,protein:8.5,kcal:355,carbs:73.0,fiber:3.9,fat:3.5},
  {name:"Bulgur",category:"Getreide",purin:52,protein:12.3,kcal:342,carbs:63.0,fiber:12.5,fat:1.5},
  {name:"Couscous",category:"Getreide",purin:44,protein:12.8,kcal:376,carbs:72.0,fiber:5.0,fat:0.6},
  {name:"Maismehl",category:"Getreide",purin:50,protein:8.2,kcal:362,carbs:74.0,fiber:7.3,fat:3.5},
  {name:"Knäckebrot",category:"Getreide",purin:62,protein:10.5,kcal:356,carbs:70.0,fiber:12.5,fat:2.0},
  {name:"Zwieback",category:"Getreide",purin:18,protein:8.5,kcal:395,carbs:73.0,fiber:2.8,fat:7.5},
  {name:"Kekse (Butterkekse)",category:"Getreide",purin:15,protein:6.8,kcal:480,carbs:70.0,fiber:1.5,fat:18.5},
  {name:"Waffeln",category:"Getreide",purin:16,protein:7.5,kcal:430,carbs:63.0,fiber:1.2,fat:17.0},
  {name:"Pizza (Teig)",category:"Getreide",purin:22,protein:8.0,kcal:267,carbs:50.5,fiber:2.5,fat:3.0},
  // Milch & Eier
  {name:"Milch (Vollmilch, 3,5%)",category:"Milch",purin:2,protein:3.3,kcal:64,carbs:4.8,fiber:0.0,fat:3.5},
  {name:"Milch (fettarm, 1,5%)",category:"Milch",purin:2,protein:3.4,kcal:46,carbs:4.9,fiber:0.0,fat:1.5},
  {name:"Milch (entrahmt)",category:"Milch",purin:2,protein:3.5,kcal:34,carbs:5.0,fiber:0.0,fat:0.1},
  {name:"Buttermilch",category:"Milch",purin:3,protein:3.3,kcal:35,carbs:4.5,fiber:0.0,fat:0.5},
  {name:"Joghurt (3,5%)",category:"Milch",purin:3,protein:3.5,kcal:62,carbs:4.7,fiber:0.0,fat:3.5},
  {name:"Joghurt (fettarm, 1,5%)",category:"Milch",purin:3,protein:3.7,kcal:44,carbs:5.0,fiber:0.0,fat:1.5},
  {name:"Joghurt (Griechisch)",category:"Milch",purin:5,protein:5.8,kcal:115,carbs:3.8,fiber:0.0,fat:9.5},
  {name:"Kefir",category:"Milch",purin:3,protein:3.3,kcal:52,carbs:4.5,fiber:0.0,fat:2.5},
  {name:"Quark (Mager)",category:"Milch",purin:8,protein:12.5,kcal:67,carbs:3.9,fiber:0.0,fat:0.3},
  {name:"Quark (20% Fett)",category:"Milch",purin:7,protein:11.3,kcal:130,carbs:3.8,fiber:0.0,fat:7.5},
  {name:"Frischkäse",category:"Milch",purin:8,protein:7.5,kcal:149,carbs:3.5,fiber:0.0,fat:11.0},
  {name:"Frischkäse (Doppelrahm)",category:"Milch",purin:5,protein:5.8,kcal:263,carbs:3.2,fiber:0.0,fat:25.0},
  {name:"Mascarpone",category:"Milch",purin:4,protein:4.5,kcal:430,carbs:3.0,fiber:0.0,fat:45.0},
  {name:"Ricotta",category:"Milch",purin:8,protein:8.9,kcal:136,carbs:3.5,fiber:0.0,fat:9.0},
  {name:"Käse (Emmentaler)",category:"Milch",purin:7,protein:28.5,kcal:380,carbs:0.5,fiber:0.0,fat:29.0},
  {name:"Käse (Gouda)",category:"Milch",purin:12,protein:25.8,kcal:356,carbs:0.5,fiber:0.0,fat:27.5},
  {name:"Käse (Edamer)",category:"Milch",purin:10,protein:25.0,kcal:314,carbs:0.5,fiber:0.0,fat:23.0},
  {name:"Käse (Tilsiter)",category:"Milch",purin:14,protein:24.5,kcal:334,carbs:0.5,fiber:0.0,fat:25.0},
  {name:"Käse (Camembert)",category:"Milch",purin:38,protein:20.9,kcal:300,carbs:0.5,fiber:0.0,fat:24.0},
  {name:"Käse (Brie)",category:"Milch",purin:35,protein:20.0,kcal:334,carbs:0.5,fiber:0.0,fat:27.5},
  {name:"Käse (Roquefort)",category:"Milch",purin:33,protein:22.7,kcal:369,carbs:0.5,fiber:0.0,fat:31.0},
  {name:"Käse (Gorgonzola)",category:"Milch",purin:31,protein:19.4,kcal:361,carbs:0.5,fiber:0.0,fat:30.0},
  {name:"Käse (Parmesan)",category:"Milch",purin:33,protein:35.6,kcal:420,carbs:0.0,fiber:0.0,fat:29.7},
  {name:"Käse (Mozzarella)",category:"Milch",purin:18,protein:18.0,kcal:253,carbs:0.5,fiber:0.0,fat:19.5},
  {name:"Käse (Feta)",category:"Milch",purin:13,protein:14.0,kcal:255,carbs:0.5,fiber:0.0,fat:20.0},
  {name:"Käse (Gruyère)",category:"Milch",purin:8,protein:29.8,kcal:413,carbs:0.0,fiber:0.0,fat:32.3},
  {name:"Käse (Allgäuer Bergkäse)",category:"Milch",purin:9,protein:28.5,kcal:400,carbs:0.0,fiber:0.0,fat:31.0},
  {name:"Schmelzkäse",category:"Milch",purin:9,protein:15.0,kcal:270,carbs:4.0,fiber:0.0,fat:20.0},
  {name:"Hüttenkäse",category:"Milch",purin:9,protein:12.5,kcal:97,carbs:3.5,fiber:0.0,fat:4.5},
  {name:"Eier (Hühnerei, roh)",category:"Milch",purin:2,protein:12.9,kcal:155,carbs:0.7,fiber:0.0,fat:11.2},
  {name:"Eier (Hühnerei, hart)",category:"Milch",purin:2,protein:12.9,kcal:155,carbs:0.7,fiber:0.0,fat:11.2},
  {name:"Eigelb",category:"Milch",purin:4,protein:15.9,kcal:353,carbs:0.6,fiber:0.0,fat:30.6},
  {name:"Eiweiß",category:"Milch",purin:0,protein:10.9,kcal:52,carbs:0.7,fiber:0.0,fat:0.2},
  {name:"Wachteleier",category:"Milch",purin:3,protein:13.0,kcal:158,carbs:0.4,fiber:0.0,fat:11.1},
  {name:"Butter (Süßrahm)",category:"Milch",purin:0,protein:0.7,kcal:741,carbs:0.6,fiber:0.0,fat:81.5},
  {name:"Butter (Sauerrahm)",category:"Milch",purin:0,protein:0.7,kcal:741,carbs:0.6,fiber:0.0,fat:81.5},
  {name:"Margarine",category:"Milch",purin:0,protein:0.2,kcal:719,carbs:0.5,fiber:0.0,fat:80.0},
  {name:"Sahne (30%)",category:"Milch",purin:4,protein:2.5,kcal:290,carbs:3.5,fiber:0.0,fat:30.0},
  {name:"Sahne (15%, Kaffeesahne)",category:"Milch",purin:4,protein:2.7,kcal:150,carbs:4.0,fiber:0.0,fat:15.0},
  {name:"Schmand",category:"Milch",purin:4,protein:2.8,kcal:245,carbs:3.7,fiber:0.0,fat:24.0},
  {name:"Sauerrahm",category:"Milch",purin:4,protein:2.8,kcal:125,carbs:4.0,fiber:0.0,fat:10.0},
  {name:"Crème fraîche",category:"Milch",purin:3,protein:2.4,kcal:292,carbs:3.5,fiber:0.0,fat:30.0},
  {name:"Kondensmilch (gesüßt)",category:"Milch",purin:5,protein:7.9,kcal:327,carbs:55.0,fiber:0.0,fat:8.5},
  {name:"Sojamilch",category:"Milch",purin:9,protein:3.3,kcal:39,carbs:2.0,fiber:0.4,fat:1.9},
  {name:"Hafermilch",category:"Milch",purin:14,protein:1.0,kcal:46,carbs:8.0,fiber:0.8,fat:1.5},
  {name:"Mandelmilch",category:"Milch",purin:6,protein:0.5,kcal:24,carbs:3.0,fiber:0.4,fat:1.2},
  {name:"Reismilch",category:"Milch",purin:4,protein:0.1,kcal:47,carbs:9.5,fiber:0.1,fat:1.0},
  // Getränke
  {name:"Wasser (still)",category:"Getränke",purin:0,protein:0.0,kcal:0,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Wasser (Sprudel)",category:"Getränke",purin:0,protein:0.0,kcal:0,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Kaffee (schwarz)",category:"Getränke",purin:3,protein:0.2,kcal:2,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Kaffee (Espresso)",category:"Getränke",purin:3,protein:0.5,kcal:9,carbs:1.0,fiber:0.0,fat:0.2},
  {name:"Kaffee (Cappuccino)",category:"Getränke",purin:2,protein:1.5,kcal:40,carbs:4.5,fiber:0.0,fat:1.5},
  {name:"Tee (schwarz)",category:"Getränke",purin:2,protein:0.1,kcal:1,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Tee (grün)",category:"Getränke",purin:2,protein:0.2,kcal:1,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Tee (Kräuter)",category:"Getränke",purin:0,protein:0.1,kcal:1,carbs:0.2,fiber:0.0,fat:0.0},
  {name:"Tee (Früchte)",category:"Getränke",purin:0,protein:0.0,kcal:2,carbs:0.3,fiber:0.0,fat:0.0},
  {name:"Bier (Pils, 0,5 l)",category:"Getränke",purin:40,protein:0.5,kcal:43,carbs:3.5,fiber:0.0,fat:0.0},
  {name:"Bier (Weizen, 0,5 l)",category:"Getränke",purin:45,protein:0.5,kcal:47,carbs:3.8,fiber:0.0,fat:0.0},
  {name:"Bier (Export, 0,5 l)",category:"Getränke",purin:40,protein:0.5,kcal:44,carbs:3.6,fiber:0.0,fat:0.0},
  {name:"Bier (Dunkel, 0,5 l)",category:"Getränke",purin:42,protein:0.6,kcal:45,carbs:3.7,fiber:0.0,fat:0.0},
  {name:"Alkoholfreies Bier",category:"Getränke",purin:22,protein:0.5,kcal:27,carbs:5.5,fiber:0.0,fat:0.0},
  {name:"Wein (Weißwein, trocken)",category:"Getränke",purin:4,protein:0.1,kcal:66,carbs:0.6,fiber:0.0,fat:0.0},
  {name:"Wein (Rotwein, trocken)",category:"Getränke",purin:5,protein:0.1,kcal:68,carbs:0.3,fiber:0.0,fat:0.0},
  {name:"Wein (Rosé)",category:"Getränke",purin:4,protein:0.1,kcal:67,carbs:0.5,fiber:0.0,fat:0.0},
  {name:"Sekt (Weißwein)",category:"Getränke",purin:5,protein:0.3,kcal:72,carbs:3.0,fiber:0.0,fat:0.0},
  {name:"Champagner",category:"Getränke",purin:5,protein:0.3,kcal:76,carbs:3.5,fiber:0.0,fat:0.0},
  {name:"Prosecco",category:"Getränke",purin:5,protein:0.3,kcal:70,carbs:2.8,fiber:0.0,fat:0.0},
  {name:"Schnaps (Korn, Klarer)",category:"Getränke",purin:0,protein:0.0,kcal:220,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Whisky",category:"Getränke",purin:0,protein:0.0,kcal:250,carbs:0.1,fiber:0.0,fat:0.0},
  {name:"Wodka",category:"Getränke",purin:0,protein:0.0,kcal:231,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Rum",category:"Getränke",purin:0,protein:0.0,kcal:230,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Likör",category:"Getränke",purin:1,protein:0.0,kcal:315,carbs:35.0,fiber:0.0,fat:0.1},
  {name:"Orangensaft (frisch)",category:"Getränke",purin:6,protein:0.7,kcal:44,carbs:9.5,fiber:0.2,fat:0.2},
  {name:"Orangensaft (Packung)",category:"Getränke",purin:5,protein:0.6,kcal:42,carbs:9.5,fiber:0.1,fat:0.1},
  {name:"Apfelsaft",category:"Getränke",purin:4,protein:0.1,kcal:46,carbs:11.0,fiber:0.1,fat:0.1},
  {name:"Traubensaft",category:"Getränke",purin:5,protein:0.4,kcal:60,carbs:14.5,fiber:0.1,fat:0.1},
  {name:"Tomatensaft",category:"Getränke",purin:8,protein:1.0,kcal:17,carbs:3.0,fiber:0.4,fat:0.1},
  {name:"Karottensaft",category:"Getränke",purin:10,protein:0.9,kcal:40,carbs:8.5,fiber:0.5,fat:0.2},
  {name:"Cola",category:"Getränke",purin:0,protein:0.0,kcal:42,carbs:10.6,fiber:0.0,fat:0.0},
  {name:"Limonade (Zitrone)",category:"Getränke",purin:0,protein:0.0,kcal:40,carbs:10.0,fiber:0.0,fat:0.0},
  {name:"Energy Drink",category:"Getränke",purin:0,protein:0.0,kcal:45,carbs:11.0,fiber:0.0,fat:0.0},
  {name:"Isotonisches Getränk",category:"Getränke",purin:0,protein:0.0,kcal:26,carbs:6.5,fiber:0.0,fat:0.0},
  {name:"Kakao (Trinkschokolade)",category:"Getränke",purin:10,protein:1.9,kcal:55,carbs:9.5,fiber:0.5,fat:1.5},
  // Nüsse & Samen
  {name:"Erdnüsse",category:"Nüsse",purin:79,protein:25.3,kcal:567,carbs:16.1,fiber:8.5,fat:49.2},
  {name:"Erdnussbutter",category:"Nüsse",purin:70,protein:25.1,kcal:588,carbs:13.0,fiber:6.0,fat:50.0},
  {name:"Cashews",category:"Nüsse",purin:49,protein:17.2,kcal:553,carbs:30.2,fiber:3.3,fat:43.9},
  {name:"Mandeln",category:"Nüsse",purin:37,protein:21.2,kcal:575,carbs:11.6,fiber:12.5,fat:49.4},
  {name:"Walnüsse",category:"Nüsse",purin:25,protein:14.4,kcal:654,carbs:10.6,fiber:6.7,fat:65.2},
  {name:"Haselnüsse",category:"Nüsse",purin:37,protein:12.0,kcal:628,carbs:11.6,fiber:9.7,fat:61.0},
  {name:"Pistazien",category:"Nüsse",purin:76,protein:20.6,kcal:562,carbs:27.5,fiber:10.6,fat:45.3},
  {name:"Macadamia",category:"Nüsse",purin:33,protein:7.9,kcal:718,carbs:13.8,fiber:8.0,fat:75.8},
  {name:"Pekannüsse",category:"Nüsse",purin:40,protein:9.2,kcal:691,carbs:13.9,fiber:9.6,fat:72.0},
  {name:"Paranüsse",category:"Nüsse",purin:23,protein:14.1,kcal:656,carbs:11.7,fiber:7.5,fat:66.4},
  {name:"Kokosnuss (frisch)",category:"Nüsse",purin:12,protein:3.5,kcal:354,carbs:6.2,fiber:9.0,fat:36.5},
  {name:"Kokosraspeln",category:"Nüsse",purin:15,protein:6.1,kcal:660,carbs:10.5,fiber:16.3,fat:64.5},
  {name:"Pinienkerne",category:"Nüsse",purin:76,protein:13.7,kcal:673,carbs:13.1,fiber:3.7,fat:68.4},
  {name:"Sonnenblumenkerne",category:"Nüsse",purin:143,protein:22.8,kcal:584,carbs:20.0,fiber:8.6,fat:51.5},
  {name:"Kürbiskerne",category:"Nüsse",purin:233,protein:30.2,kcal:559,carbs:10.7,fiber:6.0,fat:46.4},
  {name:"Sesam",category:"Nüsse",purin:62,protein:18.0,kcal:573,carbs:12.2,fiber:7.9,fat:49.7},
  {name:"Leinsamen",category:"Nüsse",purin:105,protein:18.3,kcal:534,carbs:28.9,fiber:27.3,fat:42.2},
  {name:"Chiasamen",category:"Nüsse",purin:72,protein:16.5,kcal:486,carbs:42.1,fiber:34.4,fat:30.7},
  {name:"Hanfsamen",category:"Nüsse",purin:57,protein:31.6,kcal:553,carbs:10.9,fiber:4.0,fat:47.2},
  {name:"Mohnsamen",category:"Nüsse",purin:170,protein:17.5,kcal:525,carbs:28.1,fiber:19.5,fat:41.6},
  {name:"Sonnenblumenkernbutter",category:"Nüsse",purin:100,protein:20.0,kcal:580,carbs:19.0,fiber:7.5,fat:50.0},
  {name:"Tahini (Sesammus)",category:"Nüsse",purin:65,protein:17.0,kcal:595,carbs:21.2,fiber:9.3,fat:53.8},
  {name:"Mandelmus",category:"Nüsse",purin:35,protein:20.5,kcal:614,carbs:13.5,fiber:10.5,fat:56.0},
  // Obst
  {name:"Äpfel",category:"Obst",purin:6,protein:0.3,kcal:52,carbs:13.8,fiber:2.4,fat:0.2},
  {name:"Birnen",category:"Obst",purin:11,protein:0.4,kcal:57,carbs:15.0,fiber:3.1,fat:0.1},
  {name:"Bananen",category:"Obst",purin:57,protein:1.2,kcal:95,carbs:22.8,fiber:2.6,fat:0.3},
  {name:"Erdbeeren",category:"Obst",purin:21,protein:0.8,kcal:32,carbs:7.7,fiber:2.0,fat:0.4},
  {name:"Himbeeren",category:"Obst",purin:18,protein:1.2,kcal:52,carbs:11.9,fiber:6.5,fat:0.7},
  {name:"Heidelbeeren",category:"Obst",purin:22,protein:0.7,kcal:57,carbs:14.5,fiber:2.4,fat:0.3},
  {name:"Brombeeren",category:"Obst",purin:21,protein:1.3,kcal:43,carbs:9.6,fiber:5.3,fat:0.5},
  {name:"Johannisbeeren (rot)",category:"Obst",purin:17,protein:1.1,kcal:38,carbs:8.7,fiber:3.5,fat:0.2},
  {name:"Johannisbeeren (schwarz)",category:"Obst",purin:20,protein:1.3,kcal:63,carbs:15.4,fiber:7.6,fat:0.4},
  {name:"Kirschen (süß)",category:"Obst",purin:17,protein:1.0,kcal:63,carbs:16.0,fiber:1.6,fat:0.3},
  {name:"Kirschen (sauer)",category:"Obst",purin:20,protein:1.0,kcal:58,carbs:14.3,fiber:1.6,fat:0.3},
  {name:"Orangen",category:"Obst",purin:19,protein:0.9,kcal:47,carbs:11.8,fiber:2.2,fat:0.1},
  {name:"Mandarinen",category:"Obst",purin:18,protein:0.7,kcal:53,carbs:13.3,fiber:1.8,fat:0.2},
  {name:"Zitronen",category:"Obst",purin:17,protein:1.0,kcal:29,carbs:8.0,fiber:2.8,fat:0.3},
  {name:"Grapefruits",category:"Obst",purin:18,protein:0.6,kcal:42,carbs:10.7,fiber:1.6,fat:0.1},
  {name:"Limetten",category:"Obst",purin:16,protein:0.7,kcal:30,carbs:8.4,fiber:2.8,fat:0.2},
  {name:"Trauben (weiß)",category:"Obst",purin:27,protein:0.7,kcal:69,carbs:17.2,fiber:0.9,fat:0.2},
  {name:"Trauben (rot)",category:"Obst",purin:27,protein:0.7,kcal:69,carbs:17.2,fiber:0.9,fat:0.2},
  {name:"Rosinen",category:"Obst",purin:107,protein:2.5,kcal:299,carbs:79.0,fiber:3.7,fat:0.5},
  {name:"Ananas",category:"Obst",purin:19,protein:0.5,kcal:50,carbs:13.1,fiber:1.4,fat:0.1},
  {name:"Wassermelone",category:"Obst",purin:25,protein:0.6,kcal:30,carbs:7.6,fiber:0.4,fat:0.2},
  {name:"Honigmelone",category:"Obst",purin:22,protein:0.9,kcal:34,carbs:8.2,fiber:0.9,fat:0.1},
  {name:"Pfirsich",category:"Obst",purin:18,protein:0.9,kcal:39,carbs:9.5,fiber:1.5,fat:0.1},
  {name:"Nektarinen",category:"Obst",purin:18,protein:0.9,kcal:44,carbs:10.6,fiber:1.7,fat:0.3},
  {name:"Aprikosen",category:"Obst",purin:20,protein:0.9,kcal:48,carbs:11.1,fiber:2.0,fat:0.4},
  {name:"Pflaumen",category:"Obst",purin:24,protein:0.7,kcal:46,carbs:11.4,fiber:1.4,fat:0.2},
  {name:"Zwetschgen",category:"Obst",purin:20,protein:0.7,kcal:47,carbs:11.4,fiber:1.6,fat:0.2},
  {name:"Avocado",category:"Obst",purin:19,protein:2.0,kcal:160,carbs:8.5,fiber:6.7,fat:14.7},
  {name:"Mango",category:"Obst",purin:23,protein:0.6,kcal:65,carbs:17.0,fiber:1.8,fat:0.4},
  {name:"Papaya",category:"Obst",purin:14,protein:0.5,kcal:39,carbs:9.8,fiber:1.8,fat:0.1},
  {name:"Kiwi",category:"Obst",purin:19,protein:1.0,kcal:61,carbs:14.7,fiber:3.0,fat:0.5},
  {name:"Feigen (frisch)",category:"Obst",purin:32,protein:0.8,kcal:74,carbs:19.2,fiber:2.9,fat:0.3},
  {name:"Feigen (getrocknet)",category:"Obst",purin:68,protein:3.5,kcal:249,carbs:63.9,fiber:9.8,fat:0.9},
  {name:"Datteln",category:"Obst",purin:35,protein:2.5,kcal:282,carbs:75.0,fiber:6.7,fat:0.4},
  {name:"Dörrpflaumen",category:"Obst",purin:60,protein:2.5,kcal:240,carbs:63.9,fiber:7.1,fat:0.4},
  {name:"Granatapfel",category:"Obst",purin:17,protein:1.7,kcal:83,carbs:18.7,fiber:4.0,fat:1.2},
  {name:"Litschis",category:"Obst",purin:19,protein:0.8,kcal:66,carbs:16.5,fiber:1.3,fat:0.4},
  {name:"Maracuja",category:"Obst",purin:22,protein:2.2,kcal:97,carbs:23.4,fiber:10.4,fat:0.7},
  {name:"Stachelbeeren",category:"Obst",purin:16,protein:0.9,kcal:44,carbs:10.6,fiber:4.3,fat:0.6},
  {name:"Holunderbeeren",category:"Obst",purin:33,protein:0.7,kcal:73,carbs:18.4,fiber:7.0,fat:0.5},
  {name:"Rhabarber",category:"Obst",purin:11,protein:0.7,kcal:21,carbs:3.6,fiber:1.8,fat:0.2},
  // Sonstiges
  {name:"Tofu (natur)",category:"Sonstiges",purin:68,protein:8.0,kcal:76,carbs:1.9,fiber:0.3,fat:4.8},
  {name:"Tofu (geräuchert)",category:"Sonstiges",purin:68,protein:13.0,kcal:145,carbs:3.5,fiber:0.5,fat:9.0},
  {name:"Tempeh",category:"Sonstiges",purin:153,protein:18.5,kcal:195,carbs:9.4,fiber:4.1,fat:10.8},
  {name:"Seitan",category:"Sonstiges",purin:50,protein:25.0,kcal:143,carbs:5.0,fiber:0.6,fat:1.9},
  {name:"Hefe (Bierhefe, trocken)",category:"Sonstiges",purin:1810,protein:45.0,kcal:283,carbs:37.5,fiber:14.0,fat:1.5},
  {name:"Hefe (Backhefe)",category:"Sonstiges",purin:680,protein:12.5,kcal:105,carbs:10.0,fiber:6.0,fat:0.4},
  {name:"Hefeextrakt (z.B. Marmite)",category:"Sonstiges",purin:1960,protein:29.0,kcal:172,carbs:16.5,fiber:3.5,fat:0.5},
  {name:"Fleischextrakt",category:"Sonstiges",purin:2300,protein:60.0,kcal:264,carbs:14.0,fiber:0.0,fat:0.2},
  {name:"Fleischbrühe (Würfel)",category:"Sonstiges",purin:750,protein:18.0,kcal:210,carbs:20.0,fiber:0.0,fat:5.0},
  {name:"Bouillon (Fleisch)",category:"Sonstiges",purin:160,protein:2.5,kcal:14,carbs:1.5,fiber:0.0,fat:0.2},
  {name:"Sojasoße",category:"Sonstiges",purin:45,protein:9.5,kcal:53,carbs:4.9,fiber:0.4,fat:0.1},
  {name:"Teriyakisoße",category:"Sonstiges",purin:38,protein:5.5,kcal:89,carbs:14.5,fiber:0.2,fat:0.5},
  {name:"Worcestersoße",category:"Sonstiges",purin:74,protein:3.2,kcal:78,carbs:16.0,fiber:0.0,fat:0.3},
  {name:"Ketchup",category:"Sonstiges",purin:16,protein:1.5,kcal:101,carbs:25.0,fiber:0.8,fat:0.1},
  {name:"Senf",category:"Sonstiges",purin:37,protein:4.5,kcal:67,carbs:7.2,fiber:3.3,fat:2.8},
  {name:"Mayonnaise",category:"Sonstiges",purin:2,protein:1.2,kcal:680,carbs:2.5,fiber:0.0,fat:74.0},
  {name:"Schokolade (dunkel, 70%)",category:"Sonstiges",purin:26,protein:7.8,kcal:598,carbs:43.0,fiber:10.9,fat:42.6},
  {name:"Schokolade (Vollmilch)",category:"Sonstiges",purin:15,protein:7.0,kcal:535,carbs:59.0,fiber:3.4,fat:30.0},
  {name:"Schokolade (weiß)",category:"Sonstiges",purin:5,protein:5.9,kcal:563,carbs:60.0,fiber:0.0,fat:33.5},
  {name:"Kakaopulver",category:"Sonstiges",purin:71,protein:20.4,kcal:312,carbs:10.0,fiber:33.2,fat:22.0},
  {name:"Honig",category:"Sonstiges",purin:1,protein:0.4,kcal:304,carbs:80.0,fiber:0.2,fat:0.0},
  {name:"Zucker (weiß)",category:"Sonstiges",purin:0,protein:0.0,kcal:400,carbs:100.0,fiber:0.0,fat:0.0},
  {name:"Zucker (Rohr)",category:"Sonstiges",purin:0,protein:0.0,kcal:398,carbs:99.5,fiber:0.0,fat:0.0},
  {name:"Ahornsirup",category:"Sonstiges",purin:0,protein:0.0,kcal:260,carbs:67.0,fiber:0.0,fat:0.1},
  {name:"Agavendicksaft",category:"Sonstiges",purin:1,protein:0.1,kcal:310,carbs:76.0,fiber:0.1,fat:0.2},
  {name:"Marmelade",category:"Sonstiges",purin:3,protein:0.4,kcal:250,carbs:65.0,fiber:0.5,fat:0.1},
  {name:"Pflanzenöl (allg.)",category:"Sonstiges",purin:0,protein:0.0,kcal:884,carbs:0.0,fiber:0.0,fat:100.0},
  {name:"Olivenöl",category:"Sonstiges",purin:0,protein:0.0,kcal:884,carbs:0.0,fiber:0.0,fat:100.0},
  {name:"Rapsöl",category:"Sonstiges",purin:0,protein:0.0,kcal:884,carbs:0.0,fiber:0.0,fat:100.0},
  {name:"Essig",category:"Sonstiges",purin:0,protein:0.0,kcal:18,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Salz",category:"Sonstiges",purin:0,protein:0.0,kcal:0,carbs:0.0,fiber:0.0,fat:0.0},
  {name:"Curry (Gewürzmischung)",category:"Sonstiges",purin:36,protein:12.7,kcal:325,carbs:58.0,fiber:33.2,fat:14.0},
  {name:"Petersilie (frisch)",category:"Sonstiges",purin:57,protein:3.0,kcal:36,carbs:6.3,fiber:3.3,fat:0.8},
  {name:"Schnittlauch",category:"Sonstiges",purin:33,protein:3.3,kcal:30,carbs:4.0,fiber:2.6,fat:0.7},
  {name:"Basilikum (frisch)",category:"Sonstiges",purin:24,protein:3.2,kcal:23,carbs:2.6,fiber:1.6,fat:0.6},
  {name:"Thymian (getrocknet)",category:"Sonstiges",purin:52,protein:9.1,kcal:276,carbs:63.9,fiber:37.0,fat:7.4},
  {name:"Lorbeerblätter",category:"Sonstiges",purin:18,protein:7.6,kcal:313,carbs:74.9,fiber:26.3,fat:8.4},
  {name:"Chilischoten (frisch)",category:"Sonstiges",purin:16,protein:1.9,kcal:40,carbs:8.8,fiber:1.5,fat:0.4},
  {name:"Ingwer (frisch)",category:"Sonstiges",purin:10,protein:1.8,kcal:80,carbs:17.8,fiber:2.0,fat:0.8},
  {name:"Gelatine",category:"Sonstiges",purin:45,protein:85.6,kcal:335,carbs:0.0,fiber:0.0,fat:0.1},
  {name:"Hühnerbrühe (selbst gemacht)",category:"Sonstiges",purin:55,protein:2.0,kcal:15,carbs:0.5,fiber:0.0,fat:0.5},
  {name:"Instantsuppe",category:"Sonstiges",purin:60,protein:3.5,kcal:55,carbs:7.0,fiber:0.5,fat:1.5},
  {name:"Pizza (mit Salami)",category:"Sonstiges",purin:85,protein:11.0,kcal:267,carbs:32.0,fiber:2.0,fat:10.5},
  {name:"Döner Kebab",category:"Sonstiges",purin:110,protein:14.5,kcal:230,carbs:20.0,fiber:1.5,fat:11.0},
  {name:"Hamburger",category:"Sonstiges",purin:90,protein:13.5,kcal:265,carbs:25.0,fiber:1.2,fat:11.5},
  {name:"Hot Dog",category:"Sonstiges",purin:65,protein:9.0,kcal:250,carbs:22.0,fiber:1.0,fat:13.5},
  {name:"Pommes Frites",category:"Sonstiges",purin:18,protein:3.5,kcal:274,carbs:36.0,fiber:3.3,fat:13.0},
  {name:"Chips (Kartoffel)",category:"Sonstiges",purin:30,protein:6.0,kcal:536,carbs:53.0,fiber:4.8,fat:34.0},
  {name:"Popcorn",category:"Sonstiges",purin:48,protein:8.5,kcal:382,carbs:74.0,fiber:14.5,fat:4.5},
  {name:"Tiefkühlpizza",category:"Sonstiges",purin:70,protein:9.5,kcal:242,carbs:30.0,fiber:2.2,fat:9.0},
  {name:"Sushi (Lachs)",category:"Sonstiges",purin:80,protein:10.0,kcal:145,carbs:22.0,fiber:0.5,fat:3.0},
  {name:"Sushi (Thunfisch)",category:"Sonstiges",purin:120,protein:11.5,kcal:148,carbs:22.5,fiber:0.5,fat:2.5},
];

// ── Foods (Base + Custom) ────────────────────────────────────────
const CUSTOM_FOODS_KEY   = 'purin_custom_foods';
const BASE_FOODS_CACHE_KEY = 'purin_base_foods';
let customFoods = [];
let currentBaseData = baseData; // überschrieben durch Supabase-Cache oder -Download
let data = baseData.slice();

function mergeCustomFoods() {
  data = [...currentBaseData, ...customFoods.map((f, i) => ({ ...f, _custom: true, _customIdx: i }))];
}

function loadCustomFoodsLocal() {
  // Custom Foods aus localStorage
  try {
    const stored = localStorage.getItem(CUSTOM_FOODS_KEY);
    customFoods = stored ? JSON.parse(stored) : [];
  } catch(e) { customFoods = []; }

  // Basis-Daten: gecachte Version aus localStorage (falls vorhanden)
  try {
    const cached = localStorage.getItem(BASE_FOODS_CACHE_KEY);
    if (cached) currentBaseData = JSON.parse(cached);
  } catch(e) {}

  mergeCustomFoods();
}
loadCustomFoodsLocal();

async function refreshBaseFoodsFromSupabase() {
  if (!SUPABASE_URL || SUPABASE_URL.includes('PLACEHOLDER')) return;
  try {
    const rows = await supabaseRequest('GET', 'lebensmittel',
      null, '?user_id=eq.__base__&order=id.asc&limit=600');
    if (rows && rows.length > 0) {
      currentBaseData = rows.map(r => ({
        name: r.name, category: r.category,
        purin: +r.purin, protein: +r.protein, kcal: +r.kcal,
        carbs: +r.carbs, fiber: +r.fiber, fat: +r.fat,
      }));
      localStorage.setItem(BASE_FOODS_CACHE_KEY, JSON.stringify(currentBaseData));
      mergeCustomFoods();
      render();
    }
  } catch(e) { console.warn('Basisdaten-Refresh fehlgeschlagen:', e); }
}

function openAddFoodModal() {
  ['af-name','af-purin','af-kcal','af-protein','af-carbs','af-fat','af-fiber'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('af-category').value = 'Sonstiges';
  document.getElementById('add-food-modal').classList.add('open');
  document.getElementById('af-name').focus();
}

function closeAddFoodModal(e) {
  if (e && e.target !== document.getElementById('add-food-modal')) return;
  document.getElementById('add-food-modal').classList.remove('open');
}

async function saveNewFood() {
  const name     = document.getElementById('af-name').value.trim();
  const category = document.getElementById('af-category').value;
  const purin    = parseFloat(document.getElementById('af-purin').value)   || 0;
  const kcal     = parseFloat(document.getElementById('af-kcal').value)    || 0;
  const protein  = parseFloat(document.getElementById('af-protein').value) || 0;
  const carbs    = parseFloat(document.getElementById('af-carbs').value)   || 0;
  const fat      = parseFloat(document.getElementById('af-fat').value)     || 0;
  const fiber    = parseFloat(document.getElementById('af-fiber').value)   || 0;

  if (!name) { showToast('⚠ Bitte Namen eingeben', 2000); return; }
  if (data.some(d => d.name.toLowerCase() === name.toLowerCase())) {
    showToast('⚠ Lebensmittel existiert bereits', 2000); return;
  }

  const food = { name, category, purin, protein, kcal, carbs, fiber, fat };
  customFoods.push(food);
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
  mergeCustomFoods();
  document.getElementById('add-food-modal').classList.remove('open');
  render();
  showToast(`✓ "${name}" hinzugefügt`);

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      try {
        await supabaseInsert('lebensmittel', { user_id: userId, name, category, purin, protein, kcal, carbs, fiber, fat });
      } catch(e) { console.warn('Supabase save failed:', e); }
    }
  }
}

function deleteCustomFood(idx) {
  const name = customFoods[idx]?.name;
  if (name === undefined) return;
  customFoods.splice(idx, 1);
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
  mergeCustomFoods();
  render();
  showToast(`✓ "${name}" gelöscht`);

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      fetch(`${SUPABASE_URL}/rest/v1/lebensmittel?user_id=eq.${encodeURIComponent(userId)}&name=eq.${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
      }).catch(e => console.warn('Supabase delete failed:', e));
    }
  }
}

function getLevel(p) {
  if (p < 50) return "low";
  if (p < 150) return "medium";
  if (p < 300) return "high";
  return "very-high";
}
function getLevelLabel(l) {
  return {low:"Niedrig",medium:"Mittel",high:"Hoch","very-high":"Sehr hoch"}[l];
}
function getLevelOrder(l) {
  return {low:0,medium:1,high:2,"very-high":3}[l];
}
function getRec(p) {
  if (p < 50)  return "free";
  if (p < 150) return "moderate";
  if (p < 200) return "limited";
  if (p < 300) return "rare";
  return "avoid";
}
function getRecLabel(r) {
  return {
    free:     "Täglich",
    moderate: "5–7× / Woche",
    limited:  "2–4× / Woche",
    rare:     "1× / Woche",
    avoid:    "Meiden"
  }[r];
}
function getRecDetail(r) {
  return {
    free:     "unter 50 mg · unbegrenzte Menge",
    moderate: "50–149 mg · bis 150 g / Portion",
    limited:  "150–199 mg · max. 100–150 g / Portion",
    rare:     "200–299 mg · max. 100 g / Portion",
    avoid:    "≥ 300 mg · bei Gicht strikt meiden"
  }[r];
}
function getRecOrder(r) {
  return {free:0, moderate:1, limited:2, rare:3, avoid:4}[r];
}

let sortKey = "purin", sortDir = 1;

function sort(key) {
  if (sortKey === key) sortDir *= -1;
  else { sortKey = key; sortDir = 1; }
  ["name","category","purin","kcal","protein","carbs","fiber","fat","level","rec"].forEach(k => {
    const th = document.getElementById("th-"+k);
    const arr = document.getElementById("arr-"+k);
    if (k === key) { th.classList.add("sorted"); arr.textContent = sortDir === 1 ? "↑" : "↓"; }
    else { th.classList.remove("sorted"); arr.textContent = "↕"; }
  });
  render();
}

function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("category").value;
  const lev = document.getElementById("level").value;
  const recFilter = document.getElementById("rec").value;
  const maxPurin = Math.max(...data.map(d => d.purin));

  let rows = data.filter(d => {
    const level = getLevel(d.purin);
    const rec = getRec(d.purin);
    return (!q || d.name.toLowerCase().includes(q)) &&
           (!cat || d.category === cat) &&
           (!lev || level === lev) &&
           (!recFilter || rec === recFilter);
  });

  rows.sort((a, b) => {
    if (sortKey === "name") return sortDir * a.name.localeCompare(b.name, "de");
    if (sortKey === "category") return sortDir * a.category.localeCompare(b.category, "de");
    if (sortKey === "purin") return sortDir * (a.purin - b.purin);
    if (sortKey === "kcal") return sortDir * (a.kcal - b.kcal);
    if (sortKey === "protein") return sortDir * (a.protein - b.protein);
    if (sortKey === "carbs") return sortDir * (a.carbs - b.carbs);
    if (sortKey === "fiber") return sortDir * (a.fiber - b.fiber);
    if (sortKey === "fat") return sortDir * (a.fat - b.fat);
    if (sortKey === "level") return sortDir * (getLevelOrder(getLevel(a.purin)) - getLevelOrder(getLevel(b.purin)));
    if (sortKey === "rec") return sortDir * (getRecOrder(getRec(a.purin)) - getRecOrder(getRec(b.purin)));
    return 0;
  });

  const tbody = document.getElementById("tbody");
  const empty = document.getElementById("empty");
  document.getElementById("count-info").textContent = rows.length + " von " + data.length + " Einträgen";

  if (rows.length === 0) {
    tbody.innerHTML = ""; empty.style.display = "block";
  } else {
    empty.style.display = "none";
    tbody.innerHTML = rows.map((d, i) => {
      const level = getLevel(d.purin);
      const rec = getRec(d.purin);
      const pct = Math.min(100, Math.round((d.purin / maxPurin) * 100));
      const delBtn = d._custom ? `<button class="btn-del-row" onclick="deleteCustomFood(${d._customIdx})" title="Löschen">×</button>` : '';
      return `<tr>
        <td style="padding:8px 6px 8px 14px;"><div style="display:flex;gap:4px;align-items:center;"><button class="btn-add-row" onclick="quickAdd(${data.indexOf(d)})" title="${d.name} hinzufügen (100 g)">+</button>${delBtn}</div></td>
        <td style="text-align:center;font-size:12px;color:var(--text3);font-variant-numeric:tabular-nums;">${i + 1}</td>
        <td style="font-weight:500">${d.name}</td>
        <td><span class="cat-badge">${d.category}</span></td>
        <td>
          <div class="purin-bar">
            <span class="num">${d.purin}</span>
            <div class="bar-bg"><div class="bar-fill bar-${level}" style="width:${pct}%"></div></div>
          </div>
        </td>
        <td style="font-variant-numeric:tabular-nums;">${d.kcal}</td>
        <td style="font-variant-numeric:tabular-nums;">${d.protein.toFixed(1)} g</td>
        <td style="font-variant-numeric:tabular-nums;">${d.carbs.toFixed(1)} g</td>
        <td style="font-variant-numeric:tabular-nums;">${d.fiber.toFixed(1)} g</td>
        <td style="font-variant-numeric:tabular-nums;">${d.fat.toFixed(1)} g</td>
        <td><span class="level-badge badge-${level}">${getLevelLabel(level)}</span></td>
        <td>
          <span class="rec-badge rec-${rec}">${getRecLabel(rec)}</span>
          <div style="font-size:11px;color:var(--text2);margin-top:3px;">${getRecDetail(rec)}</div>
        </td>
      </tr>`;
    }).join("");
  }

  const total = rows.length;
  const avg = total ? Math.round(rows.reduce((s,d) => s+d.purin, 0) / total) : 0;
  const maxRow = rows.length ? rows.reduce((a,b) => a.purin > b.purin ? a : b) : null;
  document.getElementById("stats").innerHTML = `
    <div class="stat"><div class="stat-label">Einträge</div><div class="stat-value">${total}</div></div>
    <div class="stat"><div class="stat-label">Durchschnitt</div><div class="stat-value">${avg} mg</div></div>
    <div class="stat"><div class="stat-label">Höchster Wert</div><div class="stat-value small">${maxRow ? maxRow.name : "–"}</div></div>
    <div class="stat"><div class="stat-label">Max. Purin</div><div class="stat-value">${maxRow ? maxRow.purin : 0} mg</div></div>
  `;
}

// ── Tagesverbrauchsrechner ──────────────────────────────────────
let trackerItems = [];
let selectedFood = null;
const PURIN_LIMIT   = 500;
const KCAL_LIMIT    = 2000;
const PROTEIN_LIMIT = 75;
const CARBS_LIMIT   = 250;
const FAT_LIMIT     = 65;

let modalFoodIdx = null;

function quickAdd(idx) {
  modalFoodIdx = idx;
  const food = data[idx];
  const level = getLevel(food.purin);
  const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
  document.getElementById("modal-name").textContent = food.name;
  document.getElementById("modal-meta").innerHTML =
    `<span style="color:${colors[level]}">${food.purin} mg Purin</span> &nbsp;·&nbsp; ${food.kcal} kcal / 100 g`;
  document.getElementById("modal-grams").value = 100;
  updatePreview();
  document.getElementById("gram-modal").classList.add("open");
  setTimeout(() => document.getElementById("modal-grams").focus(), 50);
}

function updatePreview() {
  if (modalFoodIdx === null) return;
  const food = data[modalFoodIdx];
  const g = parseFloat(document.getElementById("modal-grams").value) || 0;
  const f = g / 100;
  const level = getLevel(food.purin);
  const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
  document.getElementById("modal-preview").innerHTML = `
    <div class="modal-preview-item"><span>Purin</span><span style="color:${colors[level]}">${Math.round(food.purin*f)} mg</span></div>
    <div class="modal-preview-item"><span>Kalorien</span><span>${Math.round(food.kcal*f)} kcal</span></div>
    <div class="modal-preview-item"><span>Eiweiß</span><span>${(food.protein*f).toFixed(1)} g</span></div>
    <div class="modal-preview-item"><span>Kohlenhydrate</span><span>${(food.carbs*f).toFixed(1)} g</span></div>
    <div class="modal-preview-item"><span>Ballaststoffe</span><span>${(food.fiber*f).toFixed(1)} g</span></div>
    <div class="modal-preview-item"><span>Fett</span><span>${(food.fat*f).toFixed(1)} g</span></div>
    <div class="modal-preview-item"><span>Menge</span><span>${g} g</span></div>
  `;
}

function confirmAdd() {
  if (modalFoodIdx === null) return;
  const g = parseFloat(document.getElementById("modal-grams").value) || 100;
  addTrackerItem(data[modalFoodIdx], g);
  closeModal();
  document.querySelector(".tab-box").scrollIntoView({behavior:"smooth", block:"nearest"});
}

function closeModal(e) {
  if (e && e.target !== document.getElementById("gram-modal")) return;
  document.getElementById("gram-modal").classList.remove("open");
  modalFoodIdx = null;
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
  if (e.key === "Enter" && document.getElementById("gram-modal").classList.contains("open")) confirmAdd();
});

function showSuggestions() {
  const q = document.getElementById("tracker-search").value.trim().toLowerCase();
  const box = document.getElementById("suggestions");
  selectedFood = null;

  // Tabelle mitfiltern
  const tableSearch = document.getElementById("search");
  if (tableSearch.value !== document.getElementById("tracker-search").value.trim()) {
    tableSearch.value = document.getElementById("tracker-search").value.trim();
    render();
  }

  // Clear-Button ein-/ausblenden
  const clearBtn = document.getElementById("tracker-search-clear");
  if (clearBtn) clearBtn.style.display = q.length > 0 ? "block" : "none";

  if (q.length < 1) { box.style.display = "none"; return; }
  const hits = data.filter(d => d.name.toLowerCase().includes(q)).slice(0, 8);
  if (!hits.length) { box.style.display = "none"; return; }
  box.innerHTML = hits.map(d => {
    const level = getLevel(d.purin);
    const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
    return `<div onclick="selectFood(${data.indexOf(d)})">
      <span class="sug-name">${d.name}</span>
      <span class="sug-meta" style="color:${colors[level]}">${d.purin} mg Purin · ${d.kcal} kcal</span>
    </div>`;
  }).join("");
  box.style.display = "block";
}

function selectFood(idx) {
  selectedFood = data[idx];
  document.getElementById("tracker-search").value = selectedFood.name;
  document.getElementById("suggestions").style.display = "none";
  document.getElementById("search").value = selectedFood.name;
  render();
}

function clearTrackerSearch() {
  document.getElementById("tracker-search").value = "";
  document.getElementById("suggestions").style.display = "none";
  const clearBtn = document.getElementById("tracker-search-clear");
  if (clearBtn) clearBtn.style.display = "none";
  document.getElementById("search").value = "";
  render();
}

function handleKey(e) {
  if (e.key === "Enter") addFromInput();
  if (e.key === "Escape") document.getElementById("suggestions").style.display = "none";
}

document.addEventListener("click", e => {
  if (!e.target.closest(".suggest-wrap")) document.getElementById("suggestions").style.display = "none";
});

function addFromInput() {
  const grams = parseFloat(document.getElementById("tracker-grams").value) || 100;
  if (!selectedFood) {
    const q = document.getElementById("tracker-search").value.trim().toLowerCase();
    if (!q) return;
    selectedFood = data.find(d => d.name.toLowerCase().includes(q)) || null;
    if (!selectedFood) return;
  }
  addTrackerItem(selectedFood, grams);
  document.getElementById("tracker-search").value = "";
  document.getElementById("tracker-grams").value = 100;
  selectedFood = null;
}

function addTrackerItem(food, grams) {
  const f = grams / 100;
  trackerItems.push({
    id: Date.now() + Math.random(),
    name: food.name,
    grams,
    purin:   Math.round(food.purin   * f),
    kcal:    Math.round(food.kcal    * f),
    protein: Math.round(food.protein * f * 10) / 10,
    carbs:   Math.round(food.carbs   * f * 10) / 10,
    fat:     Math.round(food.fat     * f * 10) / 10,
    fiber:   Math.round((food.fiber || 0) * f * 10) / 10,
  });
  renderTracker();
  saveToStorage();
}

function removeTrackerItem(id) {
  trackerItems = trackerItems.filter(i => i.id !== id);
  renderTracker();
  saveToStorage();
}

function resetTracker() {
  trackerItems = [];
  renderTracker();
  saveToStorage();
}

// ── Tabs ────────────────────────────────────────────────────────
function switchTab(name) {
  ['tracker','history','chart'].forEach(t => {
    document.getElementById('tab-' + t)?.classList.remove('active');
    document.getElementById('tab-btn-' + t)?.classList.remove('active');
  });
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('tab-btn-' + name).classList.add('active');
  if (name === 'chart') renderChart();
}

// ── localStorage persistence ────────────────────────────────────
const STORAGE_KEY      = 'purin_tracker_today';
const HISTORY_KEY      = 'purin_tracker_history';
const ITEMS_DATE_KEY   = 'purin_tracker_items_date'; // wann wurden items zuletzt korrekt via saveToStorage geschrieben

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerItems)); } catch(e) {}
  try { localStorage.setItem(ITEMS_DATE_KEY, getTodayStr()); } catch(e) {}
  dbAutoSave(userId => supabaseUpsert('purin_today', { user_id: userId, ts: Date.now(), items: trackerItems }));
}

// Sofort in DB speichern (fire-and-forget) – kein Upload/Download nötig
function dbAutoSave(fn) {
  try {
    if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('PLACEHOLDER')) return;
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (!userId) return;
    fn(userId).catch(e => console.warn('Auto-Sync:', e));
  } catch(e) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) trackerItems = JSON.parse(raw);
  } catch(e) {}
}

// ── Tageshistorie ───────────────────────────────────────────────
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch(e) { return []; }
}

// Normalisierter Timestamp: immer 00:00:00 des jeweiligen Tages
function getDayTs(date) {
  const d = date ? new Date(date) : new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function saveDay() {
  if (!trackerItems.length) return;
  const history = getHistory();
  const today = new Date().toLocaleDateString('de-DE', {weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'});
  const tot = calcTotals(trackerItems);
  // Remove existing entry for today if present
  const filtered = history.filter(d => d.date !== today);
  filtered.unshift({ date: today, ts: getDayTs(), items: [...trackerItems], totals: tot });
  // Keep max 90 days
  if (filtered.length > 90) filtered.splice(90);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    renderHistory();
    switchTab('history');
    const btn = document.getElementById('btn-save-day');
    btn.textContent = '✓ Gespeichert';
    setTimeout(() => { btn.textContent = 'Tag speichern'; }, 1500);
  } catch(e) { alert('Speichern fehlgeschlagen – localStorage möglicherweise voll.'); }
  dbAutoSave(userId => supabaseUpsert('purin_history', { user_id: userId, ts: getDayTs(), date: today, items: [...trackerItems], totals: tot }));
}

async function clearHistory() {
  if (!confirm('Gesamte Tageshistorie löschen?')) return;
  try { localStorage.removeItem(HISTORY_KEY); } catch(e) {}
  renderHistory();

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/purin_history?user_id=eq.${encodeURIComponent(userId)}`, {
          method: 'DELETE',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
        });
        showToast('✓ Purin-Historie lokal + in DB gelöscht');
      } catch(e) { showToast('⚠ DB-Löschen fehlgeschlagen: ' + e.message, 4000); }
    }
  }
}

async function deleteDay(ts) {
  const history = getHistory().filter(d => d.ts !== ts);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch(e) {}
  renderHistory();

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      fetch(`${SUPABASE_URL}/rest/v1/purin_history?user_id=eq.${encodeURIComponent(userId)}&ts=eq.${ts}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
      }).catch(e => console.warn('DB-Löschen fehlgeschlagen:', e));
    }
  }
}

function toggleDay(ts) {
  const el = document.getElementById('hday-' + ts);
  if (el) el.classList.toggle('open');
}

function calcTotals(items) {
  return items.reduce((a, i) => ({
    purin:   a.purin   + (i.purin   || 0),
    kcal:    a.kcal    + (i.kcal    || 0),
    protein: Math.round((a.protein + (i.protein || 0)) * 10) / 10,
    carbs:   Math.round((a.carbs   + (i.carbs   || 0)) * 10) / 10,
    fat:     Math.round((a.fat     + (i.fat     || 0)) * 10) / 10,
    fiber:   Math.round((a.fiber   + (i.fiber   || 0)) * 10) / 10,
  }), {purin:0, kcal:0, protein:0, carbs:0, fat:0, fiber:0});
}

function purinColor(val) {
  if (val < PURIN_LIMIT * 0.75) return '#639922';
  if (val < PURIN_LIMIT)        return '#EF9F27';
  return '#E24B4A';
}

function renderHistory() {
  const history = getHistory();
  const container = document.getElementById('history-list');
  if (!history.length) {
    container.innerHTML = '<div class="history-empty">Noch keine gespeicherten Tage.</div>';
    return;
  }
  container.innerHTML = '<div class="history-list">' + history.map(day => {
    const t = day.totals || calcTotals(day.items);
    const pct = Math.min(100, Math.round((t.purin / PURIN_LIMIT) * 100));
    const col = purinColor(t.purin);
    const itemsHtml = day.items.map(it =>
      `<div class="history-day-item">
        <span class="history-day-item-name">${it.name} (${it.grams} g)</span>
        <span>${it.purin} mg</span>
      </div>`
    ).join('');
    return `<div class="history-day">
      <div class="history-day-header" onclick="toggleDay(${day.ts})">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          <div class="history-day-date">${day.date}</div>
          <div class="history-day-summary">
            <span class="history-day-pill"><strong style="color:${col}">${t.purin} mg</strong> Purin</span>
            <span class="history-day-pill"><strong>${t.kcal}</strong> kcal</span>
            <span class="history-day-pill">E: <strong>${t.protein} g</strong></span>
            <span class="history-day-pill">KH: <strong>${t.carbs} g</strong></span>
            <span class="history-day-pill">F: <strong>${t.fat} g</strong></span>
          </div>
        </div>
        <button class="history-day-del" onclick="event.stopPropagation();openEditModal(${day.ts})" title="Tag bearbeiten" style="color:var(--text2);font-size:14px;margin-right:2px;">✎</button>
        <button class="history-day-del" onclick="event.stopPropagation();deleteDay(${day.ts})" title="Tag löschen">×</button>
      </div>
      <div class="history-purin-bar" style="margin:0 14px 0;"><div class="history-purin-fill" style="width:${pct}%;background:${col}"></div></div>
      <div class="history-day-body" id="hday-${day.ts}">
        <div class="history-day-items">${itemsHtml}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:8px;padding-top:8px;border-top:0.5px solid var(--border);">
          Ballaststoffe: ${t.fiber} g &nbsp;·&nbsp; ${day.items.length} Einträge
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';
}

function pBar(val, limit) { return Math.min(100, Math.round((val / limit) * 100)); }
function pClass(val, limit) {
  const r = val / limit;
  if (r < 0.75) return "pf-ok";
  if (r < 1)    return "pf-warn";
  return "pf-over";
}

function renderTracker() {
  const list   = document.getElementById("tracker-list");
  const empty  = document.getElementById("tracker-empty");
  const totals = document.getElementById("tracker-totals");
  const saveBtn = document.getElementById("btn-save-day");

  if (!trackerItems.length) {
    list.style.display = "none"; empty.style.display = "block"; totals.style.display = "none";
    if (saveBtn) { saveBtn.disabled = true; saveBtn.style.opacity = '0.4'; }
    return;
  }
  empty.style.display = "none"; list.style.display = "block"; totals.style.display = "grid";
  if (saveBtn) { saveBtn.disabled = false; saveBtn.style.opacity = '1'; }

  list.innerHTML = trackerItems.map(item => {
    const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
    const lvl = getLevel(item.purin / (item.grams / 100));
    return `<div class="tracker-item">
      <div>
        <div class="tracker-item-name">${item.name}</div>
        <div class="tracker-item-meta" style="color:${colors[lvl]}">
          ${item.purin} mg Purin &nbsp;·&nbsp; ${item.kcal} kcal &nbsp;·&nbsp; E: ${item.protein} g &nbsp;·&nbsp; KH: ${item.carbs} g &nbsp;·&nbsp; F: ${item.fat} g
        </div>
      </div>
      <div class="tracker-item-g">${item.grams} g</div>
      <button class="tracker-item-del" onclick="removeTrackerItem(${item.id})">×</button>
    </div>`;
  }).join("");

  const tot = calcTotals(trackerItems);
  const purinRem = PURIN_LIMIT - tot.purin;
  const purinMsg = purinRem < 0 ? "⚠ Limit überschritten" : purinRem + " mg verbleibend";

  const set = (id, val, unit, limit, msg) => {
    document.getElementById("t-"+id).textContent = val + " " + unit;
    const bar = document.getElementById("t-"+id+"-bar");
    bar.style.width = pBar(val, limit) + "%";
    bar.className   = "progress-fill " + pClass(val, limit);
    const lim = document.getElementById("t-"+id+"-limit");
    if (lim) lim.textContent = msg || "";
  };
  set("purin",   tot.purin,   "mg",   PURIN_LIMIT,   purinMsg);
  set("kcal",    tot.kcal,    "kcal", KCAL_LIMIT);
  set("protein", tot.protein, "g",    PROTEIN_LIMIT);
  set("carbs",   tot.carbs,   "g",    CARBS_LIMIT);
  set("fat",     tot.fat,     "g",    FAT_LIMIT);
}

// ── Init ────────────────────────────────────────────────────────
const _origRender = render;
render = function() { _origRender(); };

loadFromStorage();
renderTracker();
renderHistory();
render();

// ── Mitternachts-Reset ──────────────────────────────────────────
const LAST_DATE_KEY = 'purin_last_date';

function getTodayStr() {
  return new Date().toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
}

function checkMidnightReset() {
  const lastDate  = localStorage.getItem(LAST_DATE_KEY);
  const itemsDate = localStorage.getItem(ITEMS_DATE_KEY);
  const today     = getTodayStr();

  // Reset nötig wenn Items von einem vorherigen Tag stammen.
  // itemsDate ist zuverlässiger als lastDate — lastDate kann schon auf "heute" stehen
  // obwohl liveRefresh danach gestrige Items zurückgespielt hat.
  const needsReset = trackerItems.length > 0 && (
    (itemsDate != null && itemsDate !== today) ||
    (itemsDate == null && lastDate && lastDate !== today)
  );

  if (needsReset) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toLocaleDateString('de-DE', {weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'});

    const tot = calcTotals(trackerItems);
    const history = getHistory();
    const exists  = history.some(d => d.date === yesterdayDate);
    if (!exists) {
      const yTs = new Date(yesterday);
      yTs.setHours(0, 0, 0, 0);
      history.unshift({ ts: yTs.getTime(), date: yesterdayDate, items: [...trackerItems], totals: tot });
      if (history.length > 90) history.splice(90);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch(e) {}
    }

    trackerItems = [];
    saveToStorage(); // setzt auch ITEMS_DATE_KEY = heute
    renderTracker();
    renderHistory();
    showToast(`Guten Morgen! Neuer Tag – Tagesverbrauch zurückgesetzt ☀`);
  }
  localStorage.setItem(LAST_DATE_KEY, today);
}

// Beim Laden prüfen
checkMidnightReset();

// Jede Minute prüfen ob Mitternacht war
setInterval(checkMidnightReset, 60 * 1000);

// ── Verlaufsdiagramm ────────────────────────────────────────────
let historyChartInstance = null;

const METRIC_CONFIG = {
  purin:   { label: 'Purin (mg)',         color: '#E24B4A', limit: PURIN_LIMIT,   unit: 'mg' },
  kcal:    { label: 'Kalorien (kcal)',    color: '#378ADD', limit: KCAL_LIMIT,    unit: 'kcal' },
  protein: { label: 'Eiweiß (g)',         color: '#639922', limit: PROTEIN_LIMIT, unit: 'g' },
  carbs:   { label: 'Kohlenhydrate (g)',  color: '#EF9F27', limit: CARBS_LIMIT,   unit: 'g' },
  fat:     { label: 'Fett (g)',           color: '#8B5CF6', limit: FAT_LIMIT,     unit: 'g' },
  fiber:   { label: 'Ballaststoffe (g)', color: '#0F6E56', limit: 30,            unit: 'g' },
};

// Parse stored date string "Montag, 01.01.2024" → Date object
function parseDayDate(dateStr) {
  // Format: "Wochentag, TT.MM.JJJJ"
  const parts = dateStr.replace(/^.*?,\s*/, '').split('.');
  if (parts.length < 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

// ISO date string YYYY-MM-DD from Date
function toISO(d) {
  return d.toISOString().split('T')[0];
}

function initDateRange() {
  const history = getHistory();
  if (!history.length) return;
  const dates = history.map(d => parseDayDate(d.date)).filter(Boolean).sort((a,b) => a-b);
  const fromEl = document.getElementById('chart-from');
  const toEl   = document.getElementById('chart-to');
  if (!fromEl || !toEl) return;
  if (!fromEl.value) fromEl.value = toISO(dates[0]);
  if (!toEl.value)   toEl.value   = toISO(new Date());
}

function resetDateRange() {
  const history = getHistory();
  if (!history.length) return;
  const dates = history.map(d => parseDayDate(d.date)).filter(Boolean).sort((a,b) => a-b);
  const fromEl = document.getElementById('chart-from');
  const toEl   = document.getElementById('chart-to');
  if (fromEl) fromEl.value = toISO(dates[0]);
  if (toEl)   toEl.value   = toISO(new Date());
  renderChart();
}

function renderChart() {
  const history = getHistory();
  const canvas  = document.getElementById('history-chart');
  const empty   = document.getElementById('chart-empty');
  const rangeEmpty = document.getElementById('chart-range-empty');
  const metric  = document.getElementById('chart-metric')?.value || 'purin';
  const cfg     = METRIC_CONFIG[metric];

  if (!history.length) {
    canvas.style.display = 'none';
    empty.style.display  = 'block';
    if (rangeEmpty) rangeEmpty.style.display = 'none';
    if (historyChartInstance) { historyChartInstance.destroy(); historyChartInstance = null; }
    return;
  }
  empty.style.display = 'none';

  // Init date inputs if empty
  initDateRange();

  const fromVal = document.getElementById('chart-from')?.value;
  const toVal   = document.getElementById('chart-to')?.value;
  const fromDate = fromVal ? new Date(fromVal) : null;
  const toDate   = toVal   ? new Date(toVal + 'T23:59:59') : null;

  // Filter and sort chronologically
  let days = [...history]
    .filter(d => {
      const dt = parseDayDate(d.date);
      if (!dt) return false;
      if (fromDate && dt < fromDate) return false;
      if (toDate   && dt > toDate)   return false;
      return true;
    })
    .sort((a, b) => (parseDayDate(a.date) || 0) - (parseDayDate(b.date) || 0));

  if (!days.length) {
    canvas.style.display = 'none';
    if (rangeEmpty) rangeEmpty.style.display = 'block';
    if (historyChartInstance) { historyChartInstance.destroy(); historyChartInstance = null; }
    return;
  }
  canvas.style.display = 'block';
  if (rangeEmpty) rangeEmpty.style.display = 'none';

  const labels = days.map(d => {
    const dt = parseDayDate(d.date);
    return dt ? dt.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'}) : d.date;
  });
  const values = days.map(d => {
    const t = d.totals || calcTotals(d.items);
    return t[metric] ?? 0;
  });

  const isDark     = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textColor  = isDark ? '#9b9a94' : '#6b6a65';
  const bgColor    = isDark ? '#1c1c1a' : '#ffffff';

  if (historyChartInstance) historyChartInstance.destroy();

  historyChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: cfg.label,
          data: values,
          borderColor: cfg.color,
          backgroundColor: cfg.color + '22',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: cfg.color,
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Tageslimit',
          data: Array(labels.length).fill(cfg.limit),
          borderColor: cfg.color + '66',
          borderWidth: 1.5,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: textColor, font: { size: 12 }, boxWidth: 16, padding: 16 }
        },
        tooltip: {
          backgroundColor: bgColor,
          borderColor: gridColor,
          borderWidth: 1,
          titleColor: isDark ? '#f0ede6' : '#1a1a18',
          bodyColor: textColor,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} ${cfg.unit}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 11 }, maxRotation: 45 },
          grid:  { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, font: { size: 11 }, callback: v => v + ' ' + cfg.unit },
          grid:  { color: gridColor },
        }
      }
    }
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (document.getElementById('tab-chart')?.classList.contains('active')) renderChart();
});

// ── Edit-Historie-Modal ─────────────────────────────────────────
let editDayTs      = null;   // timestamp of day being edited
let editDayItems   = [];     // working copy of items
let editSelFood    = null;   // selected food for add-row

function openEditModal(ts) {
  const history = getHistory();
  const day = history.find(d => d.ts === ts);
  if (!day) return;
  editDayTs    = ts;
  editDayItems = day.items.map(i => ({...i, id: i.id || (Date.now() + Math.random())}));
  document.getElementById('edit-modal-date').textContent = day.date;
  document.getElementById('edit-search').value = '';
  document.getElementById('edit-grams').value  = 100;
  document.getElementById('edit-suggestions').style.display = 'none';
  editSelFood = null;
  renderEditItems();
  document.getElementById('edit-modal').classList.add('open');
}

function closeEditModal(e) {
  if (e && e.target !== document.getElementById('edit-modal')) return;
  document.getElementById('edit-modal').classList.remove('open');
  editDayTs = null; editDayItems = []; editSelFood = null;
}

function renderEditItems() {
  const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
  document.getElementById('edit-items').innerHTML = editDayItems.map(item => {
    const lvl = getLevel(item.purin / (item.grams / 100));
    return `<div class="edit-item">
      <div>
        <div class="edit-item-name">${item.name}</div>
        <div class="edit-item-meta" style="color:${colors[lvl]}">${item.purin} mg · ${item.kcal} kcal</div>
      </div>
      <input class="edit-item-grams" type="number" min="1" max="5000" value="${item.grams}"
        oninput="updateEditGrams(${item.id}, this.value)" style="height:30px;font-size:13px;text-align:center;width:72px;">
      <button class="edit-item-del" onclick="removeEditItem(${item.id})">×</button>
    </div>`;
  }).join('') || '<div style="padding:1rem;text-align:center;font-size:13px;color:var(--text3);">Keine Einträge</div>';

  // Totals
  const t = calcTotals(editDayItems);
  const col = purinColor(t.purin);
  document.getElementById('edit-totals').innerHTML = `
    <div class="edit-total"><div class="edit-total-label">Purin</div><div class="edit-total-val" style="color:${col}">${t.purin} mg</div></div>
    <div class="edit-total"><div class="edit-total-label">kcal</div><div class="edit-total-val">${t.kcal}</div></div>
    <div class="edit-total"><div class="edit-total-label">Eiweiß</div><div class="edit-total-val">${t.protein} g</div></div>
    <div class="edit-total"><div class="edit-total-label">KH</div><div class="edit-total-val">${t.carbs} g</div></div>
    <div class="edit-total"><div class="edit-total-label">Fett</div><div class="edit-total-val">${t.fat} g</div></div>
    <div class="edit-total"><div class="edit-total-label">Ballaststoffe</div><div class="edit-total-val">${t.fiber} g</div></div>
  `;
}

function updateEditGrams(id, val) {
  const item = editDayItems.find(i => i.id === id);
  if (!item) return;
  const g = parseFloat(val) || 0;
  const f = g / 100;
  // Recalculate from original food data
  const food = data.find(d => d.name === item.name);
  if (food) {
    item.grams   = g;
    item.purin   = Math.round(food.purin   * f);
    item.kcal    = Math.round(food.kcal    * f);
    item.protein = Math.round(food.protein * f * 10) / 10;
    item.carbs   = Math.round(food.carbs   * f * 10) / 10;
    item.fat     = Math.round(food.fat     * f * 10) / 10;
    item.fiber   = Math.round((food.fiber || 0) * f * 10) / 10;
  } else {
    item.grams = g;
  }
  // Only update totals (don't re-render list to preserve focus)
  const t = calcTotals(editDayItems);
  const col = purinColor(t.purin);
  document.getElementById('edit-totals').innerHTML = `
    <div class="edit-total"><div class="edit-total-label">Purin</div><div class="edit-total-val" style="color:${col}">${t.purin} mg</div></div>
    <div class="edit-total"><div class="edit-total-label">kcal</div><div class="edit-total-val">${t.kcal}</div></div>
    <div class="edit-total"><div class="edit-total-label">Eiweiß</div><div class="edit-total-val">${t.protein} g</div></div>
    <div class="edit-total"><div class="edit-total-label">KH</div><div class="edit-total-val">${t.carbs} g</div></div>
    <div class="edit-total"><div class="edit-total-label">Fett</div><div class="edit-total-val">${t.fat} g</div></div>
    <div class="edit-total"><div class="edit-total-label">Ballaststoffe</div><div class="edit-total-val">${t.fiber} g</div></div>
  `;
}

function removeEditItem(id) {
  editDayItems = editDayItems.filter(i => i.id !== id);
  renderEditItems();
}

function showEditSuggestions() {
  const q = document.getElementById('edit-search').value.trim().toLowerCase();
  const box = document.getElementById('edit-suggestions');
  editSelFood = null;
  if (q.length < 1) { box.style.display = 'none'; return; }
  const hits = data.filter(d => d.name.toLowerCase().includes(q)).slice(0, 7);
  if (!hits.length) { box.style.display = 'none'; return; }
  const colors = {low:"#639922",medium:"#EF9F27",high:"#D85A30","very-high":"#E24B4A"};
  box.innerHTML = hits.map(d => {
    const col = colors[getLevel(d.purin)];
    return `<div onclick="selectEditFood(${data.indexOf(d)})">
      <span>${d.name}</span>
      <span style="font-size:11px;color:${col}">${d.purin} mg · ${d.kcal} kcal</span>
    </div>`;
  }).join('');
  box.style.display = 'block';
}

function selectEditFood(idx) {
  editSelFood = data[idx];
  document.getElementById('edit-search').value = editSelFood.name;
  document.getElementById('edit-suggestions').style.display = 'none';
}

function addToEditDay() {
  if (!editSelFood) {
    const q = document.getElementById('edit-search').value.trim().toLowerCase();
    if (!q) return;
    editSelFood = data.find(d => d.name.toLowerCase().includes(q)) || null;
    if (!editSelFood) return;
  }
  const g = parseFloat(document.getElementById('edit-grams').value) || 100;
  const f = g / 100;
  editDayItems.push({
    id:      Date.now() + Math.random(),
    name:    editSelFood.name,
    grams:   g,
    purin:   Math.round(editSelFood.purin   * f),
    kcal:    Math.round(editSelFood.kcal    * f),
    protein: Math.round(editSelFood.protein * f * 10) / 10,
    carbs:   Math.round(editSelFood.carbs   * f * 10) / 10,
    fat:     Math.round(editSelFood.fat     * f * 10) / 10,
    fiber:   Math.round((editSelFood.fiber || 0) * f * 10) / 10,
  });
  document.getElementById('edit-search').value = '';
  document.getElementById('edit-grams').value  = 100;
  editSelFood = null;
  document.getElementById('edit-suggestions').style.display = 'none';
  renderEditItems();
}

function saveEditDay() {
  if (editDayTs === null) return;
  const history = getHistory();
  const idx = history.findIndex(d => d.ts === editDayTs);
  if (idx === -1) return;
  history[idx].items  = editDayItems;
  history[idx].totals = calcTotals(editDayItems);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
    renderChart();
    document.getElementById('edit-modal').classList.remove('open');
    editDayTs = null; editDayItems = []; editSelFood = null;
  } catch(e) { alert('Speichern fehlgeschlagen.'); }
}

document.getElementById('edit-modal').addEventListener('click', e => {
  if (!e.target.closest('.suggest-wrap')) document.getElementById('edit-suggestions').style.display = 'none';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('edit-modal').classList.contains('open')) closeEditModal();
});

// ── Seiten-Navigation ───────────────────────────────────────────
function switchPage(name) {
  ['purin','walk'].forEach(p => {
    document.getElementById('page-' + p)?.classList.remove('active');
    document.getElementById('pnav-' + p)?.classList.remove('active');
  });
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('pnav-' + name).classList.add('active');
  if (name === 'walk') calcWalk();
}

// ── Gehrechner ──────────────────────────────────────────────────
function calcWalk() {
  const weight   = parseFloat(document.getElementById('w-weight').value);
  const speed    = parseFloat(document.getElementById('w-speed').value);   // km/h
  const grade    = parseFloat(document.getElementById('w-grade').value);   // %
  const duration = parseFloat(document.getElementById('w-duration').value); // min
  const age      = parseFloat(document.getElementById('w-age').value);
  const sex      = document.querySelector('input[name="w-sex"]:checked')?.value || 'm';

  // Update labels
  document.getElementById('lbl-weight').textContent   = weight + ' kg';
  document.getElementById('lbl-speed').textContent    = speed.toFixed(1) + ' km/h';
  document.getElementById('lbl-grade').textContent    = grade.toFixed(1) + ' %';
  document.getElementById('lbl-duration').textContent = duration + ' min';
  document.getElementById('lbl-age').textContent      = age + ' Jahre';

  const hours = duration / 60;

  // Distance (horizontal ground distance in meters)
  const distM = Math.round(speed * hours * 1000);

  // Elevation gain (Δh = horizontal_dist × tan(arctan(grade/100)))
  const gradeRad = Math.atan(grade / 100);
  const elevM    = Math.round(distM * Math.tan(gradeRad));

  // MET calculation using Pandolf equation (treadmill/grade walking):
  // VO2 (ml/kg/min) = 2.2 + 0.9 × W × (speed_m_s + 1.8 × speed_m_s × grade/100) / W
  // Simplified ACSM walking formula:
  // VO2 = 3.5 + 0.1 × speed_m_min + 1.8 × speed_m_min × (grade/100)
  const speedMMin = speed * 1000 / 60;  // m/min
  const vo2       = 3.5 + 0.1 * speedMMin + 1.8 * speedMMin * (grade / 100);
  const met       = vo2 / 3.5;

  // Caloric expenditure: kcal/min = MET × weight(kg) × 3.5 / 200
  const kcalMin   = (met * weight * 3.5) / 200;
  const kcalTotal = Math.round(kcalMin * duration);
  const kcalMinR  = Math.round(kcalMin * 10) / 10;
  const metR      = Math.round(met * 10) / 10;

  // Estimated heart rate (Karvonen-based approximation)
  const hrMax   = 220 - age;
  // HR at given MET intensity (rough estimate)
  const hrRest  = sex === 'm' ? 70 : 74;
  const hrReserve = hrMax - hrRest;
  // MET intensity as fraction of VO2max (assume VO2max ~35 average)
  const intensity = Math.min(0.95, vo2 / 35);
  const hr = Math.round(hrRest + intensity * hrReserve);

  // Steps: avg step length varies with speed (~0.7m at 2.5km/h, steeper = shorter)
  const stepLen = Math.max(0.4, 0.7 - (grade / 100) * 0.8);
  const steps   = Math.round(distM / stepLen);

  // Water: ~500ml/h baseline + 100ml per 100 kcal burned
  const water = Math.round((500 * hours) + (kcalTotal / 100) * 100);

  document.getElementById('r-dist').textContent     = distM.toLocaleString('de-DE');
  document.getElementById('r-elev').textContent     = elevM.toLocaleString('de-DE');
  document.getElementById('r-kcal').textContent     = kcalTotal.toLocaleString('de-DE');
  document.getElementById('r-kcal-min').textContent = kcalMinR;
  document.getElementById('r-met').textContent      = metR;
  document.getElementById('r-hr').textContent       = hr;
  document.getElementById('r-steps').textContent    = steps.toLocaleString('de-DE');
  document.getElementById('r-water').textContent    = water.toLocaleString('de-DE');

  // Intensity description
  let intensity_text = met < 3 ? 'leicht (Spaziergang)' :
                       met < 6 ? 'moderat (zügiges Gehen)' :
                       met < 9 ? 'anstrengend (sportliches Gehen)' :
                                 'sehr anstrengend (Bergwandern)';

  // Grade description
  let grade_text = grade < 5   ? 'flach' :
                   grade < 10  ? 'leicht hügelig' :
                   grade < 20  ? 'steil (typisches Berggelände)' :
                   grade < 30  ? 'sehr steil' : 'extrem steil';

  document.getElementById('walk-info').innerHTML =
    `<strong>Zusammenfassung:</strong> Bei ${speed.toFixed(1)} km/h und ${grade.toFixed(0)} % Steigung (${grade_text}) 
    über ${duration} Minuten legst du etwa <strong>${distM.toLocaleString('de-DE')} m</strong> zurück 
    und überwindest <strong>${elevM} Höhenmeter</strong>. 
    Die Belastung entspricht MET ${metR} – das ist <strong>${intensity_text}</strong>. 
    Du verbrennst ca. <strong>${kcalTotal} kcal</strong> und solltest mindestens 
    <strong>${water} ml</strong> trinken. Deine Herzfrequenz liegt schätzungsweise bei 
    <strong>${hr} bpm</strong>.`;

  // Store for saving
  lastWalkResult = { weight, speed, grade, duration, age, sex, dist: distM, elev: elevM, kcal: kcalTotal, kcalMin: kcalMinR, met: metR, hr, steps, water };
}

// ── Gehrechner – Speichern & Historie ──────────────────────────
const WALK_HISTORY_KEY = 'purin_walk_history';
let lastWalkResult = null;

// Init on load
calcWalk();
renderWalkHistory();

function getWalkHistory() {
  try { return JSON.parse(localStorage.getItem(WALK_HISTORY_KEY) || '[]'); } catch(e) { return []; }
}

function switchWalkTab(name) {
  ['calc','history','chart'].forEach(t => {
    document.getElementById('wtab-' + t)?.classList.remove('active');
    document.getElementById('wtab-btn-' + t)?.classList.remove('active');
  });
  document.getElementById('wtab-' + name).classList.add('active');
  document.getElementById('wtab-btn-' + name).classList.add('active');
  if (name === 'chart') renderWalkChart();
}

function saveWalkDay() {
  if (!lastWalkResult) return;
  const history = getWalkHistory();
  const date = new Date().toLocaleDateString('de-DE', {weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'});
  const entry = { ts: Date.now(), date, ...lastWalkResult };
  history.unshift(entry);
  if (history.length > 200) history.splice(200);
  try {
    localStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(history));
    renderWalkHistory();
    showToast('✓ Berechnung gespeichert');
    const btn = document.getElementById('btn-save-walk');
    const orig = btn.textContent;
    btn.textContent = '✓ Gespeichert';
    setTimeout(() => btn.textContent = orig, 1500);
  } catch(e) { showToast('⚠ Speichern fehlgeschlagen', 3000); }
  dbAutoSave(userId => supabaseUpsert('walk_history', { user_id: userId, ts: entry.ts, date: entry.date, data: entry }));
}

async function deleteWalkDay(ts) {
  const history = getWalkHistory().filter(d => d.ts !== ts);
  try { localStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(history)); } catch(e) {}
  renderWalkHistory();
  renderWalkChart();

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      fetch(`${SUPABASE_URL}/rest/v1/walk_history?user_id=eq.${encodeURIComponent(userId)}&ts=eq.${ts}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
      }).catch(e => console.warn('DB-Löschen fehlgeschlagen:', e));
    }
  }
}

async function clearWalkHistory() {
  if (!confirm('Gesamte Geh-Historie löschen?')) return;
  try { localStorage.removeItem(WALK_HISTORY_KEY); } catch(e) {}
  renderWalkHistory();
  renderWalkChart();

  if (!SUPABASE_URL.includes('PLACEHOLDER')) {
    const userId = localStorage.getItem(SYNC_USER_KEY);
    if (userId) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/walk_history?user_id=eq.${encodeURIComponent(userId)}`, {
          method: 'DELETE',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
        });
        showToast('✓ Geh-Historie lokal + in DB gelöscht');
      } catch(e) { showToast('⚠ DB-Löschen fehlgeschlagen: ' + e.message, 4000); }
    }
  }
}

// ── Walk-Eintrag bearbeiten ──────────────────────────────────────
let editWalkTs = null;

function openEditWalkModal(ts) {
  const day = getWalkHistory().find(d => d.ts === ts);
  if (!day) return;
  editWalkTs = ts;
  document.getElementById('ewalk-date').textContent = day.date;
  document.getElementById('ew-weight').value   = day.weight;
  document.getElementById('ew-speed').value    = day.speed;
  document.getElementById('ew-grade').value    = day.grade;
  document.getElementById('ew-duration').value = day.duration;
  document.getElementById('ew-age').value      = day.age;
  document.querySelector(`input[name="ew-sex"][value="${day.sex}"]`).checked = true;
  calcWalkEdit();
  document.getElementById('edit-walk-modal').classList.add('open');
}

function closeEditWalkModal(e) {
  if (e && e.target !== document.getElementById('edit-walk-modal')) return;
  document.getElementById('edit-walk-modal').classList.remove('open');
  editWalkTs = null;
}

function calcWalkEdit() {
  const weight   = parseFloat(document.getElementById('ew-weight').value)   || 75;
  const speed    = parseFloat(document.getElementById('ew-speed').value)    || 2.5;
  const grade    = parseFloat(document.getElementById('ew-grade').value)    || 0;
  const duration = parseFloat(document.getElementById('ew-duration').value) || 60;
  const age      = parseFloat(document.getElementById('ew-age').value)      || 45;
  const sex      = document.querySelector('input[name="ew-sex"]:checked')?.value || 'm';
  const hours    = duration / 60;
  const distM    = Math.round(speed * hours * 1000);
  const elevM    = Math.round(distM * Math.tan(Math.atan(grade / 100)));
  const speedMMin = speed * 1000 / 60;
  const vo2      = 3.5 + 0.1 * speedMMin + 1.8 * speedMMin * (grade / 100);
  const met      = vo2 / 3.5;
  const kcalMin  = (met * weight * 3.5) / 200;
  const kcalTotal = Math.round(kcalMin * duration);
  const metR     = Math.round(met * 10) / 10;
  const hrMax    = 220 - age;
  const hrRest   = sex === 'm' ? 70 : 74;
  const intensity = Math.min(0.95, vo2 / 35);
  const hr       = Math.round(hrRest + intensity * (hrMax - hrRest));
  const stepLen  = Math.max(0.4, 0.7 - (grade / 100) * 0.8);
  const steps    = Math.round(distM / stepLen);
  const water    = Math.round((500 * hours) + (kcalTotal / 100) * 100);
  document.getElementById('ewalk-results').innerHTML = `
    <div class="edit-total"><div class="edit-total-label">Strecke</div><div class="edit-total-val">${distM.toLocaleString('de-DE')} m</div></div>
    <div class="edit-total"><div class="edit-total-label">Höhenmeter</div><div class="edit-total-val">${elevM} m</div></div>
    <div class="edit-total"><div class="edit-total-label">Kalorien</div><div class="edit-total-val">${kcalTotal} kcal</div></div>
    <div class="edit-total"><div class="edit-total-label">MET</div><div class="edit-total-val">${metR}</div></div>
    <div class="edit-total"><div class="edit-total-label">Herzfrequenz</div><div class="edit-total-val">${hr} bpm</div></div>
    <div class="edit-total"><div class="edit-total-label">Schritte</div><div class="edit-total-val">${steps.toLocaleString('de-DE')}</div></div>
    <div class="edit-total"><div class="edit-total-label">Wasser</div><div class="edit-total-val">${water} ml</div></div>`;
  return { weight, speed, grade, duration, age, sex, dist: distM, elev: elevM, kcal: kcalTotal, kcalMin: Math.round(kcalMin*10)/10, met: metR, hr, steps, water };
}

async function saveEditWalkDay() {
  if (editWalkTs === null) return;
  const result  = calcWalkEdit();
  const history = getWalkHistory();
  const idx     = history.findIndex(d => d.ts === editWalkTs);
  if (idx === -1) return;
  const ts = editWalkTs;
  history[idx] = { ...history[idx], ...result };
  const entry = history[idx];
  try {
    localStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(history));
    renderWalkHistory();
    renderWalkChart();
    document.getElementById('edit-walk-modal').classList.remove('open');
    editWalkTs = null;
    showToast('✓ Eintrag gespeichert');
  } catch(e) { showToast('⚠ Speichern fehlgeschlagen', 3000); return; }
  dbAutoSave(userId => supabaseUpsert('walk_history', { user_id: userId, ts, date: entry.date, data: entry }));
}

function toggleWalkDay(ts) {
  document.getElementById('wday-' + ts)?.classList.toggle('open');
}

function renderWalkHistory() {
  const history = getWalkHistory();
  const container = document.getElementById('walk-history-list');
  if (!history.length) {
    container.innerHTML = '<div class="walk-history-empty">Noch keine gespeicherten Einträge.</div>';
    return;
  }
  container.innerHTML = '<div class="walk-history-list">' + history.map(d => `
    <div class="walk-history-day">
      <div class="walk-history-hdr" onclick="toggleWalkDay(${d.ts})">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;flex-wrap:wrap;">
          <div class="walk-history-date">${d.date}</div>
          <div class="walk-history-pills">
            <span class="walk-history-pill"><strong style="color:#378ADD">${d.dist.toLocaleString('de-DE')} m</strong></span>
            <span class="walk-history-pill"><strong>${d.elev}</strong> Hm</span>
            <span class="walk-history-pill"><strong>${d.kcal}</strong> kcal</span>
            <span class="walk-history-pill"><strong>${d.steps.toLocaleString('de-DE')}</strong> Schritte</span>
            <span class="walk-history-pill">${d.speed.toFixed(1)} km/h · ${d.grade.toFixed(0)} % · ${d.duration} min</span>
          </div>
        </div>
        <button class="walk-history-edit" onclick="event.stopPropagation();openEditWalkModal(${d.ts})" title="Bearbeiten">✎</button>
        <button class="walk-history-del" onclick="event.stopPropagation();deleteWalkDay(${d.ts})">×</button>
      </div>
      <div class="walk-history-body" id="wday-${d.ts}">
        MET ${d.met} · Ø ${d.hr} bpm · ${d.water} ml Trinkbedarf · Gewicht ${d.weight} kg · ${d.sex === 'm' ? 'Männlich' : 'Weiblich'} · Alter ${d.age}
      </div>
    </div>`).join('') + '</div>';
}

// ── Walk-Verlaufsdiagramm ───────────────────────────────────────
let walkChartInstance = null;

const WALK_METRIC_CONFIG = {
  dist:     { label: 'Strecke (m)',    color: '#378ADD', unit: 'm' },
  elev:     { label: 'Höhenmeter',    color: '#639922', unit: 'm' },
  kcal:     { label: 'Kalorien (kcal)', color: '#E24B4A', unit: 'kcal' },
  steps:    { label: 'Schritte',      color: '#EF9F27', unit: '' },
  met:      { label: 'MET-Wert',      color: '#8B5CF6', unit: '' },
  duration: { label: 'Dauer (min)',   color: '#0F6E56', unit: 'min' },
};

function initWalkDateRange() {
  const history = getWalkHistory();
  if (!history.length) return;
  const dates = history.map(d => new Date(d.ts)).sort((a,b) => a-b);
  const fromEl = document.getElementById('wchart-from');
  const toEl   = document.getElementById('wchart-to');
  if (fromEl && !fromEl.value) fromEl.value = toISO(dates[0]);
  if (toEl   && !toEl.value)   toEl.value   = toISO(new Date());
}

function resetWalkDateRange() {
  const history = getWalkHistory();
  if (!history.length) return;
  const dates = history.map(d => new Date(d.ts)).sort((a,b) => a-b);
  const fromEl = document.getElementById('wchart-from');
  const toEl   = document.getElementById('wchart-to');
  if (fromEl) fromEl.value = toISO(dates[0]);
  if (toEl)   toEl.value   = toISO(new Date());
  renderWalkChart();
}

function renderWalkChart() {
  const history = getWalkHistory();
  const canvas  = document.getElementById('walk-chart');
  const empty   = document.getElementById('wchart-empty');
  const rangeEmpty = document.getElementById('wchart-range-empty');
  const metric  = document.getElementById('wchart-metric')?.value || 'dist';
  const cfg     = WALK_METRIC_CONFIG[metric];

  if (!history.length) {
    canvas.style.display = 'none'; empty.style.display = 'block';
    if (rangeEmpty) rangeEmpty.style.display = 'none';
    if (walkChartInstance) { walkChartInstance.destroy(); walkChartInstance = null; }
    return;
  }
  empty.style.display = 'none';
  initWalkDateRange();

  const fromVal  = document.getElementById('wchart-from')?.value;
  const toVal    = document.getElementById('wchart-to')?.value;
  const fromDate = fromVal ? new Date(fromVal) : null;
  const toDate   = toVal   ? new Date(toVal + 'T23:59:59') : null;

  let days = [...history]
    .filter(d => {
      const dt = new Date(d.ts);
      if (fromDate && dt < fromDate) return false;
      if (toDate   && dt > toDate)   return false;
      return true;
    })
    .sort((a, b) => a.ts - b.ts);

  if (!days.length) {
    canvas.style.display = 'none';
    if (rangeEmpty) rangeEmpty.style.display = 'block';
    if (walkChartInstance) { walkChartInstance.destroy(); walkChartInstance = null; }
    return;
  }
  canvas.style.display = 'block';
  if (rangeEmpty) rangeEmpty.style.display = 'none';

  const labels = days.map(d => new Date(d.ts).toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'}));
  const values = days.map(d => d[metric] ?? 0);

  const isDark    = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textColor = isDark ? '#9b9a94' : '#6b6a65';
  const bgColor   = isDark ? '#1c1c1a' : '#ffffff';

  if (walkChartInstance) walkChartInstance.destroy();

  walkChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: cfg.label,
        data: values,
        borderColor: cfg.color,
        backgroundColor: cfg.color + '22',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: cfg.color,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { size: 12 }, boxWidth: 16, padding: 16 } },
        tooltip: {
          backgroundColor: bgColor, borderColor: gridColor, borderWidth: 1,
          titleColor: isDark ? '#f0ede6' : '#1a1a18', bodyColor: textColor,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('de-DE')}${cfg.unit ? ' ' + cfg.unit : ''}` }
        }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 11 }, maxRotation: 45 }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: textColor, font: { size: 11 }, callback: v => v.toLocaleString('de-DE') + (cfg.unit ? ' ' + cfg.unit : '') }, grid: { color: gridColor } }
      }
    }
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (document.getElementById('wtab-chart')?.classList.contains('active')) renderWalkChart();
});

// ── Export / Import ─────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Supabase Sync ───────────────────────────────────────────────
const SUPABASE_URL = 'SUPABASE_URL_PLACEHOLDER';
const SUPABASE_KEY = 'SUPABASE_KEY_PLACEHOLDER';
const SYNC_USER_KEY = 'purin_sync_user_id';

// Auto-ID: beim ersten Start UUID generieren, danach immer dieselbe verwenden.
// Manuell überschreibbar für Geräte-übergreifenden Sync.
(function() {
  const el = document.getElementById('sync-user-id');
  let saved = localStorage.getItem(SYNC_USER_KEY);
  if (!saved) {
    saved = crypto.randomUUID();
    localStorage.setItem(SYNC_USER_KEY, saved);
  }
  el.value = saved;
  el.addEventListener('change', () => {
    const id = el.value.trim();
    if (id) { localStorage.setItem(SYNC_USER_KEY, id); liveRefresh(); }
  });
})();

function getSyncUserId() {
  const el = document.getElementById('sync-user-id');
  const id = el.value.trim();
  if (!id) { showToast('⚠ Bitte zuerst eine Geräte-ID eingeben', 3000); return null; }
  localStorage.setItem(SYNC_USER_KEY, id);
  return id;
}

function setSyncStatus(state, text) {
  const dot   = document.getElementById('sync-dot');
  const label = document.getElementById('sync-label');
  dot.className   = 'sync-dot ' + (state || '');
  label.textContent = text;
}

async function supabaseDelete(table, ts, userId) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?ts=eq.${ts}&user_id=eq.${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer': 'return=minimal',
    },
  });
}

async function supabaseInsert(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (res.status === 201 || res.status === 204) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
  return null;
}

async function supabaseUpsert(table, body) {
  // purin_today hat unique auf user_id, alle anderen auf ts
  if (table === 'purin_today') {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?user_id=eq.${encodeURIComponent(body.user_id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal',
      },
    });
  } else {
    await supabaseDelete(table, body.ts, body.user_id);
  }
  await supabaseInsert(table, body);
}

async function supabaseRequest(method, table, body, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204 || res.status === 201) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function syncUpload() {
  const userId = getSyncUserId();
  if (!userId) return;
  if (!SUPABASE_URL || SUPABASE_URL.includes('PLACEHOLDER')) {
    showToast('⚠ Supabase nicht konfiguriert – Keys fehlen', 3000);
    return;
  }
  setSyncStatus('busy', 'Wird hochgeladen…');
  try {
    const history     = getHistory();
    const walkHistory = getWalkHistory();
    const today       = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Upsert into purin_history
    for (const day of history) {
      await supabaseUpsert('purin_history', {
        user_id: userId, ts: day.ts, date: day.date,
        items: day.items, totals: day.totals || calcTotals(day.items),
      });
    }
    // Upsert into walk_history
    for (const day of walkHistory) {
      await supabaseUpsert('walk_history', {
        user_id: userId, ts: day.ts, date: day.date, data: day,
      });
    }
    // Upsert today
    if (today.length) {
      await supabaseUpsert('purin_today', {
        user_id: userId, ts: Date.now(), items: today,
      });
    }
    // Upsert custom foods (DELETE all + INSERT)
    await fetch(`${SUPABASE_URL}/rest/v1/lebensmittel?user_id=eq.${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
    });
    for (const f of customFoods) {
      await supabaseInsert('lebensmittel', { user_id: userId, name: f.name, category: f.category, purin: f.purin, protein: f.protein, kcal: f.kcal, carbs: f.carbs, fiber: f.fiber, fat: f.fat });
    }

    setSyncStatus('ok', `Hochgeladen ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}`);
    showToast(`✓ ${history.length} Tage + ${walkHistory.length} Geh-Einträge + ${customFoods.length} Lebensmittel hochgeladen`);
  } catch(e) {
    setSyncStatus('error', 'Fehler');
    showToast('⚠ Upload fehlgeschlagen: ' + e.message, 4000);
    console.error(e);
  }
}

async function syncDownload() {
  const userId = getSyncUserId();
  if (!userId) return;
  if (!SUPABASE_URL || SUPABASE_URL.includes('PLACEHOLDER')) {
    showToast('⚠ Supabase nicht konfiguriert – Keys fehlen', 3000);
    return;
  }
  setSyncStatus('busy', 'Wird geladen…');
  try {
    // Fetch purin history
    const purinRows = await supabaseRequest('GET', 'purin_history',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=ts.desc&limit=90`);

    // Fetch walk history
    const walkRows = await supabaseRequest('GET', 'walk_history',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=ts.desc&limit=200`);

    // Fetch today
    const todayRows = await supabaseRequest('GET', 'purin_today',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=ts.desc&limit=1`);

    // Fetch custom foods
    const foodRows = await supabaseRequest('GET', 'lebensmittel',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=created_at.asc`);

    // Merge purin history — server wins (neueste Version aus Supabase überschreibt lokal)
    const existingPurin = getHistory();
    const purinMap = new Map(existingPurin.map(d => [d.ts, d]));
    let purinAdded = 0, purinUpdated = 0;
    (purinRows || []).forEach(row => {
      const local = purinMap.get(row.ts);
      if (!local) {
        purinMap.set(row.ts, { ts: row.ts, date: row.date, items: row.items, totals: row.totals });
        purinAdded++;
      } else {
        // Server-Version überschreibt lokale Version
        purinMap.set(row.ts, { ts: row.ts, date: row.date, items: row.items, totals: row.totals });
        purinUpdated++;
      }
    });
    const mergedPurin = Array.from(purinMap.values()).sort((a, b) => b.ts - a.ts);
    if (mergedPurin.length > 90) mergedPurin.splice(90);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(mergedPurin));

    // Merge walk history — server wins
    const existingWalk = getWalkHistory();
    const walkMap = new Map(existingWalk.map(d => [d.ts, d]));
    let walkAdded = 0;
    (walkRows || []).forEach(row => {
      walkMap.set(row.ts, row.data);
      if (!existingWalk.some(d => d.ts === row.ts)) walkAdded++;
    });
    const mergedWalk = Array.from(walkMap.values()).sort((a, b) => b.ts - a.ts);
    if (mergedWalk.length > 200) mergedWalk.splice(200);
    localStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(mergedWalk));

    // Restore today — server always wins (nur wenn Daten von heute)
    if (todayRows?.length) {
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      if (todayRows[0].ts >= todayMidnight.getTime()) {
        trackerItems = todayRows[0].items || [];
        saveToStorage();
      }
    }

    // Restore custom foods — server always wins
    if (foodRows) {
      customFoods = foodRows.map(r => ({ name: r.name, category: r.category, purin: +r.purin, protein: +r.protein, kcal: +r.kcal, carbs: +r.carbs, fiber: +r.fiber, fat: +r.fat }));
      localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
      mergeCustomFoods();
    }

    renderHistory();
    renderWalkHistory();
    renderTracker();
    render();
    if (document.getElementById('tab-chart')?.classList.contains('active')) renderChart();
    if (document.getElementById('wtab-chart')?.classList.contains('active')) renderWalkChart();

    setSyncStatus('ok', `Geladen ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}`);
    showToast(`✓ ${purinAdded} neu + ${purinUpdated} aktualisiert (Purin) · ${walkAdded} Geh-Einträge · ${customFoods.length} Lebensmittel`);
  } catch(e) {
    setSyncStatus('error', 'Fehler');
    showToast('⚠ Download fehlgeschlagen: ' + e.message, 4000);
    console.error(e);
  }
}

// Basisdaten im Hintergrund aus Supabase laden (nach Initialisierung aller Konstanten)
refreshBaseFoodsFromSupabase();

// ── Auto-Refresh: Live-Sync zwischen Browsern ────────────────────
let _liveRefreshRunning = false;
async function liveRefresh() {
  if (_liveRefreshRunning) return;
  if (SUPABASE_URL.includes('PLACEHOLDER')) return;
  const userId = localStorage.getItem(SYNC_USER_KEY);
  if (!userId) return;
  _liveRefreshRunning = true;
  try {
    // Heutigen Tagesverbrauch holen
    const todayRows = await supabaseRequest('GET', 'purin_today',
      null, `?user_id=eq.${encodeURIComponent(userId)}&limit=1`);
    if (todayRows?.length) {
      // Remote-Daten immer übernehmen wenn sie sich unterscheiden (Cross-Browser-Sync)
      const remote = JSON.stringify(todayRows[0].items || []);
      if (remote !== JSON.stringify(trackerItems)) {
        trackerItems = todayRows[0].items || [];
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerItems)); } catch(e) {}
        renderTracker();
      }
      // ITEMS_DATE_KEY setzen: heute oder veraltet — checkMidnightReset entscheidet dann ob Reset nötig
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      const dateKey = todayRows[0].ts >= todayMidnight.getTime()
        ? getTodayStr()
        : new Date(todayRows[0].ts).toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
      try { localStorage.setItem(ITEMS_DATE_KEY, dateKey); } catch(e) {}
    }
    // Purin-Historie holen
    const purinRows = await supabaseRequest('GET', 'purin_history',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=ts.desc&limit=90`);
    if (purinRows?.length) {
      const remoteTs = JSON.stringify(purinRows.map(r => r.ts));
      const localTs  = JSON.stringify(getHistory().map(d => d.ts));
      if (remoteTs !== localTs) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(
          purinRows.map(r => ({ ts: r.ts, date: r.date, items: r.items, totals: r.totals }))));
        renderHistory();
        if (document.getElementById('tab-chart')?.classList.contains('active')) renderChart();
      }
    }
    // Walk-Historie holen
    const walkRows = await supabaseRequest('GET', 'walk_history',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=ts.desc&limit=200`);
    if (walkRows?.length) {
      const remoteTs = JSON.stringify(walkRows.map(r => r.ts));
      const localTs  = JSON.stringify(getWalkHistory().map(d => d.ts));
      if (remoteTs !== localTs) {
        localStorage.setItem(WALK_HISTORY_KEY, JSON.stringify(
          walkRows.map(r => ({ ...r.data, ts: r.ts, date: r.date }))));
        renderWalkHistory();
        if (document.getElementById('wtab-chart')?.classList.contains('active')) renderWalkChart();
      }
    }
    // Custom Foods holen
    const foodRows = await supabaseRequest('GET', 'lebensmittel',
      null, `?user_id=eq.${encodeURIComponent(userId)}&order=id.asc`);
    if (foodRows) {
      const remoteNames = JSON.stringify(foodRows.map(r => r.name).sort());
      const localNames  = JSON.stringify(customFoods.map(f => f.name).sort());
      if (remoteNames !== localNames) {
        customFoods = foodRows.map(r => ({ name: r.name, category: r.category, purin: +r.purin, protein: +r.protein, kcal: +r.kcal, carbs: +r.carbs, fiber: +r.fiber, fat: +r.fat }));
        localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
        mergeCustomFoods();
        render();
      }
    }
  } catch(e) { /* silent */ }
  finally { _liveRefreshRunning = false; }
}

// Beim Laden sofort holen
liveRefresh();
// Bei Fensterfokus (separate Browser-Fenster) sofort aktualisieren
window.addEventListener('focus', liveRefresh);
// Bei Tab-Wechsel sofort aktualisieren
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') liveRefresh();
});
// Alle 15 Sekunden im Hintergrund aktualisieren
setInterval(liveRefresh, 15000);