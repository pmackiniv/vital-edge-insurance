"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { PLANENROLL } from "@/lib/externalLinks";
import { websiteScheduleUrl } from "@/lib/scheduling";

type Destination = [label: string, href: string];
type Answer = { title: string; text: string; steps?: string[]; source?: Destination; actions: Destination[] };
const call: Destination = ["Call Patrick", `tel:${site.phoneE164}`];
const book: Destination = ["Book a 20-minute Turning 65 call", websiteScheduleUrl("https://calendly.com/pmackiniv27/turning-65-medicare-phone-appointment")];
const answers = {
  start: { title: "What do you need help with?", text: "Pick a topic to see what to do next. You can also call Patrick.", actions: [call] },
  turning: { title: "See when to sign up", text: "Find out if you’ll get Medicare automatically or need to sign up.", steps: ["Check your Medicare enrollment dates.", "If you get insurance through work, ask how it works with Medicare.", "Read the guide or book a call to talk it through."], source: ["Medicare.gov: Getting started", "https://www.medicare.gov/basics/get-started-with-medicare"], actions: [book, ["Read the Turning 65 guide", "/turning-65-medicare"]] },
  working: { title: "Still working? Start here.", text: "Ask your benefits team these questions before you sign up.", steps: ["Which coverage pays first? When does my work coverage end?", "Can I get written confirmation that my drug coverage is creditable?", "If I have an HSA, what dates should I check before enrolling?"], source: ["Medicare.gov: Working past 65", "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65"], actions: [["Read the Working Past 65 guide", "/medicare-still-working"], book] },
  review: { title: "Compare your Medicare options", text: "Use the online plan finder or talk to Patrick. Vital Guide can’t check your specific benefits, doctors, or prescriptions.", actions: [["Compare Medicare plans", PLANENROLL], ["Book a call", "/schedule"]] },
  client: { title: "Get help with your plan", text: "Already work with Patrick? Call him directly or use the contact page. For claims or a new ID card, you can also call member services on your plan materials.", actions: [call, ["Open the contact page", "/contact"]] },
  personal: { title: "Talk to Patrick about this", text: "Vital Guide can’t check plan costs, eligibility, prescriptions, or doctor networks. Please keep personal details out of this guide.", actions: [call, ["Book a call", "/schedule"]] },
  unknown: { title: "I don’t have an answer for that", text: "Try a topic below or call Patrick. Vital Guide won’t guess about coverage.", actions: [call, ["Browse Medicare resources", "/resources"]] },
} satisfies Record<string, Answer>;

type Topic = keyof typeof answers;
const labels = [["turning", "Turning 65"], ["working", "Still working"], ["review", "Review coverage"], ["client", "Existing client"]] as const;
function topicFor(question: string): Topic {
  const q = question.trim().toLowerCase();
  if (!q) return "start";
  if (/\d{3}[- .]?\d{2}[- .]?\d{4}|medicare (id|number)|social security number|bank/.test(q)) return "personal";
  if (/\b(doctor|cost|premium|deductible|eligible|eligibility|benefit amount|in network)\b|prescriptions?/.test(q)) return "personal";
  if (/\b(work|working|employer|hsa|creditable)\b/.test(q)) return "working";
  if (/turn|\b65\b|first time|new to|sign up/.test(q)) return "turning";
  if (/existing client|claim|member id|already a client/.test(q)) return "client";
  if (/review|compare|switch|existing coverage|already have/.test(q)) return "review";
  return "unknown";
}

export default function HomeGuide() {
  const [topic, setTopic] = useState<Topic>("start");
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDetailsElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const answer: Answer = answers[topic];

  useEffect(() => {
    const home = dialog.current?.closest(".ve-home");
    const openGuide = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("button[data-topic]");
      if (!button) return;
      const name = button.dataset.topic;
      if (!name || !Object.hasOwn(answers, name)) return;
      setTopic(name as Topic);
      if (!dialog.current?.open) {
        origin.current = button;
        dialog.current?.showModal();
      }
    };
    home?.addEventListener("click", openGuide);
    return () => home?.removeEventListener("click", openGuide);
  }, []);

  return (
    <dialog id="guide" ref={dialog} aria-labelledby="guide-title" onClose={() => {
      if (search.current) search.current.open = false;
      if (input.current) input.current.value = "";
      origin.current?.focus();
    }}>
      <header className="dialog-head"><span className="spark" aria-hidden="true">✦</span><div><h2 id="guide-title">Vital Guide</h2><p>Medicare basics</p></div><form method="dialog"><button className="x" aria-label="Close Vital Guide">×</button></form></header>
      <div className="dialog-body">
        <div aria-live="polite">
          <h3>{answer.title}</h3><p>{answer.text}</p>
          {answer.steps && <ul>{answer.steps.map((step) => <li key={step}>{step}</li>)}</ul>}
          {answer.source && <p><a href={answer.source[1]}>{answer.source[0]}</a></p>}
          <div className="buttons">{answer.actions.map(([label, url], index) => <a key={url} className={`button ${index === 0 ? "solid" : "outline"}`} href={url}>{label}</a>)}</div>
          {topic === "review" && <p>We do not offer every plan available in your area. Visit <a href="https://www.medicare.gov/">Medicare.gov</a> or call <a href="tel:+18006334227">1-800-MEDICARE</a> for all options.</p>}
        </div>
        <div className="topic-list">{labels.map(([id, label]) => <button type="button" key={id} data-topic={id} aria-pressed={topic === id}>{label}</button>)}</div>
        <details className="search" ref={search}><summary>Look up a general topic</summary>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (!input.current) return;
            setTopic(topicFor(input.current.value));
            input.current.value = "";
          }}>
            <label htmlFor="question">Topic, not personal details</label><div className="search-row"><input ref={input} id="question" type="search" maxLength={100} placeholder="e.g. employer coverage" autoComplete="off" /><button type="submit">Find</button></div>
          </form>
        </details>
      </div>
      <div className="dialog-foot">Do not enter Medicare numbers, medical, or payment details. <a href={call[1]}>{call[0]}</a></div>
    </dialog>
  );
}
