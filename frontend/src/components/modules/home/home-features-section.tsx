import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Users, Zap } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "secondary";
}

const features: Feature[] = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Premium quiz access",
    description:
      "Unlock AI-generated practice quizzes with every paid subscription and study smarter with plan-based resources.",
    color: "primary",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Secure Stripe payments",
    description:
      "Subscribe safely with Stripe and manage your billing with confidence.",
    color: "secondary",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Progress dashboard",
    description:
      "See your subscription status, quiz history, and plan usage in one clear dashboard designed for learners.",
    color: "primary",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Fast plan upgrades",
    description:
      "Move to the next tier quickly when you need more quizzes, deeper practice, or extended premium support.",
    color: "secondary",
  },
];

const colorConfig = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20",
};

export default function HomeFeaturesSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why Choose iLearning?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Discover the features that make iLearning the best choice for your
            learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col rounded-xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <CardHeader>
                <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${colorConfig[feature.color]}`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
