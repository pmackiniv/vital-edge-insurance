export function BottomFinePrint() {
  return (
    <div className="mt-6 border-t border-black/10 pt-4 text-[12px] leading-relaxed text-black/60">
      <p>This chat provides general information and routing.</p>
      <p className="mt-2">
        For enrollment or plan-specific advice, request a call or use official enrollment links.
      </p>
      <p className="mt-2">Do not enter SSN/Medicare ID or sensitive identifiers here.</p>
      <p className="mt-2">
        Want a human handoff? Call{" "}
        <a className="underline" href="tel:+13522148879">(352) 214-8879</a>{" "}
        or email{" "}
        <a className="underline" href="mailto:pmackiniv27@icloud.com">pmackiniv27@icloud.com</a>.
      </p>
    </div>
  );
}
