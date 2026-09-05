// Français. Keys mirror en.js exactly, in the same order.

export default {
  header: {
    breadcrumb: "Fil d'Ariane",
    xp: 'xp',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    language: 'Langue',
  },

  roadmap: {
    title: 'Parcours',
    lessonsComplete: { one: 'leçon terminée', other: 'leçons terminées' },
    inProgress: 'en cours',
    locked: 'verrouillé',
    lessonCount: { one: 'leçon', other: 'leçons' },
    lockedHint: 'Verrouillé — terminez d’abord la section précédente',
  },

  section: {
    back: 'retour au parcours',
    lockedHint: 'Verrouillé — terminez d’abord la leçon précédente',
    xp: 'xp',
  },

  lesson: {
    back: 'Retour',
    prompt: 'Glissez les lignes dans le bon ordre, puis vérifiez votre travail.',
    xp: 'xp',
    dragHandle: 'Glisser pour réordonner la ligne',
    check: 'Vérifier',
    next: 'Leçon suivante',
    backToSection: 'Retour à la section',
    correct: {
      one: 'Correct. La ligne est dans le bon ordre.',
      other: 'Correct. Les {total} lignes sont dans le bon ordre.',
    },
    // French CLDR puts 0 in the 'one' category, so "0 ligne … est" is right.
    incorrect: {
      one: '{correct} ligne sur {total} est à la bonne place. Réessayez.',
      other: '{correct} lignes sur {total} sont à la bonne place. Réessayez.',
    },
  },

  course: {
    foundations: {
      title: 'Fondamentaux de la syntaxe',
      description:
        'Les déclarations modernes, les fonctions fléchées et les littéraux de gabarit qui remplacent var et la concaténation de chaînes.',
    },
    'foundations-greet': { title: 'Composer un message d’accueil avec un littéral de gabarit' },
    'foundations-format-price': { title: 'Formater un prix avec une devise par défaut' },
    'foundations-destructure-config': { title: 'Déstructurer un objet de configuration avec une valeur par défaut' },
    'foundations-rest-sum': { title: 'Collecter les arguments avec un paramètre du reste' },

    arrays: {
      title: 'Tableaux et déstructuration',
      description:
        'Filtrer, transformer et déstructurer les tableaux qui remplacent les boucles for manuelles.',
    },
    'arrays-filter-map-reduce': { title: 'Filtrer, transformer et réduire une liste de nombres' },
    'arrays-swap-destructure': { title: 'Échanger deux valeurs par déstructuration de tableau' },
    'arrays-merge-unique': { title: 'Fusionner deux tableaux et supprimer les doublons' },
    'arrays-rank-by-score': { title: 'Classer les joueurs par score avec sort et map' },

    closures: {
      title: 'Closures et portée',
      description:
        'Les closures, les chaînes de portée et les fonctions qui survivent à leur appelant.',
    },
    'closures-counter': { title: 'Créer un compteur avec une closure' },
    'closures-id-generator': { title: 'Générer des identifiants uniques avec une closure' },
    'closures-scope-chain': { title: 'Lire une variable externe via une chaîne de portée' },
    'closures-partial-chain': { title: 'Construire une chaîne d’application partielle' },

    async: {
      title: 'JavaScript asynchrone',
      description:
        'Les promesses et async/await, le flux de contrôle du code qui attend un travail réel.',
    },
    'async-promise-chain': { title: 'Chaîner des promesses avec then' },
    'async-await-basics': { title: 'Réécrire une chaîne de promesses avec async et await' },
    'async-catch-recover': { title: 'Récupérer après une promesse rejetée avec catch' },
    'async-parallel-all': { title: 'Charger une liste en parallèle avec Promise.all' },

    'advanced-patterns': {
      title: 'Motifs avancés',
      description:
        'Le debounce, la mémoïsation, la curryfication et les générateurs derrière les outils de production.',
    },
    'patterns-debounce': { title: 'Limiter les appels d’une fonction avec debounce' },
    'patterns-memoize': { title: 'Mémoïser une fonction avec une Map' },
    'patterns-curry': { title: 'Curryfier une fonction à trois arguments' },
    'patterns-generator': { title: 'Générer une séquence infinie paresseusement' },
  },
}
