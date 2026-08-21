import { z } from 'zod';

export const StorefrontSettingsSchema = z.object({
  showOwnInventory: z.boolean().default(true),
  showLeaseDeals: z.boolean().default(false),
  showNetworkInventory: z.boolean().default(false),
  showPartnerListings: z.boolean().default(false),
  showCarfaxCta: z.boolean().default(true),
  showFinancingCta: z.boolean().default(true),
  showTradeInCta: z.boolean().default(true),
  showMakeOffer: z.boolean().default(true),
  showScheduleTestDrive: z.boolean().default(true),
  showContactDealer: z.boolean().default(true),
  showVehicleRecommendations: z.boolean().default(true),
  preferredHistoryProvider: z.enum(['VINAUDIT', 'CARFAX', 'AUTOCHECK']).default('VINAUDIT'),
  heroTitle: z.string().max(200).optional(),
  heroSubtitle: z.string().max(400).optional(),
  tagline: z.string().max(200).optional(),
  primaryColor: z.string().max(20).optional(),
  accentColor: z.string().max(20).optional(),
  aboutUs: z.string().max(3000).optional(),
});

export const storefrontSettingsSchema = StorefrontSettingsSchema;
export type StorefrontSettingsInput = z.infer<typeof StorefrontSettingsSchema>;
