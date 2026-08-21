export type VehicleHistoryProviderId = 'VINAUDIT' | 'CARFAX' | 'AUTOCHECK' | 'MANUAL';

export interface NormalizedVehicleHistoryReport {
  vin: string;
  provider: VehicleHistoryProviderId;
  reportId?: string;
  retrievedAt: Date;
  titleStatus: 'CLEAN' | 'SALVAGE' | 'JUNK' | 'REBUILT' | 'FLOOD' | 'LEMON' | 'UNKNOWN';
  accidentCount: number;
  hasAccident: boolean;
  salvageRecord: boolean;
  junkRecord: boolean;
  odometerRollback: boolean;
  lastReportedOdometer?: number;
  ownerCount: number;
  serviceRecordsCount: number;
  recallCount: number;
  openRecalls?: Array<{
    campaignNumber: string;
    description: string;
    safetyRisk: string;
    remedy: string;
  }>;
  serviceHistorySummary?: Array<{
    date: string;
    odometer?: number;
    source: string;
    description: string;
  }>;
  titleEvents?: Array<{
    date: string;
    state: string;
    eventType: string;
    details: string;
  }>;
  reportUrl?: string;
  isMocked: boolean;
  status: 'SUCCESS' | 'NOT_FOUND' | 'ERROR' | 'UNAUTHORIZED';
  rawResponse?: unknown;
}

export interface VehicleHistoryProvider {
  id: VehicleHistoryProviderId;
  name: string;
  isConfigured(): boolean;
  fetchReport(vin: string, organizationId?: string): Promise<NormalizedVehicleHistoryReport>;
}
