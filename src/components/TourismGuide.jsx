// src/components/TourismGuide.jsx - CivicOne World Tourism & Destinations Explorer with Seasonal Recommendations

import React, { useState, useEffect } from 'react';
import {
  Compass, Search, MapPin, Calendar, DollarSign, ShieldCheck, Bus, Plane,
  Car, Hotel, Utensils, Star, ExternalLink, Filter, Sun, CloudRain, Snowflake,
  Flower2, Trees, Sparkles, CheckCircle2, ChevronRight, Info, AlertCircle
} from 'lucide-react';
import { tourismService } from '../services/api.js';

// Comprehensive dataset of world and Indian destinations with rich seasonal recommendations
export const DESTINATIONS_DATA = [
  {
    id: "dest-manali",
    title: "Manali & Rohtang Pass",
    country: "India",
    state: "Himachal Pradesh",
    city: "Manali",
    category: "Nature & Hills",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Majestic Himalayan mountain town famous for snow-capped peaks, pine valleys, Rohtang Pass, and adrenaline winter sports.",
    bestSeason: "Winter & Summer",
    seasonTag: "❄️ Winter (Dec – Feb) & ☀️ Summer (Apr – Jun)",
    seasonType: "WINTER", // 'WINTER' | 'SUMMER' | 'MONSOON' | 'SPRING' | 'AUTUMN'
    bestMonths: "December to February (For Snow) & April to June (For Treks)",
    temperature: "-4°C to 18°C",
    seasonWhyVisit: "Thick winter snowfall makes Solang Valley and Rohtang ideal for skiing, snowboarding, and snow igloos. In summer, pleasant 15°C weather offers world-class river rafting and paragliding.",
    estimatedBudget: "₹18,000 – ₹45,000 per person",
    popularAttractions: ["Rohtang Pass", "Solang Valley Snow Point", "Hadimba Temple", "Jogini Waterfalls", "Old Manali Cafes"],
    localTransport: "Himachal RTC Volvo Buses, 4x4 Mountain Cabs, Rental Motorbikes (Royal Enfield)",
    safetyInfo: "Ranked among safest tourist hubs in the Himalayas. Border Roads Organisation (BRO) maintains round-the-clock clearance.",
    nearbyHotels: ["The Himalayan Resort", "Span Resort & Spa", "Larisa Resort Manali"],
    nearbyRestaurants: ["Cafe 1947", "Johnson's Cafe & Bar", "Chopsticks Old Manali"],
    seasonalBreakdown: {
      winter: "Heavy snowfall, sub-zero temps, skiing, snowboarding, and frozen waterfalls (Peak Snow Season).",
      spring: "Apple orchards in bloom, pleasant afternoon sunshine, clear high mountain visibility.",
      summer: "Escape the plains heat with cool 15-20°C temperatures, trekking to Bhrigu Lake and Beas Kund.",
      monsoon: "Lush green valleys with occasional cloud bursts; landslides require weather monitoring."
    }
  },
  {
    id: "dest-goa",
    title: "Goa Beaches & Coastal Heritage",
    country: "India",
    state: "Goa",
    city: "Goa",
    category: "Beaches & Coastal",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
    shortDescription: "India's premier coastal haven known for golden sandy beaches, UNESCO Portuguese cathedrals, beach shacks, and seafood cuisine.",
    bestSeason: "Winter & Monsoon",
    seasonTag: "🌴 Winter (Nov – Feb) & 🌧️ Monsoon (Jul – Sep)",
    seasonType: "WINTER",
    bestMonths: "November to February (Beach Sunshine) & July to September (Lush Monsoon)",
    temperature: "22°C to 31°C",
    seasonWhyVisit: "Winter provides gentle tropical sunshine, calm Arabian Sea waters for scuba diving and parasailing, vibrant Sunburn festivals and Christmas celebrations. Monsoon transforms the Western Ghats into lush rainforests and roaring Dudhsagar waterfalls.",
    estimatedBudget: "₹15,000 – ₹55,000 per person",
    popularAttractions: ["Palolem & Baga Beach", "Aguada Fort & Lighthouse", "Basilica of Bom Jesus", "Dudhsagar Waterfalls", "Fontainhas Latin Quarter"],
    localTransport: "Self-drive Scooters & Cars, GoaMiles Registered Cabs, Kadamba AC State Buses",
    safetyInfo: "Very safe coastal state with dedicated tourist police squads and certified beach lifeguards at every 200m.",
    nearbyHotels: ["Taj Exotica Resort Benaulim", "W Goa Vagator", "The Leela Goa Cavelossim"],
    nearbyRestaurants: ["Fisherman's Wharf Panaji", "Thalassa Siolim", "Britto's Baga Beach"],
    seasonalBreakdown: {
      winter: "Sunny skies, 26°C breezes, open water shacks, bustling night markets and watersports.",
      spring: "Warmer beach afternoons with fewer crowds and quiet coastal retreats.",
      summer: "Budget-friendly tropical getaway with warm ocean dips and peaceful sunsets.",
      monsoon: "Lush emerald foliage, surging Dudhsagar waterfalls, and rejuvenating Ayurvedic wellness."
    }
  },
  {
    id: "dest-kashmir",
    title: "Gulmarg & Srinagar Paradise",
    country: "India",
    state: "Jammu & Kashmir",
    city: "Gulmarg & Srinagar",
    category: "Nature & Hills",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Crown of the Himalayas boasting Dal Lake houseboats, Asia's highest cable car Gondola, and legendary alpine snow basins.",
    bestSeason: "Winter & Spring",
    seasonTag: "❄️ Winter (Dec – Mar) & 🌸 Spring (Apr – May)",
    seasonType: "WINTER",
    bestMonths: "December to March (Powder Snow Skiing) & April to May (Tulip Garden Blossom)",
    temperature: "-6°C to 20°C",
    seasonWhyVisit: "Gulmarg receives world-class deep powder snow in winter, making Phase 2 Gondola an international ski hotspot. In spring, Srinagar's Indira Gandhi Memorial Garden showcases 1.5 million blooming tulips alongside serene Dal Lake Shikaras.",
    estimatedBudget: "₹25,000 – ₹65,000 per person",
    popularAttractions: ["Gulmarg Gondola (Phase 1 & 2)", "Dal Lake Shikara Ride", "Indira Gandhi Tulip Garden", "Pahalgam Betaab Valley", "Shankaracharya Temple"],
    localTransport: "Tourist Pre-paid Taxis, Shikara Boats, Gulmarg Gondola Cable Car, Pony Treks",
    safetyInfo: "Protected sovereign tourism corridor with high hospitality standards and 24/7 Tourist Police assistance.",
    nearbyHotels: ["The Khyber Himalayan Resort & Spa", "The Lalit Grand Palace Srinagar", "Nedou's Hotel Gulmarg"],
    nearbyRestaurants: ["Ahdoos Srinagar (Wazwan)", "Highland Park Restaurant", "Mughal Darbar"],
    seasonalBreakdown: {
      winter: "Complete winter wonderland with thick blankets of powder snow, heli-skiing, and frozen lakes.",
      spring: "Asia's largest Tulip Festival, blooming almond orchards, and crystal clear mountain springs.",
      summer: "Pleasant 20°C weather ideal for trekking the Great Lakes of Kashmir and Pahalgam valley.",
      monsoon: "Lush alpine greenery with occasional light showers and pleasant misty morning breezes."
    }
  },
  {
    id: "dest-dubai",
    title: "Dubai Metropolis & Desert",
    country: "United Arab Emirates",
    state: "Emirate of Dubai",
    city: "Dubai",
    category: "Luxury & Modern",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Futuristic sovereign city renowned for the Burj Khalifa, desert dune safaris, luxury marina yachting, and grand shopping festivals.",
    bestSeason: "Winter",
    seasonTag: "❄️ Winter (Nov – Mar) • Peak Season",
    seasonType: "WINTER",
    bestMonths: "November to March (Mild Balmy Weather)",
    temperature: "16°C to 28°C",
    seasonWhyVisit: "Winter is the undisputed golden season for Dubai. Comfortable 22°C temperatures allow full exploration of open-air Global Village, Miracle Garden, rooftop lounges, beach clubs, and sunset desert safaris.",
    estimatedBudget: "₹70,000 – ₹1,80,000 per person",
    popularAttractions: ["Burj Khalifa (148th Floor)", "Palm Jumeirah & Atlantis", "Museum of the Future", "Evening Red Dune Desert Safari", "Dubai Fountain & Mall"],
    localTransport: "Driverless Dubai Metro, Dubai Tram, RTA Official Taxis, Careem, Palm Monorail",
    safetyInfo: "Voted top 3 safest cities globally. Exceptional security, high civic order, and immediate emergency response.",
    nearbyHotels: ["Burj Al Arab Jumeirah", "Atlantis The Royal", "Rove Downtown Dubai"],
    nearbyRestaurants: ["Zuma Dubai (DIFC)", "Pierchic (Al Qasr)", "Al Fanar Traditional Emirati Seafood"],
    seasonalBreakdown: {
      winter: "Flawless sunny days with pleasant 20-25°C weather, global festivals, and vibrant outdoor nightlife.",
      spring: "Warm beach days and pleasant evenings; indoor shopping and theme parks remain fully active.",
      summer: "Hot desert season (38-45°C) with massive luxury indoor air-conditioned attractions and discounted hotels.",
      autumn: "Transition to outdoor weather with reopening of Global Village and Miracle Garden in October."
    }
  },
  {
    id: "dest-munnar",
    title: "Munnar & Alleppey Backwaters",
    country: "India",
    state: "Kerala",
    city: "Munnar & Alleppey",
    category: "Nature & Hills",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
    shortDescription: "God's Own Country featuring emerald rolling tea estates in Munnar and tranquil overnight houseboat cruises in Alleppey.",
    bestSeason: "Winter & Monsoon",
    seasonTag: "🍃 Winter (Oct – Mar) & 🌧️ Monsoon (Jun – Sep)",
    seasonType: "MONSOON",
    bestMonths: "October to March (Pleasant Tea Hills) & June to September (Ayurvedic Monsoon Rejuvenation)",
    temperature: "14°C to 28°C",
    seasonWhyVisit: "Winter offers crisp mountain mist in Munnar and calm waters in Alleppey. Monsoon in Kerala is world-renowned as the premier season for authentic Ayurvedic Panchakarma treatments and overflowing Athirappilly waterfalls.",
    estimatedBudget: "₹16,000 – ₹42,000 per person",
    popularAttractions: ["Alleppey Houseboat Cruise", "Eravikulam National Park (Nilgiri Tahr)", "Tata Tea Museum & Estates", "Mattupetty Dam", "Vembanad Lake"],
    localTransport: "State KSRTC Buses, Private Tour Cabs, Licensed Shikara & Houseboats",
    safetyInfo: "High safety rating with certified boat operators and eco-tourism guards.",
    nearbyHotels: ["Fragrant Nature Munnar", "Kumarakom Lake Resort", "Windermere Estate"],
    nearbyRestaurants: ["Rapsy Restaurant Munnar", "Thaff Delicacy Alleppey", "Saravana Bhavan"],
    seasonalBreakdown: {
      winter: "Cool misty hills, 15°C weather, clear night skies, and ideal boating conditions.",
      spring: "Warm, quiet retreat with lush tea harvest and serene backwater canals.",
      summer: "Pleasant refuge in the Western Ghats with refreshing mountain winds.",
      monsoon: "Prime season for traditional Ayurvedic wellness therapies and dramatic rain-drenched greenery."
    }
  },
  {
    id: "dest-paris",
    title: "Paris & The French Riviera",
    country: "France",
    state: "Île-de-France",
    city: "Paris",
    category: "Historical & Cultural",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    shortDescription: "The City of Light famed for the Eiffel Tower, Louvre masterpieces, iconic Seine River cruises, and world-class haute cuisine.",
    bestSeason: "Spring & Autumn",
    seasonTag: "🌸 Spring (Apr – Jun) & 🍂 Autumn (Sep – Oct)",
    seasonType: "SPRING",
    bestMonths: "April to June (Spring Blooms) & September to October (Golden Autumn Foliage)",
    temperature: "11°C to 22°C",
    seasonWhyVisit: "Spring brings blossoming cherry and chestnut trees across the Tuileries and Luxembourg Gardens with mild sidewalk cafe weather. Autumn offers golden amber tree-lined boulevards and the French wine harvest.",
    estimatedBudget: "₹1,20,000 – ₹2,60,000 per person",
    popularAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral & Seine Cruise", "Arc de Triomphe & Champs-Élysées", "Palace of Versailles"],
    localTransport: "RATP Metro, RER Suburban Rail, Vélib City Bicycles, G7 Taxis",
    safetyInfo: "Modern European capital with tourist police patrol. Keep valuables safe in crowded metro stations.",
    nearbyHotels: ["Le Bristol Paris", "Hotel Plaza Athénée", "CitizenM Paris Gare de Lyon"],
    nearbyRestaurants: ["Le Jules Verne (Eiffel Tower)", "Bistrot Paul Bert", "L'As du Fallafel (Le Marais)"],
    seasonalBreakdown: {
      winter: "Charming Christmas markets, festive city illuminations, and shorter museum queues.",
      spring: "Pleasant 16°C sunshine, blooming botanical gardens, and vibrant outdoor bistro terraces.",
      summer: "Lively summer music festivals, Paris Plages artificial beaches along the Seine.",
      autumn: "Crisp autumn air, golden foliage in parks, and grape harvest celebrations."
    }
  },
  {
    id: "dest-varanasi",
    title: "Varanasi & Holy Ganga Ghats",
    country: "India",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Spiritual & Heritage",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1561361066-6b2160d6961a?auto=format&fit=crop&q=80&w=800",
    shortDescription: "The world's oldest living cultural city, famous for spiritual sunrise boat rides, grand evening Ganga Aarti, and ancient temples.",
    bestSeason: "Autumn & Winter",
    seasonTag: "🪔 Autumn-Winter (Oct – Mar) • Peak Spiritual Season",
    seasonType: "AUTUMN",
    bestMonths: "October to March (Dev Deepawali & Grand Ganga Aarti)",
    temperature: "10°C to 26°C",
    seasonWhyVisit: "Autumn and winter offer serene river breezes. In November, Dev Deepawali illuminates all 84 ghats with over 1 million earthen oil lamps (diyas), accompanied by Vedic chants and musical concerts.",
    estimatedBudget: "₹12,000 – ₹32,000 per person",
    popularAttractions: ["Dashashwamedh Ghat Evening Aarti", "Kashi Vishwanath Temple Corridor", "Morning Sunrise Boat Tour", "Sarnath Buddhist Monuments", "Assi Ghat Yoga & Music"],
    localTransport: "Hand-rowed & Motor Boats, E-Rickshaws, Auto-rickshaws, Heritage Walking Tours",
    safetyInfo: "Heritage city with high spiritual tourism security and constant river police presence.",
    nearbyHotels: ["BrijRama Palace Heritage", "Taj Ganges Varanasi", "Radisson Hotel Varanasi"],
    nearbyRestaurants: ["Kashi Chaat Bhandar", "Deena Chaat Bhandar", "Blue Lassi Shop"],
    seasonalBreakdown: {
      winter: "Morning river mist, comfortable 15°C walking weather, and famous warm malaiyo sweets.",
      spring: "Warm spiritual afternoons and festive Maha Shivaratri celebrations.",
      summer: "Intense dry heat; temple visits best conducted during early morning and night.",
      monsoon: "High water levels in river Ganga; ghat walks may be submerged, but spiritual chants continue."
    }
  },
  {
    id: "dest-tokyo",
    title: "Tokyo & Kyoto Imperial Heritage",
    country: "Japan",
    state: "Kanto & Kansai",
    city: "Tokyo & Kyoto",
    category: "Historical & Modern",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Harmonious fusion of neon cyber-metropolises in Tokyo with timeless Zen temples, bamboo groves, and geisha districts in Kyoto.",
    bestSeason: "Spring & Autumn",
    seasonTag: "🌸 Spring (Mar – May) & 🍂 Autumn (Oct – Nov)",
    seasonType: "SPRING",
    bestMonths: "March to May (Cherry Blossom Season) & October to November (Red Maple Foliage)",
    temperature: "10°C to 21°C",
    seasonWhyVisit: "Spring's Sakura (Cherry Blossom) season paints Ueno Park and Kyoto's Philosopher's Path in pink petals. Autumn brings the Momiji festival with breathtaking scarlet maple leaves surrounding ancient wooden temples.",
    estimatedBudget: "₹1,10,000 – ₹2,40,000 per person",
    popularAttractions: ["Shibuya & Shinjuku Crossing", "Senso-ji Temple Asakusa", "Fushimi Inari 10,000 Torii Gates", "Arashiyama Bamboo Forest", "Mount Fuji Panoramic Tour"],
    localTransport: "JR Shinkansen Bullet Train, Tokyo Metro, Suica / Pasmo IC Cards",
    safetyInfo: "Ranked among the safest countries on earth with near-zero crime rates and world-leading punctuality.",
    nearbyHotels: ["Park Hyatt Tokyo", "The Ritz-Carlton Kyoto", "Hotel Gracery Shinjuku"],
    nearbyRestaurants: ["Sukiyabashi Jiro", "Ichiran Ramen Shinjuku", "Gion Karyo Kyoto"],
    seasonalBreakdown: {
      winter: "Clear blue skies, pristine snowy views of Mount Fuji, hot onsen baths, and illuminated streets.",
      spring: "World-famous Cherry Blossom (Sakura) blooming festivals with hanami picnics under pink trees.",
      summer: "Vibrant traditional Matsuri festivals, firework displays along Sumida River, and Mt. Fuji climbing.",
      autumn: "Spectacular crimson maple foliage (Momiji) across Kyoto temples with crisp 15°C weather."
    }
  },
  {
    id: "dest-jaipur",
    title: "Jaipur & Udaipur (Royal Rajasthan)",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur & Udaipur",
    category: "Historical & Heritage",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Land of Maharajas boasting majestic hilltop forts, opulent lake palaces, camel desert safaris, and colorful bazaars.",
    bestSeason: "Winter",
    seasonTag: "🏰 Winter (Oct – Mar) • Royal Season",
    seasonType: "WINTER",
    bestMonths: "October to March (Pleasant Royal Heritage Season)",
    temperature: "10°C to 26°C",
    seasonWhyVisit: "Winter is the perfect royal season for exploring massive Amber and Mehrangarh forts without desert heat, enjoying sunset boat rides on Udaipur's Lake Pichola, and attending the Jaipur Literature Festival.",
    estimatedBudget: "₹16,000 – ₹48,000 per person",
    popularAttractions: ["Amber Fort & Sheesh Mahal", "Hawa Mahal (Palace of Winds)", "City Palace Udaipur & Lake Pichola", "Jal Mahal (Water Palace)", "Pushkar & Thar Desert Safaris"],
    localTransport: "Rajasthan State RSRTC Deluxe Buses, Pre-paid Taxis, Royal Heritage Cabs, E-Rickshaws",
    safetyInfo: "Dedicated tourist protection cells and licensed heritage tour guides.",
    nearbyHotels: ["Taj Lake Palace Udaipur", "Rambagh Palace Jaipur", "Umaid Bhawan Palace Jodhpur"],
    nearbyRestaurants: ["LMB (Laxmi Mishtan Bhandar) Jaipur", "1559 AD Udaipur", "Chokhi Dhani Ethnic Resort"],
    seasonalBreakdown: {
      winter: "Sunny days, crisp 12°C desert nights, royal folk festivals, and vibrant handicrafts fairs.",
      spring: "Warm pleasant days celebrating the grand Gangaur and Elephant festivals.",
      summer: "Scorching desert heat (38-44°C); best for visiting air-conditioned palaces and indoor museums.",
      monsoon: "Lakes in Udaipur refill to full capacity, creating romantic palace backdrops and green Aravalli hills."
    }
  },
  {
    id: "dest-switzerland",
    title: "Swiss Alps & Interlaken",
    country: "Switzerland",
    state: "Bernese Oberland",
    city: "Interlaken & Zermatt",
    category: "Nature & Hills",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Alpine wonderland offering Jungfraujoch 'Top of Europe', Matterhorn peak, turquoise glacial lakes, and world-class skiing.",
    bestSeason: "Summer & Winter",
    seasonTag: "🏔️ Summer (Jun – Sep) & ❄️ Winter (Dec – Mar)",
    seasonType: "SUMMER",
    bestMonths: "June to September (Alpine Treks & Lake Cruises) & December to March (Ski Slopes & Glaciers)",
    temperature: "-6°C to 24°C",
    seasonWhyVisit: "Summer features lush wildflower meadows, 22°C weather, paragliding over Interlaken, and Lake Brienz steamboat cruises. Winter provides guaranteed glacier snow, world-championship ski slopes in Zermatt, and scenic Glacier Express train rides.",
    estimatedBudget: "₹1,80,000 – ₹3,50,000 per person",
    popularAttractions: ["Jungfraujoch Top of Europe (3,454m)", "Matterhorn & Zermatt Glaciers", "Lauterbrunnen 72 Waterfalls Valley", "Lake Thun & Lake Brienz Cruise", "Glacier Express Panoramic Train"],
    localTransport: "SBB Swiss Federal Railways, Cogwheel Alpine Trains, Cable Cars, Panoramic PostBuses",
    safetyInfo: "World-class alpine safety standards, pristine tap water everywhere, and 24/7 mountain rescue operations.",
    nearbyHotels: ["Victoria-Jungfrau Grand Hotel", "The Omnia Zermatt", "Hotel Bellevue des Alpes"],
    nearbyRestaurants: ["Restaurant Taverne Interlaken (Fondue)", "Chez Vrony Zermatt", "Restaurant Laterne"],
    seasonalBreakdown: {
      winter: "Epic snowy wonderland with 200+ km of ski slopes, snowshoeing, and romantic fireside fondue.",
      spring: "Thawing valleys with roaring waterfall cascades and waking alpine flora.",
      summer: "Pristine hiking trails, warm turquoise lake swims, mountain biking, and open panoramic cable cars.",
      autumn: "Golden larch forests, crisp mountain air, and uncrowded alpine summits."
    }
  },
  {
    id: "dest-bali",
    title: "Bali Tropical Beaches & Ubud",
    country: "Indonesia",
    state: "Bali",
    city: "Ubud & Seminyak",
    category: "Beaches & Coastal",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    shortDescription: "Island of the Gods boasting emerald rice terraces, cliffside Uluwatu temples, volcanic sunrises, and private pool villas.",
    bestSeason: "Summer Dry Season",
    seasonTag: "☀️ Dry Season (Apr – Oct) • Best Beach Season",
    seasonType: "SUMMER",
    bestMonths: "April to October (Dry, Sunny & Low Humidity)",
    temperature: "24°C to 30°C",
    seasonWhyVisit: "The dry summer season guarantees brilliant blue skies, minimal rainfall, and low humidity—ideal for surfing in Canggu, snorkeling with manta rays in Nusa Penida, and hiking Mount Batur for sunrise.",
    estimatedBudget: "₹45,000 – ₹95,000 per person",
    popularAttractions: ["Uluwatu Temple & Kecak Fire Dance", "Tegallalang Rice Terraces Ubud", "Nusa Penida Kelingking Beach", "Mount Batur Sunrise Trek", "Seminyak Beach Clubs"],
    localTransport: "Private Car with Driver, Rental Scooters, Grab / Gojek Ride Apps",
    safetyInfo: "Very tourist-friendly island with widespread digital payments and hospital facilities.",
    nearbyHotels: ["Four Seasons Resort Bali at Sayan", "Ayana Resort Jimbaran", "The Kayon Jungle Resort Ubud"],
    nearbyRestaurants: ["Locavore Ubud", "Merah Putih Seminyak", "Bebek Bengil Dirty Duck"],
    seasonalBreakdown: {
      winter: "Tropical showers with warm ocean waters, lower hotel rates, and vibrant green jungle rivers.",
      spring: "Start of the dry season with sunny mornings, cool evening sea breezes, and quiet beaches.",
      summer: "Peak dry sunshine with virtually no rain, ideal surfing waves, and world-class diving.",
      autumn: "Pleasant warm waters, uncrowded yoga retreats, and calm beach sunsets."
    }
  },
  {
    id: "dest-ladakh",
    title: "Leh Ladakh & Pangong Lake",
    country: "India",
    state: "Ladakh UT",
    city: "Leh & Nubra",
    category: "Nature & Hills",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=800",
    shortDescription: "High-altitude desert wonderland renowned for crystal blue Pangong Tso lake, Nubra sand dunes, and Khardung La pass.",
    bestSeason: "Summer",
    seasonTag: "☀️ Summer (May – Sep) • Pass Opening Season",
    seasonType: "SUMMER",
    bestMonths: "May to September (All High-Altitude Mountain Passes Open)",
    temperature: "4°C to 22°C",
    seasonWhyVisit: "Summer is the only season when the Manali-Leh and Srinagar-Leh highways and passes like Khardung La (17,982 ft) are fully open. Clear blue skies offer surreal reflections across Pangong Tso and spectacular Milky Way stargazing.",
    estimatedBudget: "₹28,000 – ₹60,000 per person",
    popularAttractions: ["Pangong Tso Lake (14,270 ft)", "Nubra Valley & Double-Humped Camels", "Khardung La Mountain Pass", "Hemis & Thiksey Monasteries", "Magnetic Hill & Indus Confluence"],
    localTransport: "Registered Ladakh Taxi Union 4x4 SUVs, Himalayan Bullet Rentals",
    safetyInfo: "Mandatory 48-hour acclimatization in Leh recommended. Armed forces medical bases available along routes.",
    nearbyHotels: ["The Grand Dragon Ladakh", "Nubra Organic Retreat", "Pangong Camp Resort"],
    nearbyRestaurants: ["The Tibetan Kitchen Leh", "Gesmo Restaurant", "Bon Appetit Leh"],
    seasonalBreakdown: {
      winter: "Extreme -20°C deep freeze; only for the daring Chadar Frozen River Trek and snow leopard expeditions.",
      spring: "Snow begins clearing from passes; apricot blossoms bloom in Sham Valley.",
      summer: "All highways open, crystal blue lakes, pleasant 18°C sunshine, and colorful monastery festivals.",
      autumn: "Golden poplar trees and crisp chilly nights before early winter snow closes high passes."
    }
  }
];

