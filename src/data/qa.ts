export interface QAItem {
  id: number;
  question: string;
  question_bn: string;
  answer: string;
  answer_bn: string;
  category: string;
  category_bn: string;
}

export const qaCategories = ['Belief', 'Pillars', 'Character', 'Prophets', 'Afterlife'];
export const qaCategoriesBn = ['আকীদাহ', 'স্তম্ভ', 'চরিত্র', 'নবী-রাসূল', 'পরকাল'];

export const masailCategories = ['সালাত', 'হজ্জ', 'কুরবানি', 'পবিত্রতা', 'যাকাত', 'সমসাময়িক'];

export interface Masail {
  id: number;
  question_bn: string;
  answer_bn: string;
  category_bn: string;
  reference_bn: string;
}

export const masailItems: Masail[] = [
  {
    id: 1,
    question_bn: "হজ্জ কি প্রত্যেক মুসলমানের ওপর ফরজ?",
    answer_bn: "হ্যাঁ, হজ্জ প্রত্যেক সামর্থ্যবান প্রাপ্তবয়স্ক মুসলমানের ওপর জীবনে একবার করা ফরজ। সামর্থ্য বলতে আর্থিক ও শারীরিক সক্ষমতা এবং যাতায়াতের নিরাপত্তা বজায় থাকাকে বোঝায়।",
    category_bn: "হজ্জ",
    reference_bn: "সূরা আল-ইমরান, আয়াত ৯৭"
  },
  {
    id: 2,
    question_bn: "কুরবানির পশুতে অংশীদার হওয়া কি জায়েয?",
    answer_bn: "হ্যাঁ, বড় পশুতে (যেমন গরু, মহিষ, উট) সর্বোচ্চ সাত জন অংশীদার হয়ে কুরবানি করা জায়েয। তবে ছাগল, ভেড়া ও দুম্বাতে কেবল এক জনই কুরবানি করতে পারেন।",
    category_bn: "কুরবানি",
    reference_bn: "সহীহ মুসলিম, হাদিস নং ১৩১৮"
  },
  {
    id: 3,
    question_bn: "অজু অবস্থায় ঘুমালে কি অজু ভেঙে যায়?",
    answer_bn: "যদি কেউ গভীর ঘুমে আচ্ছন্ন হয়ে পড়ে যাতে তার শরীরের নিয়ন্ত্রণ শিথিল হয়ে যায়, তবে অজু ভেঙে যাবে। কিন্তু হালকা তন্দ্রাচ্ছন্ন ভাব বা বসে হেলান না দিয়ে থাকলে অজু ভাঙবে না।",
    category_bn: "পবিত্রতা",
    reference_bn: "সুনানে আবু দাউদ, হাদিস নং ২০৩"
  },
  {
    id: 4,
    question_bn: "কুরবানির পশুর বয়স কত হতে হবে?",
    answer_bn: "উট কমপক্ষে ৫ বছর, গরু ও মহিষ ২ বছর এবং ছাগল, ভেড়া ও দুম্বা কমপক্ষে ১ বছর হতে হবে। তবে দুম্বা বা ভেড়া যদি ৬ মাস বয়সে দেখতে ১ বছরের প্রাণীর মতো হৃষ্টপুষ্ট হয়, তবে তা দিয়েও কুরবানি জায়েয।",
    category_bn: "কুরবানি",
    reference_bn: "সহীহ মুসলিম, হাদিস নং ১৯৬৩"
  },
  {
    id: 5,
    question_bn: "এহরাম অবস্থায় কি সুগন্ধি ব্যবহার করা যায়?",
    answer_bn: "না, হজ্জ বা উমরার উদ্দেশ্যে এহরাম বাঁধার পর শরীরে বা কাপড়ে কোনো প্রকার সুগন্ধি দ্রব্য ব্যবহার করা নিষিদ্ধ। তবে এহরাম বাঁধার আগে সুগন্ধি লাগানো সুন্নাত।",
    category_bn: "হজ্জ",
    reference_bn: "সহীহ বুখারী, হাদিস নং ১৫৩৯"
  },
  {
    id: 6,
    question_bn: "শেয়ার বাজারে বিনিয়োগ কি হালাল?",
    answer_bn: "যদি কোম্পানির ব্যবসা হালাল হয় এবং সুদী কারবারে লিপ্ত না থাকে, তবে তার শেয়ার কেনা-বেচা জায়েয। তবে হারাম ব্যবসা (যেমন মদ বা সুদ) সংশ্লিষ্ট কোম্পানির শেয়ার কেনা জায়েয নয়।",
    category_bn: "সমসাময়িক",
    reference_bn: "ইসলামী ফিকহ একাডেমি"
  }
];

export const qaItems: QAItem[] = [
  {
    id: 1,
    question: "What are the five pillars of Islam?",
    question_bn: "ইসলামের পাঁচটি স্তম্ভ কি কি?",
    answer: "The five pillars are: Shahada (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), and Hajj (Pilgrimage).",
    answer_bn: "ইসলামের পাঁচটি স্তম্ভ হলো: শাহাদাহ (বিশ্বাস), সালাত (নামাজ), যাকাত (দান), সওম (রোজা) এবং হজ্জ (তীর্থযাত্রা)।",
    category: "Pillars",
    category_bn: "স্তম্ভ"
  },
  {
    id: 2,
    question: "How should a Muslim treat their neighbors?",
    question_bn: "একজন মুসলমানের তার প্রতিবেশীদের সাথে কেমন আচরণ করা উচিত?",
    answer: "Islam emphasizes kindness and respect toward neighbors, regardless of their faith.",
    answer_bn: "ইসলাম প্রতিবেশী যেই হোক না কেন, তাদের সাথে সদাচরণ ও শ্রদ্ধার ওপর গুরুত্ব দেয়।",
    category: "Character",
    category_bn: "চরিত্র"
  },
  {
    id: 3,
    question: "Who is the last Prophet of Islam?",
    question_bn: "ইসলামের শেষ নবী কে?",
    answer: "Prophet Muhammad (PBUH) is the last and final messenger of Allah.",
    answer_bn: "হযরত মুহাম্মদ (সা.) হলেন আল্লাহর শেষ ও চূড়ান্ত রাসূল।",
    category: "Prophets",
    category_bn: "নবী-রাসূল"
  }
];
