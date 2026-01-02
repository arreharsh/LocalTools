"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner";

type Review = {
  name: string
  role: string
  avatar: string
  rating: number
  text: string
}

const initialReviews: Review[] = [
  {
    name: "Aman Verma",
    role: "Frontend Engineer · Bangalore",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    text: "I use this almost daily. The JSON formatter is insanely fast and doesn’t lag even with large payloads. UI feels very thoughtfully designed.",
  },
  {
    name: "Sneha Kapoor",
    role: "Product Designer · Freelance",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "No ads, no distractions. Just tools that work. Honestly feels more premium than many paid products I’ve used.",
  },
  {
    name: "Dev Patel",
    role: "Full-stack Developer · Ahmedabad",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    text: "Privacy-first approach is what sold me. Everything runs locally and performance is solid.",
  },
  {
  name: "Rohit Sharma",
  role: "Backend Developer · Gurgaon",
  avatar: "https://i.pravatar.cc/150?img=1",
  rating: 5,
  text: "The API and JSON tools saved me a lot of time during debugging. Everything feels snappy and well thought out. Great attention to performance.",
},
{
  name: "Kunal Mehta",
  role: "Indie Hacker · Remote",
  avatar: "https://i.pravatar.cc/150?img=54",
  rating: 4,
  text: "I like how focused the platform is. No unnecessary tools, no noise. Just clean utilities that actually solve daily problems.",
},
{
  name: "Priyak Nair",
  role: "Software Engineer · Kochi",
  avatar: "https://i.pravatar.cc/150?img=68",
  rating: 5,
  text: "Privacy-first approach is a big win for me. I can paste sensitive data without worrying. UI is minimal and very easy to use.",
},

]




export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [text, setText] = useState("")

  async function submitReview() {
  if (!text.trim() || rating === 0) {
    toast.error("Please add rating and write a review");
    return;
  }

  const toastId = toast.loading("Submitting your review...");

  try {
    const res = await fetch("/api/email/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role,
        text,
        rating,
      }),
    });

    if (!res.ok) throw new Error();

    // add review locally
    const newReview: Review = {
      name: name || "Anonymous",
      role: role || "User",
      rating,
      text,
      avatar: `https://i.pravatar.cc/150?u=${name || "user"}`,
    };

    setReviews([newReview, ...reviews]);

    toast.success("Thanks for your review! 🙌", { id: toastId });

    // reset form
    setName("");
    setRole("");
    setText("");
    setRating(0);
  } catch {
    toast.error("Failed to submit review. Try again.", { id: toastId });
  }
}


  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Here's what people are saying
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real feedback from people who actually use the tools
          </p>
        </div>

        {/* REVIEWS GRID */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card/40 p-6"
            >
              {/* USER */}
              <div className="flex items-center gap-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium leading-tight">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>

              {/* STARS */}
              <div className="flex gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating
                        ? "fill-yellow-500 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* TEXT */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                “{r.text}”
              </p>
            </div>
          ))}
        </div>

        {/* ADD REVIEW */}
        <div className="mt-20 max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-center">
            Write a quick review
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Used tools? Share your experience honestly
          </p>

          {/* STAR INPUT */}
          <div className="flex justify-center gap-1 mt-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className={`w-7 h-7 cursor-pointer transition ${
                  i <= (hover || rating)
                    ? "fill-yellow-500 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* FORM */}
          <div className="mt-6 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            />

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role / Company (optional)"
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your review"
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm resize-none"
            />

            <button
              onClick={submitReview}
              className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
