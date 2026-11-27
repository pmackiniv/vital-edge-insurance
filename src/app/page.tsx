import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { PLANENROLL } from "@/lib/externalLinks";
import "./home-redesign.css";

export const metadata: Metadata = {
  title: "Medicare & Health Insurance in Jacksonville | Vital Edge Insurance",
  description: "Get one-on-one Medicare help from Patrick Mackin IV. Serving Jacksonville, St. Johns County, Nocatee and 13 licensed states. Book a call or compare available plans online.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  return (
    <div className="ve-home">
<header>
<div className="wrap header topbar">
<Link className="brand brand-logo" href="/" aria-label="Vital Edge Insurance home"><Image unoptimized src="/brand/vital-edge-logo.png" width={200} height={200} alt="Vital Edge Insurance" /></Link>
<div className="top-actions"><a className="button outline head-call" href={`tel:${site.phoneE164}`}>Call Patrick</a><a className="button solid" href="#start">Get started</a></div>
</div>
<div className="nav-band"><nav className="wrap site-nav" aria-label="Main navigation"><a href="#start">Medicare help</a><Link href="/ancillary">Dental, Vision &amp; More</Link><Link href="/resources">Resources</Link><a href="#patrick">About Patrick</a><Link className="client-link" href="/contact">Client help</Link></nav></div>
</header>

<section className="hero" aria-labelledby="hero-title">
<figure className="hero-photo"><Image unoptimized src="/images/home/senior-couple.webp" width={1280} height={960} alt="An older couple laughing together on a garden porch" fetchPriority="high" /></figure>
<div className="wrap hero-grid"><div className="hero-copy">
<h1 id="hero-title">Find Medicare<br />that fits <em>you.</em></h1>
<a className="button hero-cta" href="#start">Explore Medicare options</a>
</div></div></section>
<section id="patrick" className="broker-strip" aria-label="Meet your broker"><div className="wrap broker-inner"><Image unoptimized src="/images/team/patrick-professional-headshot-320.jpg" width={96} height={96} alt="Patrick Mackin IV" decoding="async" /><div><strong>Meet Patrick Mackin IV</strong><p>Licensed insurance broker · Serving 13 states</p></div><Link href="/about">About Patrick</Link></div></section>
<section id="start" className="wrap tasks"><div className="section-head"><p className="kicker">START HERE</p><h2>Let’s get you started.</h2><p>Choose what you need. No sign-up.</p></div>
<div className="cards">
<button type="button" aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="turning" className="card"><span className="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="6" width={16} height={15} rx="2"/><path d="M4 10h16M8 3v6m8-6v6m-7 6h6m-3-3v6"/></svg></span><strong>I’m turning 65</strong><span>See when to sign up and what to do first.</span><b>See my first steps</b></button>
<button type="button" aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="working" className="card"><span className="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="7" width={18} height={13} rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/></svg></span><strong>I’m still working</strong><span>See what to ask about your work coverage.</span><b>See what to check</b></button>
<button type="button" aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="review" className="card"><span className="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="3" width={14} height={18} rx="2"/><path d="m8 12 2 2 5-5m-7 8h8"/></svg></span><strong>I already have Medicare</strong><span>Compare plans or get help with your current coverage.</span><b>See my options</b></button>
</div><p className="micro other"><Link href="/medicare-101">Medicare basics</Link> <span>·</span> <Link href="/resources">All guides</Link> <span>·</span> Helping a loved one? <Link href="/family-help">Start with the family guide</Link> <span>·</span> <Link href="/ancillary">Dental, vision &amp; other coverage</Link></p>
</section>
<section className="compare-band" aria-labelledby="compare-title"><div className="wrap compare-inner"><div><h2 id="compare-title">Want to compare plans on your own?</h2><p>Open the plan finder and enter your ZIP code to see plans near you.</p><p className="micro">We do not offer every plan available in your area. We represent many organizations which offer several products in your area. Please contact <a href="https://www.medicare.gov/">Medicare.gov</a> or <a href="tel:+18006334227">1-800-MEDICARE</a> to get information on all of your options.</p></div><a className="button solid" href={PLANENROLL}>Compare Medicare plans</a></div></section>
<section className="band"><div className="wrap help"><div><p className="kicker">VITAL GUIDE</p><h2>Have a Medicare question?</h2><p>Get a quick answer from Vital Guide, or talk to Patrick. No account or Medicare number needed.</p><button className="button solid" type="button" aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="start">Ask Vital Guide</button></div>
<div className="mini"><div className="mini-head"><span className="spark" aria-hidden="true">✦</span><span><strong>Vital Guide</strong><small>General Medicare information</small></span></div><p>What would you like help with today?</p><button aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="turning" type="button">I’m turning 65 soon</button><button aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="working" type="button">I have coverage through work</button><button aria-haspopup="dialog" aria-controls="vg-dialog" data-topic="client" type="button">I’m already a Vital Edge client</button></div>
</div></section>
<section className="wrap answers" id="answers"><p className="kicker">COMMON QUESTIONS</p><h2>Medicare questions, answered.</h2>
<details><summary>Where do I start if I’m turning 65?</summary><p>Start by checking your Medicare enrollment dates and whether you’ll get Medicare automatically. If you have coverage through current employment, check how it works with Medicare before deciding when to sign up. <a href="https://www.medicare.gov/basics/get-started-with-medicare">Medicare.gov: Getting started</a>. <Link href="/turning-65-medicare">Read our Turning 65 guide</Link>.</p></details>
<details><summary>What should I ask my employer’s benefits team?</summary><p>Ask how your work coverage coordinates with Medicare, when that coverage ends, and whether the prescription coverage is creditable. If you contribute to an HSA, check the timing before signing up. <a href="https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65">Medicare.gov: Working past 65</a>. <Link href="/medicare-still-working">Read our working-past-65 guide</Link>.</p></details>
<details><summary>Do I need to book a call to compare plans?</summary><p>No. You can open the <Link href="/enroll">self-service comparison page</Link> without a call. If you want help reviewing your situation with a licensed broker, call Patrick or request an appointment separately.</p></details>
<details><summary>How do I get help with coverage I already have?</summary><p>If Patrick is your broker, <a href={`tel:${site.phoneE164}`}>call him at (352) 214-8879</a> or use the <Link href="/contact">contact page</Link>. For a specific claim or a replacement member ID card, you can also call the member services number on your plan materials. Keep private details out of the guide.</p></details>
<p className="nearby">Local Medicare guides: <Link href="/duval-county-medicare-help">Jacksonville</Link>, <Link href="/st-johns-county-medicare-help">St. Johns County</Link>, <Link href="/nocatee-medicare-help">Nocatee</Link> and <Link href="/the-villages-medicare-help">The Villages</Link>. <Link href="/licensed-states">See all licensed states</Link>.</p>
</section>
<section className="wrap close"><div><h2>Want to talk?</h2><p>Call Patrick or pick a time.</p></div><div className="buttons"><Link className="button solid" href="/schedule">Book a call</Link><a className="button outline" href={`tel:${site.phoneE164}`}>Call (352) 214-8879</a></div></section>
    </div>
  );
}
