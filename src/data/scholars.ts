export interface Scholar {
  id: number;
  name: string;
  name_bn: string;
  title: string;
  title_bn: string;
  bio: string;
  bio_bn: string;
  contribution: string;
  contribution_bn: string;
  image: string;
  era: string;
  era_bn: string;
}

export const scholars: Scholar[] = [
  {
    id: 1,
    name: "Imam Al-Ghazali",
    name_bn: "ইমাম আল-গাজালী (রহ.)",
    title: "Hujjat al-Islam",
    title_bn: "হুজ্জাতুল ইসলাম",
    era: "1058 - 1111 CE",
    era_bn: "১০৫৮ - ১১১১ খ্রিষ্টাব্দ",
    bio: "A Persian philosopher and theologian who became one of the most prominent Sunni Muslim scholars of the Golden Age.",
    bio_bn: "একজন পারস্য জগতবিখ্যাত দার্শনিক ও ধর্মতাত্ত্বিক যিনি ইসলামের স্বর্ণযুগের অন্যতম প্রধান সুন্নি মুসলিম পণ্ডিত হিসেবে পরিচিতি লাভ করেন।",
    contribution: "His masterpiece 'Ihya Ulum al-Din' (Revival of Religious Sciences) is widely considered to be one of the greatest works of Islamic spirituality.",
    contribution_bn: "তাঁর কালজয়ী সৃষ্টি 'এহিয়াউল উলূমিদ্দীন' (ধর্মীয় জ্ঞানের পুনর্জাগরণ) ইসলামের আধ্যাত্মিকতার অন্যতম শ্রেষ্ঠ কাজ হিসেবে বিবেচিত হয়।",
    image: "https://images.unsplash.com/photo-1544644107-160a373b8893?w=400&q=80"
  },
  {
    id: 2,
    name: "Ibn Sina (Avicenna)",
    name_bn: "ইবনে সিনা",
    title: "Prince of Physicians",
    title_bn: "চিকিৎসকদের রাজকুমার",
    era: "980 - 1037 CE",
    era_bn: "৯৮০ - ১০৩৭ খ্রিষ্টাব্দ",
    bio: "A polymath who is regarded as one of the most significant physicians, astronomers, thinkers and writers of the Islamic Golden Age.",
    bio_bn: "একজন বহুবিদ্যাবিশারদ যিনি ইসলামী স্বর্ণযুগের অন্যতম গুরুত্বপূর্ণ চিকিৎসক, জ্যোতির্বিজ্ঞানী, চিন্তাবিদ ও লেখক হিসেবে বিবেচিত।",
    contribution: "He wrote 'The Canon of Medicine', which was a standard medical text at many medieval universities and remained in use as late as 1650.",
    contribution_bn: "তিনি 'আল-কানুন ফিততিব' লিখেছিলেন, যা মধ্যযুগের অনেক বিশ্ববিদ্যালয়ে একটি আদর্শ চিকিৎসা পাঠ্য ছিল এবং ১৬৫০ সাল পর্যন্ত এর ব্যবহার ছিল।",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80"
  },
  {
    id: 3,
    name: "Imam Bukhari",
    name_bn: "ইমাম বুখারী (রহ.)",
    title: "Amir al-Mu'minin fil-Hadith",
    title_bn: "আমীরুল মুমিনীন ফিল হাদীস",
    era: "810 - 870 CE",
    era_bn: "৮১০ - ৮৭০ খ্রিষ্টাব্দ",
    bio: "A Persian Islamic scholar who authored the hadith collection known as Sahih al-Bukhari.",
    bio_bn: "একজন পারস্য ইসলামী হদিস বিশেষজ্ঞ যিনি 'সহীহ আল-বুখারী' নামে পরিচিত হাদীস সংকলনের লেখক।",
    contribution: "He established the most rigorous scientific criteria for the authentication of Prophet Muhammad's (PBUH) traditions.",
    contribution_bn: "তিনি মহানবী (সা.)-এর হাদীসের বিশুদ্ধতা যাচাইয়ের জন্য সবচেয়ে কঠোর বৈজ্ঞানিক মানদণ্ড স্থাপন করেছিলেন।",
    image: "https://images.unsplash.com/photo-1585829365234-781fbc043004?w=400&q=80"
  }
];
