import React from 'react';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2 } from '@/components/icons';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About Apex Auto Gallery</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Built on radical transparency, automotive integrity, and customer satisfaction since 2018.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <p>
          Apex Auto Gallery is Austin&apos;s premier independent automotive dealer. We believe buying a high-quality used vehicle should be straightforward, exciting, and completely transparent.
        </p>
        <p>
          Every vehicle we source is subjected to our proprietary 120-Point Mechanical Certification by ASE-certified technicians. We perform comprehensive fluid services, replace worn brake pads and tires, and provide full CARFAX history reports upfront.
        </p>
      </div>
    </div>
  );
}
