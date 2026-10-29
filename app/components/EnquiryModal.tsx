"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

type EnquiryModalProps = {
  open: boolean;
  destinationName: string;
  destinationCountry: string;
  onClose: () => void;
};

const fieldClass =
  "w-full rounded-xl border border-[#252d4a]/15 bg-white px-4 py-3 text-sm text-[#252d4a] outline-none transition focus:border-[#b75b38] focus:ring-2 focus:ring-[#b75b38]/15";

function ModalContent({
  destinationName,
  destinationCountry,
  onClose,
}: Omit<EnquiryModalProps, "open">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSubmitting, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          destination: destinationName,
          country: destinationCountry,
        }),
      });

      if (!response.ok) throw new Error("Unable to submit your enquiry.");

      setFeedback("Thank you! Your enquiry has been submitted.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setFeedback("Unable to submit your enquiry right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#161b2d]/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="relative my-auto w-full max-w-xl rounded-3xl bg-[#f8f7f3] p-6 shadow-2xl sm:p-9"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close enquiry form"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#252d4a]/10 text-[#252d4a] transition hover:bg-[#252d4a] hover:text-white disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#b75b38]">
          Plan your journey
        </p>

        <h2
          id="enquiry-modal-title"
          className="pr-10 text-3xl font-semibold text-[#252d4a]"
        >
          Let&apos;s make it happen.
        </h2>

        <div className="mt-6 rounded-2xl border border-[#252d4a]/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-[#686b73]">
            Selected destination
          </p>
          <p className="mt-1 font-semibold text-[#252d4a]">
            {destinationName}, {destinationCountry}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="enquiry-name" className="mb-2 block text-sm font-medium text-[#252d4a]">
                Full name
              </label>
              <input
                id="enquiry-name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="enquiry-phone" className="mb-2 block text-sm font-medium text-[#252d4a]">
                Phone number
              </label>
              <input
                id="enquiry-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="enquiry-email" className="mb-2 block text-sm font-medium text-[#252d4a]">
              Email address
            </label>
            <input
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="enquiry-message" className="mb-2 block text-sm font-medium text-[#252d4a]">
              Tell us about your trip
            </label>
            <textarea
              id="enquiry-message"
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Travel dates, number of travellers, or any special requests..."
              className={`${fieldClass} resize-y`}
            />
          </div>

          {feedback && (
            <p role="status" aria-live="polite" className="text-sm text-[#252d4a]">
              {feedback}
            </p>
          )}

          <PrimaryButton type="submit" href="" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Send enquiry"}
            {!isSubmitting && <ArrowRight size={18} />}
          </PrimaryButton>

        </form>
      </motion.div>
    </motion.div>
  );
}

export default function EnquiryModal({ open, ...rest }: EnquiryModalProps) {
  return (
    <AnimatePresence>
      {open && <ModalContent key={rest.destinationName} {...rest} />}
    </AnimatePresence>
  );
}