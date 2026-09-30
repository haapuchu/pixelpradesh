import { NextRequest, NextResponse } from 'next/server';
import { JobStore } from '@/lib/store';
import { PixelPradeshJob, CreateJobPayload } from '@/types/job';
import { initializeVariants, executePipeline } from '@/lib/orchestrator';

// GET /api/jobs -> List all jobs
export async function GET() {
  const jobs = JobStore.list();
  return NextResponse.json({ success: true, jobs });
}

// POST /api/jobs -> Create new job and start pipeline
export async function POST(req: NextRequest) {
  try {
    const body: CreateJobPayload = await req.json();

    if (!body.productName || !body.masterPublicId) {
      return NextResponse.json(
        { success: false, error: 'Product name and master image are required.' },
        { status: 400 }
      );
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const variants = initializeVariants(jobId, body.masterPublicId, body.masterUrl, body.productName);

    const newJob: PixelPradeshJob = {
      id: jobId,
      productName: body.productName,
      category: body.category || 'General Festive Product',
      brief: body.brief || 'Festive regional promotional campaign',
      masterPublicId: body.masterPublicId,
      masterUrl: body.masterUrl,
      analysis: {
        dominantColors: ['#d97706', '#92400e', '#fef3c7'],
        safeZone: { x: 10, y: 10, width: 80, height: 25 },
        productBoundingBox: { x: 25, y: 30, width: 50, height: 45 },
        subjectType: 'Packaged Goods',
        suggestedPlacements: ['Top-Center Header', 'Bottom Floating CTA'],
      },
      totalVariants: variants.length,
      completedVariants: 0,
      variants,
      createdAt: new Date().toISOString(),
      status: 'RUNNING',
    };

    JobStore.set(newJob);

    // Execute pipeline
    await executePipeline(jobId);

    const completedJob = JobStore.get(jobId);
    return NextResponse.json({ success: true, job: completedJob }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize ad localization job.' },
      { status: 500 }
    );
  }
}
