const properties = [
  {
    id: 1,
    title: "Skyline Heights",
    type: "SQFT Investment",

    // NEW STATS
    totalValuation: "45,600",
    pricePerSqft: "1,734",
    availableUnits: 220,
    soldUnits: 180,

    images: {
      main: [
        "https://picsum.photos/800/500?1",
        "https://picsum.photos/800/500?2",
        "https://picsum.photos/800/500?3"
      ],
      thumbnails: [
        "https://picsum.photos/120/80?1",
        "https://picsum.photos/120/80?2",
        "https://picsum.photos/120/80?3",
        "https://picsum.photos/120/80?4"
      ]
    },

    description:
      "Experience luxury living at Skyline Heights, a premium residential property designed for modern urban living and strong investment returns.",

    keyHighlights: [
      "Prime location with excellent connectivity",
      "High rental yield potential",
      "Premium residential segment",
      "Modern architecture",
      "Strong capital appreciation",
      "Rental protection available"
    ],

    specifications: {
      totalArea: "1,450 sqft",
      propertyType: "Residential",
      location: "Kharar, Punjab",
      totalInvestors: 120,
      parkingSpaces: 82,
      listingType: "For Sale"
    },

    amenities: [
      "24/7 Security",
      "Swimming Pool",
      "Private Garden",
      "Parking",
      "Clubhouse",
      "Garden/Park",
      "Power Backup",
      "Elevator",
      "Children's Play Area",
      "Maintenance Staff"
    ]
  },

  {
    id: 2,
    title: "Urban Square Residency",
    type: "Fractional Buy",

    totalValuation: "32,000",
    pricePerSqft: "1,450",
    availableUnits: 150,
    soldUnits: 90,

    images: {
      main: [
        "https://picsum.photos/800/500?4",
        "https://picsum.photos/800/500?5"
      ],
      thumbnails: [
        "https://picsum.photos/120/80?5",
        "https://picsum.photos/120/80?6",
        "https://picsum.photos/120/80?7"
      ]
    },

    description:
      "Urban Square Residency offers modern living spaces in Gurgaon with excellent connectivity and investment potential.",

    keyHighlights: [
      "Near IT hubs",
      "High appreciation potential",
      "Strong rental demand",
      "Smart home features",
      "Premium clubhouse",
      "24/7 surveillance"
    ],

    specifications: {
      totalArea: "980 sqft",
      propertyType: "Residential",
      location: "Gurgaon, Haryana",
      totalInvestors: 85,
      parkingSpaces: 60,
      listingType: "For Sale"
    },

    amenities: [
      "Gym",
      "Swimming Pool",
      "Security",
      "Parking",
      "WiFi",
      "Lift",
      "Power Backup",
      "Garden",
      "Kids Area",
      "Jogging Track"
    ]
  },

  {
    id: 3,
    title: "Green Valley Villas",
    type: "One Time Buy",

    totalValuation: "78,000",
    pricePerSqft: "2,200",
    availableUnits: 40,
    soldUnits: 25,

    images: {
      main: [
        "https://picsum.photos/800/500?6",
        "https://picsum.photos/800/500?7"
      ],
      thumbnails: [
        "https://picsum.photos/120/80?8",
        "https://picsum.photos/120/80?9"
      ]
    },

    description:
      "Green Valley Villas provides a peaceful and spacious living environment ideal for families.",

    keyHighlights: [
      "Eco-friendly development",
      "Spacious villas",
      "Peaceful surroundings",
      "High resale value",
      "Gated community",
      "Premium interiors"
    ],

    specifications: {
      totalArea: "2,200 sqft",
      propertyType: "Villa",
      location: "Nagpur, Maharashtra",
      totalInvestors: 40,
      parkingSpaces: 35,
      listingType: "For Sale"
    },

    amenities: [
      "Private Garden",
      "Security",
      "Parking",
      "Clubhouse",
      "Power Backup",
      "CCTV",
      "Kids Play Area",
      "Walking Track",
      "Swimming Pool",
      "Maintenance"
    ]
  },

  {
    id: 4,
    title: "Metro Business Park",
    type: "SQFT Investment",

    totalValuation: "120,000",
    pricePerSqft: "2,800",
    availableUnits: 300,
    soldUnits: 210,

    images: {
      main: [
        "https://picsum.photos/800/500?8",
        "https://picsum.photos/800/500?9",
        "https://picsum.photos/800/500?10"
      ],
      thumbnails: [
        "https://picsum.photos/120/80?10",
        "https://picsum.photos/120/80?11",
        "https://picsum.photos/120/80?12"
      ]
    },

    description:
      "A premium commercial investment opportunity in Bangalore's prime business district.",

    keyHighlights: [
      "Prime commercial hub",
      "High rental yield",
      "Corporate tenants",
      "Modern infrastructure",
      "Excellent connectivity",
      "24/7 maintenance"
    ],

    specifications: {
      totalArea: "1,800 sqft",
      propertyType: "Commercial",
      location: "Bangalore, Karnataka",
      totalInvestors: 200,
      parkingSpaces: 150,
      listingType: "For Sale"
    },

    amenities: [
      "Security",
      "Parking",
      "Elevator",
      "Power Backup",
      "Cafeteria",
      "Conference Rooms",
      "Reception",
      "WiFi",
      "Fire Safety",
      "Maintenance Staff"
    ]
  },

  {
    id: 5,
    title: "Lakeview Apartments",
    type: "Fractional Buy",

    totalValuation: "54,000",
    pricePerSqft: "1,950",
    availableUnits: 180,
    soldUnits: 120,

    images: {
      main: [
        "https://picsum.photos/800/500?11",
        "https://picsum.photos/800/500?12"
      ],
      thumbnails: [
        "https://picsum.photos/120/80?13",
        "https://picsum.photos/120/80?14",
        "https://picsum.photos/120/80?15"
      ]
    },

    description:
      "Lakeview Apartments offer scenic views and modern living with strong investment returns.",

    keyHighlights: [
      "Lake-facing units",
      "High rental income",
      "Premium location",
      "Modern design",
      "Secure gated society",
      "Good resale value"
    ],

    specifications: {
      totalArea: "1,200 sqft",
      propertyType: "Residential",
      location: "Pune, Maharashtra",
      totalInvestors: 95,
      parkingSpaces: 70,
      listingType: "For Sale"
    },

    amenities: [
      "Swimming Pool",
      "Gym",
      "Security",
      "Parking",
      "Garden",
      "Lift",
      "Power Backup",
      "Kids Area",
      "Clubhouse",
      "Jogging Track"
    ]
  }
];

export default properties;
