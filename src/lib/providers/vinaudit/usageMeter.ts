import { prisma } from '@/lib/prisma';
import { ProviderUsageMetric } from './types';

export async function logProviderUsage(metric: ProviderUsageMetric): Promise<void> {
  try {
    await prisma.providerUsageLog.create({
      data: {
        organizationId: metric.organizationId || null,
        provider: metric.provider,
        endpoint: metric.endpoint,
        vin: metric.vin || null,
        status: metric.status,
        costEstimateCents: metric.costEstimateCents,
        metadataJson: metric.metadata ? JSON.stringify(metric.metadata) : null,
      },
    });

    // Also update monthly aggregate usage meter if org is present
    if (metric.organizationId) {
      const periodDate = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      const metricName = `${metric.provider}_${metric.endpoint.toUpperCase()}`;

      await prisma.usageMeter.upsert({
        where: {
          organizationId_metricName_periodDate: {
            organizationId: metric.organizationId,
            metricName,
            periodDate,
          },
        },
        create: {
          organizationId: metric.organizationId,
          metricName,
          periodDate,
          count: 1,
        },
        update: {
          count: { increment: 1 },
        },
      });
    }
  } catch (error) {
    console.error('[ProviderUsageMeter] Failed to log provider usage:', error);
  }
}
