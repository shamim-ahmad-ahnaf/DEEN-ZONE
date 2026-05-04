export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export const surahs: Surah[] = [
  {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatihah",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan"
  },
  {
    number: 2,
    name: "البقرة",
    englishName: "Al-Baqarah",
    englishNameTranslation: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan"
  },
  {
    number: 3,
    name: "آل عمران",
    englishName: "Al-Imran",
    englishNameTranslation: "The Family of Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan"
  },
  {
    number: 4,
    name: "النساء",
    englishName: "An-Nisa",
    englishNameTranslation: "The Women",
    numberOfAyahs: 176,
    revelationType: "Medinan"
  },
  {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    englishNameTranslation: "The Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan"
  },
  {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishNameTranslation: "The Daybreak",
    numberOfAyahs: 5,
    revelationType: "Meccan"
  },
  {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    englishNameTranslation: "The Mankind",
    numberOfAyahs: 6,
    revelationType: "Meccan"
  }
];
