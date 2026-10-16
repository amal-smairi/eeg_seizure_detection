'use strict';

/* =====================================================================
   DONNÉES EXTRAITES DU NOTEBOOK (parties I à XII)
   Pour mettre à jour le site après une nouvelle exécution du notebook,
   modifier uniquement cet objet.
   ===================================================================== */
const DATA = {
  fs: 256,
  fichiers: { mat: 44, entetes: 22, donnees: 22 },
  annotations: { lues: 83, valides: 82, exclues: 1 },
  fenetres: { total: 33206, normal: 32038, crise: 1168, taille: 512, pas: 256 },
  echantillons: { normal: 8228270, crise: 278098 },

  // id, canaux, échantillons, durée (s), crises valides, fenêtres, fenêtres de crise, échantillons de crise
  recordings: [
    ['190304A-E', 23, 403200, 1575, 1, 1574, 8, 1793],
    ['191113A-D', 23, 463360, 1810, 2, 1809, 20, 4610],
    ['200625A-F', 12, 457728, 1788, 0, 1787, 0, 0],
    ['210204B-C', 21, 314112, 1227, 0, 1226, 0, 0],
    ['210208B-G', 21, 307200, 1200, 0, 1199, 0, 0],
    ['210406A-F', 23, 372224, 1454, 1, 1453, 9, 2049],
    ['210427B-C', 21, 318976, 1246, 1, 1245, 19, 4609],
    ['210504B-C', 21, 798976, 3121, 11, 3120, 138, 32523],
    ['210914B-A', 21, 308480, 1205, 11, 1204, 187, 45067],
    ['210928B-B', 21, 344064, 1344, 2, 1343, 57, 14082],
    ['211027B-C', 21, 321280, 1255, 8, 1254, 131, 31496],
    ['211104B-D', 21, 309760, 1210, 5, 1209, 45, 10245],
    ['220106A-A', 23, 312576, 1221, 2, 1220, 39, 9474],
    ['220121B-D', 21, 330752, 1292, 3, 1291, 53, 12803],
    ['230102B-F', 21, 313600, 1225, 9, 1224, 144, 34569],
    ['230105B-H', 21, 921600, 3600, 7, 3599, 45, 9735],
    ['230210B-D', 21, 300288, 1173, 1, 1172, 23, 5633],
    ['230224B-B', 21, 365568, 1428, 3, 1427, 49, 11779],
    ['230406B-A', 21, 313600, 1225, 4, 1224, 54, 12804],
    ['230515B-G', 21, 308992, 1207, 2, 1206, 36, 8706],
    ['230519A-E', 23, 311296, 1216, 2, 1215, 37, 8962],
    ['230718A-A', 23, 308736, 1206, 7, 1205, 74, 17159]
  ].map(r => ({ id: r[0], ch: r[1], n: r[2], dur: r[3], crises: r[4], win: r[5], winC: r[6], smpC: r[7] })),

  // Instants de crise connus (secondes dans le signal). Remplacés par
  // data/annotations_with_signals.csv s'il est présent à côté de la page.
  crises: {
    '190304A-E': [[1291, 1298]],
    '191113A-D': [[1254, 1267], [1428, 1433]],
    '210406A-F': [[633, 641]],
    '210427B-C': [[1031, 1049]],
    '210504B-C': [[731, 747], [1041, 1047], [1126, 1129], [1217, 1220]]
  },

  firstCrises: [
    ['190304A-E', 1, '10:13:35', '10:35:06', '10:35:13', 1291, 1298, 7],
    ['191113A-D', 1, '10:18:19', '10:39:13', '10:39:26', 1254, 1267, 13],
    ['191113A-D', 2, '10:18:19', '10:42:07', '10:42:12', 1428, 1433, 5],
    ['210406A-F', 1, '15:05:17', '15:15:50', '15:15:58', 633, 641, 8],
    ['210427B-C', 1, '08:47:10', '09:04:21', '09:04:39', 1031, 1049, 18]
  ],

  crisesStats: { moyenne: 13.2, mediane: 11, min: 2, max: 60, ecart: 10.3, intervalle: 184.6 },

  // patient, crises déclarées dans l'Excel, crises valides retenues
  crisesParPatient: [
    ['190304A-E', 1, 1], ['191113A-D', 2, 2], ['210406A-F', 1, 1], ['210427B-C', 1, 1],
    ['210504B-C', 12, 11], ['210914B-A', 6, 11], ['210928B-B', 2, 2], ['211027B-C', 8, 8],
    ['211104B-D', 5, 5], ['220106A-A', 2, 2], ['220121B-D', 3, 3], ['230102B-F', 9, 9],
    ['230105B-H', 7, 7], ['230210B-D', 1, 1], ['230224B-B', 3, 3], ['230406B-A', 4, 4],
    ['230515B-G', 2, 2], ['230519A-E', 2, 2], ['230718A-A', 7, 7]
  ],

  // patient, RMS pendant la crise, RMS hors crise
  rms: [
    ['190304A-E', 323.10, 139.57], ['191113A-D', 152.01, 102.80], ['210406A-F', 160.06, 182.78],
    ['210427B-C', 210.43, 237.97], ['210504B-C', 125.25, 116.52], ['210914B-A', 142.72, 105.43],
    ['210928B-B', 457.32, 235.25], ['211027B-C', 182.08, 86.18], ['211104B-D', 263.39, 129.22],
    ['220106A-A', 928.51, 903.70], ['220121B-D', 204.61, 166.09], ['230102B-F', 322.21, 304.65],
    ['230105B-H', 267.32, 243.63], ['230210B-D', 167.49, 231.39], ['230224B-B', 186.89, 210.53],
    ['230406B-A', 436.19, 208.80], ['230515B-G', 247.12, 126.34], ['230519A-E', 120.61, 82.91],
    ['230718A-A', 167.77, 123.96]
  ],

  // caractéristique, AUC, pouvoir discriminant |AUC-0,5|×2, écart standardisé d
  auc: [
    ['Alpha', 0.853, 0.706, -0.05357],
    ['Theta', 0.852, 0.704, -0.063514],
    ['Amplitude', 0.825, 0.649, 0.51406],
    ['Beta', 0.807, 0.614, -0.051892],
    ['Delta', 0.783, 0.567, -0.074346],
    ['Std', 0.76, 0.519, 0.342976],
    ['Min', 0.249, 0.503, -0.727719],
    ['Variance', 0.7, 0.401, -0.088075],
    ['RMS', 0.618, 0.236, 0.299313],
    ['Mean', 0.412, 0.177, -0.401451],
    ['Energy', 0.576, 0.151, -0.08231],
    ['Max', 0.549, 0.098, 0.027242]
  ],

  corrNames: ['Mean', 'Std', 'Variance', 'Min', 'Max', 'Amplitude', 'RMS', 'Energy', 'Delta', 'Theta', 'Alpha', 'Beta'],
  corr: [
    [1.00, 0.18, 0.08, 0.68, 0.71, 0.13, -0.17, 0.06, 0.08, 0.05, 0.03, 0.03],
    [0.18, 1.00, 0.77, -0.53, 0.76, 0.95, 0.64, 0.70, 0.72, 0.59, 0.57, 0.52],
    [0.08, 0.77, 1.00, -0.42, 0.54, 0.70, 0.47, 0.85, 0.98, 0.70, 0.71, 0.62],
    [0.68, -0.53, -0.42, 1.00, 0.06, -0.59, -0.58, -0.41, -0.38, -0.37, -0.39, -0.35],
    [0.71, 0.76, 0.54, 0.06, 1.00, 0.77, 0.31, 0.47, 0.49, 0.48, 0.46, 0.44],
    [0.13, 0.95, 0.70, -0.59, 0.77, 1.00, 0.63, 0.64, 0.64, 0.63, 0.62, 0.58],
    [-0.17, 0.64, 0.47, -0.58, 0.31, 0.63, 1.00, 0.55, 0.46, 0.36, 0.35, 0.31],
    [0.06, 0.70, 0.85, -0.41, 0.47, 0.64, 0.55, 1.00, 0.84, 0.59, 0.58, 0.51],
    [0.08, 0.72, 0.98, -0.38, 0.49, 0.64, 0.46, 0.84, 1.00, 0.63, 0.62, 0.52],
    [0.05, 0.59, 0.70, -0.37, 0.48, 0.63, 0.36, 0.59, 0.63, 1.00, 0.89, 0.84],
    [0.03, 0.57, 0.71, -0.39, 0.46, 0.62, 0.35, 0.58, 0.62, 0.89, 1.00, 0.85],
    [0.03, 0.52, 0.62, -0.35, 0.44, 0.58, 0.31, 0.51, 0.52, 0.84, 0.85, 1.00]
  ],

  // nom, accuracy, precision, recall, F1
  models: [
    ['Decision Tree', 0.9714, 0.5973, 0.5769, 0.5870],
    ['Random Forest', 0.9795, 0.8101, 0.5470, 0.6531],
    ['KNN', 0.9746, 0.6484, 0.6068, 0.6269],
    ['SVM', 0.9648, 0.0000, 0.0000, 0.0000],
    ['Random Forest équilibré', 0.9809, 0.7801, 0.6368, 0.7012],
    ['MLP rééquilibré', 0.9213, 0.2968, 0.9017, 0.4466]
  ],
  naive: ['Toujours « pas de crise »', 0.9648, 0.0, 0.0, 0.0],

  // nom, vrais négatifs, faux positifs, faux négatifs, vrais positifs
  confusion: [
    ['Random Forest', 6378, 30, 106, 128],
    ['Decision Tree', 6317, 91, 99, 135],
    ['KNN', 6331, 77, 92, 142],
    ['SVM', 6408, 0, 234, 0],
    ['Random Forest équilibré', 6366, 42, 85, 149],
    ['MLP rééquilibré', 5908, 500, 23, 211]
  ],

  robust: [
    ['Random Forest, séparation aléatoire', 0.9795, 0.8101, 0.5470, 0.6531],
    ['Random Forest, test par patients', 0.9743, 0.8000, 0.2939, 0.4299]
  ],
  detection: { intervalles: 57, vp: 39, fp: 18, fn: 3, precision: 0.684211, rappel: 0.928571, f1: 0.787879 }
};

