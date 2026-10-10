"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    Icon: Mail,
    label: "Email",
    value: "hello@anvyra.in",
    href: "mailto:hello@anvyra.in",
  },
  {
    Icon: MapPin,
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: null,
  },
  {
    Icon: Clock,
    label: "Response Time",
    value: "Within 24–48 hours",
    href: null,
  },
];

const faqs = [
  {
    q: "What is your return policy?",
    a: "We offer 30-day hassle-free returns on all orders. Items must be unworn and in original packaging.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available at checkout.",
  },
  {
    q: "Do you ship pan-India?",
    a: "Yes, we ship to all major cities and towns across India. Free shipping on orders above ₹999.",
  },
  {
    q: "How do I track my order?",
    a: "Once shipped, you'll receive a tracking link via email. You can also track orders from your account page.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with real API call when ready
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="bg-[#F7F3EE]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-[#1C0A04] py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C4956A]">
            Get in Touch
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[#F7F3EE]">
            Contact Us
          </h1>
          <p className="mt-4 text-[#C4956A]/80">
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact Info + Form ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">

          {/* Left — Contact info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
                We're here to help
              </h2>
              <p className="mt-3 leading-relaxed text-[#5C2E1A]">
                Whether it's about an order, a product question, or anything
                else — reach out and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1C0A04]">
                    <Icon className="h-5 w-5 text-[#C4956A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="mt-0.5 font-medium text-[#1C0A04] hover:text-[#C4956A] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-medium text-[#1C0A04]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                Follow the brand
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href="https://www.linkedin.com/in/akanksha-deshmukh-26210b244/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#D6CCBF] px-4 py-2 text-sm font-medium text-[#5C2E1A] transition hover:border-[#C4956A] hover:text-[#C4956A]"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/akankshad1712/ANVYRA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#D6CCBF] px-4 py-2 text-sm font-medium text-[#5C2E1A] transition hover:border-[#C4956A] hover:text-[#C4956A]"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="rounded-2xl border border-[#D6CCBF] bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h3 className="mt-4 text-xl font-bold text-[#1C0A04]">Message Sent!</h3>
                <p className="mt-2 text-[#5C2E1A]">
                  Thank you for reaching out. We'll get back to you within 24–48 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 rounded-full border border-[#D6CCBF] px-6 py-2 text-sm text-[#5C2E1A] transition hover:border-[#C4956A]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#1C0A04]">
                  Send a Message
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-3 text-sm text-[#1C0A04] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-3 text-sm text-[#1C0A04] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What is this about?"
                    className="w-full rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-3 text-sm text-[#1C0A04] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#A0673A]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-3 text-sm text-[#1C0A04] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5C2E1A] py-4 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A] disabled:opacity-60"
                >
                  {loading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#F7F3EE] border-t-transparent" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-[#EDE8E0] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A0673A]">
              Quick Answers
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-[#1C0A04]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C2E1A]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">
            Ready to explore?
          </h2>
          <p className="mt-3 text-[#5C2E1A]">
            Browse our full collection of premium fashion pieces.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-[#5C2E1A] px-10 py-4 font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
          >
            Shop Now
          </Link>
        </div>
      </section>

    </main>
  );
}
