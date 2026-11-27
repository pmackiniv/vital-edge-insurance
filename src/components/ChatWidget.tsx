"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/site";
import { PLANENROLL } from "@/lib/externalLinks";
import { websiteScheduleUrl } from "@/lib/scheduling";

type Destination = [label: string, href: string];
type Answer = { title: string; text: string; steps?: string[]; source?: Destination; actions: Destination[] };
const call: Destination = ["Call Patrick", `tel:${site.phoneE164}`];
const book: Destination = ["Book a 20-minute Turning 65 call", websiteScheduleUrl("https://calendly.com/pmackiniv27/turning-65-medicare-phone-appointment")];
const answers = {
  start: { title: "What do you need help with?", text: "Pick a topic to see what to do next. You can also call Patrick.", actions: [] },
  turning: { title: "See when to sign up", text: "Find out if you’ll get Medicare automatically or need to sign up.", steps: ["Check your Medicare enrollment dates.", "If you get insurance through work, ask how it works with Medicare.", "Read the guide or book a call to talk it through."], source: ["Medicare.gov: Getting started", "https://www.medicare.gov/basics/get-started-with-medicare"], actions: [book, ["Read the Turning 65 guide", "/turning-65-medicare"]] },
  working: { title: "Still working? Start here.", text: "Ask your benefits team these questions before you sign up.", steps: ["Which coverage pays first? When does my work coverage end?", "Can I get written confirmation that my drug coverage is creditable?", "If I have an HSA, what dates should I check before enrolling?"], source: ["Medicare.gov: Working past 65", "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65"], actions: [["Read the Working Past 65 guide", "/medicare-still-working"], book] },
  basics: { title: "Start with the Medicare basics", text: "Learn what Parts A and B cover and how Medicare coverage is organized.", source: ["Medicare.gov: Medicare basics", "https://www.medicare.gov/basics/get-started-with-medicare"], actions: [["Read the Medicare basics guide", "/medicare-101"]] },
  dental: { title: "Explore dental, vision and hearing", text: "Read about these types of coverage. To check what your current plan covers, call Patrick or your plan’s member services.", actions: [["See Dental, Vision & More", "/ancillary"]] },
  review: { title: "Compare your Medicare options", text: "Use the online plan finder or talk to Patrick. Vital Guide can’t check your specific benefits, doctors, or prescriptions.", actions: [["Compare Medicare plans", PLANENROLL], ["Book a call", "/schedule"]] },
  client: { title: "Get help with your plan", text: "Already work with Patrick? Call him directly or use the contact page. For claims or a new ID card, you can also call member services on your plan materials.", actions: [call, ["Open the contact page", "/contact"]] },
  personal: { title: "Talk to Patrick about this", text: "Vital Guide can’t check plan costs, eligibility, prescriptions, or doctor networks. Please keep personal details out of this guide.", actions: [call, ["Book a call", "/schedule"]] },
  unknown: { title: "I don’t have an answer for that", text: "Try a topic below or call Patrick. Vital Guide won’t guess about coverage.", actions: [call, ["Browse Medicare resources", "/resources"]] },
} satisfies Record<string, Answer>;

type Topic = keyof typeof answers;
const labels = [["turning", "Turning 65"], ["working", "Still working"], ["review", "Review coverage"], ["client", "Existing client"], ["dental", "Dental & vision"], ["basics", "Medicare basics"]] as const;
function topicFor(question: string): Topic {
  const q = question.trim().toLowerCase();
  if (!q) return "start";
  if (/\d{3}[- .]?\d{2}[- .]?\d{4}|medicare (id|number)|social security number|bank/.test(q)) return "personal";
  if (/\b(doctor|cost|premium|deductible|eligible|eligibility|benefit amount|in[- ]network)\b/.test(q)) return "personal";
  if (/\b(work|working|employer|hsa|creditable)\b/.test(q)) return "working";
  if (/prescriptions?|\b(my plan|covered|qualify|coverage for)\b/.test(q)) return "personal";
  if (/\bturn(?:ing)?\b|\b65\b|first time|new to|sign up|when (?:can|should|do) i enroll/.test(q)) return "turning";
  if (/existing client|claim|member id|already a client/.test(q)) return "client";
  if (/review|compare|switch|existing coverage|already have/.test(q)) return "review";
  if (/dental|vision|hearing/.test(q)) return "dental";
  if (/medicare basics|part [ab]\b|what is medicare|how does medicare work/.test(q)) return "basics";
  return "unknown";
}

function ChatIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4a8.5 8.5 0 1 1 15-4.5Z"/><path d="M8 11.5h.01m4 0h.01m4 0h.01" strokeWidth="2.5"/></svg>;
}

