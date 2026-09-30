import { AdaptrJob, AdVariant } from '@/types/job';

// Global singleton in-memory job store for fast local and serverless execution
declare global {
  var __ADAPTR_JOBS_STORE__: Map<string, AdaptrJob> | undefined;
}

const jobsStore: Map<string, AdaptrJob> = global.__ADAPTR_JOBS_STORE__ || new Map<string, AdaptrJob>();
if (process.env.NODE_ENV !== 'production') {
  global.__ADAPTR_JOBS_STORE__ = jobsStore;
}

export const JobStore = {
  get(id: string): AdaptrJob | undefined {
    return jobsStore.get(id);
  },

  set(job: AdaptrJob): void {
    jobsStore.set(job.id, job);
  },

  update(id: string, partial: Partial<AdaptrJob>): AdaptrJob | undefined {
    const existing = jobsStore.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial };
    jobsStore.set(id, updated);
    return updated;
  },

  updateVariant(jobId: string, variant: AdVariant): void {
    const job = jobsStore.get(jobId);
    if (!job) return;
    const idx = job.variants.findIndex((v) => v.id === variant.id);
    if (idx !== -1) {
      job.variants[idx] = variant;
    } else {
      job.variants.push(variant);
    }
    // Update completed count
    job.completedVariants = job.variants.filter((v) => v.status === 'READY' || v.status === 'FLAGGED').length;
    if (job.completedVariants === job.totalVariants) {
      job.status = 'COMPLETED';
    }
    jobsStore.set(jobId, job);
  },

  list(): AdaptrJob[] {
    return Array.from(jobsStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  clear(): void {
    jobsStore.clear();
  },
};
