import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Users, Zap } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "info" | "success" | "warning";
}

const features: Feature[] = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI-Powered Learning",
    description:
      "Get personalized learning paths powered by advanced AI technology tailored to your pace and style.",
    color: "primary",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Goal Tracking",
    description:
      "Set, monitor, and achieve your learning goals with real-time progress tracking and insights.",
    color: "success",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Expert Community",
    description:
      "Connect with tutors and learners worldwide. Get help when you need it, share knowledge freely.",
    color: "info",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Instant Results",
    description:
      "Experience faster learning with interactive lessons, real-time feedback, and adaptive difficulty.",
    color: "warning",
  },
];

const colorConfig = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  success: "bg-success/10 text-success dark:bg-success/20",
  info: "bg-info/10 text-info dark:bg-info/20",
  warning: "bg-warning/10 text-warning dark:bg-warning/20",
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
