import { Project, UserProfile, DirectMessage } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Joemarie Gulapa Pangan",
  headline: "Senior Graphic Designer — Social Media Creatives & Brand Visuals",
  tagline: "Designing high-engagement social media campaigns, scroll-stopping visual creatives, advertising assets, and brand identities.",
  bio: "I'm a graphic designer specializing in social media content creation, viral carousel design, advertising creatives, visual branding, and print & digital layouts. I craft striking graphics that capture attention, build brand authority, and drive real engagement.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  coverBanner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
  location: "Open to Worldwide Remote Projects",
  email: "jaopangan.oligarchmedia@gmail.com",
  phone: "+1 (555) 019-2834",
  availableForWork: true,
  availabilityNote: "Available for Social Media & Brand Design Projects",
  socialLinks: {},
  experience: [
    {
      id: "exp-1",
      role: "Senior Graphic Designer & Content Lead",
      company: "Oligarch Media Creative Studio",
      period: "2023 – Present",
      location: "Remote / Global",
      description: "Directing visual content production, multi-slide educational carousels, paid social ad suites, and brand style systems for 20+ creator and consumer brands.",
      achievements: [
        "Produced 450+ high-engagement social media graphics and viral carousels resulting in an average 38% increase in organic reach.",
        "Engineered modular social media design systems in Adobe Photoshop and Illustrator, slashing asset turnaround time from 3 days to 4 hours.",
        "Designed high-converting Meta and TikTok paid advertising creative variations achieving an average 3.9x ROAS for e-commerce clients."
      ],
      skills: ["Social Media Creatives", "Photoshop", "Illustrator", "Paid Ad Graphics", "Visual Storytelling"]
    },
    {
      id: "exp-2",
      role: "Graphic Designer & Social Media Specialist",
      company: "Vanguard Creative Agency",
      period: "2020 – 2023",
      location: "New York, NY",
      description: "Crafted daily social media visual feeds, promotional event posters, typography systems, and print collateral for lifestyle and entertainment brands.",
      achievements: [
        "Designed cohesive Instagram visual feeds and multi-platform promotional campaigns for 12 lifestyle brand accounts.",
        "Created illustrated event posters and promotional merchandise featured across national music and culture tours.",
        "Prepared full print pre-press packaging layouts and large-format outdoor vinyl banners with strict color accuracy (CMYK/Pantone)."
      ],
      skills: ["Brand Guidelines", "Instagram Kits", "Typography", "Poster Design", "Print Pre-Press"]
    },
    {
      id: "exp-3",
      role: "Visual Graphic Designer",
      company: "Pixel & Print Studio",
      period: "2018 – 2020",
      location: "Austin, TX",
      description: "Designed print collateral, sales decks, vector illustration assets, editorial magazines, and digital advertising banners.",
      achievements: [
        "Created over 100+ bespoke vector illustrations and icon sets for print brochures and digital marketing campaigns.",
        "Revamped corporate marketing collateral and presentation deck typography, elevating pitch win rates by 22%."
      ],
      skills: ["Adobe InDesign", "Vector Illustration", "Editorial Layout", "Digital Banners"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.F.A. in Graphic Design & Visual Communication",
      institution: "Rhode Island School of Design (RISD)",
      year: "2014 – 2018",
      honors: "Summa Cum Laude, Graphic Design Excellence Award"
    },
    {
      id: "edu-2",
      degree: "Advanced Brand Identity & Typography Masterclass",
      institution: "Type Directors Club",
      year: "2021",
      honors: "Certified Typographic Designer"
    }
  ],
  skills: [
    {
      category: "Social Media & Visual Content",
      items: [
        { name: "Instagram Carousels & Feed Aesthetics", level: 98 },
        { name: "Paid Social Ad Creatives (Meta & TikTok)", level: 96 },
        { name: "Story & Reel Visual Graphics", level: 95 },
        { name: "YouTube Thumbnails & Banners", level: 92 },
        { name: "Visual Hooks & Content Storytelling", level: 94 }
      ]
    },
    {
      category: "Creative Tools & Software",
      items: [
        { name: "Adobe Photoshop & Photo Manipulation", level: 99 },
        { name: "Adobe Illustrator & Vector Art", level: 98 },
        { name: "Adobe InDesign & Editorial Layout", level: 92 },
        { name: "Adobe After Effects (Motion Graphics)", level: 88 },
        { name: "Lightroom & Color Grading", level: 90 }
      ]
    },
    {
      category: "Brand Identity & Print Media",
      items: [
        { name: "Logo Design & Brand Identity Systems", level: 96 },
        { name: "Typography & Hierarchy Systems", level: 97 },
        { name: "Event Posters & Billboards", level: 94 },
        { name: "Print Production & Pre-Press (CMYK)", level: 90 },
        { name: "Packaging & Merchandise Design", level: 88 }
      ]
    }
  ],
  awards: [
    {
      id: "aw-1",
      title: "Behance Curated Graphic Design Feature",
      issuer: "Adobe Behance",
      year: "2024",
      description: "Recognized in the Graphic Design & Visual Advertising curated showcase gallery."
    },
    {
      id: "aw-2",
      title: "Graphis Design Annual Merit Award",
      issuer: "Graphis International",
      year: "2023",
      description: "Recognized in the Social Media & Campaign Design category for Apex Energy launch visuals."
    },
    {
      id: "aw-3",
      title: "American Advertising Federation (AAF) Award",
      issuer: "American Advertising Federation",
      year: "2022",
      description: "Awarded for excellence in promotional posters and digital advertising campaign art direction."
    }
  ],
  testimonials: [
    {
      id: "t-1",
      clientName: "Sophia Zhang",
      clientRole: "VP of Marketing",
      company: "Nova Consumer Brands",
      quote: "Jao's social media graphics and carousel designs completely transformed our brand perception online. His ability to blend scroll-stopping visual hooks with clean typography drove a 42% lift in our post engagement.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      projectTitle: "Nova Social Media Campaign & Carousel Kit"
    },
    {
      id: "t-2",
      clientName: "Marcus Vance",
      clientRole: "Founder & Creative Director",
      company: "Atelier Sound Co.",
      quote: "Working with Jao on our album art, event posters, and promotional merchandise was an absolute masterclass in visual storytelling. Every design felt intentional, bold, and culturally relevant.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      projectTitle: "Volt Festival Poster & Merch Collection"
    }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-amazon-headphones",
    title: "Amazon Design — EchoSound ANC Pro Wireless Headphones",
    folderName: "Amazon Design — EchoSound ANC Pro Wireless Headphones",
    parentFolder: "Amazon Listing",
    tagline: "Complete 6-Image Amazon Listing Stack: Studio Hero, Active Noise Cancellation Specs & Lifestyle Callouts",
    category: "Amazon Listing",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Complete Amazon Listing visual kit for premium audio hardware. Includes 3D product render hero on pure white, 40dB hybrid ANC infographic, memory foam ergonomic specs, commuter lifestyle in-use shot, 40-hour fast-charge callout, and package contents breakdown.",
    client: "EchoSound Audio",
    role: "Senior E-Commerce Graphic Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    likes: 3840,
    views: 31200,
    featured: true,
    palette: [
      { name: "Slate Charcoal", hex: "#1E293B" },
      { name: "Electric Cyan", hex: "#0EA5E9" },
      { name: "Clean White", hex: "#FFFFFF" }
    ],
    createdAt: "2026-03-01"
  },
  {
    id: "proj-amazon-matcha",
    title: "Amazon Design — PureMatcha Ceremonial Japanese Organic Tea",
    folderName: "Amazon Design — PureMatcha Ceremonial Japanese Organic Tea",
    parentFolder: "Amazon Listing",
    tagline: "High-Converting E-Commerce Graphics: Farm Origin Infographic, Whisk Guide & USDA Certification",
    category: "Amazon Listing",
    coverImage: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Amazon product listing image stack for organic ceremonial matcha. Designed product hero packaging, shade-grown first harvest farm origin infographic, L-Theanine calm-energy vs coffee chart, 3-step traditional whisking guide, and non-GMO/USDA organic stamps.",
    client: "PureMatcha Botanicals",
    role: "Visual Brand & Packaging Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    likes: 2980,
    views: 24700,
    featured: true,
    palette: [
      { name: "Ceremonial Matcha Green", hex: "#4D7C0F" },
      { name: "Bamboo Wood", hex: "#D97706" },
      { name: "Parchment Cream", hex: "#FEF3C7" }
    ],
    createdAt: "2026-02-15"
  },
  {
    id: "proj-amazon-smartwatch",
    title: "Amazon Design — Apex Velocity Waterproof GPS Smartwatch",
    folderName: "Amazon Design — Apex Velocity Waterproof GPS Smartwatch",
    parentFolder: "Amazon Listing",
    tagline: "Rugged Sports Watch Listing: AMOLED Sunlight Display, 50M Waterproof Specs & Biometric Tracking",
    category: "Amazon Listing",
    coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High-impact tech listing graphics for an outdoor endurance smartwatch. Highlighting 1000-nit AMOLED display legibility, 5ATM swim proof rating, 14-day endurance battery specs, real-time heart rate / SpO2 tracking, and outdoor athlete lifestyle compositions.",
    client: "Apex Wearable Tech",
    role: "Lead E-Commerce Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "3D Renders"],
    likes: 3120,
    views: 28400,
    featured: true,
    palette: [
      { name: "Obsidian Slate", hex: "#0F172A" },
      { name: "Neon Lime", hex: "#84CC16" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    createdAt: "2026-01-20"
  },
  {
    id: "proj-amazon-serum",
    title: "Amazon Design — NovaGlow 20% Vitamin C Radiance Serum",
    folderName: "Amazon Design — NovaGlow 20% Vitamin C Radiance Serum",
    parentFolder: "Amazon Listing",
    tagline: "Skincare E-Commerce Stack: 4-Week Clinical Results, Active Ingredients & Daily Routine Steps",
    category: "Amazon Listing",
    coverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608248597359-5034a7541d40?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Amazon listing design suite for luxury clinical skincare. Dropper bottle hero with water droplet refraction, key active compound callouts (20% Vitamin C + Ferulic Acid), before & after consumer perception chart, and morning AM/PM routine order guide.",
    client: "NovaGlow Dermatics",
    role: "Senior Graphic Designer",
    tools: ["Adobe Photoshop", "Illustrator"],
    likes: 2740,
    views: 22100,
    featured: false,
    palette: [
      { name: "Golden Amber", hex: "#B45309" },
      { name: "Clean Pearl", hex: "#FFFBEB" },
      { name: "Charcoal", hex: "#1F2937" }
    ],
    createdAt: "2026-02-05"
  },
  {
    id: "proj-1",
    title: "Apex Energy Drink — Global Social Media Launch & Ad Campaign",
    folderName: "Social Media — Apex Energy Drink Launch",
    parentFolder: "Social Media",
    tagline: "High-octane social media visual campaign, kinetic Instagram carousels, and high-converting paid ad assets.",
    category: "Social Media",
    coverImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A high-octane social media visual campaign for a zero-sugar clean energy drink launch. Developed an explosive visual system featuring high-contrast typography, dynamic product compositions, multi-slide Instagram educational carousels, story sequences, and high-ROAS paid ads across Meta and TikTok.",
    client: "Apex Beverage Co.",
    role: "Lead Graphic Designer",
    year: "2024",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "After Effects", "Social Kit"],
    likes: 2450,
    views: 18400,
    featured: true,
    behanceUrl: "https://behance.net/gallery/apex-energy-social",
    liveUrl: "https://instagram.com",
    challenges: "Energy drink marketing is often oversaturated with clichés. The brand required a fresh, modern street-style aesthetic with bold visual hooks that immediately stopped thumbs in fast-scrolling social feeds.",
    solution: "We combined distressed brutalist typography, vibrant hyper-saturated gradients, custom 3D can mockups, and structured carousel slides that educate users on active ingredients while driving direct click-throughs.",
    palette: [
      { name: "Hyper Cobalt", hex: "#1D4ED8" },
      { name: "Neon Volt", hex: "#EAB308" },
      { name: "Obsidian Black", hex: "#0F172A" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    createdAt: "2024-03-10"
  },
  {
    id: "proj-2",
    title: "Kroma Craft Coffee — Visual Brand Identity & Packaging Design",
    folderName: "Brand Identity — Kroma Craft Coffee",
    parentFolder: "Brand Identity",
    tagline: "An artisanal visual brand identity, geometric packaging suite, custom merchandise, and social media launch assets.",
    category: "Brand Identity",
    coverImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A warm, artisanal visual brand identity for a specialty micro-roastery. Crafted the complete logo mark family, custom geometric pattern library, matte-finish coffee pouch packaging, sticker packs, apparel merchandise, and cohesive Instagram launch templates.",
    client: "Kroma Roasters",
    role: "Brand & Packaging Designer",
    tools: ["Adobe Illustrator", "InDesign", "Photoshop", "Packaging Print"],
    likes: 2890,
    views: 22100,
    featured: true,
    behanceUrl: "https://behance.net/gallery/kroma-coffee-identity",
    challenges: "The roastery needed to position itself above mass-market commercial coffee while remaining approachable, warm, and distinctly recognizable on retail shelves and Instagram grids.",
    solution: "Designed a clean monoline typographic wordmark paired with origin-specific earthy color accents and modular labels that can easily adapt to seasonal bean releases.",
    palette: [
      { name: "Roasted Espresso", hex: "#292524" },
      { name: "Warm Terracotta", hex: "#C2410C" },
      { name: "Cream Parchment", hex: "#F5F5F4" },
      { name: "Deep Sage", hex: "#44403C" }
    ],
    createdAt: "2023-11-20"
  },
  {
    id: "proj-3",
    title: "Volt Music Festival 2026 — Kinetic Typographic Poster & Event Assets",
    folderName: "Posters & Banners — Volt Music Festival",
    parentFolder: "Posters & Banners",
    tagline: "Expressive typographic event posters, festival billboard graphics, stage signage, and social media countdowns.",
    category: "Posters & Banners",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A bold, expressive poster design and event graphics suite for a premier electronic music festival. Features custom warped typography, gritty duotone textures, stage banners, social media lineup teasers, and large-format billboard prints.",
    client: "Volt Live Entertainment",
    role: "Poster & Visual Graphic Designer",
    tools: ["Adobe Illustrator", "Photoshop", "Type Design", "Print Layout"],
    likes: 3120,
    views: 26800,
    featured: true,
    behanceUrl: "https://behance.net/gallery/volt-festival-poster",
    challenges: "The poster needed to convey raw musical energy, announce 40+ artists legibly, and translate seamlessly between 48x70-inch printed outdoor posters and 9:16 Instagram Story formats.",
    solution: "Created an asymmetrical kinetic typographic layout with custom warped letterforms, high-contrast neon accents, and modular artist billing blocks that scaled flawlessly across all print and digital dimensions.",
    palette: [
      { name: "Electric Blue", hex: "#2563EB" },
      { name: "Neon Magenta", hex: "#DB2777" },
      { name: "Deep Ink", hex: "#030712" },
      { name: "Paper White", hex: "#F8FAFC" }
    ],
    createdAt: "2024-02-18"
  },
  {
    id: "proj-4",
    title: "Lumina Skincare — Viral Educational Carousel Series & Instagram Kit",
    folderName: "Carousels & Posts — Lumina Skincare Educational Series",
    parentFolder: "Carousels & Posts",
    tagline: "A 10-part educational Instagram carousel campaign, aesthetic ingredient layouts, and branded story templates.",
    category: "Carousels & Posts",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A 10-part educational Instagram carousel campaign focused on active skincare ingredients, routine combinations, and skin myths. Each multi-slide post pairs minimalist product photography with scannable graphic diagrams and typography, generating over 1.2M impressions and 45,000 saves.",
    client: "Lumina Organic Skincare",
    role: "Social Media Graphic Designer",
    tools: ["Photoshop", "Illustrator", "Infographic Design", "Canva Pro"],
    likes: 1980,
    views: 16700,
    featured: false,
    challenges: "Complex dermatological information often causes viewer drop-off. The client needed graphics that were informative, aesthetic, and shareable without feeling clinical or dry.",
    solution: "Developed an elegant visual template system using soft pastel tones, clear typographic hierarchy, step-by-step swipe cues, and summary save-cards that maximize Instagram algorithmic bookmarks.",
    palette: [
      { name: "Rose Clay", hex: "#E0A9A5" },
      { name: "Cream Silk", hex: "#FAF7F2" },
      { name: "Forest Olive", hex: "#3F4E4F" },
      { name: "Deep Charcoal", hex: "#2C3639" }
    ],
    createdAt: "2023-08-05"
  },
  {
    id: "proj-5",
    title: "Zenith Acoustics — High-Converting Paid Social Ad Creative Suite",
    folderName: "Marketing & Ads — Zenith Acoustics Ad Suite",
    parentFolder: "Marketing & Ads",
    tagline: "Performance marketing static and motion ad graphics engineered for Meta and TikTok paid campaigns.",
    category: "Marketing & Ads",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A comprehensive suite of high-converting social media advertising graphics designed for Meta (Instagram/Facebook) and TikTok feeds. Designed side-by-side feature comparison matrices, customer review callouts, seasonal discount flash-sale banners, and story ads that achieved a 4.2x Return on Ad Spend (ROAS).",
    client: "Zenith Audio Hardware",
    role: "Advertising Graphic Designer",
    tools: ["Adobe Photoshop", "After Effects", "Ad Creatives", "Visual Layout"],
    likes: 2150,
    views: 17900,
    featured: false,
    challenges: "Ad fatigue was driving up customer acquisition costs on existing campaigns. The brand needed 20+ distinct visual angles to test against different customer buyer personas.",
    solution: "Constructed modular ad creative matrices featuring bold 'US vs THEM' comparison charts, celebrity press quote cards, unboxing graphics, and high-visibility price-drop stickers.",
    palette: [
      { name: "Deep Midnight", hex: "#0F172A" },
      { name: "Cyber Sapphire", hex: "#3B82F6" },
      { name: "Alert Coral", hex: "#F43F5E" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    createdAt: "2023-09-18"
  },
  {
    id: "proj-6",
    title: "Starlight Records — Vinyl Album Art & Tour Merch Collection",
    folderName: "Packaging & Print — Starlight Records Album",
    parentFolder: "Packaging & Print",
    tagline: "Custom illustrated album artwork, gatefold packaging, tour t-shirts, and digital streaming release graphics.",
    category: "Packaging & Print",
    coverImage: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Custom illustrated album artwork and physical merchandise suite for indie artist national tour. Delivered 12-inch vinyl gatefold packaging with inner sleeve lyrics, tour t-shirt vector graphics, screen-printed gig posters, and digital streaming canvas graphics for Spotify and Apple Music.",
    client: "Starlight Records & Management",
    role: "Graphic & Merchandise Designer",
    year: "2024",
    tools: ["Digital Painting", "Photoshop", "Vector Illustration", "Silk Screen Prep"],
    likes: 2780,
    views: 23400,
    featured: true,
    behanceUrl: "https://behance.net/gallery/starlight-album-art",
    challenges: "Capturing the nostalgic yet futuristic tone of the album and translating fine art illustration into cost-effective multi-color silkscreen apparel and print packaging.",
    solution: "Hand-rendered cosmic illustrations separated into 4 spot colors for crisp, vibrant screen-printing, accompanied by custom vintage display typography for the artist's logo.",
    palette: [
      { name: "Cosmic Indigo", hex: "#312E81" },
      { name: "Starlight Gold", hex: "#F59E0B" },
      { name: "Nebula Violet", hex: "#7C3AED" },
      { name: "Space Dust", hex: "#E0E7FF" }
    ],
    createdAt: "2024-01-25"
  }
];

export const PRESET_SAMPLE_COVERS = [
  { name: "Amazon Product Hero & Infographics", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80" },
  { name: "Amazon Lifestyle & Specs Stack", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80" },
  { name: "Social Media Campaign", url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80" },
  { name: "Brand Identity & Packaging", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80" },
  { name: "Festival Typographic Poster", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" },
  { name: "Instagram Carousel Series", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" },
  { name: "Paid Ad Creative Suite", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80" },
  { name: "Vinyl Album & Merch Art", url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80" }
];

export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: "msg-1",
    senderName: "Sarah Jenkins",
    senderEmail: "sarah.j@lumina-ventures.io",
    subject: "Social Media Campaign & Carousel Creatives",
    inquiryType: "Social Media Graphics",
    message: "Hi Joemarie, I came across your portfolio and love your social media visual designs and carousel graphics. We're launching a major product campaign next month and need high-impact ad creatives and carousels. Let's discuss availability and rates!",
    createdAt: "2026-09-15T14:32:00Z",
    isRead: false
  },
  {
    id: "msg-2",
    senderName: "Marcus Vance",
    senderEmail: "marcus@vancemedia.co",
    subject: "Brand Identity & Visual Graphics Collaboration",
    inquiryType: "Brand Identity",
    message: "Hello Joemarie! We're preparing for a complete brand redesign with matching social media templates and marketing collateral. Your typography and visual compositions are outstanding. Would love to collaborate!",
    createdAt: "2026-09-12T09:15:00Z",
    isRead: true
  }
];
