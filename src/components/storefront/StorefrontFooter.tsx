import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Mail, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export function StorefrontFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-850 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">120-Point Certified Guarantee</div>
              <p className="text-[11px] text-slate-400">
                Every unit undergoes full safety, mechanical, and frame inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Transparent Fixed Pricing</div>
              <p className="text-[11px] text-slate-400">
                No hidden dealer add-ons or unexpected documentation surprises.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Instant Top-Dollar Trade Equity</div>
              <p className="text-[11px] text-slate-400">
                Guaranteed cash offer for your vehicle whether you buy from us or not.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span>Apex Auto Gallery</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              CERTIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Austin&apos;s premier independent automotive destination. Specializing in meticulously reconditioned, clean-history sedans, luxury SUVs, and heavy-duty trucks.
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>4500 Auto Mall Parkway, Austin, TX 78759</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>(512) 555-0199</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>sales@apexautogallery.com</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/storefront/inventory" className="hover:text-white">
                View All Vehicles
              </Link>
            </li>
            <li>
              <Link href="/storefront/financing" className="hover:text-white">
                Financing Application
              </Link>
            </li>
            <li>
              <Link href="/storefront/trade-in" className="hover:text-white">
                Value Your Trade
              </Link>
            </li>
            <li>
              <Link href="/storefront/about" className="hover:text-white">
                About Our Dealership
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Showroom Hours</div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>Monday - Friday: 9:00 AM - 7:00 PM</li>
            <li>Saturday: 9:00 AM - 6:00 PM</li>
            <li>Sunday: Closed (Appointments Only)</li>
          </ul>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Dealer OS Admin Login →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-[11px]">
        &copy; 2026 Apex Auto Gallery. Powered by DealerOS Platform. All rights reserved.
      </div>
    </footer>
  );
}
