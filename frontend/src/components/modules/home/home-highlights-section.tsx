import { BarChart3, CreditCard, Cpu, ShieldCheck } from "lucide-react";

const steps = [
	{
		title: "Select a subscription plan",
		description:
			"Choose the student plan that matches your pace and unlock premium AI quiz generation.",
		icon: <CreditCard className="h-5 w-5" />,
	},
	{
		title: "Pay securely with Stripe",
		description:
			"Complete payment through Stripe and immediately gain access to plan-based premium features.",
		icon: <ShieldCheck className="h-5 w-5" />,
	},
	{
		title: "Start generating quizzes",
		description:
			"Use AI-powered quiz generation on demand to practice, revise, and measure your progress.",
		icon: <Cpu className="h-5 w-5" />,
	},
];

const stats = [
	{ label: "AI quiz sessions", value: "98k+", icon: <BarChart3 className="h-5 w-5" /> },
	{ label: "Subscription plans", value: "3 tiers", icon: <ShieldCheck className="h-5 w-5" /> },
	{ label: "Average rating", value: "4.9/5", icon: <Cpu className="h-5 w-5" /> },
];

export default function HomeHighlightsSection() {
	return (
		<section className="bg-muted/10 py-24">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<p className="text-sm uppercase tracking-[0.28em] text-primary">
						Subscription workflow
					</p>
					<h2 className="mt-4 text-3xl font-bold sm:text-4xl">
						How iLearning unlocks premium quiz access
					</h2>
					<p className="mt-4 text-muted-foreground">
						Subscribe once, pay securely with Stripe, and use the AI quiz generator
						for plan-based study sessions.
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
					<div className="space-y-6 rounded-[2rem] border border-border bg-card p-10 shadow-sm">
						<div className="space-y-4">
							<p className="text-sm uppercase tracking-[0.28em] text-primary">
								Premium access
							</p>
							<h3 className="text-2xl font-semibold">
								Everything you need for better study flow
							</h3>
							<p className="text-muted-foreground">
								iLearning is built around a single powerful idea: paid subscriptions
								unlock priority access to AI-generated quizzes, progress tracking,
								and premium learning pathways.
							</p>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							{stats.map((item) => (
								<div
									key={item.label}
									className="rounded-3xl border border-border/70 bg-muted/30 p-6"
								>
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										{item.icon}
									</div>
									<p className="mt-4 text-xl font-semibold">{item.value}</p>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{item.label}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-5 rounded-[2rem] bg-slate-50/80 dark:bg-slate-950/70 p-8 shadow-lg shadow-primary/10 dark:shadow-slate-950/40">
						{steps.map((step, index) => (
							<div
								key={step.title}
								className="rounded-[1.75rem] border border-border/70 bg-white/95 dark:bg-slate-950/90 p-6 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										{step.icon}
									</div>
									<div>
										<p className="text-sm uppercase tracking-[0.28em] text-primary">
											Step {index + 1}
										</p>
										<h4 className="mt-2 text-lg font-semibold">
											{step.title}
										</h4>
									</div>
								</div>
								<p className="mt-4 text-sm leading-6 text-muted-foreground">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
