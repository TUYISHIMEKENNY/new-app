import { createFileRoute } from "@tanstack/react-router";
import { Heart, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_site/donate")({
  component: Donate,
  head: () => ({
    meta: [
      { title: "Donate — Epilepsy Alliance Africa" },
      {
        name: "description",
        content:
          "Make a contribution to Epilepsy Alliance Africa. Your gift funds quiet, careful, evidence-led work.",
      },
    ],
  }),
});

function Donate() {
  const [donationType, setDonationType] = useState<"One-Time" | "Monthly">("One-Time");
  const [selectedAmount, setSelectedAmount] = useState<number | "Other">(100);
  const [customAmount, setCustomAmount] = useState<string>("100.00");
  const [coverFees, setCoverFees] = useState(true);

  const amounts = [35, 50, 100, 250, 500];

  const actualAmount = selectedAmount === "Other" ? parseFloat(customAmount) || 0 : selectedAmount;
  // Assuming a 3.75% processing fee like in the prompt example for $100 -> $3.75
  const processingFee = actualAmount * 0.0375;
  const totalAmount = actualAmount + (coverFees ? processingFee : 0);

  return (
    <article>
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow text-background/70">Support</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            Your gift funds quiet, careful, evidence-led work.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-background/80">
            Epilepsy Alliance Africa accepts no industry funding. We are sustained entirely by
            individual donors and a small number of mission-aligned foundations.
            Every contribution is acknowledged. Every dollar is accounted for.
          </p>
        </div>
      </header>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-10">
          
          <div className="bg-card border border-border shadow-sm p-8 md:p-12">
            <h2 className="font-display text-3xl mb-8">Make a Donation</h2>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
              
              {/* Donation Option */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider mb-4">
                  Donation Option <span className="text-destructive">*Required</span>
                </label>
                <div className="flex bg-secondary/50 p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => setDonationType("One-Time")}
                    className={`flex-1 py-3 text-sm font-bold transition-all ${
                      donationType === "One-Time" 
                        ? "bg-background shadow-sm text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType("Monthly")}
                    className={`flex-1 py-3 text-sm font-bold transition-all ${
                      donationType === "Monthly" 
                        ? "bg-background shadow-sm text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider mb-4">
                  Donation Amount <span className="text-destructive">*Required</span>
                </label>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-4 border-2 font-display text-2xl transition-all ${
                        selectedAmount === amt 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-border bg-background hover:border-foreground/30 text-foreground"
                      }`}
                    >
                      ${amt.toFixed(2)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAmount("Other")}
                    className={`py-4 border-2 font-display text-xl transition-all ${
                      selectedAmount === "Other" 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border bg-background hover:border-foreground/30 text-foreground"
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {/* Custom Amount Input */}
              {selectedAmount === "Other" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-semibold uppercase tracking-wider mb-2">
                    Custom Donation Amount <span className="text-destructive">*Required</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border-2 border-border bg-background py-4 pl-10 pr-4 font-display text-2xl outline-none focus:border-primary transition-colors"
                      placeholder="100.00"
                    />
                  </div>
                </div>
              )}

              {/* Processing Costs */}
              <div className="bg-secondary/30 border border-border p-5">
                <p className="text-sm font-semibold uppercase tracking-wider mb-3">Processing costs</p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={coverFees}
                      onChange={(e) => setCoverFees(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-5 border-2 border-primary bg-background peer-checked:bg-primary transition-colors flex items-center justify-center">
                      {coverFees && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                  </div>
                  <span className="text-base text-foreground group-hover:text-primary transition-colors">
                    Yes! I’d like to cover processing costs. (${processingFee.toFixed(2)})
                  </span>
                </label>
              </div>

              {/* Monthly CTA Banner */}
              {donationType === "One-Time" && (
                <div className="bg-primary/10 border-l-4 border-primary p-4 flex items-center gap-4">
                  <Heart className="h-6 w-6 text-primary fill-primary/20 shrink-0" />
                  <p className="text-primary font-medium m-0">
                    <button 
                      type="button" 
                      onClick={() => setDonationType("Monthly")}
                      className="font-bold underline underline-offset-2 hover:text-primary/80 transition-colors"
                    >
                      Increase your impact, give monthly!
                    </button>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary py-5 text-xl font-display text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1"
              >
                <Heart className="h-5 w-5 fill-current" />
                Give ${totalAmount.toFixed(2)}
              </button>

            </form>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            For wire transfers, planned giving, or partnership inquiries, please write to{" "}
            <a href="mailto:epilepsyallianceafrica@gmail.com" className="text-foreground underline underline-offset-4 hover:text-primary">
              epilepsyallianceafrica@gmail.com
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
