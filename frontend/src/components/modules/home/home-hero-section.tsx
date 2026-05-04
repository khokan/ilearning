"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const slides = [
	{
		title: "Build a smarter learning routine",
		description:
			"AI-guided learning, personalized review plans, and curated study content to help you progress faster.",
		badge: "AI-powered learning",
		image:
			"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
	},
	{
		title: "Stay motivated with meaningful goals",
		description:
			"Track progress, set milestones, and unlock premium tools designed for students who want measurable growth.",
		badge: "Goal tracking",
		image:
			"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
	},
	{
		title: "Access premium courses anywhere",
		description:
			"Expert-led lessons, practice quizzes, and student support built for modern online learning journeys.",
		badge: "Premium access",
		image:
			"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
	},
];

export default function HomeHeroSection() {
	const [activeIndex, setActiveIndex] = useState(0);
	const slide = slides[activeIndex];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % slides.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const pagination = useMemo(
		() =>
			slides.map((_, index) => (
				<button
					key={index}
					type="button"
					onClick={() => setActiveIndex(index)}
					className={`h-2.5 w-2.5 rounded-full transition-all ${
						index === activeIndex ? "bg-primary" : "bg-border"
					}`}
					aria-label={`Go to slide ${index + 1}`}
				/>
			)),
		[activeIndex]
	);

	return (
		<section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-slate-50 to-white text-slate-950 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950 dark:text-slate-50">
			<div className="container mx-auto px-4 py-20 sm:py-24">
				<div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="max-w-2xl">
						<span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
							<Sparkles className="h-4 w-4" /> {slide.badge}
						</span>
						<h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							{slide.title}
						</h1>
						<p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
							{slide.description}
						</p>
						<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
							<Button
								asChild
								size="lg"
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/dashboard/subscription">
									Choose your plan
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/dashboard/subscription">View Plans</Link>
							</Button>
						</div>
						<div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
							<div className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/70 dark:text-slate-200">
								Live support
							</div>
							<div className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/70 dark:text-slate-200">
								Premium student community
							</div>
							<div className="rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/70 dark:text-slate-200">
								Monthly skill challenges
							</div>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700/70 dark:bg-slate-950/95 dark:shadow-slate-950/40 min-h-[60vh] max-h-[70vh]">
						<Image
							src={slide.image}
							alt={slide.title}
							fill
							sizes="100vw"
							className="object-cover opacity-95"
							unoptimized
						/>
						<div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-8 text-slate-950 dark:text-white">
							<div className="space-y-3 rounded-[1.5rem] bg-white/50 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-sm dark:bg-slate-950/50 dark:shadow-slate-950/30">
								<p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
									Featured path
								</p>
								<h2 className="text-2xl font-semibold sm:text-3xl">
									From beginner to advanced skills
								</h2>
								<p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
									Join a learning path that adapts to your progress with goal-based milestones and rewards.
								</p>
								<div className="flex items-center gap-3">{pagination}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
