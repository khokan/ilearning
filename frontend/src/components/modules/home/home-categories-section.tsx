import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
	{
		title: "AI Quiz access",
		description:
			"Your subscription gives instant access to premium AI-generated quizzes for fast review and practice.",
		icon: <Sparkles className="h-6 w-6" />,
	},
	{
		title: "Stripe payment security",
		description:
			"Pay securely with Stripe and manage your billing information with confidence.",
		icon: <ShieldCheck className="h-6 w-6" />,
	},
	{
		title: "Flexible plans",
		description:
			"Choose the plan that suits your study rhythm and upgrade anytime for more premium features.",
		icon: <CreditCard className="h-6 w-6" />,
	},
	{
		title: "Progress dashboard",
		description:
			"Track active subscriptions, quiz history, and personalized learning progress in one place.",
		icon: <Zap className="h-6 w-6" />,
	},
];

export default function HomeCategoriesSection() {
	return (
		<section className="border-t bg-muted/30 py-20">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-12 max-w-2xl text-center">
					<p className="text-sm uppercase tracking-[0.28em] text-primary">
						Subscription benefits
					</p>
					<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
						Everything included with a paid plan
					</h2>
					<p className="mt-3 text-muted-foreground">
						Unlock premium AI quiz generation, secure Stripe checkout, and
						real-time progress tools after subscribing.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{benefits.map((benefit) => (
						<Card
							key={benefit.title}
							className="rounded-3xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50"
						>
							<CardHeader>
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
									{benefit.icon}
								</div>
								<CardTitle className="text-lg">{benefit.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									{benefit.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mt-10 text-center">
					<Button
						asChild
						size="lg"
						className="bg-primary text-primary-foreground"
					>
						<Link href="/dashboard/subscription">
							View subscription plans
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
