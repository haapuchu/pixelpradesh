import { NextRequest, NextResponse } from 'next/server';
import { regenerateVariant } from '@/lib/orchestrator';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id: jobId, variantId } = await params;

  try {
    const updatedVariant = await regenerateVariant(jobId, variantId);

    if (!updatedVariant) {
      return NextResponse.json(
        { success: false, error: 'Variant or job not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, variant: updatedVariant });
  } catch (error) {
    console.error('Error regenerating variant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to regenerate variant.' },
      { status: 500 }
    );
  }
}
