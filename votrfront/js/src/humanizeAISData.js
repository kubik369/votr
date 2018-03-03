const humanizeWith = (table) => {
  return (value) => {
    return table[value] || value;
  };
};

export const humanizeTypVyucby = humanizeWith({
  A: 'povinné (A)',
  B: 'povinne voliteľné (B)',
  C: 'výberové (C)',
});

export const humanizeTerminHodnotenia = humanizeWith({
  'R - Riadny termín': 'riadny',
  '1 - Prvý opravný termín': 'prvý opravný',
  '2 - Druhý opravný termín': 'druhý opravný',
});

export const humanizeNazovPriemeru = humanizeWith({
  'Sem ?': 'Semester',
  'AkadR ?': 'Akademický rok',
});

export const humanizeBoolean = humanizeWith({
  A: 'áno',
  N: 'nie',
});

export const classForSemester = (semester) => {
  if (semester === 'Z') {
    return 'zima';
  }
  if (semester === 'L') {
    return 'leto';
  }
  return undefined;
};

export const plural = (count, one, few, many) => {
  if (count === 1) {
    return one;
  }
  if (count >= 2 && count <= 4) {
    return few;
  }
  return many;
};