Object.assign(DATA, {
  testPatients: ['190304A-E', '191113A-D', '210914B-A', '220121B-D', '230105B-H'],

  // Q1 : premières lignes de 190304A_E_0000d.csv
  head: {
    cols: ['time', 'channel_1', 'channel_2', 'channel_3', '…', 'channel_21', 'channel_22', 'channel_23'],
    rows: ['0,000000', '0,003906', '0,007812', '0,011719', '0,015625'].map(t => [t, '0,038499', '0,038499', '0,038499', '…', '0,038499', '19,67274', '1,271977'])
  },

  // Q3 : extrait affiché si le CSV d'annotations n'est pas lisible (5 premières et 5 dernières crises)
  crisesExtract: [
    ['190304A-E', 1, 1291, 1298, 7], ['191113A-D', 1, 1254, 1267, 13], ['191113A-D', 2, 1428, 1433, 5],
    ['210406A-F', 1, 633, 641, 8], ['210427B-C', 1, 1031, 1049, 18],
    ['230718A-A', 3, 302, 313, 11], ['230718A-A', 4, 430, 441, 11], ['230718A-A', 5, 737, 745, 8],
    ['230718A-A', 6, 974, 986, 12], ['230718A-A', 7, 1103, 1110, 7]
  ],

  // Q7 : premières fenêtres de 190304A_E (fenêtre, début éch., fin éch., début s, fin s, fraction de crise, classe)
  winFirst: [
    [1, 0, 512, 0.0, 1.996094, 0, 0], [2, 256, 768, 1.0, 2.996094, 0, 0], [3, 512, 1024, 2.0, 3.996094, 0, 0],
    [4, 768, 1280, 3.0, 4.996094, 0, 0], [5, 1024, 1536, 4.0, 5.996094, 0, 0]
  ],

  // Q8 : Window, Mean, Std, Variance, Min, Max, Amplitude, RMS, Energy, Class
  featFirst: [
    [1, -3.840028, 45.414005, 7420.294970, -162.682044, 122.971378, 285.653422, 48.188571, 4038866, 0],
    [2, -10.044156, 66.807073, 17373.907601, -167.537631, 135.832106, 303.369737, 76.477522, 10466270, 0],
    [3, -5.382459, 70.782379, 20345.164237, -162.022058, 141.570059, 303.592117, 82.366393, 12623620, 0],
    [4, 1.096169, 72.754141, 20368.771015, -158.182249, 154.988651, 313.170900, 80.624167, 11903290, 0],
    [5, 2.143481, 73.946677, 20329.547732, -159.017287, 177.708507, 336.725794, 79.385766, 11169850, 0]
  ],

  // Q9 : Window, Delta, Theta, Alpha, Beta, Class
  freqFirst: [
    [1, 263299.727254, 19649.712487, 32747.663468, 34462.081003, 0],
    [2, 202605.876858, 54344.535135, 77211.683450, 76332.983890, 0],
    [3, 53159.444407, 58367.106661, 85691.744120, 72785.200325, 0],
    [4, 83352.311542, 57986.669845, 119150.011719, 70694.053362, 0],
    [5, 66818.682829, 70070.662145, 138537.751973, 89463.512182, 0]
  ],

  // Q10 : caractéristique, moyenne classe 0, moyenne classe 1, rapport 1/0
  cmp: [['Energy', 4.435e8, 2.388e8, 0.54], ['Delta', 6.698e7, 1.542e7, 0.23], ['Theta', 4.856e6, 1.335e6, 0.27], ['Std', 122.3, 173, 1.41]],

  // Q12 : jeu, fenêtres, fenêtres de classe 1, % de classe 1
  split: [['Entraînement', 26564, 934, 3.516], ['Test', 6642, 234, 3.523]],
  trainTimes: [['Decision Tree', 0.7], ['Random Forest', 7.6], ['KNN', 0.2], ['SVM', 5.8]],

  // Q14 : extrait de partie_X_comparaison_intervalles.csv
  // prédit n°, patient, début prédit, fin prédite, crise, début réel, fin réelle, recouvrement (s), IoU, statut
  cmpIntervals: [
    [0, '190304A-E', 1291, 1293.996094, 1, 1291, 1298, 2.996094, 0.428013, 'vrai_positif'],
    [null, '191113A-D', null, null, 1, 1254, 1267, 0, 0, 'faux_negatif'],
    [null, '191113A-D', null, null, 2, 1428, 1433, 0, 0, 'faux_negatif'],
    [1, '210914B-A', 14, 15.996094, 1, 14, 18, 1.996094, 0.499023, 'vrai_positif'],
    [2, '210914B-A', 17, 18.996094, 1, 14, 18, 1.0, 0.200156, 'vrai_positif'],
    [3, '210914B-A', 30, 32.996094, 2, 28, 66, 2.996094, 0.078845, 'vrai_positif'],
    [4, '210914B-A', 39, 41.996094, 2, 28, 66, 2.996094, 0.078845, 'vrai_positif'],
    [5, '210914B-A', 44, 45.996094, 2, 28, 66, 1.996094, 0.052529, 'vrai_positif'],
    [6, '210914B-A', 64, 66.996094, 2, 28, 66, 2.0, 0.051287, 'vrai_positif'],
    [7, '210914B-A', 81, 82.996094, 3, 81, 87, 1.996094, 0.332682, 'vrai_positif'],
    [8, '210914B-A', 83, 84.996094, 3, 81, 87, 1.996094, 0.332682, 'vrai_positif'],
    [9, '210914B-A', 104, 105.996094, 4, 96, 107, 1.996094, 0.181463, 'vrai_positif'],
    [10, '210914B-A', 154, 156.996094, 5, 154, 160, 2.996094, 0.499349, 'vrai_positif'],
    [11, '210914B-A', 159, 160.996094, 5, 154, 160, 1.0, 0.142937, 'vrai_positif'],
    [12, '210914B-A', 169, 170.996094, 6, 168, 174, 1.996094, 0.332682, 'vrai_positif'],
    [13, '210914B-A', 172, 174.996094, 6, 168, 174, 2.0, 0.285874, 'vrai_positif'],
    [14, '210914B-A', 274, 276.996094, 7, 271, 276, 2.0, 0.33355, 'vrai_positif'],
    [15, '210914B-A', 373, 374.996094, 8, 358, 389, 1.996094, 0.06439, 'vrai_positif'],
    [16, '210914B-A', 514, 515.996094, 9, 512, 561, 1.996094, 0.040737, 'vrai_positif'],
    [17, '210914B-A', 525, 526.996094, 9, 512, 561, 1.996094, 0.040737, 'vrai_positif'],
    [18, '210914B-A', 528, 529.996094, 9, 512, 561, 1.996094, 0.040737, 'vrai_positif'],
    [19, '210914B-A', 536, 540.996094, 9, 512, 561, 4.996094, 0.101961, 'vrai_positif'],
    [20, '210914B-A', 546, 548.996094, 9, 512, 561, 2.996094, 0.061145, 'vrai_positif'],
    [21, '210914B-A', 555, 556.996094, 9, 512, 561, 1.996094, 0.040737, 'vrai_positif'],
    [22, '210914B-A', 673, 674.996094, 10, 673, 681, 1.996094, 0.249512, 'vrai_positif'],
    [23, '210914B-A', 678, 679.996094, 10, 673, 681, 1.996094, 0.249512, 'vrai_positif'],
    [26, '210914B-A', 1026, 1027.996094, 11, 1026, 1038, 1.996094, 0.166341, 'vrai_positif'],
    [27, '210914B-A', 1032, 1034.996094, 11, 1026, 1038, 2.996094, 0.249674, 'vrai_positif'],
    [24, '210914B-A', 907, 908.996094, null, null, null, 0, 0, 'faux_positif'],
    [25, '210914B-A', 916, 918.996094, null, null, null, 0, 0, 'faux_positif']
  ],

  // Partie XI : fenêtres des 5 patients de test, puis par patient (FN, FP, VN, VP)
  errWindow: { vn: 9141, fp: 23, fn: 221, vp: 92, precision: 0.800, recall: 0.294, f1: 0.430 },
  errPatient: [
    ['190304A-E', 6, 0, 1566, 2], ['191113A-D', 20, 0, 1789, 0], ['210914B-A', 151, 3, 1014, 36],
    ['220121B-D', 15, 14, 1224, 38], ['230105B-H', 29, 6, 3548, 16]
  ],

  // Intervalles prédits connus d'après les sorties du notebook (le CSV complet les remplace)
  pred: {
    '190304A-E': [[1291, 1293.996094]],
    '191113A-D': [],
    '210914B-A': [[14, 15.996094], [17, 18.996094], [30, 32.996094], [39, 41.996094], [44, 45.996094], [64, 66.996094],
      [81, 82.996094], [83, 84.996094], [104, 105.996094], [154, 156.996094], [159, 160.996094], [169, 170.996094],
      [172, 174.996094], [274, 276.996094], [373, 374.996094], [514, 515.996094], [525, 526.996094], [528, 529.996094],
      [536, 540.996094], [546, 548.996094], [555, 556.996094], [673, 674.996094], [678, 679.996094], [907, 908.996094],
      [916, 918.996094], [1026, 1027.996094], [1032, 1034.996094]]
  }
});
DATA.crises['210914B-A'] = [[14, 18], [28, 66], [81, 87], [96, 107], [154, 160], [168, 174], [271, 276], [358, 389], [512, 561], [673, 681], [1026, 1038]];


/* =====================================================================
   Utilitaires
   ===================================================================== */
const $ = (sel, el = document) => el.querySelector(sel);
const NS = 'http://www.w3.org/2000/svg';
const NBSP = '\u202f';

