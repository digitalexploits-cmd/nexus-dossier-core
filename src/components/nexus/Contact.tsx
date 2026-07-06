import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BRAND, RESUME_URL } from "@/data/content";

export const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const msg = String(data.get("message") || "");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:${BRAND.contactEmail}?subject=Briefing%20Request%20\u2014%20Nexus&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast({ title: "Briefing request drafted", description: "Your mail client should open with the request." });
    }, 400);
  };

  return (
    <section id="contact" className="container py-20 scroll-mt-24">
      <div className="panel brushed p-6 md:p-10 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="tick">CONTACT / REQUEST BRIEFING</div>
          <h3 className="text-3xl font-semibold tracking-tight">Open a channel to the founder.</h3>
          <p className="text-muted-foreground">
            Briefings are handled directly. Share your context and we’ll respond with a scoped briefing package appropriate to your audience level.
          </p>
          <div className="rule" />
          <div className="space-y-1 text-sm">
            <div><span className="tick mr-2">DIRECT</span>{BRAND.contactEmail}</div>
            <div><span className="tick mr-2">ENTITY</span>{BRAND.company}</div>
            <div><span className="tick mr-2">RESUME</span>
              <a className="text-primary underline underline-offset-4" href={RESUME_URL} download>anthony-mcgee-resume.pdf</a>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="tick">NAME</label>
            <Input name="name" required className="mt-1 bg-surface-raised border-border" />
          </div>
          <div>
            <label className="tick">EMAIL</label>
            <Input name="email" type="email" required className="mt-1 bg-surface-raised border-border" />
          </div>
          <div>
            <label className="tick">CONTEXT</label>
            <Textarea name="message" required rows={5} className="mt-1 bg-surface-raised border-border" placeholder="Audience, use case, timeframe…" />
          </div>
          <Button type="submit" disabled={sending} className="mono tracking-widest text-xs w-full">
            {sending ? "OPENING CHANNEL…" : "REQUEST BRIEFING"}
          </Button>
        </form>
      </div>
    </section>
  );
};
