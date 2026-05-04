export interface Hadith {
  id: number;
  text: string;
  text_bn: string;
  source: string;
  source_bn: string;
  narrator: string;
  narrator_bn: string;
}

export const hadiths: Hadith[] = [
  {
    id: 1,
    text: "Actions are but by intentions and every man shall have only that which he intended.",
    text_bn: "নিশ্চয়ই আল্লাহ তোমাদের কাজের প্রতিদান নিয়তের ওপর ভিত্তি করে দেবেন।",
    narrator: "Umar bin Al-Khattab",
    narrator_bn: "উমর ইবনুল খাত্তাব (রা.)",
    source: "Sahih Bukhari & Muslim",
    source_bn: "সহীহ বুখারী ও মুসলিম"
  },
  {
    id: 2,
    text: "The best among you are those who have the best manners and character.",
    text_bn: "তোমাদের মধ্যে সেই ব্যক্তিই সর্বোত্তম, যার চরিত্র সবচেয়ে বেশি সুন্দর।",
    narrator: "Abdullah ibn Amr",
    narrator_bn: "আবদুল্লাহ ইবনে আমর (রা.)",
    source: "Sahih Bukhari",
    source_bn: "সহীহ বুখারী"
  },
  {
    id: 3,
    text: "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
    text_bn: "তোমাদের কেউ ততক্ষণ পর্যন্ত পূর্ণ মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা পছন্দ করবে যা সে নিজের জন্য পছন্দ করে।",
    narrator: "Anas bin Malik",
    narrator_bn: "আনাস বিন মালিক (রা.)",
    source: "Sahih Bukhari",
    source_bn: "সহীহ বুখারী"
  },
  {
    id: 4,
    text: "He who believes in Allah and the Last Day, let him be hospitable to his guest.",
    text_bn: "যে ব্যক্তি আল্লাহ ও পরকালের প্রতি বিশ্বাস রাখে, সে যেন তার মেহমানকে সম্মান করে।",
    narrator: "Abu Shurayh al-Khuza’i",
    narrator_bn: "আবু শুরাইহ আল-খুজাই (রা.)",
    source: "Sahih Bukhari & Muslim",
    source_bn: "সহীহ বুখারী ও মুসলিম"
  },
  {
    id: 5,
    text: "The strong man is not one who is good at wrestling, but the strong man is one who controls himself in a fit of rage.",
    text_bn: "প্রকৃত বীর বা শক্তিশালী সে নয় যে কুস্তিতে অন্যকে হারিয়ে দেয়, বরং প্রকৃত বীর সেই যে রাগের সময় নিজেকে নিয়ন্ত্রণ করতে পারে।",
    narrator: "Abu Hurairah",
    narrator_bn: "আবু হুরায়রা (রা.)",
    source: "Sahih Bukhari",
    source_bn: "সহীহ বুখারী"
  },
  {
    id: 6,
    text: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
    text_bn: "প্রকৃত মুসলিম সেই ব্যক্তি, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",
    narrator: "Abdullah ibn Amr",
    narrator_bn: "আবদুল্লাহ ইবনে আমর (রা.)",
    source: "Sahih Bukhari",
    source_bn: "সহীহ বুখারী"
  }
];
