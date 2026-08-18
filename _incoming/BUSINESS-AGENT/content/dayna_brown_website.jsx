import { useState, useEffect, useRef } from "react";

const C = {cream:"#F5F0E8",warm:"#FAF7F2",linen:"#EDE7DB",char:"#1C1917",ink:"#292524",stone:"#57534E",clay:"#78716C",sand:"#A8A29E",rust:"#9A5B3C"};
const ff = "'Plus Jakarta Sans', system-ui, sans-serif";
const SL = ({children}) => <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:C.rust,marginBottom:12}}>{children}</div>;

export default function App() {
  const [pg,setPg] = useState("home");
  const [vis,setVis] = useState({});
  const refs = useRef({});
  useEffect(()=>{setVis({});refs.current={};window.scrollTo(0,0);},[pg]);
  useEffect(()=>{
    const obs = new IntersectionObserver((es)=>{es.forEach((e)=>{if(e.isIntersecting)setVis((p)=>({...p,[e.target.id]:true}));});},{threshold:0.1});
    setTimeout(()=>{Object.values(refs.current).forEach((el)=>{if(el)obs.observe(el);});},100);
    return ()=>obs.disconnect();
  },[pg]);
  const reg=(id)=>(el)=>{if(el){el.id=id;refs.current[id]=el;}};
  const fi=(id)=>({opacity:vis[id]?1:0,transform:vis[id]?"translateY(0)":"translateY(24px)",transition:"opacity 0.7s ease, transform 0.7s ease"});
  const go=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <div style={{background:C.cream,minHeight:"100vh",fontFamily:ff,color:C.ink}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.rust}33}@keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}@keyframes lineGrow{from{width:0}to{width:72px}}`}</style>

      <nav style={{position:"sticky",top:0,zIndex:100,background:C.cream+"EE",backdropFilter:"blur(16px)",borderBottom:"1px solid "+C.linen}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer"}} onClick={()=>setPg("home")}>
            <div style={{fontSize:16,fontWeight:700,color:C.char,lineHeight:1.1}}>A Well Lived Citizen</div>
            <div style={{fontSize:10,color:C.stone,letterSpacing:"0.08em",textTransform:"uppercase"}}>by Dayna Brown</div>
          </div>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <button onClick={()=>{setPg("home");setTimeout(()=>go("svc"),100);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,fontFamily:ff}}>Services</button>
            <button onClick={()=>setPg("pricing")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:pg==="pricing"?C.rust:C.stone,fontFamily:ff}}>Pricing</button>
            <button onClick={()=>{setPg("home");setTimeout(()=>go("about"),100);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,fontFamily:ff}}>About</button>
            <button onClick={()=>{setPg("home");setTimeout(()=>go("contact"),100);}} style={{background:C.rust,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#fff",padding:"9px 20px",fontFamily:ff}}>Get in Touch</button>
          </div>
        </div>
      </nav>

      {pg==="home" ? <Home reg={reg} fi={fi} go={go} setPg={setPg} /> : <PricingPg reg={reg} fi={fi} setPg={setPg} />}

      <footer style={{padding:"40px 24px",maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid "+C.linen}}>
        <div><div style={{fontSize:14,fontWeight:700,color:C.char}}>A Well Lived Citizen</div><div style={{fontSize:11,color:C.sand,marginTop:2}}>Well kept. Well placed. Well lived.</div></div>
        <div style={{fontSize:11,color:C.sand}}>© 2026 Dayna Brown</div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════
// HOME
// ═══════════════════════════════════════
function Home({reg,fi,go,setPg}) {
  return (<div>
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"120px 40px 80px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{animation:"fadeUp 1s ease forwards"}}>
        <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:C.rust,marginBottom:28}}>Los Angeles</div>
        <h1 style={{fontSize:"clamp(38px,5vw,64px)",fontWeight:700,lineHeight:1.08,color:C.char,maxWidth:700,letterSpacing:"-0.02em"}}>Well kept.<br/>Well placed.<br/>Well lived.</h1>
        <div style={{width:72,height:2,background:C.rust,margin:"36px 0",animation:"lineGrow 1.2s ease forwards",animationDelay:"0.4s"}} />
        <p style={{fontSize:15,color:C.stone,maxWidth:520,marginBottom:24,lineHeight:1.7}}>Home organization, legacy planning, and curated resale.</p>
        <p style={{fontSize:19,fontStyle:"italic",lineHeight:1.65,color:C.ink,maxWidth:560}}>Life is messy. It looks different for everyone. But it's always well lived. Every item is a story — and I know just how to unpack it.</p>
        <div style={{display:"flex",gap:16,marginTop:44}}>
          <button onClick={()=>go("svc")} style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",padding:"13px 28px",background:C.char,color:C.cream,border:"none",cursor:"pointer",fontFamily:ff}}>See what I do</button>
          <button onClick={()=>go("contact")} style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",padding:"13px 28px",background:"transparent",color:C.char,border:"1px solid "+C.char,cursor:"pointer",fontFamily:ff}}>Get in touch</button>
        </div>
      </div>
    </section>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"0 40px"}}><div style={{height:1,background:C.linen}} /></div>

    <section id="svc" ref={reg("svc")} style={{padding:"100px 40px",maxWidth:1100,margin:"0 auto",...fi("svc")}}>
      <SL>Services</SL>
      <h2 style={{fontSize:32,fontWeight:700,color:C.char,marginBottom:12}}>What I do.</h2>
      <p style={{fontSize:16,color:C.ink,lineHeight:1.85,maxWidth:640,marginBottom:48}}>I walk into homes, storage units, closets, and garages — wherever life has piled up — and I make it make sense. I know what things are worth. I know where they should go. I identify what others miss. And I handle the whole thing so you don't have to.</p>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        {[
          {t:"Home Organization",h:"Your space, made to work for you.",d:"One room or the whole house. Systems that hold — not arrangements for a photo. Small repairs and installations included while I am there.",p:"$150/hr"},
          {t:"Legacy Planning",h:"A plan for everything you've built.",d:"Life shifts. Retirement comes in stages. Your kids live across the country. The heirlooms matter but nobody has a plan for them yet. I go through it all with you and build one.",p:"$175/hr · projects from $3,500"},
          {t:"Elder Safety & Home Readiness",h:"Safe, functional, and independent.",d:"For seniors aging in place or their families across the country who need someone they trust in the home. Tech setup, safety review, and everything in between.",p:"$150/hr"},
          {t:"Curated Resale",h:"Put it in my hands.",d:"I pick it up from your door and handle everything — photography, listing, negotiation, shipping, payout. You do nothing except get paid.",p:"50/50 or 55/45 depending on category"},
        ].map((s,i)=>(
          <div key={i} style={{padding:"32px 28px",background:C.warm,border:"1px solid "+C.linen}}>
            <h3 style={{fontSize:20,fontWeight:700,color:C.char,marginBottom:4}}>{s.t}</h3>
            <div style={{fontSize:14,fontWeight:500,color:C.rust,marginBottom:12}}>{s.h}</div>
            <p style={{fontSize:14,color:C.ink,lineHeight:1.7,marginBottom:12}}>{s.d}</p>
            <div style={{fontSize:13,fontWeight:600,color:C.stone}}>{s.p}</div>
          </div>
        ))}
      </div>

      <div style={{background:C.char,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20,marginBottom:32}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:C.rust,marginBottom:6}}>The Flex Block — Best Value</div>
          <p style={{fontSize:15,color:C.linen,lineHeight:1.7,maxWidth:480}}>In transition? Buy a block of time and I apply it wherever it is needed. 10 hours, pre-paid, never expires.</p>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:32,fontWeight:700,color:C.rust}}>$1,250</div>
          <div style={{fontSize:12,color:C.sand}}>$125/hr · Save $250 vs hourly</div>
        </div>
      </div>

      <p style={{fontSize:14,color:C.clay,fontStyle:"italic",marginBottom:16}}>If someone I trust sent you my way — I will always make time for a conversation first.</p>
      <button onClick={()=>setPg("pricing")} style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",color:C.rust,background:"none",border:"none",cursor:"pointer",fontFamily:ff}}>View full pricing and details →</button>
    </section>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"0 40px"}}><div style={{height:1,background:C.linen}} /></div>

    <section id="about" ref={reg("about")} style={{padding:"100px 40px",maxWidth:1100,margin:"0 auto",...fi("about")}}>
      <SL>About</SL>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60}}>
        <div>
          <h2 style={{fontSize:28,fontWeight:700,color:C.char,marginBottom:20,lineHeight:1.2}}>Someone you'd trust in your mother's house when you're not there.</h2>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85,marginBottom:16}}>I spent 14 years running retail operations — managing $85 million in revenue, standardizing 150 stores, leading teams across the country. I started on the floor at Nordstrom styling men during the era when client relationships had no limits, moved through Bonobos during the Guideshop launch, then across womenswear at Joie, Equipment, and Current/Elliott. I know clothing, closets, value, and condition the way most people know their commute.</p>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85,marginBottom:16}}>During the pandemic I launched Well Dressed Citizen as a styling and closet business for professionals — a passion project that became freelance consulting alongside my corporate career. My real-world work in pricing, resale, ecommerce, returns, and condition assessment spans clothing, sewing machines, outdoor gear, and used equipment. I have set pricing strategies, run sales floors, aligned brick and mortar with ecommerce, and built policies that always put the customer first.</p>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85,marginBottom:16}}>Then my apartment flooded in Seattle and I watched my own treasures get damaged with no one to help. I met a woman at a storage unit who helped me build a plan. And I realized: the thing I had been doing for corporations — walking into chaos, building the system, knowing what everything is worth and where it should go — that is what people need in their homes and in their lives.</p>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85,marginBottom:16}}>I came back to Los Angeles because this is where the work is and this is where the people are. My thing has always been behind the scenes — making other people's lives work. At the heart of everything I have done, I have never been the person in the back end of a corporation. I have always been the person fighting for the front end — the real people, the real function, the real value. And so I am taking my years of experience valued in the corporate world and putting it where I feel it really matters.</p>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85,marginBottom:16}}>I am a night owl who unpacks before going to bed. I have hosted guests for dinner the night after moving into a new place and been asked if I had been moved in for weeks — not just the day before. I may have been on a budget most of my life, but that is where my love for curated resale and sharing the vintage treasures people have held in their homes comes from. My last apartment was a dedicated, intentional home I built from collectors pieces I sourced by hunting and refurbishing — custom pieces that told my story, found and bought from strangers all over the country who had amazing stories to tell and were ready to hand them over.</p>
          <p style={{fontSize:15,color:C.ink,lineHeight:1.85}}>Each home I walk into — whether it is total junk we declutter or a one-of-a-kind fur coat that makes some 25-year-old feel like the only girl in California — I am helping make room for people's next chapter. Every item has a story. Some stay. Some go. But none of them end up forgotten, undervalued, or thrown away because nobody knew what they were looking at. That is the work. And it is a really beautiful thing.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{padding:"44px 36px",background:C.warm,border:"1px solid "+C.linen}}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.clay,marginBottom:20}}>Background</div>
            {["SVP Worldwide (Singer/Husqvarna Viking) — Regional Retail Director, $85M operations","evo — Senior Regional Director, Pacific Northwest","The Collected Group (Joie, Equipment, Current/Elliott) — Regional Brand Director","Bonobos — Retail Sales & Management","Nordstrom — Division Manager, Future Leaders Program","Featured speaker, MAGIC Las Vegas 2023","Featured guest, Retail in America Podcast"].map((x,i)=>(
              <p key={i} style={{fontSize:13,color:C.stone,lineHeight:1.6,marginBottom:8,paddingBottom:8,borderBottom:i<6?"1px solid "+C.linen:"none"}}>{x}</p>
            ))}
          </div>
        </div>
      </div>
    </section>

    <div style={{background:C.linen}}>
      <section id="contact" ref={reg("cont")} style={{padding:"80px 40px",maxWidth:1100,margin:"0 auto",...fi("cont")}}>
        <SL>Contact</SL>
        <h2 style={{fontSize:30,fontWeight:700,color:C.char,marginBottom:12}}>Let's talk about what you need.</h2>
        <p style={{fontSize:15,color:C.clay,lineHeight:1.7,maxWidth:520,marginBottom:40}}>Whether it is a one-day reset or a year-long legacy project, it starts with a conversation. The first one is always free.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,maxWidth:700}}>
          {[["Phone","(323) 433-1350"],["Email","daynambrown@me.com"],["Area","Los Angeles, CA"]].map(([l,v],i)=>(
            <div key={i}><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>{l}</div><div style={{fontSize:16,fontWeight:600,color:C.char}}>{v}</div></div>
          ))}
        </div>
      </section>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// PRICING
// ═══════════════════════════════════════
function R({s,d,p}) {
  return (<div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,padding:"16px 20px",borderBottom:"1px solid "+C.linen,alignItems:"start"}}>
    <div>
      <div style={{fontSize:15,fontWeight:600,color:C.char}}>{s}</div>
      {d && <div style={{fontSize:13,color:C.stone,marginTop:3,lineHeight:1.5}}>{d}</div>}
    </div>
    <div style={{fontSize:15,fontWeight:700,color:C.rust,whiteSpace:"nowrap",textAlign:"right"}}>{p}</div>
  </div>);
}

function PricingPg({reg,fi,setPg}) {
  return (<div style={{paddingTop:80}}>
    <div ref={reg("ph")} style={{maxWidth:800,margin:"0 auto",padding:"72px 40px 48px",...fi("ph")}}>
      <SL>Pricing</SL>
      <h1 style={{fontSize:"clamp(32px,5vw,48px)",fontWeight:700,color:C.char,lineHeight:1.1,letterSpacing:"-0.02em",marginBottom:20}}>Straightforward.<br/>No surprises.</h1>
      <p style={{fontSize:17,color:C.ink,lineHeight:1.8,maxWidth:580}}>In a city full of strangers from apps, I am a known quantity. Every rate below reflects real expertise, real accountability, and a professional who shows up, does the work, and answers the phone. The first conversation is always free.</p>
    </div>

    <div ref={reg("p1")} style={{maxWidth:800,margin:"0 auto",padding:"0 40px 40px",...fi("p1")}}>

      {/* HOW I CHARGE */}
      <div style={{background:C.warm,border:"1px solid "+C.linen,padding:"28px 32px",marginBottom:48}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:20}}>How I charge</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div style={{padding:"16px 20px",background:C.cream,border:"1px solid "+C.linen}}>
            <div style={{fontSize:22,fontWeight:700,color:C.rust}}>$150/hr</div>
            <div style={{fontSize:13,fontWeight:600,color:C.char,marginTop:4}}>Hourly</div>
            <div style={{fontSize:12,color:C.stone,marginTop:4}}>3-hour minimum. Works for single rooms, closets, one-day jobs, elder visits.</div>
          </div>
          <div style={{padding:"16px 20px",background:C.char}}>
            <div style={{fontSize:22,fontWeight:700,color:C.rust}}>$1,250</div>
            <div style={{fontSize:13,fontWeight:600,color:C.linen,marginTop:4}}>Flex Block · 10 hrs</div>
            <div style={{fontSize:12,color:C.sand,marginTop:4}}>$125/hr. Pre-paid. Never expires. Best value for transitions and multi-visit work. Save $250.</div>
          </div>
          <div style={{padding:"16px 20px",background:C.cream,border:"1px solid "+C.linen}}>
            <div style={{fontSize:22,fontWeight:700,color:C.rust}}>Quoted</div>
            <div style={{fontSize:13,fontWeight:600,color:C.char,marginTop:4}}>Project</div>
            <div style={{fontSize:12,color:C.stone,marginTop:4}}>Multi-day work is scoped after a walkthrough. I will always recommend whichever format saves you money.</div>
          </div>
        </div>
      </div>

      {/* HOME ORG */}
      <SL>Home Organization</SL>
      <p style={{fontSize:15,color:C.ink,lineHeight:1.8,marginBottom:20}}>You just moved. You are about to move. You watched something at 3 AM and now you want to throw everything away. You have been meaning to deal with it for years and today is the day. You are going through a divorce, a career change, retirement, or you just finally hit the wall with how your space makes you feel. Whatever got you here — I am not going to hand you a book or ask you how things make you feel. I am going to walk through your home, figure out what is not working, and fix it so it works for how you actually live. Not how a TV show says you should live. Not for a photo. For you.</p>
      <p style={{fontSize:14,color:C.stone,lineHeight:1.7,marginBottom:20}}>Small repairs, shelf installs, hardware, and furniture assembly are included while I am already in your home. No need to call a second person.</p>

      <div style={{background:"#fff",border:"1px solid "+C.linen,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <R s="Closet Reset & Wardrobe Systems" d="Typical 4-8 hours. 3-hour minimum." p="$150/hr" />
        <R s="Full Home Organization" d="Typical 12-30+ hours. Hourly or quoted as a project after walkthrough." p="$150/hr or project" />
        <R s="Studio or 1BR Move-In Setup" d="Boxes get unpacked while you are at work. Day one: bed built, clean sheets, nightstand, phone chargers, clothes unpacked and hung, essentials organized. Intake form sent ahead with any needs and optional add-ons (dishes, towels, toilet paper, shampoo, desk, TV mount). I can preorder a desk or TV to arrive and build it while you are gone. I mount and install anything up to 43 inches on most standard wall mounts. Day two if needed: dresser builds, couch placement, art hung, remaining boxes — everything but interior design. 8-hour day, straight through. Flex blocks do not apply — time limitations require high intensity labor days. 1BR confirmed after consult call depending on volume and needs." p="$1,200/day" />
        <R s="Larger Move-In (2BR+)" d="Falls into project or custom pricing depending on scope. We will talk through it and flex for what makes sense for both your needs and your budget." p="Quoted after call" />
        <R s="Storage Unit Organization" d="Typical 4-8 hours. 3-hour minimum. Sort, consolidate, label." p="$150/hr" />
        <R s="Furniture Assembly" d="IKEA, West Elm, CB2, Target, vintage. 2-hour minimum." p="$150/hr" />
      </div>

      <div style={{padding:"16px 20px",background:C.warm,border:"1px solid "+C.linen,borderLeft:"3px solid "+C.rust,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.rust,marginBottom:6}}>ADHD & Sensory-Sensitive Spaces</div>
        <p style={{fontSize:13,color:C.ink,lineHeight:1.7}}>Guidance on organizing for children and adults with ADHD, sensory needs, and high-energy environments — systems built around how that person's brain operates. Available within standard engagements. <span style={{fontStyle:"italic",color:C.clay}}>Guidance only. Not a clinical service.</span></p>
      </div>

      {/* MOVE-IN BUNDLE */}
      <div style={{padding:"20px 24px",background:C.warm,border:"1px solid "+C.linen,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.rust,marginBottom:10}}>Move-In Setup Bundles (optional)</div>
        <p style={{fontSize:13,color:C.ink,lineHeight:1.7,marginBottom:12}}>Supplies sourced and delivered before I arrive. Functional, not decorative. Everything you forgot to pack and everything you need to actually live your first week without emergency Target runs.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div style={{padding:"14px 16px",background:C.cream,border:"1px solid "+C.linen}}>
            <div style={{fontSize:16,fontWeight:700,color:C.rust}}>~$200</div>
            <div style={{fontSize:12,fontWeight:600,color:C.char,marginTop:4}}>Budget</div>
            <div style={{fontSize:11,color:C.stone,marginTop:6,lineHeight:1.5}}>5 clear bins, basic tool set with drill, surge protectors with USB, extension cord, under-bed storage, rolling rack, smart bulbs, table lamp, dish set, utensils, dish soap, laundry soap, bath mats, 2 towels</div>
          </div>
          <div style={{padding:"14px 16px",background:C.cream,border:"1px solid "+C.linen}}>
            <div style={{fontSize:16,fontWeight:700,color:C.rust}}>~$350</div>
            <div style={{fontSize:12,fontWeight:600,color:C.char,marginTop:4}}>Essential</div>
            <div style={{fontSize:11,color:C.stone,marginTop:6,lineHeight:1.5}}>Everything in Budget plus quality tool set you keep for life, premium storage, bedding starter, expanded kitchen basics, cleaning supplies</div>
          </div>
          <div style={{padding:"14px 16px",background:C.cream,border:"1px solid "+C.linen}}>
            <div style={{fontSize:16,fontWeight:700,color:C.rust}}>~$500</div>
            <div style={{fontSize:12,fontWeight:600,color:C.char,marginTop:4}}>Full Setup</div>
            <div style={{fontSize:11,color:C.stone,marginTop:6,lineHeight:1.5}}>Everything in Essential plus desk if needed, additional lighting, cable management, full kitchen and bathroom basics for hosting in week one</div>
          </div>
        </div>
        <p style={{fontSize:11,color:C.sand,marginTop:10}}>Bundles are supply cost only. Labor is separate at hourly rate.</p>
      </div>

      <div style={{height:1,background:C.linen,margin:"48px 0"}} />

      {/* LEGACY */}
      <SL>Legacy Planning</SL>
      <p style={{fontSize:15,color:C.stone,lineHeight:1.7,marginBottom:20}}>Life shifts. Retirement comes in stages. You are moving into something smaller, splitting time between two places, or your kids live across the country in apartments that cannot hold the china. The heirlooms are real and they matter — and nobody has a plan for them yet. I come in, go through it all with you, and build one.</p>

      <div style={{background:"#fff",border:"1px solid "+C.linen,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <R s="Legacy Catalog" d="You do not need me to reorganize the home — you need me to walk through it with you or your family, hear the stories, photograph the pieces, open the bins nobody has looked at in years, and document what everything is and what it is worth. The output is a Legacy Catalog your family keeps. 20-30 hours typical." p="From $3,500" />
        <R s="Standard Elder Home Project" d="The full thing. Organization, safety check, declutter, removal of unwanted items, donation runs, resale pickups, home upgrades and repairs, tech and device setup, plus the finished Legacy Catalog. 40 hours average spread across 4-hour visits, including about 6 hours off-site for catalog creation and project coordination. If those hours are not fully used, they roll into other agreed work or the cost is reduced." p="$7,000" />
        <R s="Full Estate Project (60-80+ hours)" d="Larger homes, extensive collections, multiple locations, or complex situations that require extended time and specialized research." p="From $10,000" />
        <R s="Family Distribution Plan" d="The storytelling piece — where you imagine where meaningful items would go. Not a will. Not legally binding. Lives inside the Legacy Catalog as your personal vision for what you hope happens." p="$175/hr" />
        <R s="Estate Transition Support" d="When the family is ready to execute the plan. I come back with the catalog and handle it — what sells, what gets donated, what needs pickup, what still has a story left in it." p="$175/hr + resale commission" />
        <R s="Ongoing Legacy Retainer" d="Monthly check-ins, asset management, tech support, home reviews, donation pickups, resale continuation, ongoing downsizing work." p="$500/month" />
        <R s="Hourly (custom scoping)" d="For anything that does not fit neatly into a project. Every engagement starts with a free walkthrough and conversation." p="$175/hr" />
      </div>

      <p style={{fontSize:13,color:C.clay,fontStyle:"italic"}}>All legacy work is at $175/hr. Every project is quoted after a walkthrough. The first conversation is always free.</p>

      <div style={{padding:"16px 20px",background:C.char,marginBottom:16}}>
        <p style={{fontSize:14,color:C.linen,lineHeight:1.7}}>
          <span style={{color:C.rust,fontWeight:600}}>Common next step:</span> After the Legacy Catalog is complete, many clients purchase a Flex Block ($1,250 / 10 hours) to have me come back and execute — sort everything into clear labeled bins, organize room by room from the catalog, and get the home set up based on what we documented together. Items flagged for resale get listed. This is the most common path and it happens naturally.
        </p>
      </div>

      <div style={{height:1,background:C.linen,margin:"48px 0"}} />

      {/* ELDER */}
      <SL>Elder Safety & Home Readiness</SL>
      <p style={{fontSize:15,color:C.stone,lineHeight:1.7,marginBottom:20}}>For seniors aging in place — or their families across the country who need someone they trust. You tell me what you need and I handle it.</p>

      <div style={{background:"#fff",border:"1px solid "+C.linen,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <R s="Elder Home Visit" d="Any combination of: smoke/CO check, fall prevention, outlet safety, bedside remote lighting, battery and appliance review, phone and password setup, Wi-Fi, streaming, emergency contacts, shower head install, cord and fire hazard audit, lighting upgrades, furniture stability check. For out-of-state families: periodic sweeps with a report back." p="$150/hr" />
      </div>

      {/* SENIOR BUNDLE */}
      <div style={{padding:"20px 24px",background:C.warm,border:"1px solid "+C.linen,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.rust,marginBottom:10}}>Senior Home Safety Bundle (optional · ~$150)</div>
        <p style={{fontSize:13,color:C.ink,lineHeight:1.7}}>Pre-sourced supplies I bring to the first visit: replacement batteries for all devices, flashlight, fire extinguisher, updated smoke/CO detector with 10-year battery, bedside remote outlet adapters, updated light bulbs (brighter, dimmable), fire safe grab-and-go briefcase for important documents (critical for California fire and evacuation), detachable shower head, and shower stool or bench if needed based on assessment.</p>
        <p style={{fontSize:11,color:C.sand,marginTop:8}}>Supply cost is separate from hourly labor. Confirmed before purchase.</p>
      </div>

      <p style={{fontSize:13,color:C.stone}}>Often paired with Legacy Planning. Included in full legacy engagements. Standalone visits available.</p>

      <div style={{height:1,background:C.linen,margin:"48px 0"}} />

      {/* RESALE */}
      <SL>Curated Resale</SL>
      <p style={{fontSize:15,color:C.stone,lineHeight:1.7,marginBottom:20}}>I handle everything: pickup, photography, listing, negotiation, shipping, and monthly payout. Each item goes where its buyers actually are. You get paid. I do the work.</p>

      <div style={{background:"#fff",border:"1px solid "+C.linen,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <R s="Clothing & Accessories" d="10-item minimum pickup. Zip bags provided. Nothing under $20 estimated value." p="55 me / 45 you" />
        <R s="Designer & High-Value ($300+)" d="Per item. I know what it is worth and which platform to sell it on." p="50 / 50" />
        <R s="Furniture ($150+ items)" d="Free local consultation. I list, manage the sale, coordinate buyer pickup." p="50 / 50" />
        <R s="Full Closet Liquidation (50+ items)" d="Volume project over 2-3 months. Monthly reporting." p="55 me / 45 you" />
        <R s="Doorstep Pickup" d="Order the zip bags. Fill them. I pick up. No sorting needed — I identify what others miss." p="Free" />
        <R s="Monthly Payout" d="Report by the 1st. Venmo, Zelle, or check." p="Paid by the 5th" />
      </div>

      <div style={{padding:"16px 20px",background:C.warm,border:"1px solid "+C.linen,marginBottom:16}}>
        <p style={{fontSize:13,color:C.stone,lineHeight:1.7}}>Split is on sale price. I absorb all platform fees, shipping, photography, and listing management. Your share is clean — no deductions after the split. You set a floor price at intake. I have authority within 15-20% to keep things moving without calling you for every offer. Day 30: -10%. Day 60: -10% more. Day 90: pick up, donate, or accept best offer.</p>
      </div>

      <div style={{height:1,background:C.linen,margin:"48px 0"}} />

      {/* ADD-ONS */}
      <SL>Add-Ons</SL>
      <p style={{fontSize:15,color:C.stone,lineHeight:1.7,marginBottom:20}}>Available during any engagement. Most are included — a few are standalone.</p>

      <div style={{background:"#fff",border:"1px solid "+C.linen,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <R s="Furniture assembly" d="IKEA, West Elm, CB2, Target, vintage" p="Included" />
        <R s="Small repairs, shelf installation, hardware, fixtures" d="" p="Included" />
        <R s="Electronics wipe and responsible recycling" d="" p="Included" />
        <R s="Senior home safety review" d="Included in legacy engagements" p="Included" />
        <R s="Vendor coordination" d="Haulers, movers, deep clean, contractors — I manage the timeline" p="$150/hr" />
        <R s="Referral coordination" d="Vetted local vendors for services outside my scope — standalone" p="$50" />
      </div>

      {/* SCOPE AND BOUNDARIES */}
      <div style={{padding:"28px 32px",background:C.warm,border:"1px solid "+C.linen,marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.rust,marginBottom:12}}>What I do and what I do not do</div>
        <p style={{fontSize:14,color:C.ink,lineHeight:1.85,marginBottom:12}}>I am not an interior designer — but I can refer you to one. I am not a lawyer, estate sale company, liquidator, or certified appraiser. I do not perform any construction, contractor, or electrical work that requires a license, meeting code, or that violates renters regulations, tenant leases, HOA rules, or city codes. There is no price that will compromise the safety of you, your neighbors, or myself. The law is there for a reason and this is not an area I put my clients at risk on.</p>
        <p style={{fontSize:14,color:C.ink,lineHeight:1.85,marginBottom:12}}>My assessments of value and condition come from years of professional retail experience across multiple industries — clothing, outdoor gear, sewing machines, used equipment, luxury resale — and my credibility is listed on this site. Any advice or suggestions I offer outside of my direct services comes from a place of human experience and is simply a suggestion or a referral to someone credible who can help.</p>
        <p style={{fontSize:14,color:C.ink,lineHeight:1.85}}>I stand by everything on this list. I am confident that as this work evolves I will create things for my clients that I have not thought of yet — because that is what I was raised to do in retail. We worried about the time it took or the hit later and it all leveled out in the end. I believe the investment and time I put into people will lead to only good things.</p>
      </div>

      {/* CLOSING */}
      <div style={{padding:"28px 32px",background:C.char,marginBottom:48}}>
        <p style={{fontSize:15,color:C.linen,lineHeight:1.9,marginBottom:12}}>There is no request you cannot ask if it comes up in natural conversation. I am clear with boundaries and if I have the space and time to honor something unconventional for you, I will. This business will be evolving as I live and learn through my efforts to bring this vision to life. I am sure I will hit roadblocks, mess up a time or two, and fumble here and there.</p>
        <p style={{fontSize:15,color:C.linen,lineHeight:1.9}}>I go into this asking for grace and openness — and I will do the same for anyone who comes my way. Thank you for trusting me with your journey. I look forward to helping you unpack your story in this chapter so you can keep turning the page.</p>
      </div>

      {/* CTA */}
      <div style={{textAlign:"center",padding:"24px 0 40px"}}>
        <p style={{fontSize:22,fontStyle:"italic",color:C.char,marginBottom:12}}>Ready to start?</p>
        <p style={{fontSize:15,color:C.stone,marginBottom:24}}>Call or text (323) 433-1350. The first conversation is always free.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center"}}>
          <button onClick={()=>setPg("home")} style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",padding:"12px 28px",background:"transparent",color:C.char,border:"1px solid "+C.char,cursor:"pointer",fontFamily:ff}}>Back to home</button>
          <button onClick={()=>{setPg("home");setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),150);}} style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",padding:"12px 28px",background:C.char,color:C.cream,border:"none",cursor:"pointer",fontFamily:ff}}>Get in touch</button>
        </div>
      </div>
    </div>
  </div>);
}
