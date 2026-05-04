export interface Question {
  id: number;
  question: string;
  question_bn: string;
  options: string[];
  options_bn: string[];
  correctAnswer: number;
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Who was the first person to embrace Islam among women?",
    question_bn: "নারীদের মধ্যে প্রথম কে ইসলাম গ্রহণ করেন?",
    options: ["Aisha (RA)", "Khadija (RA)", "Fatima (RA)", "Sawda (RA)"],
    options_bn: ["আয়েশা (রা.)", "খাদিজা (রা.)", "ফাতিমা (রা.)", "সওদা (রা.)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "In which month was the Quran first revealed?",
    question_bn: "কোন মাসে কুরআন প্রথম নাযিল হয়েছিল?",
    options: ["Muharram", "Rajab", "Ramadan", "Dhul-Hijjah"],
    options_bn: ["মুহাররম", "রজব", "রমজান", "জিলহজ্জ"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "How many chapters (Surahs) are there in the Quran?",
    question_bn: "কুরআনে মোট কতটি সূরা আছে?",
    options: ["110", "114", "120", "30"],
    options_bn: ["১১০", "১১৪", "১২০", "৩০"],
    correctAnswer: 1
  }
];
