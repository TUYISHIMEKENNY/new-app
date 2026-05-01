import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart, Check, CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  amount: z.number().catch(100),
  type: z.string().catch("One-Time"),
});

export const Route = createFileRoute("/_site/donate-details")({
  validateSearch: searchSchema,
  component: DonateDetails,
  head: () => ({
    meta: [
      { title: "Complete Donation — Epilepsy Alliance Africa" },
    ],
  }),
});

function DonateDetails() {
  const { amount, type } = Route.useSearch();
  const navigate = useNavigate();

  // Tribute States
  const [isTribute, setIsTribute] = useState(false);
  const [tributeType, setTributeType] = useState<"memory" | "honor" | "">("");
  
  // Corporate States
  const [givingType, setGivingType] = useState<"individual" | "corporate">("individual");
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "mobile_money">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to Payment Gateway (e.g., Stripe or Flutterwave)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <article className="min-h-[60vh] flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full bg-card border border-border p-10 text-center shadow-lg rounded-xl">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-display text-3xl mb-4 text-foreground">Thank you!</h2>
          <p className="text-muted-foreground mb-8">
            Your {type.toLowerCase()} donation of ${amount.toFixed(2)} has been processed successfully. Your support makes our work possible.
          </p>
          <button 
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-primary py-4 text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </article>
    );
  }

  return (
    <article>
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
          <p className="eyebrow text-background/70">Complete Your Gift</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-5xl">
            You are giving <span className="text-primary">${amount.toFixed(2)}</span> {type.toLowerCase()}.
          </h1>
        </div>
      </header>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
          
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Personal Details */}
            <div className="bg-card border border-border shadow-sm p-8 rounded-xl space-y-6">
              <h2 className="font-display text-2xl m-0 text-foreground">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-muted-foreground">First Name <span className="text-destructive">*</span></label>
                  <input type="text" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-muted-foreground">Last Name <span className="text-destructive">*</span></label>
                  <input type="text" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-muted-foreground">Email Address <span className="text-destructive">*</span></label>
                <input type="email" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
              </div>
            </div>

            {/* Tribute Gift */}
            <div className="bg-card border border-border shadow-sm p-8 rounded-xl space-y-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={isTribute}
                    onChange={(e) => setIsTribute(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-6 border-2 border-primary bg-background peer-checked:bg-primary rounded-sm transition-colors flex items-center justify-center">
                    {isTribute && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                </div>
                <span className="text-xl font-display text-foreground group-hover:text-primary transition-colors">
                  Is this a tribute gift?
                </span>
              </label>

              {isTribute && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6 pt-4">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                      Is this in memory of or in honor of? <span className="text-destructive">*</span>
                    </label>
                    <select 
                      value={tributeType}
                      onChange={(e) => setTributeType(e.target.value as any)}
                      className="w-full border-2 border-border bg-background p-4 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium"
                      required
                    >
                      <option value="">[Select...]</option>
                      <option value="memory">In memory of</option>
                      <option value="honor">In honor of</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-muted-foreground">Honoree First Name <span className="text-destructive">*</span></label>
                      <input type="text" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-muted-foreground">Honoree Last Name <span className="text-destructive">*</span></label>
                      <input type="text" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corporate Giving */}
            <div className="bg-card border border-border shadow-sm p-8 rounded-xl space-y-6">
              <h2 className="font-display text-2xl m-0 text-foreground">Corporate Giving</h2>
              <div className="flex bg-secondary/50 p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => setGivingType("individual")}
                  className={`flex-1 py-3 text-sm font-bold transition-all rounded ${
                    givingType === "individual" 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Individual Gift
                </button>
                <button
                  type="button"
                  onClick={() => setGivingType("corporate")}
                  className={`flex-1 py-3 text-sm font-bold transition-all rounded ${
                    givingType === "corporate" 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Gift on behalf of my company
                </button>
              </div>

              {givingType === "corporate" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 pt-2 space-y-2">
                  <label className="block text-sm font-semibold text-muted-foreground">See if your company will match your donation!</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search for company..."
                      className="w-full border-2 border-border bg-background p-4 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">No matches found.</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border shadow-sm p-8 rounded-xl space-y-6">
              <h2 className="font-display text-2xl m-0 text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Secure Payment
              </h2>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-4 border-2 rounded-lg font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "card" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 py-4 border-2 rounded-lg font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "paypal" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mobile_money")}
                  className={`flex-1 py-4 border-2 rounded-lg font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "mobile_money" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-6 h-6"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  Mobile Money
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-muted-foreground">Card Number <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" placeholder="0000 0000 0000 0000" required className="w-full border-2 border-border bg-background p-3 pl-10 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-muted-foreground">Expiration Date <span className="text-destructive">*</span></label>
                      <input type="text" placeholder="MM/YY" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-muted-foreground">CVC <span className="text-destructive">*</span></label>
                      <input type="text" placeholder="123" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "mobile_money" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-muted-foreground">Phone Number (MoMo/Airtel) <span className="text-destructive">*</span></label>
                    <input type="tel" placeholder="+250 700 000 000" required className="w-full border-2 border-border bg-background p-3 rounded-md outline-none focus:border-primary transition-colors text-foreground font-medium" />
                  </div>
                  <p className="text-sm text-muted-foreground">You will receive a prompt on your phone to confirm the payment.</p>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 pt-4 text-center p-6 border-2 border-dashed border-border rounded-lg bg-secondary/20">
                  <p className="text-foreground font-medium mb-2">You will be redirected to PayPal to complete your secure donation.</p>
                </div>
              )}

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary py-5 text-xl font-display text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-md disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {paymentMethod === "paypal" ? (
                <span>Proceed to PayPal (${amount.toFixed(2)})</span>
              ) : (
                <>
                  <Heart className={`h-6 w-6 fill-current ${isSubmitting ? 'animate-pulse' : ''}`} />
                  {isSubmitting ? 'Processing Payment...' : `Complete $${amount.toFixed(2)} Donation`}
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Payments are securely processed. Your card details are never stored on our servers.
            </p>

          </form>
        </div>
      </section>
    </article>
  );
}
