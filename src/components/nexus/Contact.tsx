import { useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BRAND, RESUME_URL } from "@/data/content";

const AUDIENCES = [
  { value: "executive",  label: "Executive / Strategic" },
  { value: "technical",  label: "Technical / Engineering" },
  { value: "commercial", label: "Commercial / Pilot" },
  { value: "press",      label: "Press / Media" },
  { value: "other",      label: "Other" },
] as const;

const briefingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be under 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email must be under 255 characters" }),
  organization: z
    .string()
    .trim()
    .max(120, { message: "Organization must be under 120 characters" })
    .optional()
    .or(z.literal("")),
  audience: z.enum(
    ["executive", "technical", "commercial", "press", "other"],
    { errorMap: () => ({ message: "Select an audience level" }) },
  ),
  message: z
    .string()
    .trim()
    .min(20, { message: "Please provide at least 20 characters of context" })
    .max(1200, { message: "Context must be under 1200 characters" }),
});

type BriefingInput = z.infer<typeof briefingSchema>;
type Errors = Partial<Record<keyof BriefingInput, string>>;

const MESSAGE_LIMIT = 1200;

export const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState<BriefingInput | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [messageLen, setMessageLen] = useState(0);
  const [audience, setAudience] = useState<BriefingInput["audience"] | "">("");

  const messageRemaining = useMemo(() => MESSAGE_LIMIT - messageLen, [messageLen]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const raw = {
      name:         String(data.get("name") || ""),
      email:        String(data.get("email") || ""),
      organization: String(data.get("organization") || ""),
      audience:     audience,
      message:      String(data.get("message") || ""),
    };

    const parsed = briefingSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BriefingInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast({
        title: "Please review the form",
        description: "A few fields need attention before sending.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setSending(true);

    const v = parsed.data;
    const audienceLabel =
      AUDIENCES.find((a) => a.value === v.audience)?.label ?? v.audience;
    const bodyLines = [
      `Name: ${v.name}`,
      `Email: ${v.email}`,
      v.organization ? `Organization: ${v.organization}` : null,
      `Audience: ${audienceLabel}`,
      "",
      v.message,
    ].filter(Boolean) as string[];

    const subject = encodeURIComponent("Briefing Request — Nexus");
    const body = encodeURIComponent(bodyLines.join("\n"));
    const href = `mailto:${encodeURIComponent(BRAND.contactEmail)}?subject=${subject}&body=${body}`;
    window.location.href = href;

    window.setTimeout(() => {
      setSending(false);
      setSubmitted(v);
      toast({
        title: "Briefing request drafted",
        description: "Your mail client should open with the request queued.",
      });
    }, 350);
  };

  const reset = () => {
    setSubmitted(null);
    setErrors({});
    setMessageLen(0);
    setAudience("");
  };

  const fieldBase =
    "mt-1 bg-[rgba(12,24,40,0.55)] border-[rgba(80,160,255,0.18)] text-[#eef6ff] placeholder:text-[#8fa3b8]";
  const errorRing = "border-[hsl(0,80%,60%)] focus-visible:ring-[hsl(0,80%,60%)]";

  return (
    <section id="contact" className="container py-20 scroll-mt-24">
      <div
        id="briefing"
        className="panel brushed p-6 md:p-10 grid md:grid-cols-2 gap-8 border border-[rgba(80,160,255,0.18)] shadow-[0_0_40px_rgba(40,120,220,0.08)] scroll-mt-24"
      >
        {/* Left rail */}
        <div className="space-y-4">
          <div className="tick">CONTACT / REQUEST BRIEFING</div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#eef6ff]">
            Open a channel to the founder.
          </h3>
          <p className="text-[#8fa3b8]">
            Briefings are handled directly. Share your context and we'll respond with
            a scoped briefing package appropriate to your audience level.
          </p>
          <div className="rule" />
          <div className="space-y-1 text-sm">
            <div className="text-[#c8d4e2]">
              <span className="tick mr-2">DIRECT</span>
              <a
                href={`mailto:${BRAND.contactEmail}`}
                className="text-[#4db7ff] underline underline-offset-4 no-underline hover:underline"
              >
                {BRAND.contactEmail}
              </a>
            </div>
            <div className="text-[#c8d4e2]">
              <span className="tick mr-2">ENTITY</span>
              {BRAND.company}
            </div>
            <div className="text-[#c8d4e2]">
              <span className="tick mr-2">RESUME</span>
              <a
                className="text-[#4db7ff] underline underline-offset-4"
                href={RESUME_URL}
                download
              >
                anthony-mcgee-resume.pdf
              </a>
            </div>
          </div>
          <div className="rule" />
          <ul className="text-xs text-[#8fa3b8] space-y-1.5 mono tracking-wide">
            <li>· Response typically within 2 business days</li>
            <li>· Evidence-labeled materials — no overclaim</li>
            <li>· Zero tracking; your context stays with the founder</li>
          </ul>
        </div>

        {/* Right rail — form or success */}
        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="anim-swap-in relative flex flex-col justify-center border border-[hsl(var(--interactive)/0.5)] bg-[hsl(var(--interactive)/0.06)] p-6 rounded-sm shadow-[0_0_40px_hsl(var(--interactive)/0.18)]"
          >
            <div className="flex items-start gap-4">
              <div
                aria-hidden
                className="shrink-0 w-10 h-10 rounded-full border border-[hsl(var(--interactive)/0.7)] bg-[hsl(var(--interactive)/0.12)] flex items-center justify-center text-[hsl(var(--interactive))] mono text-lg shadow-[0_0_18px_hsl(var(--interactive)/0.45)]"
              >
                ✓
              </div>
              <div className="min-w-0">
                <div className="mono text-[0.6rem] tracking-[0.32em] uppercase text-[hsl(var(--interactive))]">
                  CHANNEL OPENED
                </div>
                <h4 className="text-xl font-semibold text-[#eef6ff] mt-1">
                  Thanks, {submitted.name.split(" ")[0]}.
                </h4>
                <p className="text-sm text-[#c8d4e2] mt-2 leading-relaxed">
                  Your briefing request is drafted in your mail client, addressed to{" "}
                  <span className="text-[#eef6ff]">{BRAND.contactEmail}</span>. Send it
                  when you're ready — we'll respond within 2 business days with a
                  scoped package for the{" "}
                  <span className="text-[hsl(var(--interactive))]">
                    {AUDIENCES.find((a) => a.value === submitted.audience)?.label}
                  </span>{" "}
                  audience.
                </p>
              </div>
            </div>

            <div className="rule my-5" />

            <div className="grid grid-cols-2 gap-3 text-[0.7rem] mono tracking-widest">
              <a
                href={`mailto:${BRAND.contactEmail}`}
                className="border border-[rgba(80,160,255,0.35)] hover:border-[hsl(var(--interactive))] px-3 py-2 text-center text-[#c8d4e2] no-underline"
              >
                REOPEN MAIL DRAFT
              </a>
              <button
                type="button"
                onClick={reset}
                className="border border-[rgba(80,160,255,0.35)] hover:border-[hsl(var(--interactive))] px-3 py-2 text-[#c8d4e2]"
              >
                SEND ANOTHER
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-3 anim-swap-in">
            <div>
              <label htmlFor="cf-name" className="tick">NAME</label>
              <Input
                id="cf-name"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "cf-name-err" : undefined}
                className={`${fieldBase} ${errors.name ? errorRing : ""}`}
              />
              {errors.name && (
                <p id="cf-name-err" className="mono text-[0.65rem] tracking-wider text-[hsl(0,80%,68%)] mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="cf-email" className="tick">EMAIL</label>
                <Input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cf-email-err" : undefined}
                  className={`${fieldBase} ${errors.email ? errorRing : ""}`}
                />
                {errors.email && (
                  <p id="cf-email-err" className="mono text-[0.65rem] tracking-wider text-[hsl(0,80%,68%)] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cf-org" className="tick">
                  ORGANIZATION <span className="text-[#8fa3b8] normal-case">(optional)</span>
                </label>
                <Input
                  id="cf-org"
                  name="organization"
                  maxLength={120}
                  autoComplete="organization"
                  aria-invalid={!!errors.organization}
                  aria-describedby={errors.organization ? "cf-org-err" : undefined}
                  className={`${fieldBase} ${errors.organization ? errorRing : ""}`}
                />
                {errors.organization && (
                  <p id="cf-org-err" className="mono text-[0.65rem] tracking-wider text-[hsl(0,80%,68%)] mt-1">
                    {errors.organization}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="tick" htmlFor="cf-audience">AUDIENCE</label>
              <Select
                value={audience}
                onValueChange={(v) => setAudience(v as BriefingInput["audience"])}
              >
                <SelectTrigger
                  id="cf-audience"
                  aria-invalid={!!errors.audience}
                  aria-describedby={errors.audience ? "cf-audience-err" : undefined}
                  className={`${fieldBase} ${errors.audience ? errorRing : ""}`}
                >
                  <SelectValue placeholder="Select briefing audience…" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.audience && (
                <p id="cf-audience-err" className="mono text-[0.65rem] tracking-wider text-[hsl(0,80%,68%)] mt-1">
                  {errors.audience}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="cf-msg" className="tick">CONTEXT</label>
                <span
                  className={`mono text-[0.6rem] tracking-widest ${
                    messageRemaining < 0
                      ? "text-[hsl(0,80%,68%)]"
                      : messageRemaining < 100
                        ? "text-[hsl(var(--interactive))]"
                        : "text-[#8fa3b8]"
                  }`}
                >
                  {messageRemaining} LEFT
                </span>
              </div>
              <Textarea
                id="cf-msg"
                name="message"
                required
                rows={5}
                maxLength={MESSAGE_LIMIT}
                onChange={(e) => setMessageLen(e.currentTarget.value.length)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "cf-msg-err" : undefined}
                className={`${fieldBase} ${errors.message ? errorRing : ""}`}
                placeholder="Audience, use case, timeframe, decision you're trying to inform…"
              />
              {errors.message && (
                <p id="cf-msg-err" className="mono text-[0.65rem] tracking-wider text-[hsl(0,80%,68%)] mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="mono tracking-widest text-xs w-full"
            >
              {sending ? "OPENING CHANNEL…" : "REQUEST BRIEFING"}
            </Button>
            <p className="mono text-[0.55rem] tracking-widest uppercase text-[#8fa3b8] text-center pt-1">
              Opens your mail client — nothing sent until you press send.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
