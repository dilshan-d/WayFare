import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../Models/User.js';
import Destination from '../Models/Destination.js';
import Tour from '../Models/Tour.js';
import Hotel from '../Models/Hotel.js';
import Room from '../Models/Room.js';
import Review from '../Models/Review.js';
import TourBooking from '../Models/TourBooking.js';
import HotelBooking from '../Models/HotelBooking.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Wayfare';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Tour.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Review.deleteMany({});
    await TourBooking.deleteMany({});
    await HotelBooking.deleteMany({});

    console.log('Cleared existing database records.');

    // 1. Create Users
    // NOTE: Pass PLAIN TEXT passwords — the User model's pre-save hook hashes them once.
    // Do NOT manually hash here to avoid double-hashing.

    const admin = await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@wayfare.com',
      password: 'c',
      role: 'admin',
      isAdmin: true,
      phone: '+1 800 555 0199',
      country: 'United States',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const customer = await User.create({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'user@wayfare.com',
      password: 'User@123456',
      role: 'customer',
      isAdmin: false,
      phone: '+1 415 555 2671',
      country: 'Canada',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Users created: Admin (admin@wayfare.com), Customer (user@wayfare.com)');

    // 2. Create 10 Destinations
    const destinationsData = [
      {
        name: 'Ella',
        country: 'Sri Lanka',
        description: 'A serene mountain village surrounded by emerald tea plantations, mist-covered valleys, and iconic viaduct bridges.',
        images: ['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Nine Arches Bridge', 'Little Adams Peak', 'Ella Rock', 'Ravana Falls'],
        bestTimeToVisit: 'January to March',
        featured: true,
      },
      {
        name: 'Kandy',
        country: 'Sri Lanka',
        description: 'The cultural capital nestled amidst rolling hills, home to sacred temples, botanical gardens, and scenic lakes.',
        images: ['https://images.unsplash.com/photo-1588598048216-928646b9b32c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Temple of the Tooth', 'Royal Botanical Gardens', 'Kandy Lake', 'Udawatta Kele Sanctuary'],
        bestTimeToVisit: 'December to April',
        featured: true,
      },
      {
        name: 'Galle',
        country: 'Sri Lanka',
        description: 'A coastal UNESCO World Heritage gem boasting colonial Dutch architecture, ocean view ramparts, and chic boutiques.',
        images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Galle Dutch Fort', 'Galle Lighthouse', 'Unawatuna Beach', 'Maritime Museum'],
        bestTimeToVisit: 'November to April',
        featured: true,
      },
      {
        name: 'Nuwara Eliya',
        country: 'Sri Lanka',
        description: 'Known as Little England, featuring cool highland air, Tudor-style mansions, golf courses, and cascading waterfalls.',
        images: ['https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Gregory Lake', 'Horton Plains & World End', 'Pedro Tea Estate', 'Victoria Park'],
        bestTimeToVisit: 'February to May',
        featured: true,
      },
      {
        name: 'Sigiriya',
        country: 'Sri Lanka',
        description: 'The ancient rock fortress rising 200 meters above tropical jungle, renowned for its water gardens and ancient frescoes.',
        images: ['https://images.unsplash.com/photo-1602643163983-ed0babe3c7da?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Sigiriya Lion Rock Fortress', 'Pidurangala Rock', 'Minneriya Elephant Safari', 'Dambulla Cave Temple'],
        bestTimeToVisit: 'January to April',
        featured: true,
      },
      {
        name: 'Mirissa',
        country: 'Sri Lanka',
        description: 'A vibrant beach haven famed for turquoise waters, whale watching excursions, Coconut Tree Hill, and sunset beach bars.',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Coconut Tree Hill', 'Whale Watching Spot', 'Secret Beach', 'Parrot Rock'],
        bestTimeToVisit: 'November to April',
        featured: true,
      },
      {
        name: 'Bentota',
        country: 'Sri Lanka',
        description: 'The golden sand capital of water sports, luxury beachfront resorts, lagoon cruises, and sea turtle hatcheries.',
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Bentota Beach', 'Madu River Safari', 'Kosgoda Turtle Hatchery', 'Brief Garden'],
        bestTimeToVisit: 'October to April',
        featured: false,
      },
      {
        name: 'Colombo',
        country: 'Sri Lanka',
        description: 'A bustling oceanfront metropolis blending modern skyscrapers, historic temples, vibrant night markets, and dining.',
        images: ['https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Galle Face Green', 'Lotus Tower', 'Gangaramaya Temple', 'Pettah Floating Market'],
        bestTimeToVisit: 'Year-round',
        featured: false,
      },
      {
        name: 'Jaffna',
        country: 'Sri Lanka',
        description: 'A culturally rich northern peninsula filled with colorful Hindu kovils, pristine offshore islands, and delicious cuisine.',
        images: ['https://images.unsplash.com/photo-1602643163983-ed0babe3c7da?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Nallur Kandaswamy Kovil', 'Jaffna Fort', 'Nainativu Island', 'Keerimalai Springs'],
        bestTimeToVisit: 'January to September',
        featured: false,
      },
      {
        name: 'Trincomalee',
        country: 'Sri Lanka',
        description: 'A natural deep-water harbor sanctuary offering serene white beaches, coral island snorkeling, and blue whale sightings.',
        images: ['https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        attractions: ['Pigeon Island National Park', 'Koneswaram Temple', 'Nilaveli Beach', 'Fort Frederick'],
        bestTimeToVisit: 'May to October',
        featured: false,
      },
    ];

    const createdDestinations = await Destination.insertMany(destinationsData);
    console.log(`Created ${createdDestinations.length} destinations.`);

    // Map destination names to Objects for easy lookup
    const destMap = {};
    createdDestinations.forEach((d) => {
      destMap[d.name] = d;
    });

    // 3. Create 10+ Tours
    const toursData = [
      {
        name: 'Ella Highlands Scenic Train & Trekking Odyssey',
        destination: destMap['Ella']._id,
        destinationName: 'Ella',
        description: 'Ride the world-famous blue train through tea estates, trek Nine Arches Bridge, and summit Ella Rock with local guides.',
        images: ['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'],
        price: 249,
        duration: 3,
        category: 'Adventure',
        itinerary: [
          { day: 1, title: 'Scenic Train Ride', description: 'Depart Kandy on the legendary hill country railway to Ella.' },
          { day: 2, title: 'Nine Arches & Little Adams Peak', description: 'Sunrise photo walk at Nine Arches Bridge followed by a gentle hike.' },
          { day: 3, title: 'Ella Rock Trek', description: 'Challenging morning hike to Ella Rock summit for panoramic valley views.' },
        ],
        includedServices: ['Expert Trekking Guide', 'Train Tickets', 'Daily Breakfast', 'Private Hotel Transfers'],
        availableDates: [new Date('2026-09-10'), new Date('2026-09-20'), new Date('2026-10-05')],
        maxParticipants: 15,
        rating: 4.9,
        status: 'active',
      },
      {
        name: 'Sacred Kandy Heritage & Temple Discovery',
        destination: destMap['Kandy']._id,
        destinationName: 'Kandy',
        description: 'Immerse yourself in ancient royal history, attend evening pooja rituals at Temple of the Tooth, and explore royal gardens.',
        images: ['https://images.unsplash.com/photo-1588598048216-928646b9b32c?auto=format&fit=crop&w=800&q=80'],
        price: 180,
        duration: 2,
        category: 'Cultural',
        itinerary: [
          { day: 1, title: 'Temple & Lake Walk', description: 'Visit Temple of the Tooth Relic and stroll around Kandy Lake.' },
          { day: 2, title: 'Peradeniya Botanical Paradise', description: 'Guided tour through 147 acres of tropical orchids and royal palms.' },
        ],
        includedServices: ['Temple Entry Passes', 'Cultural Dance Show', 'Luxury AC Bus', 'Bilingual Guide'],
        availableDates: [new Date('2026-09-15'), new Date('2026-10-01')],
        maxParticipants: 20,
        rating: 4.8,
        status: 'active',
      },
      {
        name: 'Galle Fort Dutch Heritage & Coastal Escape',
        destination: destMap['Galle']._id,
        destinationName: 'Galle',
        description: 'Walk through 400 years of living colonial history inside Galle Fort walls, accompanied by sea breezes and artisan coffee.',
        images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'],
        price: 210,
        duration: 2,
        category: 'Cultural',
        itinerary: [
          { day: 1, title: 'Ramparts & Lighthouse Sunset', description: 'Historical walking tour along ocean ramparts and lighthouse.' },
          { day: 2, title: 'Unawatuna Beach & Stilt Fishing', description: 'Witness traditional stilt fishermen and relax on golden shores.' },
        ],
        includedServices: ['Fort Heritage Guide', 'Seafood Dinner', 'Boutique Hotel Accommodation'],
        availableDates: [new Date('2026-09-12'), new Date('2026-09-25')],
        maxParticipants: 12,
        rating: 4.9,
        status: 'active',
      },
      {
        name: 'Sigiriya Rock Fortress & Elephant Safari',
        destination: destMap['Sigiriya']._id,
        destinationName: 'Sigiriya',
        description: 'Scale the majestic 5th-century Lion Rock fortress and embark on a thrilling 4x4 open-top jeep safari to spot wild elephant herds.',
        images: ['https://images.unsplash.com/photo-1602643163983-ed0babe3c7da?auto=format&fit=crop&w=800&q=80'],
        price: 320,
        duration: 3,
        category: 'Wildlife',
        itinerary: [
          { day: 1, title: 'Sigiriya Lion Rock Climb', description: 'Early morning ascension past ancient frescoes to summit palace ruins.' },
          { day: 2, title: 'Minneriya Elephant Gathering', description: 'Afternoon jeep safari to witness hundreds of Asian elephants.' },
          { day: 3, title: 'Pidurangala Rock Sunrise', description: 'Short trek for spectacular views facing Sigiriya Rock.' },
        ],
        includedServices: ['4x4 Safari Jeep', 'Park Entrance Fees', 'All Meals Included', 'Licensed Naturalist'],
        availableDates: [new Date('2026-09-08'), new Date('2026-09-22')],
        maxParticipants: 16,
        rating: 5.0,
        status: 'active',
      },
      {
        name: 'Nuwara Eliya Tea Gardens & Horton Plains Expedition',
        destination: destMap['Nuwara Eliya']._id,
        destinationName: 'Nuwara Eliya',
        description: 'Experience tea picking in emerald gardens, trek to World’s End precipice, and enjoy high tea at Grand Hotel.',
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'],
        price: 275,
        duration: 3,
        category: 'Nature',
        itinerary: [
          { day: 1, title: 'Tea Estate Tasting', description: 'Pluck tea leaves and sample single-origin Ceylon tea with master blenders.' },
          { day: 2, title: 'Worlds End Trek', description: 'Sunrise hike across cloud-shrouded Horton Plains reserve.' },
          { day: 3, title: 'High Tea & Lake Boating', description: 'Colonial high tea experience and paddle boating on Lake Gregory.' },
        ],
        includedServices: ['Park Permits', 'High Tea Session', 'Private Transportation'],
        availableDates: [new Date('2026-09-18'), new Date('2026-10-10')],
        maxParticipants: 14,
        rating: 4.7,
        status: 'active',
      },
      {
        name: 'Mirissa Blue Whale Watching & Sunset Cruise',
        destination: destMap['Mirissa']._id,
        destinationName: 'Mirissa',
        description: 'Sail into deep ocean waters to encounter majestic Blue Whales, spinner dolphins, and enjoy beachfront coconut cocktails.',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        price: 195,
        duration: 2,
        category: 'Wildlife',
        itinerary: [
          { day: 1, title: 'Ocean Safari', description: 'Morning boat excursion with marine biologists into deep blue waters.' },
          { day: 2, title: 'Coconut Tree Hill Sunset', description: 'Photography walk to Mirissa iconic coconut grove peninsula.' },
        ],
        includedServices: ['Catamaran Boat Cruise', 'Life Vests & Safety Gear', 'Breakfast on Board'],
        availableDates: [new Date('2026-09-14'), new Date('2026-09-28')],
        maxParticipants: 25,
        rating: 4.9,
        status: 'active',
      },
      {
        name: 'Bentota Water Sports & River Safari Extreme',
        destination: destMap['Bentota']._id,
        destinationName: 'Bentota',
        description: 'Get your adrenaline pumping with jet skiing, banana rides, and a serene boat ride through Madu River mangrove tunnels.',
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'],
        price: 160,
        duration: 1,
        category: 'Adventure',
        itinerary: [
          { day: 1, title: 'Mangroves & Jet Skiing', description: 'Morning mangrove river safari followed by afternoon water sports.' },
        ],
        includedServices: ['Jet Ski Pass', 'Mangrove Boat Tour', 'Beachside Buffet Lunch'],
        availableDates: [new Date('2026-09-11'), new Date('2026-09-24')],
        maxParticipants: 18,
        rating: 4.6,
        status: 'active',
      },
      {
        name: 'Trincomalee Coral Reef Snorkeling & Pigeon Island',
        destination: destMap['Trincomalee']._id,
        destinationName: 'Trincomalee',
        description: 'Swim with blacktip reef sharks, sea turtles, and colorful marine life in crystal-clear sanctuary waters.',
        images: ['https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'],
        price: 230,
        duration: 2,
        category: 'Adventure',
        itinerary: [
          { day: 1, title: 'Pigeon Island Snorkeling', description: 'Speedboat transfer to marine park for guided snorkeling.' },
          { day: 2, title: 'Koneswaram Cliff Temple', description: 'Clifftop temple exploration overlooking Swami Rock abyss.' },
        ],
        includedServices: ['Snorkeling Equipment', 'Speedboat Ride', 'National Park Ticket'],
        availableDates: [new Date('2026-09-16'), new Date('2026-10-02')],
        maxParticipants: 10,
        rating: 4.9,
        status: 'active',
      },
      {
        name: 'Jaffna Cultural & Offshore Islands Odyssey',
        destination: destMap['Jaffna']._id,
        destinationName: 'Jaffna',
        description: 'Discover northern heritage, savor authentic Jaffna crab curry, and take a ferry to secluded Nainativu Island.',
        images: ['https://images.unsplash.com/photo-1602643163983-ed0babe3c7da?auto=format&fit=crop&w=800&q=80'],
        price: 290,
        duration: 4,
        category: 'Cultural',
        itinerary: [
          { day: 1, title: 'Jaffna City & Kovil', description: 'Evening pooja at majestic Nallur Kandaswamy Temple.' },
          { day: 2, title: 'Nainativu Island Ferry', description: 'Scenic boat trip across Palk Strait to ancient island shrines.' },
          { day: 3, title: 'Keerimalai Springs & Fort', description: 'Bathe in sacred mineral springs and tour Jaffna Fort.' },
          { day: 4, title: 'Northern Culinary Finale', description: 'Crab cooking masterclass with renowned local chefs.' },
        ],
        includedServices: ['Island Boat Passes', 'Culinary Class & Lunch', 'Hotel Stay'],
        availableDates: [new Date('2026-09-19'), new Date('2026-10-15')],
        maxParticipants: 12,
        rating: 4.8,
        status: 'active',
      },
      {
        name: 'Colombo Cosmopolitan Food & Architecture Tour',
        destination: destMap['Colombo']._id,
        destinationName: 'Colombo',
        description: 'Explore Dutch hospital dining, tuk-tuk street food safari, and architectural highlights from Lotus Tower to Gangaramaya.',
        images: ['https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'],
        price: 120,
        duration: 1,
        category: 'Cultural',
        itinerary: [
          { day: 1, title: 'Tuk Tuk Street Food Safari', description: 'Nighttime culinary tour stopping at 6 famous local eateries.' },
        ],
        includedServices: ['Private Tuk-Tuk Driver', 'All Food & Drink Tastings', 'Lotus Tower Observation Pass'],
        availableDates: [new Date('2026-09-09'), new Date('2026-09-21')],
        maxParticipants: 20,
        rating: 4.7,
        status: 'active',
      },
    ];

    const createdTours = await Tour.insertMany(toursData);
    console.log(`Created ${createdTours.length} tours.`);

    // 4. Create 10+ Hotels
    const hotelsData = [
      {
        name: '99 Acres Resort & Spa',
        destination: destMap['Ella']._id,
        location: 'Ella, Sri Lanka',
        address: '99 Acres Estate, Passara Road, Ella',
        description: 'A luxurious eco-resort perched atop misty hills overlooking Nine Arches Bridge with private infinity pools.',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        rating: 4.9,
        startingPrice: 220,
        amenities: ['Free WiFi', 'Infinity Pool', 'Mountain View', 'Spa & Wellness', 'Fine Dining Restaurant', 'Helipad'],
        status: 'active',
      },
      {
        name: 'Grand Kandyan Hotel',
        destination: destMap['Kandy']._id,
        location: 'Kandy, Sri Lanka',
        address: 'No 891, Peradeniya Road, Kandy',
        description: 'Five-star luxury combining royal Kandyan heritage with modern sophistication, rooftop pool, and 360-degree mountain views.',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'],
        rating: 4.8,
        startingPrice: 160,
        amenities: ['Free WiFi', 'Rooftop Swimming Pool', 'Fitness Center', 'Buffet Restaurant', 'Bar & Lounge'],
        status: 'active',
      },
      {
        name: 'Amangalla Galle Fort',
        destination: destMap['Galle']._id,
        location: 'Galle, Sri Lanka',
        address: '10 Church Street, Galle Fort, Galle',
        description: 'A historic 17th-century Dutch colonial sanctuary with high ceilings, antique furnishings, and tranquil gardens.',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'],
        rating: 5.0,
        startingPrice: 380,
        amenities: ['Free WiFi', 'Hydrotherapy Baths', 'The Baths Spa', 'Colonial Verandah Dining', 'Concierge Service'],
        status: 'active',
      },
      {
        name: 'The Grand Hotel Nuwara Eliya',
        destination: destMap['Nuwara Eliya']._id,
        location: 'Nuwara Eliya, Sri Lanka',
        address: 'Grand Hotel Road, Nuwara Eliya',
        description: 'An iconic Elizabethan manor surrounded by manicured lawns, rose gardens, and traditional British high tea service.',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
        rating: 4.7,
        startingPrice: 190,
        amenities: ['Free WiFi', 'Heated Indoor Pool', 'Billiards Room', 'High Tea Lounge', 'Indian & Thai Dining'],
        status: 'active',
      },
      {
        name: 'Water Garden Sigiriya',
        destination: destMap['Sigiriya']._id,
        location: 'Sigiriya, Sri Lanka',
        address: 'Indigaswewa, Sigiriya',
        description: 'Luxury villas set amidst lotus waterways, lakes, and paddy fields with unobstructed views of Sigiriya Rock.',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
        rating: 4.9,
        startingPrice: 310,
        amenities: ['Private Plunge Pool', 'Free WiFi', 'Organic Farm Dining', 'Ayurvedic Spa', 'Bicycle Rentals'],
        status: 'active',
      },
      {
        name: 'Mandara Resort Mirissa',
        destination: destMap['Mirissa']._id,
        location: 'Mirissa, Sri Lanka',
        address: 'Beach Access Road, Mirissa',
        description: 'A beachfront haven where the river meets the sea, featuring direct ocean access, seafood grills, and palm shade.',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        rating: 4.6,
        startingPrice: 140,
        amenities: ['Beachfront Location', 'Free WiFi', 'Outdoor Pool', 'Seafood BBQ Bar', 'Whale Watch Desk'],
        status: 'active',
      },
      {
        name: 'Cinnamon Bey Beruwala & Bentota',
        destination: destMap['Bentota']._id,
        location: 'Bentota, Sri Lanka',
        address: 'Moragalla, Beruwala / Bentota Coast',
        description: 'A grand Turkish-inspired resort with 6 signature restaurants, sprawling pools, and water sport beach access.',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'],
        rating: 4.7,
        startingPrice: 175,
        amenities: ['6 Restaurants', '3 Swimming Pools', 'Beach Access', 'Free WiFi', 'Kids Play Area'],
        status: 'active',
      },
      {
        name: 'Cinnamon Grand Colombo',
        destination: destMap['Colombo']._id,
        location: 'Colombo, Sri Lanka',
        address: '77 Galle Road, Colombo 03',
        description: 'Premier city center five-star landmark hotel attached to Crescat shopping mall with 14 dining options.',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
        rating: 4.8,
        startingPrice: 185,
        amenities: ['14 Restaurants', 'Free WiFi', '2 Outdoor Pools', 'Executive Lounge', 'Tennis Courts'],
        status: 'active',
      },
      {
        name: 'Jaffna Heritage Hotel',
        destination: destMap['Jaffna']._id,
        location: 'Jaffna, Sri Lanka',
        address: 'Temple Road, Nallur, Jaffna',
        description: 'A tranquil boutique property adjacent to Nallur Kovil, serving traditional vegetarian & Jaffna specialties.',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        rating: 4.5,
        startingPrice: 110,
        amenities: ['Free WiFi', 'Vegetarian Dining', 'Outdoor Pool', 'Courtyard Garden', 'Tour Desk'],
        status: 'active',
      },
      {
        name: 'Trinco Blu by Cinnamon',
        destination: destMap['Trincomalee']._id,
        location: 'Trincomalee, Sri Lanka',
        address: 'Sampaltivu Post, Trincomalee',
        description: 'A retro-chic ocean resort located right on Nilaveli beach, ideal for sea excursions and relaxing.',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'],
        rating: 4.8,
        startingPrice: 155,
        amenities: ['Nilaveli Beach Access', 'Free WiFi', 'Crab Shack Restaurant', 'Dive Center', 'Pool Bar'],
        status: 'active',
      },
    ];

    const createdHotels = await Hotel.insertMany(hotelsData);
    console.log(`Created ${createdHotels.length} hotels.`);

    // 5. Create 20+ Rooms for Hotels
    const roomTypes = ['Deluxe', 'Suite', 'Double', 'Family Suite', 'Single'];
    const roomsData = [];

    createdHotels.forEach((hotel) => {
      // Create 2 to 3 rooms for each hotel
      const r1 = {
        hotel: hotel._id,
        roomType: 'Deluxe',
        description: `Spacious Deluxe room at ${hotel.name} with king bed, balcony views, and marble bathroom.`,
        capacity: 2,
        pricePerNight: hotel.startingPrice,
        amenities: ['King Bed', 'Air Conditioning', 'Free WiFi', 'Mini Bar', 'Flat Screen TV', 'Balcony'],
        images: [hotel.images[0]],
        availability: true,
      };

      const r2 = {
        hotel: hotel._id,
        roomType: 'Suite',
        description: `Luxury Executive Suite at ${hotel.name} featuring separate living room, ocean/mountain panorama, and jacuzzi.`,
        capacity: 3,
        pricePerNight: Math.round(hotel.startingPrice * 1.6),
        amenities: ['King Bed + Sofa', 'Private Jacuzzi', 'Executive Lounge Access', 'Free WiFi', 'Espresso Machine'],
        images: [hotel.images[1] || hotel.images[0]],
        availability: true,
      };

      const r3 = {
        hotel: hotel._id,
        roomType: 'Family Suite',
        description: `Premium Family Suite at ${hotel.name} equipped with 2 double beds and spacious lounge area.`,
        capacity: 4,
        pricePerNight: Math.round(hotel.startingPrice * 2.1),
        amenities: ['2 Queen Beds', 'Living Room', 'Free WiFi', 'Kid Amenities', 'Kitchenette'],
        images: [hotel.images[0]],
        availability: true,
      };

      roomsData.push(r1, r2, r3);
    });

    const createdRooms = await Room.insertMany(roomsData);
    console.log(`Created ${createdRooms.length} rooms.`);

    // 6. Create Reviews
    const reviewsData = [
      {
        user: customer._id,
        targetType: 'Tour',
        targetId: createdTours[0]._id,
        rating: 5,
        comment: 'The Nine Arches Bridge train journey was the highlight of our entire trip to Sri Lanka! Highly recommended!',
        status: 'approved',
      },
      {
        user: customer._id,
        targetType: 'Hotel',
        targetId: createdHotels[0]._id,
        rating: 5,
        comment: '99 Acres Resort exceeded all expectations. Waking up to misty tea valley views was pure magic.',
        status: 'approved',
      },
      {
        user: customer._id,
        targetType: 'Destination',
        targetId: createdDestinations[0]._id,
        rating: 5,
        comment: 'Ella is breathtaking. Cool breezes, lush mountains, friendly locals, and amazing hiking trails.',
        status: 'approved',
      },
      {
        user: customer._id,
        targetType: 'Tour',
        targetId: createdTours[3]._id,
        rating: 5,
        comment: 'Climbing Sigiriya Rock at sunrise and seeing wild elephants in Minneriya park was an unbelievable experience!',
        status: 'approved',
      },
    ];

    await Review.insertMany(reviewsData);
    console.log('Created sample customer reviews.');

    // 7. Create Sample Bookings for demo history
    const sampleTourBooking = await TourBooking.create({
      user: customer._id,
      tour: createdTours[0]._id,
      tourDate: new Date('2026-10-10'),
      numberOfGuests: 2,
      totalAmount: createdTours[0].price * 2,
      bookingReference: 'WF-TR-884920',
      status: 'confirmed',
    });

    const sampleHotelBooking = await HotelBooking.create({
      user: customer._id,
      hotel: createdHotels[0]._id,
      room: createdRooms[0]._id,
      checkIn: new Date('2026-10-11'),
      checkOut: new Date('2026-10-14'),
      numberOfGuests: 2,
      numberOfRooms: 1,
      numberOfNights: 3,
      totalAmount: createdRooms[0].pricePerNight * 3,
      bookingReference: 'WF-HT-192847',
      status: 'confirmed',
    });

    console.log('Created sample tour and hotel bookings for test user.');
    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
