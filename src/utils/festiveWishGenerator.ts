// Festive Bengali Puja Wish Generator with authentic cultural touch and relationship-specific tailoring
export interface WishParams {
  sender?: string;
  recipient?: string;
  relationship?: string;
  mood?: string;
}

export function generateBengaliFestiveWish(params: WishParams): string {
  const sender = params.sender?.trim() || 'আপনার শুভাকাঙ্ক্ষী';
  const recipient = params.recipient?.trim() || 'প্রিয় সুহৃদ';
  const relationship = (params.relationship || 'friend').toLowerCase();
  const mood = (params.mood || 'joyful').toLowerCase();

  const templates: { [key: string]: string[] } = {
    family: [
      `প্রণাম ও শারদীয়ার আন্তরিক প্রীতি রইল, ${recipient}। মা দুর্গার আশীর্বাদে আমাদের পরিবারের প্রতিটি দিন অপার আনন্দ, সুস্বাস্থ্য এবং পরম শান্তিতে ভরে উঠুক। শুভ দুর্গোৎসব! — ${sender}`,
      `শুভ শারদীয়া, ${recipient}! মায়ের চরণস্পর্শে সংসারে আসুক অনাবিল সুখ ও সমৃদ্ধি। ঢাকের মিষ্টি ধ্বনি আর শিউলির সুবাসে আমাদের পারিবারিক বন্ধন চিরদিন অটুট থাকুক। ইতি, ${sender}`,
      `প্রিয় ${recipient}, দেবীর বোধনে দূর হোক সকল দুঃখ-কষ্ট। মা দুর্গার কৃপায় আপনার জীবন দীর্ঘায়ু ও অসীম শান্তিতে মঙ্গলময় হয়ে উঠুক। শারদীয়ার শ্রদ্ধা ও ভালোবাসা সহ — ${sender}`
    ],
    friend: [
      `দোস্ত ${recipient}, শুভ শারদীয়া! ঢাকের তালে, কাশের দোলায় আর নতুন জামার গন্ধে কাটুক পুজো। প্যান্ডেল হপিং আর ফুচকার আড্ডায় মেতে ওঠো প্রতিদিন। দারুণ আনন্দ করো! — ${sender}`,
      `শুভ দুর্গোৎসব, ${recipient}! মা দুর্গার আগমনে তোর জীবনে আসুক নতুন আশার আলো আর সীমাহীন সাফল্য। পুজোর এই কটা দিন ভরে উঠুক নিখাদ বন্ধুত্ব আর অফুরন্ত হাসিতে। — ${sender}`,
      `হৈচৈ, আড্ডা আর আলোর রোশনাই— পুজো তো বন্ধুর সাথেই সেরা, ${recipient}! দেবী দুর্গার আশীর্বাদে তোর সব স্বপ্ন পূরণ হোক। শুভ মহা অষ্টমী ও শারদীয়া! ইতি, ${sender}`
    ],
    love: [
      `আমার ভালোবাসা ${recipient}, শুভ শারদীয়া! কাশফুলের দোলা আর অষ্টমীর অঞ্জলির পবিত্র লগ্নে দেবীর কাছে শুধু তোমার সুখ ও হাসিমুখের প্রার্থনা করি। তোমার উপস্থিতিতে আমার প্রতিটি পুজো স্বর্গীয় হয়ে ওঠে। অনেক ভালোবাসা সহ — ${sender}`,
      `প্রিয় ${recipient}, শারদ উৎসবের আলোর বন্যায় তোমায় জানাই হৃদয়ের গভীরতম প্রীতি ও ভালোবাসা। মা দুর্গার কৃপায় আমাদের বন্ধন চিরন্তন হোক, ভালোবাসার রঙে রাঙিয়ে উঠুক প্রতিটি ক্ষণ। শুভ দুর্গোৎসব! — ${sender}`,
      `ধূপ-ধুনো আর ঢাকের মিষ্টি ছন্দে শারদীয়ার শুভলগ্নে তোমার হাত ধরে কাটুক উৎসবের প্রতিটি মুহূর্ত, ${recipient}। মা দুর্গা আমাদের প্রেমকে অটুট রাখুন। শুভ শারদীয়া! — ${sender}`
    ],
    colleague: [
      `শুভ শারদীয়া, ${recipient}! কাজের ব্যস্ততা ভুলে শারদ উৎসবের এই কটা দিন আপনার ও আপনার পরিবারের আনন্দে কাটুক। মা দুর্গার আশীর্বাদে আগামী দিনগুলোতে আপনার প্রফেশনাল ও ব্যক্তিগত জীবনে আসুক বিরাট সাফল্য। শুভেচ্ছা সহ — ${sender}`,
      `শ্রদ্ধেয় ${recipient}, দেবী দুর্গার পবিত্র আগমনে আপনার জীবন সফলতার নবীন শিখরে পৌঁছাক। কর্মক্ষেত্রে ও পরিবারে বজায় থাকুক শান্তি ও কল্যাণ। শুভ দুর্গোৎসব ২০২৬! — ${sender}`
    ],
    elder: [
      `চরণকমলে প্রণাম জানাই, ${recipient}। শারদীয়ার এই পুণ্যলগ্নে মা দুর্গার কাছে আপনার সুস্বাস্থ্য ও দীর্ঘায়ু কামনা করি। আপনার স্নেহাশিস যেন সর্বদা আমাদের পথপ্রদর্শক হয়ে থাকে। শুভ বিজয়া ও শারদীয়া! — বিনীত ${sender}`,
      `শ্রদ্ধেয় ${recipient}, মা দুর্গার আশীর্বাদে আপনার জীবন সর্বদা সুখ, শান্তি ও দেবীর অপার কৃপায় সুরভিত থাকুক। পুজোর পবিত্র দিনে রইল আমার সশ্রদ্ধ প্রণাম ও আন্তরিক শুভেচ্ছা। — ${sender}`
    ]
  };

  // Select list based on relationship or default to friend
  let list = templates[relationship] || templates.friend;

  if (relationship.includes('পরিবার') || relationship.includes('family') || relationship.includes('বাবা') || relationship.includes('মা')) {
    list = templates.family;
  } else if (relationship.includes('বন্ধু') || relationship.includes('friend') || relationship.includes('দোস্ত')) {
    list = templates.friend;
  } else if (relationship.includes('ভালোবাসা') || relationship.includes('love') || relationship.includes('প্রেম')) {
    list = templates.love;
  } else if (relationship.includes('অফিস') || relationship.includes('সহকর্মী') || relationship.includes('colleague')) {
    list = templates.colleague;
  } else if (relationship.includes('গুরুজন') || relationship.includes('elder') || relationship.includes('শ্রদ্ধেয়')) {
    list = templates.elder;
  }

  // Modulate with mood flavor if poetic or emotional
  if (mood.includes('poetic') || mood.includes('কাব্যিক')) {
    const poeticPrefix = `কাশফুলের দোলা আর ঢাকের আওয়াজ, শিউলি ফুলের গন্ধে সেজেছে প্রকৃতি আজ। `;
    const selected = list[Math.floor(Math.random() * list.length)];
    return `${poeticPrefix}${selected}`;
  }

  return list[Math.floor(Math.random() * list.length)];
}
