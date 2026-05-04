import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  initials: string;
  type: "student" | "tutor";
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Ahmed",
    role: "Student · Computer Science",
    content:
      "iLearning completely transformed how I study. The AI-powered personalization helped me understand complex concepts in half the time. Highly recommended!",
    avatar: "",
    initials: "SA",
    type: "student",
  },
  {
    name: "Marcus Johnson",
    role: "Student · Web Development",
    content:
      "The interactive lessons and real-time feedback from tutors have been game-changing. I've learned more in 3 months than I did in the past year.",
    avatar: "",
    initials: "MJ",
    type: "student",
  },
  {
    name: "Priya Sharma",
    role: "Tutor · Mathematics",
    content:
      "As a tutor, iLearning gives me the perfect platform to reach students globally. The dashboard tools make tracking progress incredibly easy.",
    avatar: "",
    initials: "PS",
    type: "tutor",
  },
  {
    name: "James Wilson",
    role: "Student · Data Science",
    content:
      "The structured learning paths and goal tracking features keep me motivated. The community support is outstanding!",
    avatar: "",
    initials: "JW",
    type: "student",
  },
];

const getBadgeColor = (type: "student" | "tutor") => {
  return type === "student"
    ? "bg-success/10 text-success border border-success/30"
    : "bg-info/10 text-info border border-info/30";
};

export default function HomeTestimonialsSection() {
  return (
    <section className="border-t bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            What Learners Say
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of satisfied students and tutors transforming their
            learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="flex flex-col rounded-xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <Quote className="h-4 w-4 text-primary/40 shrink-0" />
                </div>
                <div className="mt-3 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground flex-1 mb-3 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <span className={`inline-flex text-xs px-2 py-1 rounded-full w-fit ${getBadgeColor(testimonial.type)}`}>
                  {testimonial.type === "student" ? "Student" : "Tutor"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
