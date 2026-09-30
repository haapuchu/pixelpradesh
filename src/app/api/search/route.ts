import { NextRequest, NextResponse } from 'next/server';
import { JobStore } from '@/lib/store';
import { AdVariant } from '@/types/job';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const festival = searchParams.get('festival')?.toLowerCase() || '';
  const ratio = searchParams.get('ratio') || '';
  const status = searchParams.get('status')?.toUpperCase() || '';

  const jobs = JobStore.list();
  const allVariants: (AdVariant & { productName: string })[] = [];

  for (const job of jobs) {
    for (const v of job.variants) {
      allVariants.push({ ...v, productName: job.productName });
    }
  }

  // Filter variants
  const filtered = allVariants.filter((v) => {
    if (festival && !v.metadata.festival.toLowerCase().includes(festival)) {
      return false;
    }
    if (ratio && v.metadata.ratio !== ratio) {
      return false;
    }
    if (status && v.status !== status) {
      return false;
    }
    if (query) {
      const matchText =
        `${v.productName} ${v.metadata.headline} ${v.metadata.festival} ${v.metadata.locale} ${v.metadata.cta}`.toLowerCase();
      if (!matchText.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    totalIndexed: allVariants.length,
    resultsCount: filtered.length,
    variants: filtered,
  });
}
