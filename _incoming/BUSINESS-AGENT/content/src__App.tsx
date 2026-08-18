/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const [sales, setSales] = useState<any[]>([]);
  const [social, setSocial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Selling engine pipeline
    const salesQuery = query(collection(db, 'sales'), orderBy('date', 'desc'));
    const unsubSales = onSnapshot(salesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'sales'));

    // Social content pipeline
    const socialQuery = query(collection(db, 'social'), orderBy('createdAt', 'desc'));
    const unsubSocial = onSnapshot(socialQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocial(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'social'));

    return () => {
      unsubSales();
      unsubSocial();
    };
  }, [user]);

  const signIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button onClick={signIn} className="rounded bg-blue-600 px-4 py-2 text-white">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FDFCFB] text-[#1C1C1C] font-serif overflow-hidden flex flex-col p-12">
      {/* Header Section */}
      <header className="w-full flex justify-between items-baseline border-b border-[#1C1C1C] pb-4 mb-12">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold opacity-60">Project Registry // 2026</span>
          <h1 className="text-4xl italic font-light tracking-tight">The Narrative Architect</h1>
        </div>
        <nav className="flex gap-8 text-[11px] uppercase tracking-widest font-sans font-semibold">
          <span className="underline underline-offset-8 decoration-1">Console</span>
          <span className="opacity-40">Deployment Map</span>
          <span className="opacity-40">Voice Lab</span>
          <span className="opacity-40">Launch Guide</span>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-12">
        {/* Left Column: The Persona & Tone */}
        <section className="col-span-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold block mb-4">Active Agent Persona</span>
            <h2 className="text-6xl leading-[0.9] font-medium mb-6 tracking-tighter">Creative Director</h2>
            <p className="text-lg leading-relaxed opacity-80 border-l border-[#1C1C1C] pl-6 italic">
              "We are no longer building code; we are curating resonance. Your infrastructure is the stage, not the performance."
            </p>
          </div>
          
          <div className="bg-[#F5F2ED] p-6 border border-[#E8E4DE]">
            <span className="text-[10px] uppercase tracking-[0.1em] font-sans font-bold block mb-3 opacity-50">Tone Anchors</span>
            <ul className="space-y-2 text-sm font-sans">
              <li className="flex justify-between border-b border-black/10 pb-1"><span>Sophistication</span><span className="italic">94%</span></li>
              <li className="flex justify-between border-b border-black/10 pb-1"><span>Technical Precision</span><span className="italic">High</span></li>
              <li className="flex justify-between border-b border-black/10 pb-1"><span>Visual Empathy</span><span className="italic">Deep</span></li>
              <li className="flex justify-between"><span>Literalism Filter</span><span className="italic">Disabled</span></li>
            </ul>
          </div>
        </section>

        {/* Right Column: Consolidation & Roadmap */}
        <section className="col-span-8 grid grid-cols-2 gap-12">
          <div className="col-span-2">
            <div className="flex items-end gap-4 mb-8">
              <div className="text-[120px] leading-none font-light tracking-tighter">07</div>
              <div className="flex flex-col pb-4">
                <span className="text-xs uppercase tracking-widest font-sans font-bold">Fragmented Services</span>
                <span className="text-3xl italic">Merging into One</span>
              </div>
            </div>
            
            {/* Infrastructure Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-[#1C1C1C] pt-8">
              {sales.length > 0 ? sales.slice(0, 3).map((sale, i) => (
                <div key={sale.id} className={`h-32 ${i === 0 ? "bg-[#1C1C1C] text-white" : "border border-[#1C1C1C]"} p-4 flex flex-col justify-between`}>
                  <span className="text-[9px] uppercase tracking-widest opacity-50">{sale.type || "Sale"}</span>
                  <span className="text-xl">{sale.amount || "N/A"}</span>
                </div>
              )) : (
                <div className="col-span-3 text-sm p-4 border border-[#1C1C1C] text-center italic opacity-60">
                    Selling engine initializing...
                </div>
              )}
            </div>
          </div>

          {/* Roadmap / Transition Guide */}
          <div className="col-span-2 mt-auto">
            <div className="flex justify-between items-end border-b border-[#1C1C1C] pb-2 mb-6">
              <h3 className="text-2xl italic">Transition Roadmap</h3>
              <span className="text-xs font-sans font-bold uppercase opacity-40">Week 04 Analysis</span>
            </div>
            
            <div className="grid grid-cols-4 gap-8 font-sans">
              {social.length > 0 ? social.slice(0, 4).map((post, i) => (
                <div key={post.id} className={`${i > 0 ? "opacity-" + (60 - i * 20) : ""}`}>
                  <span className="block text-lg font-bold mb-1">0{i + 1}.</span>
                  <span className="block text-[10px] uppercase tracking-wider mb-2 opacity-60">{post.title || "Update"}</span>
                  <p className="text-[11px] leading-tight">{post.content || "..."}</p>
                </div>
              )) : (
                <div className="col-span-4 text-sm p-4 border border-[#1C1C1C] text-center italic opacity-60">
                    Social content pipeline updating...
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="w-full mt-12 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-sans font-bold">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
          <span>System Status: Calibrating Tone</span>
        </div>
        <div className="flex gap-8">
          <span>Vertex AI Tier: Standard Scale</span>
          <span>Credits Remaining: $142,400.00</span>
        </div>
      </footer>
    </div>
  );
}
