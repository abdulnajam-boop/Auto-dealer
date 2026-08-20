import React from 'react';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Visit Our Showroom</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Conveniently located in North Austin with indoor climate-controlled vehicle viewing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs text-slate-300">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Location &amp; Contact</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Showroom &amp; Lot</div>
                <p className="text-slate-400">4500 Auto Mall Parkway, Austin, TX 78759</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Direct Sales Desk</div>
                <p className="text-slate-400">(512) 555-0199</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Support Email</div>
                <p className="text-slate-400">sales@apexautogallery.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs text-slate-300">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Business Hours</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-white">Monday – Friday</span>
              <span>9:00 AM – 7:00 PM</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-white">Saturday</span>
              <span>9:00 AM – 6:00 PM</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-white">Sunday</span>
              <span className="text-amber-400">Appointments Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