export default function TourismGuide({ onSelectTravelBooking }) {
  const [destinations, setDestinations] = useState(DESTINATIONS_DATA);
  const [search, setSearch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDest, setSelectedDest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter handlers
  const seasons = [
    { id: 'ALL', label: 'All Seasons', icon: Sparkles },
    { id: 'WINTER', label: '❄️ Winter (Dec – Feb)', icon: Snowflake },
    { id: 'SPRING', label: '🌸 Spring (Mar – May)', icon: Flower2 },
    { id: 'SUMMER', label: '☀️ Summer (May – Aug)', icon: Sun },
    { id: 'MONSOON', label: '🌧️ Monsoon (Jun – Sep)', icon: CloudRain },
    { id: 'AUTUMN', label: '🍂 Autumn (Sep – Nov)', icon: Trees }
  ];

  const categories = ['ALL', 'Nature & Hills', 'Beaches & Coastal', 'Historical & Heritage', 'Luxury & Modern', 'Spiritual & Heritage'];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSeason = selectedSeason === 'ALL' || dest.seasonType === selectedSeason || dest.bestSeason.toUpperCase().includes(selectedSeason);
    const matchesCategory = selectedCategory === 'ALL' || dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search.trim() ||
      dest.title.toLowerCase().includes(search.toLowerCase()) ||
      dest.city.toLowerCase().includes(search.toLowerCase()) ||
      dest.country.toLowerCase().includes(search.toLowerCase()) ||
      dest.seasonTag.toLowerCase().includes(search.toLowerCase()) ||
      dest.bestMonths.toLowerCase().includes(search.toLowerCase());

    return matchesSeason && matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border-light)',
      padding: '32px 24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F0FDF4',
          color: '#166534',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '10px'
        }}>
          <Compass size={16} /> CIVICONE WORLD • GLOBAL & INDIAN DESTINATIONS
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Places & Destinations to Visit with Seasonal Guides
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '840px', lineHeight: '1.5' }}>
          Discover handpicked global and Indian destinations with curated guidance on <strong>best seasons to visit</strong>, expected climate temperatures, seasonal attractions, local transit, and safety verification.
        </p>
      </div>

      {/* SEARCH & SEASON FILTER CONTROLS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        
        {/* Search Box */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination name, city, country, or season (e.g. Manali, Winter, Goa, Dubai, Spring)..."
            style={{
              width: '100%',
              padding: '13px 16px 13px 46px',
              borderRadius: '14px',
              border: '1.5px solid var(--border-light)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          />
        </div>

        {/* SEASON SELECTOR PILLS */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Filter by Ideal Season to Visit:
          </span>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {seasons.map((s) => {
              const isSelected = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isSelected ? '#0B5ED7' : 'var(--bg-main)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 12px rgba(11, 94, 215, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                backgroundColor: selectedCategory === cat ? '#EFF6FF' : 'transparent',
                color: selectedCategory === cat ? '#1D4ED8' : 'var(--text-light)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* DESTINATIONS GRID */}
      {filteredDestinations.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--bg-main)', borderRadius: '20px', color: 'var(--text-muted)' }}>
          <Compass size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>No Destinations Match Filter</h3>
          <p style={{ fontSize: '0.85rem' }}>Try clearing your search term or switching to "All Seasons".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1.5px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              className="hover-card"
            >
              <div>
                {/* Destination Image & Badges */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img
                    src={dest.image}
                    alt={dest.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Rating Badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(11, 31, 58, 0.85)', backdropFilter: 'blur(6px)', color: '#FEF08A', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} fill="#FEF08A" /> {dest.rating}
                  </div>

                  {/* Category Pill */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)', color: '#0B1F3A', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {dest.category}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  
                  {/* Location & Title */}
                  <div style={{ fontSize: '0.775rem', color: '#0B5ED7', fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {dest.city}, {dest.country}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {dest.title}
                  </h3>

                  {/* PROMINENT SEASON RECOMMENDATION BADGE */}
                  <div style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ⭐ Best Season to Visit
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7' }}>
                        🌡️ {dest.temperature}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>
                      {dest.seasonTag}
                    </div>
                  </div>

                  {/* Why Visit in Season Highlight */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.4',
                    marginBottom: '14px'
                  }}>
                    <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>
                      💡 Seasonal Highlights:
                    </strong>
                    {dest.seasonWhyVisit}
                  </div>

                  {/* Budget & Safety */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', paddingTop: '4px', borderTop: '1px solid var(--border-light)' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: 700 }}>Est. Budget:</span>{' '}
                      <strong style={{ color: '#059669', fontWeight: 800 }}>{dest.estimatedBudget}</strong>
                    </div>
                    <span style={{ color: '#047857', fontWeight: 800, fontSize: '0.725rem', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                      🟢 Verified Safe
                    </span>
                  </div>

                </div>
              </div>

              {/* Card Footer Button */}
              <div style={{ padding: '0 20px 20px 20px' }}>
                <button
                  onClick={() => setSelectedDest(dest)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(11, 94, 215, 0.2)'
                  }}
                >
                  <Calendar size={15} /> View Seasonal Guide & Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED SEASONAL DESTINATION MODAL */}
      {selectedDest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '780px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid #DBEAFE',
            position: 'relative'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Compass size={14} /> CIVICONE WORLD DESTINATION GUIDE
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0B1F3A' }}>
                  {selectedDest.title}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={14} color="#0B5ED7" /> {selectedDest.city}, {selectedDest.country}
                </div>
              </div>

              <button
                onClick={() => setSelectedDest(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontWeight: 800, fontSize: '1.1rem', color: '#64748B', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Hero Image */}
            <div style={{ position: 'relative', height: '260px', borderRadius: '18px', overflow: 'hidden', marginBottom: '22px' }}>
              <img
                src={selectedDest.image}
                alt={selectedDest.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', backgroundColor: 'rgba(11, 31, 58, 0.9)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                {selectedDest.seasonTag}
              </div>
            </div>

            {/* Top 3 Quick Highlight Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>BEST MONTHS TO VISIT</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>{selectedDest.bestMonths}</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>ESTIMATED BUDGET</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{selectedDest.estimatedBudget}</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>CLIMATE TEMPERATURE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0B5ED7', marginTop: '2px' }}>{selectedDest.temperature}</div>
              </div>
            </div>

            {/* 4-SEASON COMPLETE CLIMATE BREAKDOWN */}
            <div style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '18px', marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} /> 4-Season Climate & Travel Breakdown:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                  <strong style={{ color: '#0369A1', display: 'block', marginBottom: '2px' }}>❄️ Winter:</strong>
                  <span style={{ color: '#334155' }}>{selectedDest.seasonalBreakdown.winter}</span>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                  <strong style={{ color: '#D97706', display: 'block', marginBottom: '2px' }}>🌸 Spring:</strong>
                  <span style={{ color: '#334155' }}>{selectedDest.seasonalBreakdown.spring}</span>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                  <strong style={{ color: '#B45309', display: 'block', marginBottom: '2px' }}>☀️ Summer:</strong>
                  <span style={{ color: '#334155' }}>{selectedDest.seasonalBreakdown.summer}</span>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                  <strong style={{ color: '#047857', display: 'block', marginBottom: '2px' }}>🌧️ Monsoon:</strong>
                  <span style={{ color: '#334155' }}>{selectedDest.seasonalBreakdown.monsoon}</span>
                </div>
              </div>
            </div>

            {/* Popular Attractions */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} color="#D97706" /> Must-Visit Landmarks & Attractions:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedDest.popularAttractions.map((att, i) => (
                  <span key={i} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '6px 12px', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 700 }}>
                    {att}
                  </span>
                ))}
              </div>
            </div>

            {/* Local Transport */}
            <div style={{ marginBottom: '20px', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bus size={15} color="#0B5ED7" /> Local Transit & Commuting:
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
                {selectedDest.localTransport}
              </p>
            </div>

            {/* Verified Hotels & Restaurants */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hotel size={14} /> Verified Stays & Resorts
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.825rem', color: '#334155' }}>
                  {selectedDest.nearbyHotels.map((h, idx) => <li key={idx}>{h}</li>)}
                </ul>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Utensils size={14} /> Authentic Food & Dining
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.825rem', color: '#334155' }}>
                  {selectedDest.nearbyRestaurants.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedDest(null)}
                style={{
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 26px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