function GuideLink({ href, label, onNavigate, className }: { href: string; label: string; onNavigate?: () => void; className?: string }) {
  return href.startsWith("/")
    ? <Link href={href} className={className} onClick={onNavigate}>{label}</Link>
    : <a href={href} className={className}>{label}</a>;
}

function GuideConversation({ topic, onTopic, onNavigate }: { topic: Topic; onTopic: (topic: Topic) => void; onNavigate?: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const answer: Answer = answers[topic];
  function select(next: Topic) {
    onTopic(next);
    if (scroll.current) scroll.current.scrollTop = 0;
  }
  return (
    <div className="vg-conversation">
      <div className="vg-scroll" ref={scroll}>
        <div role="log" aria-label="Vital Guide conversation" aria-live="polite" aria-atomic="true">
          <div className="vg-answer">
            <h3>{answer.title}</h3>
            <p>{answer.text}</p>
            {answer.steps && <ul>{answer.steps.map((step) => <li key={step}>{step}</li>)}</ul>}
            {answer.source && <p><a href={answer.source[1]}>{answer.source[0]}</a></p>}
            {answer.actions.length > 0 && <div className="vg-actions">{answer.actions.map(([label, href], index) => (
              <GuideLink key={href} href={href} label={label} onNavigate={onNavigate} className={index === 0 ? "vg-primary" : ""} />
            ))}</div>}
            {topic === "review" && <p className="vg-disclosure">We do not offer every plan available in your area. Visit <a href="https://www.medicare.gov/">Medicare.gov</a> or call <a href="tel:+18006334227">1-800-MEDICARE</a> for all options.</p>}
          </div>
        </div>
        <div className="vg-topics" aria-label="Popular topics">
          {labels.map(([id, label]) => <button type="button" key={id} onClick={() => select(id)} aria-pressed={topic === id}>{label}</button>)}
        </div>
      </div>
      <form className="vg-composer" onSubmit={(event) => {
        event.preventDefault();
        if (!input.current?.value.trim()) return;
        select(topicFor(input.current.value));
        input.current.value = "";
      }}>
        <label htmlFor={inputId}>Look up a general Medicare topic</label>
        <div className="vg-search"><input ref={input} id={inputId} type="search" maxLength={100} placeholder="e.g. employer coverage" autoComplete="off" /><button type="submit">Send</button></div>
        <p>For privacy, don’t enter Medicare numbers, medical details, or payment information.</p>
      </form>
      <footer className="vg-footer">
        <a href={call[1]}>{call[0]}</a>
        <Link href="/schedule" onClick={onNavigate}>Book a call</Link>
        <Link href="/contact" onClick={onNavigate}>Request a callback</Link>
      </footer>
    </div>
  );
}

export function InlineVitalGuide() {
  const [topic, setTopic] = useState<Topic>("start");
  return <div className="vg-inline"><GuideConversation topic={topic} onTopic={setTopic} /></div>;
}

export function ChatWidget() {
  const pathname = usePathname();
  const [topic, setTopic] = useState<Topic>("start");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) closeButton.current?.focus(); }, [open]);

  function show(button: HTMLButtonElement, initial?: Topic) {
    if (!dialog.current || dialog.current.open) return;
    if (initial) setTopic(initial);
    origin.current = button;
    dialog.current.showModal();
    setOpen(true);
  }

  useEffect(() => {
    function openFromHome(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>(".ve-home button[data-topic]");
      const name = button?.dataset.topic;
      if (button && name && Object.hasOwn(answers, name)) show(button, name as Topic);
    }
    document.addEventListener("click", openFromHome);
    return () => document.removeEventListener("click", openFromHome);
  }, []);

  if (pathname === "/chat") return null;
  return (
    <>
      <button className="chat-widget-root vg-launch" type="button" aria-label="Open Vital Guide"
        aria-haspopup="dialog" aria-controls="vg-dialog" aria-expanded={open}
        onClick={(e) => show(e.currentTarget)}>
        <ChatIcon /> <span>Vital Guide</span>
      </button>
      <dialog id="vg-dialog" className="vg-dialog" aria-labelledby="vg-title" ref={dialog}
        onClose={() => { setOpen(false); origin.current?.focus(); }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const r = event.currentTarget.getBoundingClientRect();
          if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close();
        }}>
        {open && <>
          <header className="vg-header">
            <ChatIcon />
            <div><h2 id="vg-title">Vital Guide</h2><p>Automated Medicare guide</p></div>
            <form method="dialog"><button ref={closeButton} type="submit" aria-label="Close Vital Guide">×</button></form>
          </header>
          <GuideConversation topic={topic} onTopic={setTopic} onNavigate={() => dialog.current?.close()} />
        </>}
      </dialog>
    </>
  );
}
