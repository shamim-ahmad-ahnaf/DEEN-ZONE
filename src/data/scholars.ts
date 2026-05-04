export interface Scholar {
  id: number;
  name: string;
  title: string;
  bio: string;
  contribution: string;
  image: string;
  era: string;
}

export const scholars: Scholar[] = [
  {
    id: 1,
    name: "Imam Al-Ghazali",
    title: "Hujjat al-Islam",
    era: "1058 - 1111 CE",
    bio: "A Persian philosopher and theologian who became one of the most prominent Sunni Muslim scholars of the Golden Age.",
    contribution: "His masterpiece 'Ihya Ulum al-Din' (Revival of Religious Sciences) is widely considered to be one of the greatest works of Islamic spirituality.",
    image: "https://images.unsplash.com/photo-1544644107-160a373b8893?w=400&q=80"
  },
  {
    id: 2,
    name: "Ibn Sina (Avicenna)",
    title: "Prince of Physicians",
    era: "980 - 1037 CE",
    bio: "A polymath who is regarded as one of the most significant physicians, astronomers, thinkers and writers of the Islamic Golden Age.",
    contribution: "He wrote 'The Canon of Medicine', which was a standard medical text at many medieval universities and remained in use as late as 1650.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80"
  },
  {
    id: 3,
    name: "Imam Bukhari",
    title: "Amir al-Mu'minin fil-Hadith",
    era: "810 - 870 CE",
    bio: "A Persian Islamic scholar who authored the hadith collection known as Sahih al-Bukhari.",
    contribution: "He established the most rigorous scientific criteria for the authentication of Prophet Muhammad's (PBUH) traditions.",
    image: "https://images.unsplash.com/photo-1585829365234-781fbc043004?w=400&q=80"
  }
];
