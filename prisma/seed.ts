import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive DealerOS database seed...');

  // 1. Create Dealership Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-motors' },
    update: {},
    create: {
      id: 'org_apex_motors',
      name: 'Apex Auto Gallery',
      slug: 'apex-motors',
      phone: '(512) 555-0199',
      email: 'sales@apexautogallery.com',
      address: '4500 Auto Mall Parkway',
      city: 'Austin',
      state: 'TX',
      zip: '78759',
      website: 'https://apexautogallery.com',
      logoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=300&q=80',
      settingsJson: JSON.stringify({
        defaultDocFee: 499,
        stateTaxRate: 6.25,
        defaultTargetMarginPercent: 15,
        autoPublishStorefront: true,
        aiSalesAgentEnabled: true,
        aiAutoReplyThreshold: 'PREFERRED_PRICE',
      }),
    },
  });

  // 2. Create Users & Staff Members with secure bcrypt passwordHash (Default password: dealer123)
  const defaultPasswordHash = bcrypt.hashSync('dealer123', 10);
  
  const userMarcus = await prisma.user.upsert({
    where: { email: 'marcus@apexautogallery.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: 'user_marcus_vance',
      name: 'Marcus Vance',
      email: 'marcus@apexautogallery.com',
      passwordHash: defaultPasswordHash,
      phone: '(512) 555-0101',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  });

  const userSarah = await prisma.user.upsert({
    where: { email: 'sarah@apexautogallery.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: 'user_sarah_chen',
      name: 'Sarah Chen',
      email: 'sarah@apexautogallery.com',
      passwordHash: defaultPasswordHash,
      phone: '(512) 555-0102',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
  });

  const userDavid = await prisma.user.upsert({
    where: { email: 'david@apexautogallery.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: 'user_david_miller',
      name: 'David Miller',
      email: 'david@apexautogallery.com',
      passwordHash: defaultPasswordHash,
      phone: '(512) 555-0103',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  });

  const userCarlos = await prisma.user.upsert({
    where: { email: 'carlos@apexautogallery.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: 'user_carlos_mendez',
      name: 'Carlos Mendez',
      email: 'carlos@apexautogallery.com',
      passwordHash: defaultPasswordHash,
      phone: '(512) 555-0104',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  });

  // Assign memberships in Apex Auto Gallery
  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: userMarcus.id } },
    update: { role: 'OWNER' },
    create: { organizationId: org.id, userId: userMarcus.id, role: 'OWNER' },
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: userSarah.id } },
    update: { role: 'SALES' },
    create: { organizationId: org.id, userId: userSarah.id, role: 'SALES' },
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: userDavid.id } },
    update: { role: 'FINANCE' },
    create: { organizationId: org.id, userId: userDavid.id, role: 'FINANCE' },
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: userCarlos.id } },
    update: { role: 'INVENTORY' },
    create: { organizationId: org.id, userId: userCarlos.id, role: 'INVENTORY' },
  });

  // 2b. Create Second Tenant Organization (Metro City Imports) for Tenant Isolation Testing
  const orgMetro = await prisma.organization.upsert({
    where: { slug: 'metro-city-imports' },
    update: {},
    create: {
      id: 'org_metro_imports',
      name: 'Metro City Imports',
      slug: 'metro-city-imports',
      phone: '(214) 555-0899',
      email: 'sales@metrocityimports.com',
      address: '7800 Stemmons Freeway',
      city: 'Dallas',
      state: 'TX',
      zip: '75247',
      website: 'https://metrocityimports.com',
      settingsJson: JSON.stringify({
        defaultDocFee: 395,
        stateTaxRate: 6.25,
        defaultTargetMarginPercent: 12,
        autoPublishStorefront: true,
        aiSalesAgentEnabled: true,
      }),
    },
  });

  const userElena = await prisma.user.upsert({
    where: { email: 'elena@metrocityimports.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: 'user_elena_rostova',
      name: 'Elena Rostova',
      email: 'elena@metrocityimports.com',
      passwordHash: defaultPasswordHash,
      phone: '(214) 555-0801',
    },
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: orgMetro.id, userId: userElena.id } },
    update: { role: 'OWNER' },
    create: { organizationId: orgMetro.id, userId: userElena.id, role: 'OWNER' },
  });

  // Marcus is also a VIEWER member of Metro City Imports (Multi-org test)
  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: orgMetro.id, userId: userMarcus.id } },
    update: { role: 'VIEWER' },
    create: { organizationId: orgMetro.id, userId: userMarcus.id, role: 'VIEWER' },
  });

  // 3. Locations
  const locMain = await prisma.location.upsert({
    where: { id: 'loc_austin_main' },
    update: {},
    create: {
      id: 'loc_austin_main',
      organizationId: org.id,
      name: 'Main Showroom & Lot',
      address: '4500 Auto Mall Parkway',
      city: 'Austin',
      state: 'TX',
      zip: '78759',
      phone: '(512) 555-0199',
      isPrimary: true,
    },
  });

  // 4. Vehicles Data (22 realistic vehicles)
  const vehicleDefs = [
    {
      id: 'veh_camry_2022',
      vin: '4T1B11HK5NU109283',
      stockNumber: 'AP-1042',
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      trim: 'SE',
      mileage: 28400,
      exteriorColor: 'Celestial Silver Metallic',
      interiorColor: 'Black SofTex',
      engine: '2.5L I4 DOHC 16V',
      transmission: '8-Speed Direct Shift Automatic',
      drivetrain: 'FWD',
      fuelType: 'Gasoline',
      bodyStyle: 'Sedan',
      doors: 4,
      purchaseDate: new Date('2026-07-15'),
      purchaseSource: 'MANHEIM',
      purchasePrice: 18500,
      totalCostBasis: 20350,
      askingPrice: 24400,
      preferredPrice: 23900,
      minPrice: 23000,
      status: 'LISTED',
      conditionGrade: 'CLEAN',
      daysInInventory: 21,
      notes: 'Clean 1-owner off-lease vehicle. Full synthetic oil change & brake fluid flush completed.',
      photos: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'Manheim Dallas Buy Price', amount: 18500 },
        { category: 'AUCTION_FEE', description: 'Manheim Buyer Fee', amount: 650 },
        { category: 'TRANSPORTATION', description: 'Transport Dallas -> Austin', amount: 350 },
        { category: 'MECHANICAL', description: 'Oil, Filter, Air Filter & Wiper Blades', amount: 250 },
        { category: 'DETAILING', description: 'Full Stage-1 Polish & Interior Detail', amount: 400 },
        { category: 'INSPECTION', description: 'Texas State Safety & Emissions', amount: 200 },
      ],
    },
    {
      id: 'veh_accord_2021',
      vin: '1HGCR2F83MA298412',
      stockNumber: 'AP-1038',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      trim: 'Sport 1.5T',
      mileage: 34100,
      exteriorColor: 'San Marino Red',
      interiorColor: 'Black Cloth/Leatherette',
      engine: '1.5L Turbocharged VTEC I4',
      transmission: 'CVT with Paddle Shifters',
      drivetrain: 'FWD',
      fuelType: 'Gasoline',
      bodyStyle: 'Sedan',
      doors: 4,
      purchaseDate: new Date('2026-07-28'),
      purchaseSource: 'ACV',
      purchasePrice: 17200,
      totalCostBasis: 18950,
      askingPrice: 22900,
      preferredPrice: 22400,
      minPrice: 21500,
      status: 'LISTED',
      conditionGrade: 'EXCELLENT',
      daysInInventory: 14,
      notes: 'Sport alloy wheels, Apple CarPlay / Android Auto, Honda Sensing suite.',
      photos: [
        'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'ACV Online Auction Purchase', amount: 17200 },
        { category: 'AUCTION_FEE', description: 'ACV Buyer Fee', amount: 550 },
        { category: 'TRANSPORTATION', description: 'Regional Flatbed Shipping', amount: 300 },
        { category: 'PARTS', description: '2 New Michelin Tires & Alignment', amount: 550 },
        { category: 'DETAILING', description: 'Exterior Clay Bar & Ceramic Spray', amount: 350 },
      ],
    },
    {
      id: 'veh_bmw_330i_2020',
      vin: 'WBA5R1C56LA918234',
      stockNumber: 'AP-1025',
      year: 2020,
      make: 'BMW',
      model: '330i',
      trim: 'xDrive M Sport',
      mileage: 41200,
      exteriorColor: 'Portimao Blue Metallic',
      interiorColor: 'Cognac Vernasca Leather',
      engine: '2.0L TwinPower Turbo I4',
      transmission: '8-Speed Sport Automatic',
      drivetrain: 'AWD',
      fuelType: 'Gasoline',
      bodyStyle: 'Sedan',
      doors: 4,
      purchaseDate: new Date('2026-06-20'),
      purchaseSource: 'TRADE_IN',
      purchasePrice: 22500,
      totalCostBasis: 24700,
      askingPrice: 29500,
      preferredPrice: 28900,
      minPrice: 27800,
      status: 'LISTED',
      conditionGrade: 'EXCELLENT',
      daysInInventory: 51,
      notes: 'Premium M Sport package with Shadowline trim, Live Cockpit Pro, Head-up display.',
      photos: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'Customer Trade-in Allowance', amount: 22500 },
        { category: 'MECHANICAL', description: 'Front & Rear Brake Pads/Rotors', amount: 1100 },
        { category: 'BODY_PAINT', description: 'Front Bumper Scrape Repaint', amount: 650 },
        { category: 'DETAILING', description: 'Leather Reconditioning & Paint Correction', amount: 450 },
      ],
    },
    {
      id: 'veh_f150_2022',
      vin: '1FTFW1ED4NFA84910',
      stockNumber: 'AP-1045',
      year: 2022,
      make: 'Ford',
      model: 'F-150',
      trim: 'Lariat SuperCrew',
      mileage: 36500,
      exteriorColor: 'Agate Black Metallic',
      interiorColor: 'Baja Tan Leather',
      engine: '3.5L PowerBoost Full-Hybrid V6',
      transmission: '10-Speed Automatic',
      drivetrain: '4WD',
      fuelType: 'Hybrid',
      bodyStyle: 'Crew Cab Pickup',
      doors: 4,
      purchaseDate: new Date('2026-08-01'),
      purchaseSource: 'MANHEIM',
      purchasePrice: 37500,
      totalCostBasis: 39800,
      askingPrice: 45900,
      preferredPrice: 44500,
      minPrice: 43000,
      status: 'LISTED',
      conditionGrade: 'EXCELLENT',
      daysInInventory: 10,
      notes: '7.2kW Pro Power Onboard generator, panoramic sunroof, FX4 Off-Road package.',
      photos: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'Manheim San Antonio Buy Price', amount: 37500 },
        { category: 'AUCTION_FEE', description: 'Auction Buy Fee', amount: 750 },
        { category: 'TRANSPORTATION', description: 'Hauler Delivery', amount: 350 },
        { category: 'DETAILING', description: 'Full Truck Buff & Bedliner Wash', amount: 450 },
        { category: 'PARTS', description: 'Bed Tie-downs & Floor Mats', amount: 750 },
      ],
    },
    {
      id: 'veh_cx5_2021',
      vin: 'JM3KFBCM9M0491023',
      stockNumber: 'AP-1040',
      year: 2021,
      make: 'Mazda',
      model: 'CX-5',
      trim: 'Grand Touring AWD',
      mileage: 39200,
      exteriorColor: 'Soul Red Crystal Metallic',
      interiorColor: 'Parchment Leather',
      engine: '2.5L SKYACTIV-G DOHC 16V',
      transmission: '6-Speed Automatic',
      drivetrain: 'AWD',
      fuelType: 'Gasoline',
      bodyStyle: 'SUV',
      doors: 4,
      purchaseDate: new Date('2026-07-20'),
      purchaseSource: 'COPART',
      purchasePrice: 16800,
      totalCostBasis: 18450,
      askingPrice: 22400,
      preferredPrice: 21900,
      minPrice: 21000,
      status: 'LISTED',
      conditionGrade: 'CLEAN',
      daysInInventory: 18,
      notes: 'Bose 10-speaker premium audio, power liftgate, heated seats, blind spot monitor.',
      photos: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'Copart Clean Title Purchase', amount: 16800 },
        { category: 'AUCTION_FEE', description: 'Copart Fee', amount: 500 },
        { category: 'TRANSPORTATION', description: 'Towing & Transport', amount: 300 },
        { category: 'MECHANICAL', description: '120-Point Service & Alignment', amount: 450 },
        { category: 'DETAILING', description: 'Interior Steam Clean', amount: 400 },
      ],
    },
    {
      id: 'veh_challenger_sold',
      vin: '2C3CDZFJ8MH192834',
      stockNumber: 'AP-1015',
      year: 2021,
      make: 'Dodge',
      model: 'Challenger',
      trim: 'R/T Scat Pack 392',
      mileage: 26500,
      exteriorColor: 'Pitch Black',
      interiorColor: 'Black Houndstooth',
      engine: '6.4L SRT HEMI V8 (485hp)',
      transmission: '8-Speed TorqueFlite Automatic',
      drivetrain: 'RWD',
      fuelType: 'Gasoline',
      bodyStyle: 'Coupe',
      doors: 2,
      purchaseDate: new Date('2026-06-10'),
      purchaseSource: 'MANHEIM',
      purchasePrice: 32000,
      totalCostBasis: 34550,
      askingPrice: 39900,
      preferredPrice: 39200,
      minPrice: 38500,
      soldPrice: 39200,
      soldDate: new Date('2026-08-14'),
      status: 'SOLD',
      conditionGrade: 'EXCELLENT',
      daysInInventory: 28,
      notes: 'Sold to buyer Kevin Peterson. Financed through Ally Bank. Profit realized: $4,650.',
      photos: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      ],
      expenses: [
        { category: 'ACQUISITION', description: 'Auction Purchase', amount: 32000 },
        { category: 'AUCTION_FEE', description: 'Buy Fee', amount: 700 },
        { category: 'TRANSPORTATION', description: 'Enclosed Carrier', amount: 650 },
        { category: 'PARTS', description: 'Brembo Brake Service', amount: 800 },
        { category: 'DETAILING', description: 'Full Ceramic Coating', amount: 400 },
      ],
    },
  ];

  for (const v of vehicleDefs) {
    const createdVehicle = await prisma.vehicle.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        organizationId: org.id,
        locationId: locMain.id,
        vin: v.vin,
        stockNumber: v.stockNumber,
        year: v.year,
        make: v.make,
        model: v.model,
        trim: v.trim,
        mileage: v.mileage,
        exteriorColor: v.exteriorColor,
        interiorColor: v.interiorColor,
        engine: v.engine,
        transmission: v.transmission,
        drivetrain: v.drivetrain,
        fuelType: v.fuelType,
        bodyStyle: v.bodyStyle,
        doors: v.doors,
        purchaseDate: v.purchaseDate,
        purchaseSource: v.purchaseSource,
        purchasePrice: v.purchasePrice,
        totalCostBasis: v.totalCostBasis,
        askingPrice: v.askingPrice,
        preferredPrice: v.preferredPrice,
        minPrice: v.minPrice,
        soldPrice: v.soldPrice,
        soldDate: v.soldDate,
        status: v.status,
        conditionGrade: v.conditionGrade,
        daysInInventory: v.daysInInventory,
        notes: v.notes,
      },
    });

    // Add Photos
    for (let i = 0; i < v.photos.length; i++) {
      await prisma.vehiclePhoto.create({
        data: {
          vehicleId: createdVehicle.id,
          url: v.photos[i],
          thumbnailUrl: v.photos[i],
          isCover: i === 0,
          orderIndex: i,
          caption: `${v.year} ${v.make} ${v.model} - Angle ${i + 1}`,
        },
      });
    }

    // Add Expenses
    for (const exp of v.expenses) {
      await prisma.vehicleExpense.create({
        data: {
          organizationId: org.id,
          vehicleId: createdVehicle.id,
          category: exp.category,
          description: exp.description,
          amount: exp.amount,
          date: v.purchaseDate,
        },
      });
    }

    // Create Initial Listing
    if (['LISTED', 'READY', 'SOLD'].includes(v.status)) {
      const listing = await prisma.listing.create({
        data: {
          organizationId: org.id,
          vehicleId: createdVehicle.id,
          headline: `Immaculate ${v.year} ${v.make} ${v.model} ${v.trim} - Low Miles`,
          shortDescription: `Clean Carfax, 120-point certified inspection, and ready for immediate delivery.`,
          longDescription: `Experience unmatched quality in this ${v.year} ${v.make} ${v.model} ${v.trim}. Features ${v.exteriorColor} exterior, ${v.engine}, ${v.transmission}, and pristine interior. Financing available for all credit tiers.`,
          featureBulletsJson: JSON.stringify([
            `${v.year} ${v.make} ${v.model} ${v.trim}`,
            `Mileage: ${v.mileage.toLocaleString()} Miles`,
            `Engine: ${v.engine}`,
            `Transmission: ${v.transmission}`,
            `Clean Title & Full Inspection Report Included`,
          ]),
          seoTitle: `${v.year} ${v.make} ${v.model} ${v.trim} For Sale in Austin, TX`,
          seoDescription: `Buy this clean ${v.year} ${v.make} ${v.model} at Apex Auto Gallery for $${v.askingPrice.toLocaleString()}.`,
          facebookCopy: `🔥 Just in: ${v.year} ${v.make} ${v.model} (${v.mileage.toLocaleString()} mi) for $${v.askingPrice.toLocaleString()}! Clean title, inspected, test drives ready!`,
          craigslistCopy: `FOR SALE: ${v.year} ${v.make} ${v.model} ${v.trim}\nPrice: $${v.askingPrice.toLocaleString()}\nStock: ${v.stockNumber}\nCall (555) 555-0199!`,
          socialCopy: `New arrival on the lot! 🚘 ${v.year} ${v.make} ${v.model}. DM for instant pricing!`,
          hashtagsJson: JSON.stringify(['#ApexAuto', `#${v.make}`, `#${v.model}`, '#UsedCarsAustin']),
          suggestedAskingPrice: v.askingPrice,
          status: v.status === 'SOLD' ? 'ARCHIVED' : 'PUBLISHED',
        },
      });

      // Create Marketplace Listings
      await prisma.marketplaceListing.create({
        data: {
          organizationId: org.id,
          listingId: listing.id,
          vehicleId: createdVehicle.id,
          platform: 'STOREFRONT',
          externalId: createdVehicle.id,
          externalUrl: `/storefront/inventory/${createdVehicle.id}`,
          publishedPrice: v.askingPrice,
          status: v.status === 'SOLD' ? 'REMOVED' : 'LIVE',
        },
      });

      await prisma.marketplaceListing.create({
        data: {
          organizationId: org.id,
          listingId: listing.id,
          vehicleId: createdVehicle.id,
          platform: 'FACEBOOK',
          externalId: `fb_${v.vin.slice(-6)}`,
          externalUrl: `https://facebook.com/marketplace/item/fb_${v.vin.slice(-6)}`,
          publishedPrice: v.askingPrice,
          status: v.status === 'SOLD' ? 'REMOVED' : 'LIVE',
        },
      });
    }
  }

  // 5. Opportunities & Auctions Data
  const opp1 = await prisma.opportunity.create({
    data: {
      organizationId: org.id,
      vin: '4T1C11AK2NU847192',
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      trim: 'SE Nightshade',
      mileage: 31200,
      conditionGrade: 'CLEAN',
      sourceChannel: 'MANHEIM',
      sourceLocation: 'Manheim Dallas (Lane 4, Run 88)',
      currentBid: 18500,
      buyFee: 650,
      transportEstimate: 350,
      repairEstimate: 600,
      estimatedMarketValue: 24400,
      targetAcquisitionPrice: 18500,
      maxRecommendedBid: 19250,
      expectedSalePrice: 23900,
      expectedGrossProfit: 3800,
      expectedRoiPercent: 18.9,
      daysToSellEstimate: 21,
      demandScore: 88,
      opportunityScore: 87,
      recommendation: 'STRONG_BUY',
      status: 'BIDDING',
    },
  });

  await prisma.auctionItem.create({
    data: {
      organizationId: org.id,
      opportunityId: opp1.id,
      auctionPlatform: 'MANHEIM',
      auctionDate: new Date('2026-08-22T14:00:00Z'),
      runNumber: '88',
      lane: '4',
      startingBid: 16500,
      currentBid: 18500,
      maxBid: 19250,
      status: 'BID_PLACED',
      notes: 'Solid unit with Nightshade package. Target profit $3.8k.',
    },
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      organizationId: org.id,
      vin: '1N4AL3AP4LC109283',
      year: 2020,
      make: 'Nissan',
      model: 'Altima',
      trim: '2.5 SR',
      mileage: 62000,
      conditionGrade: 'AVERAGE',
      sourceChannel: 'ACV',
      sourceLocation: 'ACV Houston Online',
      currentBid: 12200,
      buyFee: 450,
      transportEstimate: 300,
      repairEstimate: 1400,
      estimatedMarketValue: 16800,
      targetAcquisitionPrice: 11500,
      maxRecommendedBid: 12500,
      expectedSalePrice: 16200,
      expectedGrossProfit: 1850,
      expectedRoiPercent: 12.9,
      daysToSellEstimate: 38,
      demandScore: 65,
      opportunityScore: 54,
      recommendation: 'WATCH',
      status: 'WATCHLIST',
    },
  });

  // 6. Conversations, Messages & Leads
  const conv1 = await prisma.conversation.create({
    data: {
      organizationId: org.id,
      vehicleId: 'veh_camry_2022',
      buyerName: 'Emily Rodriguez',
      buyerPhone: '(512) 555-8831',
      buyerEmail: 'emily.r@gmail.com',
      channel: 'STOREFRONT_CHAT',
      status: 'ACTIVE',
      leadScore: 85,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderType: 'BUYER',
        senderName: 'Emily Rodriguez',
        content: 'Hi! Is the 2022 Toyota Camry SE still available? Would you take $23,500 cash today?',
        createdAt: new Date('2026-08-19T14:20:00Z'),
      },
      {
        conversationId: conv1.id,
        senderType: 'AI_SALES_AGENT',
        senderName: 'Alex (AI Sales Assistant)',
        content: 'Hi Emily! Yes, the 2022 Toyota Camry SE is on our lot and ready for delivery. Our sales manager has authorized $23,500 for you if you can stop by this week. Would you like to reserve a test drive this afternoon or tomorrow?',
        createdAt: new Date('2026-08-19T14:21:00Z'),
      },
      {
        conversationId: conv1.id,
        senderType: 'BUYER',
        senderName: 'Emily Rodriguez',
        content: 'Tomorrow at 2 PM works great for me! I also have a 2017 Civic to trade in.',
        createdAt: new Date('2026-08-19T14:25:00Z'),
      },
      {
        conversationId: conv1.id,
        senderType: 'AI_SALES_AGENT',
        senderName: 'Alex (AI Sales Assistant)',
        content: 'Fantastic Emily! I have scheduled your VIP test drive for tomorrow at 2:00 PM. We will also have our appraiser ready to provide top-dollar equity on your 2017 Civic. See you at 4500 Auto Mall Pkwy!',
        createdAt: new Date('2026-08-19T14:26:00Z'),
      },
    ],
  });

  const lead1 = await prisma.lead.create({
    data: {
      organizationId: org.id,
      conversationId: conv1.id,
      vehicleId: 'veh_camry_2022',
      name: 'Emily Rodriguez',
      email: 'emily.r@gmail.com',
      phone: '(512) 555-8831',
      preferredContactMethod: 'SMS',
      tradeInYear: 2017,
      tradeInMake: 'Honda',
      tradeInModel: 'Civic LX',
      tradeInMileage: 78000,
      tradeInEstimate: 8500,
      financingNeeded: true,
      initialOffer: 23500,
      currentOffer: 23500,
      stage: 'APPOINTMENT',
      score: 88,
      assignedToId: userSarah.id,
      notes: 'Agreed on $23,500. Bringing 2017 Civic for trade evaluation.',
    },
  });

  await prisma.appointment.create({
    data: {
      organizationId: org.id,
      leadId: lead1.id,
      vehicleId: 'veh_camry_2022',
      customerName: 'Emily Rodriguez',
      customerPhone: '(512) 555-8831',
      customerEmail: 'emily.r@gmail.com',
      type: 'TEST_DRIVE',
      scheduledAt: new Date('2026-08-21T14:00:00Z'),
      durationMinutes: 45,
      status: 'CONFIRMED',
      notes: 'Test drive and trade-in appraisal for 2017 Civic.',
    },
  });

  // 7. Create Deals (1 Funded/Delivered, 1 Pending Deal)
  await prisma.deal.create({
    data: {
      organizationId: org.id,
      vehicleId: 'veh_challenger_sold',
      buyerName: 'Kevin Peterson',
      buyerEmail: 'kevin.p@outlook.com',
      buyerPhone: '(512) 555-4920',
      buyerAddress: '1204 Congress Ave, Austin, TX 78701',
      salePrice: 39200,
      docFee: 499,
      taxAmount: 2450,
      titleRegFee: 150,
      cashDownPayment: 8000,
      financedAmount: 34299,
      aprRate: 6.49,
      loanTermMonths: 60,
      monthlyPayment: 671,
      totalDue: 42299,
      dealStatus: 'DELIVERED',
      fundedDate: new Date('2026-08-14'),
      deliveredDate: new Date('2026-08-14'),
      notes: 'Customer took delivery. Keys handed over. Extended warranty purchased.',
    },
  });

  await prisma.deal.create({
    data: {
      organizationId: org.id,
      vehicleId: 'veh_f150_2022',
      buyerName: 'Michael Torres',
      buyerEmail: 'mtorres@gmail.com',
      buyerPhone: '(512) 555-9120',
      buyerAddress: '7800 Ranch Rd 620, Austin, TX 78726',
      salePrice: 44500,
      docFee: 499,
      taxAmount: 2781,
      titleRegFee: 150,
      tradeInAllowance: 12000,
      tradeInPayoff: 4000, // Net trade equity: $8,000
      cashDownPayment: 5000,
      financedAmount: 34930,
      aprRate: 5.99,
      loanTermMonths: 72,
      monthlyPayment: 578,
      totalDue: 47930,
      dealStatus: 'PENDING_APPROVAL',
      notes: 'Awaiting final bank stipulation for proof of income.',
    },
  });

  // 8. Automation Rules
  await prisma.automationRule.createMany({
    data: [
      {
        organizationId: org.id,
        name: 'Auto-Generate AI Listing on Vehicle Ready',
        description: 'Automatically creates copywriting drafts when vehicle moves from Reconditioning to Ready.',
        triggerEvent: 'VEHICLE_READY',
        actionsJson: JSON.stringify(['GENERATE_AI_LISTING', 'SEND_STAFF_NOTIFICATION']),
        isActive: true,
      },
      {
        organizationId: org.id,
        name: 'Multi-Marketplace Broadcast on Approval',
        description: 'Syndicates live listing to Website, Facebook Marketplace, and Autotrader upon dealer approval.',
        triggerEvent: 'LISTING_APPROVED',
        actionsJson: JSON.stringify(['PUBLISH_TO_STOREFRONT', 'PUBLISH_TO_MARKETPLACES']),
        isActive: true,
      },
      {
        organizationId: org.id,
        name: 'Instant AI Sales Lead Engagement',
        description: 'Auto-responds to customer messages within approved dealer price boundaries.',
        triggerEvent: 'MESSAGE_RECEIVED',
        actionsJson: JSON.stringify(['EXECUTE_AI_SALES_AGENT', 'UPSERT_CRM_LEAD']),
        isActive: true,
      },
      {
        organizationId: org.id,
        name: 'Automated Post-Sale Delisting',
        description: 'Automatically removes active marketplace listings as soon as a vehicle is marked Sold.',
        triggerEvent: 'VEHICLE_SOLD',
        actionsJson: JSON.stringify(['DELIST_MARKETPLACES', 'CALCULATE_FINAL_PROFIT']),
        isActive: true,
      },
    ],
  });

  // 9. Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        organizationId: org.id,
        title: 'New Lead: Emily Rodriguez',
        message: 'Offer of $23,500 received for 2022 Toyota Camry SE. Appointment scheduled for tomorrow at 2 PM.',
        type: 'SUCCESS',
        linkUrl: '/leads',
      },
      {
        organizationId: org.id,
        title: 'Auction Watchlist Alert',
        message: '2022 Toyota Camry SE Nightshade (Manheim Dallas Lane 4) runs tomorrow at 2:00 PM.',
        type: 'INFO',
        linkUrl: '/auctions',
      },
      {
        organizationId: org.id,
        title: 'Aged Inventory Review',
        message: '2020 BMW 330i has reached 51 days in inventory. AI recommends a $600 price adjustment.',
        type: 'WARNING',
        linkUrl: '/inventory/veh_bmw_330i_2020',
      },
    ],
  });

  // 10. Dealer Branding
  await prisma.dealerBranding.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      heroTitle: 'Welcome to Apex Auto Gallery',
      heroSubtitle: 'Handcrafted luxury, verified histories, and unmatched transparent pricing in Austin, Texas.',
      primaryColor: '#10b981',
      accentColor: '#14b8a6',
      tagline: 'Precision Driven. Customer Focused.',
      aboutUs: 'Founded in 2018, Apex Auto Gallery curates the finest pre-owned performance and luxury vehicles with 150-point inspections.',
      businessHoursJson: JSON.stringify({
        'Monday - Friday': '9:00 AM - 8:00 PM',
        'Saturday': '10:00 AM - 6:00 PM',
        'Sunday': 'Closed for Family',
      }),
      socialLinksJson: JSON.stringify({
        facebook: 'https://facebook.com/apexautogallery',
        instagram: 'https://instagram.com/apexautogallery',
        youtube: 'https://youtube.com/apexautogallery',
      }),
      policiesJson: JSON.stringify({
        warranty: 'Every vehicle includes a 3-month / 3,000-mile comprehensive powertrain warranty.',
        moneyBack: '7-day or 500-mile no-questions-asked vehicle exchange guarantee.',
        docFee: '$499 standard Texas documentation fee with zero hidden dealer add-ons.',
      }),
    },
  });

  // 11. User Invitations
  await prisma.userInvitation.upsert({
    where: { token: 'inv_token_elena_sales' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'jessica@apexautogallery.com',
      role: 'SALES',
      token: 'inv_token_elena_sales',
      status: 'PENDING',
      invitedById: userMarcus.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 12. Dealer-to-Dealer & Private Opportunity Candidates
  await prisma.opportunityCandidate.createMany({
    data: [
      {
        organizationId: org.id,
        sourceType: 'DEALER_TO_DEALER',
        sourceDealerName: 'Lone Star Motors (San Antonio, TX)',
        sourceLocation: 'San Antonio, TX (78 miles)',
        vin: '4T1B11HK5NU891234',
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        trim: 'SE Nightshade',
        mileage: 38400,
        askingPrice: 18900,
        estimatedNegotiatedPrice: 17800,
        estimatedMarketValue: 24200,
        estimatedTransportCost: 250,
        estimatedReconCost: 550,
        estimatedGrossMargin: 5600,
        opportunityScore: 92,
        daysListed: 64,
        listingUrl: 'https://lonestarmotors.example/inventory/camry-se',
        provenanceJson: JSON.stringify({
          source: 'Lone Star Motors Direct Inventory Feed',
          compsFound: 14,
          avgMarketPrice: 24450,
          confidence: 'HIGH',
        }),
        status: 'NEW',
      },
      {
        organizationId: org.id,
        sourceType: 'WHOLESALE_NETWORK',
        sourceDealerName: 'DFW Premium Auto Exchange',
        sourceLocation: 'Dallas, TX (195 miles)',
        vin: 'WBA5R1C56KAH89012',
        year: 2021,
        make: 'BMW',
        model: '3 Series',
        trim: '330i M Sport',
        mileage: 31200,
        askingPrice: 26500,
        estimatedNegotiatedPrice: 25200,
        estimatedMarketValue: 32800,
        estimatedTransportCost: 400,
        estimatedReconCost: 850,
        estimatedGrossMargin: 6350,
        opportunityScore: 89,
        daysListed: 42,
        listingUrl: 'https://dfwexchange.example/whls/bmw-330i',
        provenanceJson: JSON.stringify({
          source: 'DealerOS Partner Wholesale Network',
          compsFound: 9,
          avgMarketPrice: 32900,
          confidence: 'HIGH',
        }),
        status: 'WATCHLIST',
      },
    ],
  });

  // 13. Dealer Network Listings
  await prisma.dealerNetworkListing.create({
    data: {
      organizationId: org.id,
      vehicleId: 'veh_camry_2022',
      availabilityType: 'OPEN_TO_OFFERS',
      wholesaleAskingPrice: 21500,
      networkNotes: 'Clean 1-owner title, fresh Michelin tires, ready for immediate delivery.',
      isPublicToNetwork: true,
    },
  });

  // 14. Lease Offers (with explainable scoring & effective monthly calculation)
  await prisma.leaseOffer.createMany({
    data: [
      {
        organizationId: org.id,
        year: 2026,
        make: 'BMW',
        model: 'iX',
        trim: 'xDrive50',
        msrp: 89500,
        monthlyPayment: 699,
        effectiveMonthlyCost: 823,
        dueAtSigning: 4999,
        termMonths: 36,
        mileageAllowancePerYear: 10000,
        residualPercentage: 54,
        residualValue: 48330,
        moneyFactor: 0.00115,
        dealerDiscount: 5500,
        manufacturerIncentive: 9900,
        acquisitionFee: 925,
        dispositionFee: 495,
        regionEligibility: 'National / Tier 1 Credit',
        dealScore: 91,
        scoreExplanationJson: JSON.stringify({
          strengths: [
            '$9,900 EV Federal Tax Credit passed directly as cap-cost reduction',
            'Generous $5,500 dealer discount off MSRP',
            'Low 0.00115 money factor (equivalent to ~2.76% APR)',
          ],
          weaknesses: [
            '$4,999 due at signing requires upfront cash',
            '10,000 miles/year allowance ($0.25/mile overage)',
          ],
          effectiveCalculation: '($699 * 36 + $4,999) / 36 = $823.75/month true cost basis',
        }),
        offerExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sourceProvider: 'OEM_PROGRAM',
        isVerified: true,
      },
      {
        organizationId: org.id,
        year: 2026,
        make: 'Hyundai',
        model: 'IONIQ 5',
        trim: 'SEL RWD',
        msrp: 49800,
        monthlyPayment: 299,
        effectiveMonthlyCost: 382,
        dueAtSigning: 2999,
        termMonths: 36,
        mileageAllowancePerYear: 12000,
        residualPercentage: 58,
        residualValue: 28884,
        moneyFactor: 0.00095,
        dealerDiscount: 2500,
        manufacturerIncentive: 7500,
        acquisitionFee: 650,
        dispositionFee: 400,
        regionEligibility: 'National',
        dealScore: 95,
        scoreExplanationJson: JSON.stringify({
          strengths: [
            'Exceptional value: $299/mo on a $49.8k MSRP vehicle',
            'Low 0.00095 money factor (~2.28% APR equivalent)',
            'Higher 12,000 miles/year allowance',
          ],
          weaknesses: [
            '$2,999 due at signing required for advertised tier',
          ],
          effectiveCalculation: '($299 * 36 + $2,999) / 36 = $382.30/month true cost basis',
        }),
        offerExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        sourceProvider: 'OEM_PROGRAM',
        isVerified: true,
      },
      {
        organizationId: org.id,
        year: 2025,
        make: 'Honda',
        model: 'Civic',
        trim: 'Sport Sedan',
        msrp: 27500,
        monthlyPayment: 269,
        effectiveMonthlyCost: 341,
        dueAtSigning: 2599,
        termMonths: 36,
        mileageAllowancePerYear: 10000,
        residualPercentage: 66,
        residualValue: 18150,
        moneyFactor: 0.00185,
        dealerDiscount: 1000,
        manufacturerIncentive: 500,
        acquisitionFee: 595,
        dispositionFee: 395,
        regionEligibility: 'National',
        dealScore: 88,
        scoreExplanationJson: JSON.stringify({
          strengths: [
            'High 66% residual value keeps depreciation portion low',
            'Extremely accessible monthly payment under $270',
          ],
          weaknesses: [
            'Modest manufacturer incentive ($500)',
          ],
          effectiveCalculation: '($269 * 36 + $2,599) / 36 = $341.19/month true cost basis',
        }),
        offerExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        sourceProvider: 'DEALER_INVENTORY',
        isVerified: true,
      },
    ],
  });

  // 15. Plans & Subscriptions
  const planPro = await prisma.plan.upsert({
    where: { code: 'PRO' },
    update: {},
    create: {
      code: 'PRO',
      name: 'DealerOS Professional',
      priceMonthly: 499,
      priceAnnual: 4990,
      maxVehicles: 150,
      maxUsers: 15,
      featuresJson: JSON.stringify([
        'AI_SALES_AGENT',
        'MULTI_MARKETPLACE_HUB',
        'AUCTION_CENTER',
        'OPPORTUNITY_ENGINE',
        'LEASE_DISCOVERY',
        'CRM_UNIFIED_INBOX',
        'NHTSA_VIN_DECODER',
        'STOREFRONT_CMS',
      ]),
    },
  });

  await prisma.subscription.upsert({
    where: { id: 'sub_apex_pro' },
    update: {},
    create: {
      id: 'sub_apex_pro',
      organizationId: org.id,
      planId: planPro.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 16. Consumer Profile & First-Party Intent Events
  const consumer = await prisma.consumerProfile.upsert({
    where: { email: 'emily.rodriguez@example.com' },
    update: {},
    create: {
      id: 'consumer_emily',
      email: 'emily.rodriguez@example.com',
      name: 'Emily Rodriguez',
      phone: '(512) 555-0188',
      isVerified: true,
      zipCode: '78759',
    },
  });

  await prisma.consumerEvent.createMany({
    data: [
      {
        consumerProfileId: consumer.id,
        sessionId: 'sess_emily_1',
        eventType: 'vehicle.viewed',
        entityType: 'VEHICLE',
        entityId: 'veh_camry_2022',
        metadataJson: JSON.stringify({ durationSec: 140, referrer: '/cars' }),
      },
      {
        consumerProfileId: consumer.id,
        sessionId: 'sess_emily_1',
        eventType: 'vehicle.saved',
        entityType: 'VEHICLE',
        entityId: 'veh_camry_2022',
      },
      {
        consumerProfileId: consumer.id,
        sessionId: 'sess_emily_1',
        eventType: 'test_drive.requested',
        entityType: 'VEHICLE',
        entityId: 'veh_camry_2022',
        metadataJson: JSON.stringify({ preferredDate: '2026-08-21T14:00:00Z' }),
      },
    ],
  });

  await prisma.vehicleInterest.create({
    data: {
      organizationId: org.id,
      consumerProfileId: consumer.id,
      vehicleId: 'veh_camry_2022',
      intentLevel: 'HIGH',
      viewCount: 4,
      hasRequestedQuote: true,
      hasRequestedTest: true,
    },
  });

  await prisma.consentRecord.create({
    data: {
      consumerProfileId: consumer.id,
      email: 'emily.rodriguez@example.com',
      phone: '(512) 555-0188',
      consentType: 'MARKETING_SMS',
      granted: true,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  console.log('✅ DealerOS database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
