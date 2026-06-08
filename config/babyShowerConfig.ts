export interface ScheduleItem {
  time: string;
  activity: string;
  icon: string;
}

export interface GuestMessage {
  name: string;
  message: string;
  avatar: string;
}

export interface BabyShowerConfig {
  parents: { partner1: string; partner2: string };
  event: {
    date: string;
    time: string;
    venue: { name: string; address: string };
    countdownTarget: string;
  };
  taglines: { main: string; genderReveal: string; hero: string };
  schedule: ScheduleItem[];
  nameSuggestions: string[];
  guestMessages: GuestMessage[];
  footer: { credit: string };
  mockVisitorCount: number;
}

export const config: BabyShowerConfig = {
  parents: {
    partner1: "Vignesh",
    partner2: "Mythili",
  },
  event: {
    date: "June 24, Wednesday",
    time: "12:00 PM – 5:00 PM",
    venue: {
      name: "Thambi's Kitchen",
      address: "60 Lenton Boulevard,\nNottingham, England, NG7 2EN",
    },
    countdownTarget: "2026-06-24T12:00:00",
  },
  taglines: {
    main: "A little one is on the way, let's celebrate this special day!",
    genderReveal: "Boy or Girl? Join us for the big reveal!",
    hero: "Honoring the parents-to-be",
  },
  schedule: [
    { time: "12:00 PM", activity: "Guests Arrive",         icon: "🎉" },
    { time: "1:00 PM",  activity: "Games & Fun",           icon: "🎮" },
    { time: "2:00 PM",  activity: "Lunch & Treats",        icon: "🍽️" },
    { time: "3:00 PM",  activity: "Cake Cutting",          icon: "🎂" },
    { time: "4:00 PM",  activity: "Gender Reveal Moment",  icon: "🎊" },
    { time: "5:00 PM",  activity: "Farewell & Memories",   icon: "💝" },
  ],
  nameSuggestions: [
    "Arjun", "Aanya", "Rohan", "Priya", "Kiran", "Diya",
    "Aditya", "Kavya", "Vikram", "Ishaan", "Anaya", "Dev",
    "Riya", "Siddharth", "Meera", "Aryan", "Nila", "Veer",
    "Saanvi", "Dhruv", "Myra", "Rehan", "Tara", "Neil",
  ],
  guestMessages: [
    {
      name: "Priya & Raj",
      message: "So thrilled for you both! This little one is already so loved 💕",
      avatar: "🌸",
    },
    {
      name: "Aunty Lakshmi",
      message: "Wishing you a beautiful journey into parenthood. Can't wait to meet the little one!",
      avatar: "🌺",
    },
    {
      name: "The Sharma Family",
      message: "Sending so much love and joy your way. What a blessing!",
      avatar: "⭐",
    },
    {
      name: "Deepa & Suresh",
      message: "You're going to be the most wonderful parents. So excited for June 24th!",
      avatar: "🌻",
    },
    {
      name: "Meena Aunty",
      message: "A precious little miracle is on the way! Blessed to celebrate with you 🙏",
      avatar: "🌷",
    },
  ],
  footer: {
    credit: "Made with love by Astral Prism",
  },
  mockVisitorCount: 247,
};