function fr(n, d = 0) {
  return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function mmss(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return m + ' min ' + String(s).padStart(2, '0') + ' s';
}
function el(tag, attrs = {}, html) {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  return e;
}

const rec = DATA.recordings;
const withCrises = rec.filter(r => r.crises > 0).length;
const withoutCrises = rec.length - withCrises;
const meanDur = rec.reduce((s, r) => s + r.dur, 0) / rec.length;

/* =====================================================================
   Cartes de chiffres clés
   ===================================================================== */
function renderStats() {
  const icons = {
    folder: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3.5 8.5a2.5 2.5 0 0 1 2.5-2.5h6.5l3 3.5H26a2.5 2.5 0 0 1 2.5 2.5v12.5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>',
    file: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.5h11l6 6V26a2.5 2.5 0 0 1-2.5 2.5h-14.5A2.5 2.5 0 0 1 5.5 26V6A2.5 2.5 0 0 1 8 3.5Z"/><path d="M19 3.5v6h6M10.5 15h11M10.5 19.5h11M10.5 24h6"/></svg>',
    wave: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 16h6l3.5-9 6 18 3.5-9h8"/></svg>',
    alert: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3.5 29.5 27h-27Z"/><path d="M16 12.5v7M16 23.2v.1"/></svg>'
  };
  const cards = [
    { cls: 'stat-blue', icon: icons.folder, num: rec.length, label: 'Enregistrements EEG', sub: 'Fichiers .mat analysés' },
    { cls: 'stat-amber', icon: icons.file, num: DATA.fichiers.mat, label: 'Fichiers traités',
      sub: '_h (en-têtes) et _d (données)' },
    { cls: 'stat-purple', icon: icons.wave, num: 21, label: 'Canaux typiques',
      sub: 'channel_1 à channel_21' },
    { cls: 'stat-red', icon: icons.alert, num: DATA.annotations.valides, label: 'Crises annotées',
      sub: 'Annotations valides du jeu de données' }
  ];
  $('#stats').innerHTML = cards.map(c => `
    <div class="stat ${c.cls}">
      <div class="stat-icon">${c.icon}</div>
      <div>
        <div class="stat-num">${c.num}</div>
        <div class="stat-label">${c.label}</div>
        <div class="stat-sub">${c.sub}</div>
      </div>
    </div>`).join('');
}

function renderSummary() {
  const rows = [
    ['Nombre d\'enregistrements', rec.length],
    ['Durée moyenne', '~ ' + Math.round(meanDur / 60) + ' minutes'],
    ['Fréquence d\'échantillonnage', DATA.fs + ' Hz'],
    ['Nombre de canaux', '21 (typique)'],
    ['Nombre de crises annotées', DATA.annotations.valides],
    ['Durée moyenne des crises', '~ ' + Math.round(DATA.crisesStats.moyenne) + ' secondes'],
    ['Format des fichiers', '.mat → .csv'],
    ['Annotations', 'Fichier Excel']
  ];
  $('#summary').innerHTML = rows.map(r =>
    `<div class="summary-row"><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('');
}

function renderPie() {
  const svg = $('#pie');
  const cx = 120, cy = 120, R = 112;
  const parts = [
    { n: withCrises, color: '#0e7a5f', txt: '#fff', label: 'Avec crises' },
    { n: withoutCrises, color: '#8fd9c0', txt: '#0a4a3a', label: 'Sans crises' }
  ];
  const total = rec.length;
  let a0 = -Math.PI / 2;
  parts.forEach(p => {
    const frac = p.n / total, a1 = a0 + frac * 2 * Math.PI;
    const large = frac > .5 ? 1 : 0;
    const pt = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
    svg.appendChild(svgEl('path', {
      d: `M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`,
      fill: p.color
    }));
    const [tx, ty] = pt((a0 + a1) / 2, R * (frac > .5 ? .55 : .66));
    svg.appendChild(svgEl('text', {
      x: tx.toFixed(1), y: ty.toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'central',
      fill: p.txt, 'font-size': '21', 'font-weight': '700', 'font-family': 'inherit'
    }, Math.round(frac * 100) + NBSP + '%'));
    a0 = a1;
  });
  $('#pieLegend').innerHTML = parts.map(p => `
    <li><span class="pie-dot" style="background:${p.color}"></span>
      <div><b>${p.label}</b><span class="sub">(${p.n} enregistrements)</span></div></li>`).join('');
}

/* =====================================================================
   Tracés EEG (canvas) — signal illustratif
   ===================================================================== */
function hash32(n) {
  n = Math.imul(n ^ (n >>> 15), n | 1);
  n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
  return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
}
function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function sampleSignal(seed, ch, t, i, crises) {
  const ph = hash32(seed + ch * 101) * 6.283;
  const env = 0.55 + 0.25 * Math.sin(6.283 * t / 37 + ph);
  const noise = hash32(seed * 31 + ch * 7919 + i * 977) * 2 - 1;
  let v = env * (0.55 * Math.sin(6.283 * 10.2 * t + ph) +
                 0.35 * Math.sin(6.283 * 6.1 * t + ph * 2) +
                 0.25 * Math.sin(6.283 * 17.5 * t + ph * 3)) + 0.5 * noise;
  let e = 0;
  for (const c of crises) {
    const a = c[0] - 0.4, b = c[1] + 0.4;
    if (t >= a && t <= b) e = Math.max(e, Math.min(1, (t - a) / 0.4, (b - t) / 0.4));
  }
  if (e > 0) {
    const s = Math.sin(6.283 * 3 * t + ph * 0.3);
    v += e * (1.9 * Math.sign(s) * Math.pow(Math.abs(s), 0.7) + 0.6 * Math.sin(6.283 * 6 * t + ph) + 0.4 * noise);
  }
  return v;
}

/* Activité globale : RMS de tous les canaux, chacun normalisé par son bruit habituel (1 ~ niveau normal). */
function sqOf(sig) {
  if (!sig.sq) {
    const sq = new Float32Array(sig.n);
    let nc = 0;
    sig.all.forEach(C => {
      if (!(C.sd > 0)) return;
      nc++;
      const d = C.data, m = C.med, k = 1 / C.sc;
      for (let i = 0; i < sig.n; i++) {
        let v = (d[i] - m) * k;
        if (v > 8) v = 8; else if (v < -8) v = -8;
        if (v === v) sq[i] += v * v;
      }
    });
    for (let i = 0; i < sig.n; i++) sq[i] /= Math.max(1, nc);
    sig.sq = sq;
  }
  return sig.sq;
}

function drawEEG(cv, o) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);

  const p = o.pad;
  const x0 = p.l, x1 = w - p.r, y0 = p.t, y1 = h - p.b;
  const rows = o.channels, rh = (y1 - y0) / rows;
  const sx = t => x0 + (t - o.t0) / o.win * (x1 - x0);
  const font = '12px Inter, system-ui, "Segoe UI", sans-serif';

  // bandes de crise
  g.fillStyle = 'rgba(249,168,168,.45)';
  o.crises.forEach(c => {
    const a = Math.max(x0, sx(c[0])), b = Math.min(x1, sx(c[1]));
    if (b > a - 0.01) g.fillRect(a, y0, Math.max(2, b - a), y1 - y0);
  });

  // repère « Crise EEG »
  if (o.bracket && o.crises.length) {
    const c = o.crises[0];
    const a = Math.max(x0, sx(c[0])), b = Math.min(x1, sx(c[1]));
    g.strokeStyle = '#d92d2d'; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(a, y0 - 2); g.lineTo(a, y0 - 12); g.lineTo(b, y0 - 12); g.lineTo(b, y0 - 2); g.stroke();
    g.fillStyle = '#c81e1e'; g.font = '600 14px Inter, system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'bottom';
    g.fillText('Crise EEG', (a + b) / 2, y0 - 18);
  }

  // canaux
  g.lineWidth = 1; g.strokeStyle = '#0a6b52'; g.lineJoin = 'round';
  if (o.real && o.global) {
    // un seul tracé pour tout l'enregistrement
    const R = o.real;
    const i0 = 0, i1 = R.n - 1, span = R.n;
    const pxW = Math.max(1, Math.floor(x1 - x0));
    const H = y1 - y0;
    g.font = font; g.textBaseline = 'middle'; g.textAlign = 'right';
    if (o.gchan === 'rms') {
      const sq = sqOf(R.sig);
      const vals = new Float32Array(pxW);
      let vmax = 0;
      for (let px = 0; px < pxW; px++) {
        const a = Math.floor(px / pxW * span), b = Math.max(a + 1, Math.floor((px + 1) / pxW * span));
        let sum = 0, cnt = 0;
        for (let i = a; i < b && i <= i1; i++) { sum += sq[i]; cnt++; }
        const v = Math.sqrt(sum / Math.max(1, cnt));
        vals[px] = v; if (v > vmax) vmax = v;
      }
      const top = Math.max(1.5, vmax * 1.08);
      const step = [0.5, 1, 2, 5, 10, 20, 50].find(s => top / s <= 6) || 50;
      for (let v = 0; v <= top; v += step) {
        const y = y1 - v / top * H;
        g.strokeStyle = '#e2ece7'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
        g.fillStyle = '#46635a'; g.fillText(String(v), x0 - 8, y);
      }
      g.beginPath(); g.moveTo(x0, y1);
      for (let px = 0; px < pxW; px++) g.lineTo(x0 + px + 0.5, y1 - vals[px] / top * H);
      g.lineTo(x0 + pxW, y1); g.closePath();
      g.fillStyle = 'rgba(12,130,100,.22)'; g.fill();
      g.beginPath();
      for (let px = 0; px < pxW; px++) {
        const x = x0 + px + 0.5, y = y1 - vals[px] / top * H;
        if (px === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    } else {
      const C = R.sig.all[o.gchan], mid = (y0 + y1) / 2, amp = H / 2 / 5.5;
      g.strokeStyle = '#e2ece7'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x0, mid); g.lineTo(x1, mid); g.stroke();
      g.strokeStyle = '#0a6b52';
      g.beginPath();
      for (let px = 0; px < pxW; px++) {
        const a = Math.floor(px / pxW * span), b = Math.max(a + 1, Math.floor((px + 1) / pxW * span));
        let lo = Infinity, hi = -Infinity;
        for (let i = a; i < b && i <= i1; i++) { const v = C.data[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
        if (lo === Infinity) continue;
        const nv = v => { v = (v - C.med) / C.sc; return v > 5 ? 5 : (v < -5 ? -5 : v); };
        const x = x0 + px + 0.5;
        g.moveTo(x, mid - nv(hi) * amp); g.lineTo(x, mid - nv(lo) * amp + 0.8);
      }
      g.stroke();
      g.fillStyle = '#46635a'; g.fillText(C.label, x0 - 8, mid);
    }
  } else if (o.real) {
    const R = o.real;
    const i0 = Math.max(0, Math.floor(o.t0 * R.fs)), i1 = Math.min(R.n - 1, Math.ceil((o.t0 + o.win) * R.fs));
    for (let ch = 0; ch < rows && ch < R.ch.length; ch++) {
      const C = R.ch[ch], mid = y0 + rh * (ch + 0.5), amp = rh * 0.1;
      const norm = v => { v = (v - C.med) / C.sc; return v > 5 ? 5 : (v < -5 ? -5 : v); };
      g.beginPath();
      for (let i = i0; i <= i1; i++) {
        const x = sx(i / R.fs), y = mid - norm(C.data[i]) * amp;
        if (i === i0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
      if (o.labels) {
        g.fillStyle = '#46635a'; g.font = font; g.textAlign = 'right'; g.textBaseline = 'middle';
        g.fillText(C.label, x0 - 8, mid);
      }
    }
  }
  const nPts = Math.max(60, Math.floor((x1 - x0) * 1.6));
  for (let ch = 0; !o.real && ch < rows; ch++) {
    const mid = y0 + rh * (ch + 0.5), amp = rh * 0.17;
    g.beginPath();
    for (let k = 0; k <= nPts; k++) {
      const t = o.t0 + o.win * k / nPts;
      const v = sampleSignal(o.seed, ch, t, k, o.crises);
      const x = x0 + (x1 - x0) * k / nPts, y = mid - v * amp;
      if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
    if (o.labels) {
      g.fillStyle = '#46635a'; g.font = font; g.textAlign = 'right'; g.textBaseline = 'middle';
      g.fillText('ch' + (ch + 1), x0 - 8, mid);
    }
  }

  // axe du temps
  if (o.axis) {
    g.strokeStyle = '#5f7b71'; g.lineWidth = 1; g.fillStyle = '#46635a';
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'top';
    g.beginPath(); g.moveTo(x0, y1 + 3); g.lineTo(x1, y1 + 3); g.stroke();
    const step = [10, 20, 30, 60, 120, 300, 600].find(s => o.win / s <= 12) || 600;
    for (let k = 0; k <= o.win; k += step) {
      const x = x0 + (x1 - x0) * k / o.win;
      g.beginPath(); g.moveTo(x, y1 + 3); g.lineTo(x, y1 + 8); g.stroke();
      g.fillText(String(Math.round(o.t0 + k)), x, y1 + 11);
    }
    g.fillText('Temps (secondes)', (x0 + x1) / 2, y1 + 29);
  }
}

/* =====================================================================
   Aperçu interactif
   ===================================================================== */
const heroCv = $('#heroCanvas');
const prevCv = $('#previewCanvas');
const select = $('#patientSelect');
const winRange = $('#winRange');
let currentId = rec[0].id;

function crisesOf(id) { return DATA.crises[id] || []; }

/* Signaux réels chargés depuis les CSV du patient (lecture locale, rien n'est envoyé). */
const csvFiles = new Map();   // id -> File
const signals = new Map();    // id -> signal décodé
const WIN = 60;
let t0Override = null;

function idFromFilename(name) {
  const m = /^(\d{6}[A-Za-z])_([A-Za-z])_/.exec(name);
  return m ? (m[1] + '-' + m[2]).toUpperCase() : null;
}

/* Dossier des CSV, relatif à la page (site/index.html -> ../data/csv/). */
const CSV_DIR = '../data/csv/';
const pending = new Map();    // id -> promesse de chargement en cours
const failed = new Set();     // ids dont le chargement automatique a échoué

async function parseStream(stream, name) {
  const STEP = 4;                                   // 256 Hz -> 64 Hz
  const reader = stream.getReader(), dec = new TextDecoder();
  let rest = '', header = null, nch = 0, chans = null, row = 0, ta = 0, tb = 0;

  const handle = line => {
    if (header === null) {
      header = line;
      nch = line.split(',').length - 1;
      chans = Array.from({ length: nch }, () => []);
      return;
    }
    if (!line.trim()) return;
    if (row % STEP === 0 || row === 1) {
      const p = line.split(',');
      if (row === 0) ta = parseFloat(p[0]);
      if (row === 1) tb = parseFloat(p[0]);
      if (row % STEP === 0) for (let c = 0; c < nch; c++) chans[c].push(parseFloat(p[c + 1]));
    }
    row++;
  };

  for (;;) {
    const { done, value } = await reader.read();
    rest += done ? dec.decode() : dec.decode(value, { stream: true });
    let pos = 0;
    for (;;) {
      const nl = rest.indexOf('\n', pos);
      if (nl === -1) break;
      handle(rest.slice(pos, nl));
      pos = nl + 1;
    }
    rest = rest.slice(pos);
    if (done) { if (rest.trim()) handle(rest); break; }
  }
  if (!chans || !chans[0].length) throw new Error('CSV vide');

  const fs = (tb - ta) > 0 ? Math.round(1 / (tb - ta)) : DATA.fs;
  const all = [];
  for (let c = 0; c < nch; c++) {
    const data = Float32Array.from(chans[c]);
    let s = 0, s2 = 0, n = 0;
    for (let i = 0; i < data.length; i++) { const v = data[i]; if (v === v) { s += v; s2 += v * v; n++; } }
    const m = s / n, sd = Math.sqrt(Math.max(0, s2 / n - m * m));
    const sorted = Float32Array.from(data).sort();
    const med = sorted[sorted.length >> 1];
    const dev = data.map(v => Math.abs(v - med)).sort();
    const sc = (dev[dev.length >> 1] * 1.4826) || sd || 1;
    all.push({ label: 'ch' + (c + 1), data, med, sc, sd });
    await new Promise(r => setTimeout(r));
  }
  const top = all.map((x, i) => i).filter(i => all[i].sd > 0)
    .sort((a, b) => all[b].sd - all[a].sd).slice(0, 8).sort((a, b) => a - b);
  return { fs: fs / STEP, n: chans[0].length, all, top, file: name, total: nch };
}

function setStatus(msg) { $('#csvStatus').textContent = msg; }

/* Charge le signal d'un patient : fichier choisi à la main, sinon ../data/csv/ (Live Server). */
function ensureSignal(id) {
  if (signals.has(id)) return Promise.resolve();
  if (pending.has(id)) return pending.get(id);
  const p = (async () => {
    await Promise.resolve();            // laisse pending.set s'exécuter avant la fin éventuelle
    try {
      let stream, name;
      if (csvFiles.has(id)) {
        const f = csvFiles.get(id);
        stream = f.stream(); name = f.name;
      } else if (location.protocol === 'file:') {
        setStatus('Page ouverte en file:// : utilisez Live Server ou le bouton ci-dessus.');
        return;
      } else if (failed.has(id)) {
        return;
      } else {
        name = id.replace('-', '_') + '_0000d.csv';
        setStatus('Chargement de ' + name + '…');
        const r = await fetch(CSV_DIR + name);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        stream = r.body || new Response(await r.text()).body;
      }
      setStatus('Lecture de ' + name + '…');
      signals.set(id, await parseStream(stream, name));
      setStatus('Signal de ' + id + ' chargé');
    } catch (err) {
      failed.add(id);
      setStatus('CSV introuvable pour ' + id + ' : chargez-le avec le bouton ci-dessus.');
    } finally {
      pending.delete(id);
    }
  })();
  pending.set(id, p);
  return p;
}

function dataDur(id) {
  const s = signals.get(id);
  return s ? s.n / s.fs : rec.find(x => x.id === id).dur;
}

function autoT0(id) {
  const list = crisesOf(id).slice().sort((a, b) => a[0] - b[0]);
  return list.length ? Math.floor(list[0][0]) - 34 : 0;
}

let viewCh = 'all';        // 'top' = 8 canaux les plus actifs, 'all' = tous
let viewScope = 'window';  // 'window' = 60 s, 'global' = enregistrement entier
let globalChan = 'rms';    // trace global : 'rms' (tous les canaux) ou index d'un canal
let criseIdx = -1;         // crise courante pour « Voir crise »

function syncSeg() {
  document.querySelectorAll('.seg-btn').forEach(b => {
    const on = b.dataset.ch ? b.dataset.ch === viewCh : b.dataset.view === viewScope;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function drawPreview() {
  const id = currentId;
  const r = rec.find(x => x.id === id);
  const sig = signals.get(id) || null;
  const isGlobal = viewScope === 'global' && !!sig;
  const dur = dataDur(id), maxT = Math.max(0, Math.floor(dur - WIN));
  let t0 = t0Override !== null ? t0Override : autoT0(id);
  t0 = Math.max(0, Math.min(maxT, t0));
  const win = isGlobal ? dur : WIN, tt0 = isGlobal ? 0 : t0;
  const list = crisesOf(id).filter(c => c[1] > tt0 && c[0] < tt0 + win);
  const chans = sig ? (viewCh === 'all' ? sig.all : sig.top.map(i => sig.all[i])) : null;
  const rows = isGlobal ? 1 : (chans ? chans.length : (viewCh === 'all' ? r.ch : 8));

  // sélecteur du trace global
  const gs = $('#globalSel');
  if (sig && gs.dataset.for !== id) {
    gs.innerHTML = '<option value="rms">Tous les canaux (activité RMS)</option>' +
      sig.all.map((c, i) => `<option value="${i}">${c.label}</option>`).join('');
    gs.dataset.for = id;
  }
  if (sig && globalChan !== 'rms' && globalChan >= sig.all.length) globalChan = 'rms';
  gs.value = String(globalChan);
  $('#globalSelWrap').hidden = !isGlobal;
  $('#segCh').hidden = isGlobal;

  const wide = viewCh === 'all' || isGlobal;
  $('#apercu').classList.toggle('is-wide', wide);
  document.querySelector('.panels').classList.toggle('has-wide', wide);
  prevCv.style.height = (isGlobal ? 320 : (rows <= 8 ? 252 : Math.max(300, rows * 26 + 64))) + 'px';
  prevCv.style.cursor = isGlobal ? 'zoom-in' : 'default';
  drawEEG(prevCv, {
    seed: seedOf(id), t0: tt0, win, channels: rows, crises: list, global: isGlobal, gchan: globalChan,
    real: sig ? { fs: sig.fs, n: sig.n, ch: chans, sig } : null,
    pad: { l: 40, r: 24, t: 10, b: 50 }, labels: true, axis: true, bracket: false
  });
  winRange.max = maxT; winRange.value = t0;
  $('#winNav').hidden = isGlobal;

  // navigation entre les crises
  const all = crisesOf(id).slice().sort((a, b) => a[0] - b[0]);
  $('#criGo').disabled = $('#criPrev').disabled = $('#criNext').disabled = !all.length;
  $('#criLabel').textContent = !all.length
    ? (r.crises === 0 ? 'Aucune crise annotée' : 'Instants des crises non chargés')
    : (criseIdx < 0 ? all.length + ' crise(s) connue(s)'
       : 'Crise ' + (criseIdx + 1) + ' / ' + all.length + ' · ' + fr(all[criseIdx][0]) + ' s à ' + fr(all[criseIdx][1]) + ' s');

  const known = crisesOf(id).length;
  let msg;
  if (sig) {
    msg = 'Signal réel (' + sig.file + ') : ' +
      (isGlobal ? sig.total + ' canaux dans le fichier' : (viewCh === 'all' ? 'tous les canaux (' + sig.all.length + ')' : rows + ' canaux les plus actifs sur ' + sig.total)) +
      ', ramené à ' + fr(sig.fs) + ' Hz.';
    if (isGlobal) msg += ' Trace global : un seul tracé sur ' + mmss(dur) + (globalChan === 'rms' ? ', activité RMS de tous les canaux (1 ≈ niveau habituel).' : ', enveloppe min/max du canal choisi.') + ' Cliquez sur le tracé pour zoomer, ou utilisez « Voir crise ».';
  } else if (pending.has(id)) {
    msg = 'Chargement du signal réel de ' + id + '…';
  } else if (viewScope === 'global') {
    msg = 'Trace global indisponible : CSV introuvable. Ouvrez le site avec Live Server (dossier data/csv à la racine du projet) ou chargez le CSV avec le bouton ci-dessus.';
  } else {
    msg = 'Tracé illustratif : signal réel indisponible. Placez les CSV dans data/csv ou chargez-les avec le bouton ci-dessus.';
  }
  if (r.crises === 0) msg += ' Aucune crise annotée.';
  else if (!known) msg += ' Instants des crises non chargés (voir À propos).';
  else msg += ' Crises surlignées : ' + known + ' sur ' + r.crises + '.';
  $('#previewNote').textContent = msg;
}

function drawHero() {
  drawEEG(heroCv, {
    seed: 4242, t0: 0, win: 60, channels: 8, crises: [[17, 33]],
    pad: { l: 40, r: 6, t: 44, b: 10 }, labels: true, axis: false, bracket: true
  });
}

function goCrise(i) {
  const list = crisesOf(currentId).slice().sort((a, b) => a[0] - b[0]);
  if (!list.length) return;
  criseIdx = ((i % list.length) + list.length) % list.length;
  const c = list[criseIdx];
  viewScope = 'window'; syncSeg();
  t0Override = Math.round((c[0] + c[1]) / 2 - WIN / 2);
  drawPreview();
}

async function selectPatient(id, scroll) {
  currentId = id;
  t0Override = null;
  criseIdx = -1;
  select.value = id;
  drawPreview();
  if (scroll) $('#apercu').scrollIntoView({ behavior: 'smooth', block: 'center' });
  const p = ensureSignal(id);
  drawPreview();                       // met à jour le message « chargement »
  await p;
  if (currentId === id) drawPreview();
}

function initPreview() {
  select.innerHTML = rec.map(r => `<option value="${r.id}">${r.id}</option>`).join('');
  select.addEventListener('change', () => selectPatient(select.value, false));
  winRange.addEventListener('input', () => { t0Override = parseInt(winRange.value, 10); drawPreview(); });
  const shift = d => { t0Override = Math.max(0, Math.min(parseInt(winRange.max, 10), parseInt(winRange.value, 10) + d)); drawPreview(); };
  document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.ch) viewCh = b.dataset.ch;
    if (b.dataset.view) viewScope = b.dataset.view;
    syncSeg(); drawPreview();
  }));
  prevCv.addEventListener('click', e => {
    if (!(viewScope === 'global' && signals.has(currentId))) return;
    const rect = prevCv.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (e.clientX - rect.left - 40) / (rect.width - 40 - 24)));
    t0Override = Math.round(f * dataDur(currentId) - WIN / 2);
    viewScope = 'window'; syncSeg(); drawPreview();
  });
  $('#criGo').addEventListener('click', () => goCrise(criseIdx < 0 ? 0 : criseIdx));
  $('#criPrev').addEventListener('click', () => goCrise(criseIdx < 0 ? 0 : criseIdx - 1));
  $('#criNext').addEventListener('click', () => goCrise(criseIdx + 1));
  $('#globalSel').addEventListener('change', e => { globalChan = e.target.value === 'rms' ? 'rms' : parseInt(e.target.value, 10); drawPreview(); });
  $('#winPrev').addEventListener('click', () => shift(-30));
  $('#winNext').addEventListener('click', () => shift(30));
  $('#csvInput').addEventListener('change', async e => {
    let n = 0;
    Array.from(e.target.files).forEach(f => {
      const id = idFromFilename(f.name);
      if (id && rec.some(r => r.id === id)) { csvFiles.set(id, f); signals.delete(id); failed.delete(id); n++; }
    });
    setStatus(n ? n + ' fichier(s) CSV reconnu(s)' : 'Aucun nom de fichier reconnu (attendu : 190304A_E_0000d.csv)');
    await ensureSignal(currentId);
    drawPreview();
  });
  drawHero(); drawPreview();
  ensureSignal(currentId).then(drawPreview);
  if ('ResizeObserver' in window) {
    new ResizeObserver(drawHero).observe(heroCv);
    new ResizeObserver(drawPreview).observe(prevCv);
  } else {
    window.addEventListener('resize', () => { drawHero(); drawPreview(); });
  }
}

/* Lecture des CSV du notebook (nécessite un serveur, par exemple Live Server). */
function fetchFirst(paths) {
  return paths.reduce((p, u) => p.catch(() => fetch(u).then(r => r.ok ? r.text() : Promise.reject())), Promise.reject());
}

function loadCrisesCsv() {
  if (!window.fetch || location.protocol === 'file:') return;
  fetchFirst(['../output/annotations_with_signals.csv', 'data/annotations_with_signals.csv']).then(txt => {
    const lines = txt.trim().split(/\r?\n/);
    const head = lines.shift().split(',').map(s => s.trim());
    const ix = k => head.indexOf(k);
    const iP = ix('patient_id'), iC = ix('crise'), iS = ix('start_seconds'), iE = ix('end_seconds'), iD = ix('duration_seconds'), iV = ix('validation_message');
    if (iP < 0 || iS < 0 || iE < 0) return;
    const out = {}, rows = [];
    lines.forEach(l => {
      const c = l.split(',');
      if (iV >= 0 && c[iV].trim() !== 'ok') return;
      const id = c[iP].trim().replace('_', '-');
      const s = parseFloat(c[iS]), e = parseFloat(c[iE]);
      (out[id] = out[id] || []).push([s, e]);
      rows.push([id, iC >= 0 ? parseInt(c[iC], 10) : out[id].length, s, e, iD >= 0 ? parseFloat(c[iD]) : e - s]);
    });
    if (Object.keys(out).length) { DATA.crises = out; DATA.crisesRows = rows; refreshCrisesViews(); }
  }).catch(() => {});
}

function loadPredCsv() {
  if (!window.fetch || location.protocol === 'file:') return;
  fetchFirst(['../output/partie_X_crises_detectees.csv', 'data/partie_X_crises_detectees.csv']).then(txt => {
    const lines = txt.trim().split(/\r?\n/);
    const head = lines.shift().split(',').map(s => s.trim());
    const iP = head.indexOf('patient_id'), iS = head.indexOf('pred_start'), iE = head.indexOf('pred_end');
    if (iP < 0 || iS < 0 || iE < 0) return;
    const out = {};
    DATA.testPatients.forEach(id => { out[id] = []; });
    lines.forEach(l => {
      const c = l.split(',');
      const id = c[iP].trim().replace('_', '-');
      (out[id] = out[id] || []).push([parseFloat(c[iS]), parseFloat(c[iE])]);
    });
    DATA.pred = out;
    drawTemporal();
  }).catch(() => {});
}

/* =====================================================================
   Aides pour les tableaux et les graphiques
   ===================================================================== */
function sci(v) {
  const p = Number(v).toExponential(3).split('e');
  return fr(parseFloat(p[0]), 3) + ' × 10<sup>' + parseInt(p[1], 10) + '</sup>';
}

function fillTable(sel, heads, rows) {
  $(sel + ' thead').innerHTML = '<tr>' + heads.map(h => `<th scope="col">${h}</th>`).join('') + '</tr>';
  $(sel + ' tbody').innerHTML = rows.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('');
}

/* =====================================================================
   Partie I — Données (Q1, Q2)
   ===================================================================== */
function renderTable() {
  const cols = [
    { k: 'id', t: 'Fichier', v: r => r.id, f: (v, r) => v.replace('-', '_') + '_0000d.csv' },
    { k: 'n', t: 'Lignes', v: r => r.n, f: v => fr(v) },
    { k: 'vars', t: 'Variables', v: r => r.ch + 1, f: v => v },
    { k: 'ch', t: 'Canaux', v: r => r.ch, f: v => v },
    { k: 'fs', t: 'Fréquence', v: r => DATA.fs, f: v => v + ' Hz' },
    { k: 'dur', t: 'Durée', v: r => r.dur, f: v => mmss(v) + ' (' + fr(v) + ' s)' },
    { k: 'na', t: 'Valeurs manquantes', v: r => 0, f: v => v }
  ];
  const state = { k: 'id', dir: 'asc' };
  const thead = $('#recTable thead'), tbody = $('#recTable tbody');

  function draw() {
    const col = cols.find(c => c.k === state.k);
    const sorted = rec.slice().sort((a, b) => {
      const x = col.v(a), y = col.v(b);
      const d = typeof x === 'string' ? x.localeCompare(y) : x - y;
      return state.dir === 'asc' ? d : -d;
    });
    thead.innerHTML = '<tr>' + cols.map(c =>
      `<th scope="col" aria-sort="${state.k === c.k ? (state.dir === 'asc' ? 'ascending' : 'descending') : 'none'}">
        <button class="th-btn" type="button" data-k="${c.k}" data-dir="${state.k === c.k ? state.dir : ''}">${c.t}</button></th>`).join('') + '</tr>';
    tbody.innerHTML = sorted.map(r => `
      <tr class="is-link" tabindex="0" data-id="${r.id}">
        ${cols.map(c => `<td>${c.f(c.v(r), r)}</td>`).join('')}
      </tr>`).join('');
  }

  thead.addEventListener('click', e => {
    const b = e.target.closest('.th-btn');
    if (!b) return;
    const k = b.dataset.k;
    state.dir = (state.k === k && state.dir === 'asc') ? 'desc' : 'asc';
    state.k = k;
    draw();
  });
  tbody.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]');
    if (tr) selectPatient(tr.dataset.id, true);
  });
  tbody.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const tr = e.target.closest('tr[data-id]');
    if (tr) { e.preventDefault(); selectPatient(tr.dataset.id, true); }
  });
  draw();

  const H = DATA.head;
  fillTable('#headTable', H.cols, H.rows);
}

/* Histogrammes groupés en SVG */
function groupedBars(target, o) {
  const n = o.labels.length, k = o.series.length;
  const W = Math.max(o.minW || 640, n * (o.slot || 44) + 70), H = o.height || 320;
  const m = { l: 48, r: 10, t: 14, b: o.bottom || 74 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const max = o.max;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', role: 'img', 'aria-label': o.aria });
  svg.style.minWidth = W + 'px';
  svg.setAttribute('font-family', 'Inter, system-ui, sans-serif');

  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const v = max * i / ticks, y = m.t + ih - ih * i / ticks;
    svg.appendChild(svgEl('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, stroke: i === 0 ? '#9db5ab' : '#e2ece7' }));
    svg.appendChild(svgEl('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5f7b71' }, o.fmt(v)));
  }
  const slotW = iw / n, gap = Math.min(10, slotW * .22);
  const bw = (slotW - gap * 2) / k;
  o.labels.forEach((lab, i) => {
    const gx = m.l + slotW * i + gap;
    o.series.forEach((s, j) => {
      const v = s.values[i], bh = ih * Math.min(v, max) / max;
      const bar = svgEl('rect', { x: gx + bw * j, y: m.t + ih - bh, width: Math.max(2, bw - 1.5), height: bh, rx: 2, fill: s.color });
      bar.appendChild(svgEl('title', {}, `${lab} · ${s.name} : ${o.fmt(v, true)}`));
      svg.appendChild(bar);
    });
    const lx = m.l + slotW * (i + .5), ly = m.t + ih + 14;
    svg.appendChild(svgEl('text', {
      x: lx, y: ly, 'font-size': 11, fill: '#2b4a40', 'text-anchor': o.rotate === false ? 'middle' : 'end',
      transform: o.rotate === false ? '' : `rotate(-40 ${lx} ${ly})`
    }, lab));
  });
  target.innerHTML = '';
  target.appendChild(svg);
}

function legend(target, series) {
  target.innerHTML = series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('');
}

function renderRms() {
  const series = [
    { name: 'Pendant la crise', color: '#d92d2d', values: DATA.rms.map(r => r[1]) },
    { name: 'Hors crise', color: '#0e7a5f', values: DATA.rms.map(r => r[2]) }
  ];
  legend($('#rmsLegend'), series);
  groupedBars($('#rmsChart'), {
    labels: DATA.rms.map(r => r[0]), series, max: 1000, height: 330,
    fmt: v => fr(v, 0), aria: 'Amplitude RMS pendant la crise et hors crise pour chaque patient'
  });
}

/* =====================================================================
   Partie II — Annotations (Q3, Q4)
   ===================================================================== */
function renderQ3() {
  const full = DATA.crisesRows && DATA.crisesRows.length;
  const rows = full ? DATA.crisesRows : DATA.crisesExtract;
  fillTable('#q3Table', ['Patient', 'Crise', 'Début (s)', 'Fin (s)', 'Durée (s)'],
    rows.map(r => [r[0], r[1], fr(r[2]), fr(r[3]), fr(r[4])]));
  $('#q3Count').textContent = full ? '(' + rows.length + ' crises)' : '(extrait : 10 sur 82)';
  $('#q3Note').textContent = full
    ? 'Nombre total de crises valides : ' + rows.length + '.'
    : 'Extrait des sorties du notebook (5 premières et 5 dernières lignes). Avec Live Server, le site lit ../output/annotations_with_signals.csv et affiche les 82 lignes.';
}

function renderAnnotations() {
  const ok = '<span class="check-ic check-ok" aria-hidden="true">✓</span>';
  const warn = '<span class="check-ic check-warn" aria-hidden="true">!</span>';
  $('#checks').innerHTML = [
    [ok, `<b>${DATA.annotations.valides} crises valides</b> sur ${DATA.annotations.lues} annotations lues.`],
    [warn, '<b>1 annotation exclue</b> : 210504B-C, crise 1, de 12:50:58 à 18:51:06. Durée aberrante (21 608 s, au-delà du seuil de 300 s).'],
    [warn, '<b>Écart avec l\'Excel</b> : 210914B-A déclare 6 crises, 11 sont retenues ; 210504B-C déclare 12 crises, 11 sont retenues.'],
    [warn, '<b>Doublons</b> : 230406B-A et 230515B-G figurent deux fois dans le classeur. Une seule ligne est conservée (la dernière).']
  ].map(c => `<li>${c[0]}<div>${c[1]}</div></li>`).join('');

  const series = [
    { name: 'Déclarées dans l\'Excel', color: '#8fd9c0', values: DATA.crisesParPatient.map(r => r[1]) },
    { name: 'Valides retenues', color: '#0e7a5f', values: DATA.crisesParPatient.map(r => r[2]) }
  ];
  legend($('#crisesLegend'), series);
  groupedBars($('#crisesChart'), {
    labels: DATA.crisesParPatient.map(r => r[0]), series, max: 12, height: 300,
    fmt: v => fr(v, 0), aria: 'Nombre de crises déclarées et retenues pour chaque patient'
  });
}

function renderKpis() {
  const s = DATA.crisesStats;
  const items = [
    [fr(s.moyenne, 1) + ' s', 'Durée moyenne'], [s.mediane + ' s', 'Durée médiane'],
    [s.min + ' s', 'Durée minimale'], [s.max + ' s', 'Durée maximale'],
    [fr(s.ecart, 1) + ' s', 'Écart-type'], [fr(s.intervalle, 1) + ' s', 'Intervalle moyen entre deux crises'],
    ['0,78', 'Coefficient de variation']
  ];
  $('#durKpis').innerHTML = items.map(i => `<div class="kpi"><b>${i[0]}</b><span>${i[1]}</span></div>`).join('');
}

function renderHist() {
  const rows = DATA.crisesRows || [];
  const box = $('#durHist');
  if (rows.length < 20) { box.innerHTML = ''; return; }
  const step = 5, nb = 12;
  const counts = new Array(nb).fill(0);
  rows.forEach(r => { const b = Math.min(nb - 1, Math.floor(r[4] / step)); counts[b]++; });
  const labels = counts.map((_, i) => (i * step) + '–' + (i === nb - 1 ? '60+' : (i + 1) * step) + ' s');
  const maxC = Math.max(...counts);
  groupedBars(box, {
    labels, series: [{ name: 'Crises', color: '#0e7a5f', values: counts }],
    max: Math.ceil(maxC / 5) * 5, height: 240, slot: 52, bottom: 60,
    fmt: v => fr(v, 0), aria: 'Histogramme des durées des crises'
  });
}

/* =====================================================================
   Partie III — Variable cible (Q5, Q6)
   ===================================================================== */
function renderClassTable() {
  const rows = rec.map(r => [r.id, fr(r.n), fr(r.n - r.smpC), fr(r.smpC), fr(r.smpC / r.n * 100, 2) + NBSP + '%', r.crises]);
  rows.push(['<b>Total</b>', '<b>' + fr(DATA.echantillons.normal + DATA.echantillons.crise) + '</b>', '<b>' + fr(DATA.echantillons.normal) + '</b>',
    '<b>' + fr(DATA.echantillons.crise) + '</b>', '<b>3,27' + NBSP + '%</b>', '<b>' + DATA.annotations.valides + '</b>']);
  fillTable('#classTable', ['Patient', 'Échantillons', 'Classe 0', 'Classe 1', '% de classe 1', 'Crises'], rows);
}

function imbalanceHtml(rowsDef) {
  return rowsDef.map(r => {
    const tot = r.n + r.c, pc = r.c / tot * 100;
    return `<div class="imb">
      <div class="imb-label"><span>${r.t}</span><span>${fr(tot)}</span></div>
      <div class="imb-bar" role="img" aria-label="${fr(100 - pc, 2)} % classe 0, ${fr(pc, 2)} % classe 1">
        <i class="imb-n" style="width:${100 - pc}%"></i><i class="imb-c" style="width:${pc}%"></i></div>
      <div class="imb-vals"><span>Classe 0 <b>${fr(r.n)}</b> (${fr(100 - pc, 2)}${NBSP}%)</span><span>Classe 1 <b>${fr(r.c)}</b> (${fr(pc, 2)}${NBSP}%)</span></div>
    </div>`;
  }).join('');
}

function renderImbalance() {
  $('#imbalance').innerHTML = imbalanceHtml([{ t: 'Échantillons', n: DATA.echantillons.normal, c: DATA.echantillons.crise }]);
  $('#featCounts').innerHTML = imbalanceHtml([{ t: 'Fenêtres de 2 s', n: DATA.fenetres.normal, c: DATA.fenetres.crise }]);
}

/* =====================================================================
   Parties IV, V, VI — Segmentation, caractéristiques, fréquences
   ===================================================================== */
function renderWindows() {
  const F = DATA.fenetres;
  $('#winKpis').innerHTML = [
    [F.taille, 'Échantillons par fenêtre (2 s)'], [F.pas, 'Décalage (50 % de recouvrement)'],
    [fr(F.total), 'Fenêtres au total'], [fr(F.normal), 'Fenêtres de classe 0'], [fr(F.crise), 'Fenêtres de classe 1']
  ].map(i => `<div class="kpi"><b>${i[0]}</b><span>${i[1]}</span></div>`).join('');

  fillTable('#winFirst', ['Fenêtre', 'Début (échantillon)', 'Fin (échantillon)', 'Début (s)', 'Fin (s)', 'Fraction de crise', 'Classe'],
    DATA.winFirst.map(r => [r[0], r[1], r[2], fr(r[3], 6), fr(r[4], 6), fr(r[5], 1), r[6]]));

  const rows = rec.map(r => [r.id, fr(r.win), fr(r.win - r.winC), fr(r.winC), fr(r.winC / r.win * 100, 2) + NBSP + '%']);
  rows.push(['<b>Total</b>', '<b>' + fr(F.total) + '</b>', '<b>' + fr(F.normal) + '</b>', '<b>' + fr(F.crise) + '</b>', '<b>3,52' + NBSP + '%</b>']);
  fillTable('#winPatients', ['Patient', 'Fenêtres', 'Classe 0', 'Classe 1', '% de classe 1'], rows);
}

function renderFeatures() {
  fillTable('#featFirst', ['Window', 'Mean', 'Std', 'Variance', 'Min', 'Max', 'Amplitude', 'RMS', 'Energy', 'Class'],
    DATA.featFirst.map(r => [r[0], fr(r[1], 2), fr(r[2], 2), fr(r[3], 1), fr(r[4], 2), fr(r[5], 2), fr(r[6], 2), fr(r[7], 2), sci(r[8]), r[9]]));
  fillTable('#freqFirst', ['Window', 'Delta', 'Theta', 'Alpha', 'Beta', 'Class'],
    DATA.freqFirst.map(r => [r[0], fr(r[1], 0), fr(r[2], 0), fr(r[3], 0), fr(r[4], 0), r[5]]));
}

/* ----- Q9 : fenêtre hors crise / crise, signal et spectre ----- */
const BANDS = [['Delta', 0.5, 4], ['Theta', 4, 8], ['Alpha', 8, 13], ['Beta', 13, 30]];
const specSel = $('#specPatient');
let specId = null;

function spectrum(x, fs) {
  const N = x.length;
  let mean = 0; for (let i = 0; i < N; i++) mean += x[i]; mean /= N;
  const w = new Float64Array(N);
  for (let i = 0; i < N; i++) w[i] = (x[i] - mean) * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
  const f = [], p = [];
  for (let k = 0; k <= N / 2; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) { const a = 2 * Math.PI * k * n / N; re += w[n] * Math.cos(a); im -= w[n] * Math.sin(a); }
    f.push(k * fs / N); p.push((re * re + im * im) / (N * N));
  }
  return { f, p };
}

function drawXY(cv, xs, ys, o) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  const l = 46, r = 10, t = 8, b = 34, x0 = l, x1 = w - r, y0 = t, y1 = h - b;
  let lo = Infinity, hi = -Infinity;
  ys.forEach(v => { if (v < lo) lo = v; if (v > hi) hi = v; });
  if (o.zero) lo = 0;
  if (hi === lo) hi = lo + 1;
  const pad = (hi - lo) * 0.06; if (!o.zero) { lo -= pad; } hi += pad;
  const sx = x => x0 + (x - o.xmin) / (o.xmax - o.xmin) * (x1 - x0);
  const sy = v => y1 - (v - lo) / (hi - lo) * (y1 - y0);
  g.font = '11px Inter, system-ui, sans-serif';
  if (o.bands) {
    o.bands.forEach((bd, i) => {
      g.fillStyle = i % 2 ? 'rgba(12,130,100,.07)' : 'rgba(12,130,100,.15)';
      g.fillRect(sx(bd[1]), y0, sx(bd[2]) - sx(bd[1]), y1 - y0);
      g.fillStyle = '#46635a'; g.textAlign = 'center'; g.textBaseline = 'top';
      g.fillText(bd[0], (sx(bd[1]) + sx(bd[2])) / 2, y0 + 2);
    });
  }
  g.strokeStyle = '#e2ece7'; g.lineWidth = 1; g.fillStyle = '#46635a'; g.textAlign = 'right'; g.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = lo + (hi - lo) * i / 4, y = sy(v);
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    g.fillText(o.yfmt ? o.yfmt(v) : fr(v, 0), x0 - 6, y);
  }
  g.strokeStyle = '#9db5ab'; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x1, y1); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'top';
  const xt = o.xticks || 4;
  for (let i = 0; i <= xt; i++) {
    const v = o.xmin + (o.xmax - o.xmin) * i / xt, x = sx(v);
    g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y1 + 4); g.stroke();
    g.fillText(fr(v, o.xdec || 0), x, y1 + 6);
  }
  g.fillText(o.xlabel, (x0 + x1) / 2, y1 + 20);
  g.strokeStyle = '#0a6b52'; g.lineWidth = 1.2; g.lineJoin = 'round';
  g.beginPath();
  xs.forEach((x, i) => { const X = sx(x), Y = sy(ys[i]); if (i === 0) g.moveTo(X, Y); else g.lineTo(X, Y); });
  g.stroke();
  if (o.fill) { g.lineTo(sx(xs[xs.length - 1]), y1); g.lineTo(sx(xs[0]), y1); g.closePath(); g.fillStyle = 'rgba(12,130,100,.18)'; g.fill(); }
}

function pickWindows(id) {
  const list = crisesOf(id).slice().sort((a, b) => a[0] - b[0]);
  if (!list.length) return null;
  const c = list[0];
  const t1 = Math.max(0, (c[0] + c[1]) / 2 - 1);
  const free = t => !list.some(k => k[1] > t - 1 && k[0] < t + 3);
  let t0 = null;
  for (let d = 30; d <= 600 && t0 === null; d += 30) { const t = c[0] - d; if (t >= 0 && free(t)) t0 = t; }
  if (t0 === null) for (let t = c[1] + 30; t < dataDur(id) - 3 && t0 === null; t += 30) if (free(t)) t0 = t;
  return { t0: t0 === null ? 0 : t0, t1 };
}

function drawSpec() {
  const id = specId;
  const sig = signals.get(id);
  const status = $('#specStatus');
  const caps = [$('#specCap0'), $('#specCap1')];
  const pairs = [['#specTime0', '#specFreq0'], ['#specTime1', '#specFreq1']];
  const blank = () => pairs.flat().forEach(s => { const cv = $(s); const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); });
  if (!id) { status.textContent = 'Aucun patient avec des instants de crise connus.'; blank(); return; }
  if (!sig) {
    status.textContent = pending.has(id) ? 'Chargement du signal…' : 'Signal indisponible : placez les CSV dans data/csv (Live Server) ou chargez-les avec le bouton de l\'aperçu.';
    caps[0].textContent = 'Hors crise'; caps[1].textContent = 'Crise'; blank(); return;
  }
  const wins = pickWindows(id);
  status.textContent = 'Signal de ' + id + ' : 2 s hors crise et 2 s de crise (canal le plus actif pour le signal, moyenne des 8 canaux les plus actifs pour le spectre).';
  const chans = sig.top.map(i => sig.all[i]);
  const best = chans.reduce((a, c) => c.sd > a.sd ? c : a, chans[0]);
  [wins.t0, wins.t1].forEach((t, k) => {
    const n = Math.round(2 * sig.fs), i0 = Math.max(0, Math.min(sig.n - n, Math.round(t * sig.fs)));
    const ys = Array.from(best.data.subarray(i0, i0 + n));
    const xs = ys.map((_, i) => t + i / sig.fs);
    drawXY($(pairs[k][0]), xs, ys, { xmin: t, xmax: t + 2, xlabel: 'Temps (secondes)', xticks: 4, xdec: 1, fill: false });
    const acc = new Float64Array(n / 2 + 1); let f = null;
    chans.forEach(C => { const sp = spectrum(Array.from(C.data.subarray(i0, i0 + n)), sig.fs); f = sp.f; sp.p.forEach((v, i) => acc[i] += v / chans.length); });
    const sel = f.map((x, i) => i).filter(i => f[i] <= 30);
    drawXY($(pairs[k][1]), sel.map(i => f[i]), sel.map(i => acc[i]), { xmin: 0, xmax: 30, xlabel: 'Fréquence (Hz)', xticks: 6, zero: true, fill: true, bands: BANDS, yfmt: v => v.toExponential(0) });
    const bp = BANDS.map(b => { let s = 0; f.forEach((x, i) => { if (x >= b[1] && x < b[2]) s += acc[i]; }); return b[0] + ' ' + s.toExponential(1).replace('.', ','); });
    caps[k].textContent = (k ? 'Crise' : 'Hors crise') + ' · ' + fr(t, 0) + ' s à ' + fr(t + 2, 0) + ' s · ' + bp.join(' · ');
  });
}

function initSpec() {
  const ids = Object.keys(DATA.crises).filter(id => rec.some(r => r.id === id)).sort();
  specSel.innerHTML = ids.map(i => `<option value="${i}">${i}</option>`).join('');
  if (!ids.includes(specId)) specId = ids[0] || null;
  if (specId) specSel.value = specId;
  drawSpec();
  if (specId) ensureSignal(specId).then(() => { if (specId) drawSpec(); });
}

/* =====================================================================
   Parties VII et VIII — Analyse et modèles
   ===================================================================== */
function renderCompare() {
  fillTable('#cmpTable', ['Caractéristique', 'Moyenne classe 0', 'Moyenne classe 1', 'Rapport 1 / 0'],
    DATA.cmp.map(r => [r[0], r[0] === 'Std' ? fr(r[1], 1) : sci(r[1]), r[0] === 'Std' ? fr(r[2], 0) : sci(r[2]), fr(r[3], 2)]));
  $('#ratioBars').innerHTML = DATA.cmp.map(r => {
    const lg = Math.log10(r[3]), w = Math.min(50, Math.abs(lg) * 50);
    const side = lg >= 0 ? `left:50%;width:${w}%` : `left:${50 - w}%;width:${w}%`;
    return `<div class="ratio-row"><span>${r[0]}</span>
      <div class="ratio-track" role="img" aria-label="Rapport ${fr(r[3], 2)}"><i class="ratio-mid"></i><i class="ratio-bar ${lg >= 0 ? 'is-up' : 'is-down'}" style="${side}"></i></div>
      <span class="auc-val">× ${fr(r[3], 2)}</span></div>`;
  }).join('') + '<div class="ratio-axis"><span>0,1</span><span>1</span><span>10</span></div>';
}

function renderAuc() {
  $('#auc').innerHTML = DATA.auc.map((r, i) => `
    <div class="auc-row ${i < 3 ? 'is-top' : ''}">
      <span>${r[0]}</span>
      <div class="auc-track" role="img" aria-label="Pouvoir discriminant ${fr(r[2], 2)}"><i style="width:${r[2] * 100}%"></i></div>
      <span class="auc-val" title="AUC ${fr(r[1], 3)}">${fr(r[2], 2)}</span>
    </div>`).join('');
  fillTable('#aucTable', ['Caractéristique', 'AUC', 'Pouvoir discriminant', 'Écart standardisé d'],
    DATA.auc.map(r => [r[0], fr(r[1], 3), fr(r[2], 3), fr(r[3], 3)]));
}

function renderHeat() {
  const names = DATA.corrNames;
  const short = ['Mean', 'Std', 'Var', 'Min', 'Max', 'Amp', 'RMS', 'Enrg', 'δ', 'θ', 'α', 'β'];
  let html = '<div></div>' + names.map((n, i) => `<div class="heat-h" title="${n}">${short[i]}</div>`).join('');
  DATA.corr.forEach((row, i) => {
    html += `<div class="heat-r">${names[i]}</div>`;
    row.forEach(v => {
      const a = Math.abs(v);
      const bg = v >= 0 ? `rgba(12,130,100,${(a * .9 + .04).toFixed(2)})` : `rgba(217,45,45,${(a * .9 + .04).toFixed(2)})`;
      html += `<div class="heat-c" style="background:${bg};color:${a > .45 ? '#fff' : '#1f4036'}">${fr(v, 2)}</div>`;
    });
  });
  $('#heat').innerHTML = html;
}

function renderSplit() {
  fillTable('#splitTable', ['Jeu', 'Fenêtres', 'Fenêtres de classe 1', '% de classe 1'],
    DATA.split.map(r => [r[0], fr(r[1]), fr(r[2]), fr(r[3], 3) + NBSP + '%']));
  $('#trainTimes').innerHTML = DATA.trainTimes.map(t => `<div class="kpi"><b>${fr(t[1], 1)} s</b><span>Entraînement : ${t[0]}</span></div>`).join('');
}

/* =====================================================================
   Parties IX à XII — Résultats
   ===================================================================== */
function modelTable(sel, rows, bestKey) {
  const bestF1 = Math.max(...rows.filter(m => m !== DATA.naive).map(m => m[4]));
  const bestRec = Math.max(...rows.filter(m => m !== DATA.naive).map(m => m[3]));
  fillTable(sel, ['Modèle', 'Accuracy', 'Precision', 'Recall', 'F1-score'], rows.map(m => {
    let badge = '';
    if (m !== DATA.naive && m[4] === bestF1) badge = '<span class="badge">meilleur F1</span>';
    else if (m !== DATA.naive && m[3] === bestRec && bestKey) badge = '<span class="badge">meilleur recall</span>';
    return [m[0] + badge, ...m.slice(1).map(v => fr(v, 3))];
  }));
  Array.from($(sel + ' tbody').rows).forEach((tr, i) => {
    if (rows[i][4] === bestF1 && rows[i] !== DATA.naive) tr.classList.add('is-best');
    if (rows[i] === DATA.naive) tr.classList.add('is-muted');
  });
}

function confusionCard(name, vn, fp, fn, vp) {
  const cell = (v, kind, lab) => `<div class="cm-cell ${v === 0 ? 'cm-zero' : kind}"><b>${fr(v)}</b><span>${lab}</span></div>`;
  return `<article class="card cm-card">
    <h4 class="cm-title">${name}</h4>
    <div class="cm-grid" role="group" aria-label="Matrice de confusion ${name}">
      <div></div><div class="cm-head">Prédit<br>sans crise</div><div class="cm-head">Prédit<br>crise</div>
      <div class="cm-head">Réel<br>sans crise</div>${cell(vn, 'cm-good', 'VN')}${cell(fp, 'cm-bad', 'FP')}
      <div class="cm-head">Réel<br>crise</div>${cell(fn, 'cm-bad', 'FN')}${cell(vp, 'cm-good', 'VP')}
    </div></article>`;
}

function renderResults() {
  const base = DATA.models.slice(0, 4).concat([DATA.naive]);
  modelTable('#modelTable4', base, false);

  const byName = n => DATA.confusion.find(c => c[0] === n);
  $('#confusions').innerHTML = ['Decision Tree', 'Random Forest', 'KNN', 'SVM'].map(n => { const c = byName(n); return confusionCard(c[0], c[1], c[2], c[3], c[4]); }).join('');

  $('#robust').className = 'robust';
  $('#robust').innerHTML = DATA.robust.map(r => `
    <div class="robust-row"><h4>${r[0]}</h4>
      <div class="robust-vals">
        <span><b>${fr(r[1], 3)}</b>Accuracy</span><span><b>${fr(r[2], 3)}</b>Precision</span>
        <span><b>${fr(r[3], 3)}</b>Recall</span><span><b>${fr(r[4], 3)}</b>F1-score</span>
      </div></div>`).join('') +
    '<p class="note">Patients de test : ' + DATA.testPatients.join(', ') + '.</p>';

  // Partie X
  const d = DATA.detection;
  $('#detKpis').innerHTML = [
    [d.intervalles, 'Intervalles détectés'], [d.vp, 'Vrais positifs'], [d.fp, 'Faux positifs'], [d.fn, 'Faux négatifs'],
    [fr(d.precision, 3), 'Precision (intervalles)'], [fr(d.rappel, 3), 'Rappel (intervalles)'], [fr(d.f1, 3), 'F1 (intervalles)']
  ].map(i => `<div class="kpi"><b>${i[0]}</b><span>${i[1]}</span></div>`).join('');
  const statut = { vrai_positif: 'vrai positif', faux_positif: 'faux positif', faux_negatif: 'faux négatif' };
  const iv = (a, b) => a === null ? '—' : fr(a, 1) + ' → ' + fr(b, 1);
  fillTable('#cmpIntervals', ['Prédit n°', 'Patient', 'Intervalle prédit (s)', 'Crise', 'Crise réelle (s)', 'Recouvrement (s)', 'IoU', 'Statut'],
    DATA.cmpIntervals.map(r => [r[0] === null ? '—' : r[0], r[1], iv(r[2], r[3]), r[4] === null ? '—' : r[4], iv(r[5], r[6]), fr(r[7], 1), fr(r[8], 3), statut[r[9]]]));

  // Partie XI
  const w = DATA.errWindow;
  $('#errWindow').innerHTML = `<div class="cm-wrap">${confusionCard('Fenêtres, 5 patients de test', w.vn, w.fp, w.fn, w.vp)}</div>
    <div class="kpis"><div class="kpi"><b>${fr(w.precision, 3)}</b><span>Precision</span></div><div class="kpi"><b>${fr(w.recall, 3)}</b><span>Recall</span></div><div class="kpi"><b>${fr(w.f1, 3)}</b><span>F1-score</span></div></div>`;
  fillTable('#errPatient', ['Patient', 'Faux négatifs', 'Faux positifs', 'Vrais négatifs', 'Vrais positifs'],
    DATA.errPatient.map(r => [r[0], fr(r[1]), fr(r[2]), fr(r[3]), fr(r[4])]));

  // Partie XII
  modelTable('#modelTable6', DATA.models, true);
  const series = [
    { name: 'Precision', color: '#8fd9c0', values: DATA.models.map(m => m[2]) },
    { name: 'Recall', color: '#0e7a5f', values: DATA.models.map(m => m[3]) },
    { name: 'F1-score', color: '#d92d2d', values: DATA.models.map(m => m[4]) }
  ];
  legend($('#modelLegend'), series);
  groupedBars($('#modelChart'), {
    labels: DATA.models.map(m => m[0].replace('Random Forest', 'RF').replace('Decision Tree', 'Arbre de décision')), series, max: 1, height: 300, slot: 110, minW: 640, bottom: 50,
    fmt: v => fr(v, 1), aria: 'Precision, recall et F1-score des six modèles', rotate: false
  });
  $('#confusionsXii').innerHTML = ['Random Forest équilibré', 'MLP rééquilibré'].map(n => { const c = byName(n); return confusionCard(c[0], c[1], c[2], c[3], c[4]); }).join('');
}

/* ----- Q14 : signal, crises réelles et crises prédites ----- */
const tempSel = $('#tempPatient'), tempView = $('#tempView'), tempCv = $('#temporalCanvas');
let tempId = DATA.testPatients[0];

function fillTempViews() {
  const list = crisesOf(tempId).slice().sort((a, b) => a[0] - b[0]);
  const prev = tempView.value;
  tempView.innerHTML = '<option value="all">Enregistrement entier</option>' +
    list.map((c, i) => `<option value="${i}">Crise ${i + 1} (${fr(c[0])} s à ${fr(c[1])} s)</option>`).join('');
  tempView.value = Array.from(tempView.options).some(o => o.value === prev) ? prev : 'all';
}

function drawTemporal() {
  const id = tempId, sig = signals.get(id) || null;
  const trues = crisesOf(id).slice().sort((a, b) => a[0] - b[0]);
  const preds = DATA.pred[id];
  const dur = dataDur(id);
  let t0 = 0, win = dur;
  if (tempView.value !== 'all' && trues[+tempView.value]) {
    const c = trues[+tempView.value];
    win = Math.min(dur, 90);
    t0 = Math.max(0, Math.min(dur - win, (c[0] + c[1]) / 2 - win / 2));
  }
  const dpr = window.devicePixelRatio || 1;
  const w = tempCv.clientWidth, h = tempCv.clientHeight;
  if (!w || !h) return;
  tempCv.width = Math.round(w * dpr); tempCv.height = Math.round(h * dpr);
  const g = tempCv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  const l = 74, r = 16, t = 10, b = 40, x0 = l, x1 = w - r;
  const sh = 18, gap = 8;
  const yPred = h - b - sh, yReal = yPred - sh - gap, yTrace1 = yReal - 14;
  const sx = s => x0 + (s - t0) / win * (x1 - x0);
  const font = '11px Inter, system-ui, sans-serif';
  g.font = font;

  // trace d'activité
  if (sig) {
    const sq = sqOf(sig), pxW = Math.max(1, Math.floor(x1 - x0)), vals = new Float32Array(pxW);
    const iA = Math.floor(t0 * sig.fs), span = Math.max(1, Math.floor(win * sig.fs));
    let vmax = 0;
    for (let px = 0; px < pxW; px++) {
      const a = iA + Math.floor(px / pxW * span), bb = Math.max(a + 1, iA + Math.floor((px + 1) / pxW * span));
      let sum = 0, cnt = 0;
      for (let i = a; i < bb && i < sig.n; i++) { sum += sq[i]; cnt++; }
      const v = Math.sqrt(sum / Math.max(1, cnt)); vals[px] = v; if (v > vmax) vmax = v;
    }
    const top = Math.max(1.5, vmax * 1.08), H = yTrace1 - t;
    g.strokeStyle = '#e2ece7'; g.fillStyle = '#46635a'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.lineWidth = 1;
    const step = [0.5, 1, 2, 5, 10, 20, 50].find(s => top / s <= 4) || 50;
    for (let v = 0; v <= top; v += step) {
      const y = yTrace1 - v / top * H;
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.fillText(String(v), x0 - 8, y);
    }
    g.beginPath(); g.moveTo(x0, yTrace1);
    for (let px = 0; px < pxW; px++) g.lineTo(x0 + px + 0.5, yTrace1 - vals[px] / top * H);
    g.lineTo(x0 + pxW, yTrace1); g.closePath(); g.fillStyle = 'rgba(12,130,100,.22)'; g.fill();
    g.strokeStyle = '#0a6b52'; g.beginPath();
    for (let px = 0; px < pxW; px++) { const y = yTrace1 - vals[px] / top * H; if (px === 0) g.moveTo(x0 + 0.5, y); else g.lineTo(x0 + px + 0.5, y); }
    g.stroke();
  } else {
    g.fillStyle = '#5f7b71'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('Signal non chargé : seules les bandes de crise sont affichées.', (x0 + x1) / 2, (t + yTrace1) / 2);
  }

  // bandes
  const strip = (y, list, color, label) => {
    g.fillStyle = '#f1f6f3'; g.fillRect(x0, y, x1 - x0, sh);
    (list || []).forEach(c => {
      if (c[1] < t0 || c[0] > t0 + win) return;
      const a = Math.max(x0, sx(c[0])), bb = Math.min(x1, sx(c[1]));
      g.fillStyle = color; g.fillRect(a, y, Math.max(2, bb - a), sh);
    });
    g.fillStyle = '#2b4a40'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(label, x0 - 8, y + sh / 2);
  };
  strip(yReal, trues, '#f08a8a', 'Réelles');
  strip(yPred, preds, '#0c8264', 'Prédites');

  // axe du temps
  const y1 = h - b + 2;
  g.strokeStyle = '#9db5ab'; g.fillStyle = '#46635a'; g.textAlign = 'center'; g.textBaseline = 'top';
  g.beginPath(); g.moveTo(x0, y1); g.lineTo(x1, y1); g.stroke();
  const step = [10, 20, 30, 60, 120, 300, 600].find(s => win / s <= 10) || 600;
  for (let k = Math.ceil(t0 / step) * step; k <= t0 + win + 0.001; k += step) {
    const x = sx(k); g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y1 + 4); g.stroke(); g.fillText(String(k), x, y1 + 6);
  }
  g.fillText('Temps (secondes)', (x0 + x1) / 2, y1 + 20);

  const nT = trues.length;
  let note = 'Crises réelles : ' + nT + '.';
  if (preds === undefined) note += ' Intervalles prédits non disponibles pour ce patient : ouvrez le site avec Live Server pour lire ../output/partie_X_crises_detectees.csv.';
  else note += ' Intervalles prédits : ' + preds.length + (preds.length ? '' : ' (aucune fenêtre détectée)') + '.';
  if (!nT) note += ' Instants des crises non chargés (voir À propos).';
  $('#tempNote').textContent = note;
  $('#tempStatus').textContent = sig ? '' : (pending.has(id) ? 'Chargement du signal…' : 'Signal non chargé (data/csv ou bouton de l\'aperçu).');
}

function initTemporal() {
  tempSel.innerHTML = DATA.testPatients.map(i => `<option value="${i}">${i}</option>`).join('');
  tempSel.value = tempId;
  fillTempViews();
  tempSel.addEventListener('change', () => {
    tempId = tempSel.value; fillTempViews(); drawTemporal();
    ensureSignal(tempId).then(drawTemporal);
  });
  tempView.addEventListener('change', drawTemporal);
  specSel.addEventListener('change', () => { specId = specSel.value; drawSpec(); ensureSignal(specId).then(drawSpec); });
  drawTemporal();
  ensureSignal(tempId).then(drawTemporal);
  if ('ResizeObserver' in window) {
    new ResizeObserver(drawTemporal).observe(tempCv);
    ['#specTime0', '#specFreq0', '#specTime1', '#specFreq1'].forEach(s => new ResizeObserver(drawSpec).observe($(s)));
  }
}

/* =====================================================================
   À propos : pipeline et correspondance énoncé / site
   ===================================================================== */
function renderAbout() {
  const steps = [
    ['Signal EEG', 'Partie I'], ['Exploration des données', 'Parties I et II'],
    ['Prétraitement : conversion .mat → .csv, annotations converties en secondes', 'Parties II et III'],
    ['Segmentation en fenêtres de 2 s', 'Partie IV'], ['Extraction des caractéristiques', 'Parties V et VI'],
    ['Dataset de classification', 'Parties V et VI'], ['Classe 0 (pas de crise) / classe 1 (crise)', 'Partie III'],
    ['Machine Learning : DT, RF, KNN, SVM', 'Partie VIII'], ['Évaluation', 'Partie IX'], ['Meilleur modèle', 'Partie IX'],
    ['Détection temporelle', 'Partie X'], ['Début / fin de chaque crise', 'Partie X']
  ];
  $('#pipeline').innerHTML = steps.map(s => `<li><span>${s[0]}</span><em>${s[1]}</em></li>`).join('');
  const sec = (id, name) => `<a href="#${id}">${name}</a>`;
  fillTable('#mapTable', ['Partie', 'Questions', 'Contenu', 'Section du site'], [
    ['I', 'Q1, Q2', 'Compréhension et exploration des données', sec('donnees', 'Données')],
    ['II', 'Q3, Q4', 'Exploitation des annotations', sec('annotations', 'Annotations')],
    ['III', 'Q5, Q6', 'Construction de la variable cible', sec('annotations', 'Annotations')],
    ['IV', 'Q7', 'Segmentation du signal', sec('exploration', 'Exploration')],
    ['V', 'Q8', 'Extraction des caractéristiques', sec('exploration', 'Exploration')],
    ['VI', 'Q9', 'Analyse fréquentielle', sec('exploration', 'Exploration')],
    ['VII', 'Q10, Q11', 'Analyse exploratoire', sec('analyse', 'Analyse')],
    ['VIII', 'Q12', 'Construction du modèle de Data Mining', sec('analyse', 'Analyse')],
    ['IX', 'Q13', 'Évaluation des modèles', sec('resultats', 'Résultats')],
    ['X', 'Q14', 'Détection temporelle des crises', sec('resultats', 'Résultats')],
    ['XI', '—', 'Analyse des erreurs', sec('resultats', 'Résultats')],
    ['XII', '—', 'Amélioration du système', sec('resultats', 'Résultats')]
  ]);
}

/* Aller à l'aperçu du signal depuis les questions 2 et 6 */
function initViewerLinks() {
  document.querySelectorAll('[data-go-viewer]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    $('#apercu').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
}

function refreshCrisesViews() {
  renderQ3(); renderHist();
  fillTempViews(); drawTemporal();
  initSpec();
  drawPreview();
}

/* =====================================================================
   Navigation : lien actif selon la section visible
   ===================================================================== */
function initNav() {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const map = new Map();
  links.forEach(a => map.set(a.getAttribute('href').slice(1), a));
  const setActive = id => {
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const act = map.get(id);
    if (act && act.scrollIntoView && window.innerWidth <= 900) {
      const nav = act.parentElement;
      nav.scrollTo({ left: act.offsetLeft - 16, behavior: 'smooth' });
    }
  };
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-35% 0px -60% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* =====================================================================
   Démarrage
   ===================================================================== */
renderStats();
renderSummary();
renderPie();
initPreview();
renderTable();
renderRms();
renderQ3();
renderAnnotations();
renderKpis();
renderHist();
renderClassTable();
renderImbalance();
renderWindows();
renderFeatures();
renderCompare();
renderAuc();
renderHeat();
renderSplit();
renderResults();
renderAbout();
initViewerLinks();
initSpec();
initTemporal();
initNav();
loadCrisesCsv();
loadPredCsv();