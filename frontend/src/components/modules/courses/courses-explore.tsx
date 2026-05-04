"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { courses } from "@/lib/course-data";

const sortOptions = [
	{ value: "popular", label: "Most popular" },
	{ value: "price-asc", label: "Price: low to high" },
	{ value: "price-desc", label: "Price: high to low" },
	{ value: "rating", label: "Top rated" },
	{ value: "newest", label: "Newest" },
];

export default function CoursesExplore() {
	const [searchTerm, setSearchTerm] = useState("");
	const [category, setCategory] = useState("All");
	const [level, setLevel] = useState("All");
	const [sort, setSort] = useState("popular");
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const categories = useMemo(
		() => ["All", ...Array.from(new Set(courses.map((course) => course.category)))],
		[]
	);

	const levels = useMemo(
		() => ["All", ...Array.from(new Set(courses.map((course) => course.level)))],
		[]
	);

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 600);
		return () => window.clearTimeout(timer);
	}, []);

	const filteredCourses = useMemo(() => {
		const normalizedTerm = searchTerm.toLowerCase().trim();
		const filtered = courses.filter((course) => {
			const matchesSearch =
				course.title.toLowerCase().includes(normalizedTerm) ||
				course.description.toLowerCase().includes(normalizedTerm) ||
				course.instructor.toLowerCase().includes(normalizedTerm);

			const matchesCategory = category === "All" || course.category === category;
			const matchesLevel = level === "All" || course.level === level;

			return matchesSearch && matchesCategory && matchesLevel;
		});

		const sorted = [...filtered].sort((a, b) => {
			if (sort === "price-asc") return a.price - b.price;
			if (sort === "price-desc") return b.price - a.price;
			if (sort === "rating") return b.rating - a.rating;
			if (sort === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			return b.reviews - a.reviews;
		});

		return sorted;
	}, [category, level, searchTerm, sort]);

	const itemsPerPage = 8;
	const pageCount = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
	const currentCourses = filteredCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setPage(1);
	};

	const handleCategoryChange = (value: string) => {
		setCategory(value);
		setPage(1);
	};

	const handleLevelChange = (value: string) => {
		setLevel(value);
		setPage(1);
	};

	return (
		<main className="bg-background text-foreground">
			<section className="border-b border-border/80 bg-muted/20 py-20">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-sm uppercase tracking-[0.24em] text-primary">Explore</p>
						<h1 className="mt-4 text-4xl font-bold sm:text-5xl">Find the right course for your goals</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							Browse expert-led learning paths, compare pricing, and jump into a course that fits your schedule.
						</p>
					</div>

					<div className="mt-12 grid gap-4 lg:grid-cols-[1fr_240px]">
						<div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
							<div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
								<Search className="h-5 w-5 text-muted-foreground" />
								<label className="flex-1">
									<span className="sr-only">Search courses</span>
									<Input
										value={searchTerm}
										onChange={(event) => handleSearchChange(event.target.value)}
										placeholder="Search by title, instructor, or topic"
									/>
								</label>
							</div>

							<div className="mt-6 grid gap-4">
								<div>
									<p className="mb-2 text-sm font-semibold">Category</p>
									<Select value={category} onValueChange={handleCategoryChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="All categories" />
										</SelectTrigger>
										<SelectContent>
											{categories.map((item) => (
												<SelectItem key={item} value={item}>
													{item}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<p className="mb-2 text-sm font-semibold">Level</p>
									<Select value={level} onValueChange={handleLevelChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="All levels" />
										</SelectTrigger>
										<SelectContent>
											{levels.map((item) => (
												<SelectItem key={item} value={item}>
													{item}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<p className="mb-2 text-sm font-semibold">Sort</p>
									<Select value={sort} onValueChange={(value) => setSort(value)}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Sort by" />
										</SelectTrigger>
										<SelectContent>
											{sortOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						<aside className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Quick stats</p>
								<div className="mt-4 grid gap-3 sm:grid-cols-2">
									<div className="rounded-3xl border border-border/70 bg-muted/50 p-4 text-center">
										<p className="text-2xl font-semibold">{courses.length}</p>
										<p className="text-sm text-muted-foreground">Courses available</p>
									</div>
									<div className="rounded-3xl border border-border/70 bg-muted/50 p-4 text-center">
										<p className="text-2xl font-semibold">
											{Math.round(courses.reduce((sum, item) => sum + item.rating, 0) / courses.length)}
										</p>
										<p className="text-sm text-muted-foreground">Avg rating</p>
									</div>
									<div className="rounded-3xl border border-border/70 bg-muted/50 p-4 text-center">
										<p className="text-2xl font-semibold">{categories.length - 1}</p>
										<p className="text-sm text-muted-foreground">Categories</p>
									</div>
									<div className="rounded-3xl border border-border/70 bg-muted/50 p-4 text-center">
										<p className="text-2xl font-semibold">{levels.length - 1}</p>
										<p className="text-sm text-muted-foreground">Levels</p>
									</div>
								</div>
							</div>

							<div className="rounded-3xl border border-border/70 bg-slate-950/5 p-5">
								<p className="text-sm font-semibold text-foreground">Need help choosing?</p>
								<p className="mt-2 text-sm text-muted-foreground">
									Reach out to our student success team for a custom learning recommendation.
								</p>
								<Button asChild className="mt-4 w-full" variant="outline">
									<Link href="/contact">Contact us</Link>
								</Button>
							</div>
						</aside>
					</div>

					<div className="mt-12 space-y-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Showing {filteredCourses.length} result{filteredCourses.length !== 1 ? "s" : ""}
								</p>
								<h2 className="text-2xl font-semibold">Featured learning paths</h2>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<ChevronsUpDown className="h-4 w-4" /> Sorted by{" "}
								{sortOptions.find((option) => option.value === sort)?.label}
							</div>
						</div>

						{isLoading ? (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
								{Array.from({ length: 8 }).map((_, index) => (
									<div key={index} className="space-y-4 rounded-3xl border border-border bg-card p-4">
										<Skeleton className="h-40 w-full rounded-2xl" />
										<div className="space-y-3">
											<Skeleton className="h-5 w-3/4 rounded-full" />
											<Skeleton className="h-4 w-1/2 rounded-full" />
											<Skeleton className="h-4 w-full rounded-full" />
										</div>
									</div>
								))}
							</div>
						) : currentCourses.length ? (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
								{currentCourses.map((course) => (
									<Card key={course.id} className="h-full rounded-3xl border shadow-sm transition-all hover:shadow-md">
										<div className="relative h-48 overflow-hidden rounded-t-3xl bg-slate-950/5">
											<Image
												src={course.image}
												alt={course.title}
												fill
												sizes="(max-width: 768px) 100vw, 25vw"
												className="object-cover"
												unoptimized
											/>
										</div>
										<CardContent className="flex flex-1 flex-col gap-4 px-5 py-6">
											<div className="space-y-2">
												<div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
													<span>{course.category}</span>
													<span>{course.level}</span>
												</div>
												<CardTitle className="text-lg">{course.title}</CardTitle>
												<CardDescription>{course.description}</CardDescription>
											</div>

											<div className="grid gap-2 text-sm text-muted-foreground">
												<div className="flex items-center justify-between gap-2">
													<span>Rating</span>
													<span>{course.rating} ★</span>
												</div>
												<div className="flex items-center justify-between gap-2">
													<span>Duration</span>
													<span>{course.duration}</span>
												</div>
												<div className="flex items-center justify-between gap-2">
													<span>Location</span>
													<span>{course.location}</span>
												</div>
											</div>
										</CardContent>
										<CardFooter className="flex flex-col gap-3 px-5 pb-5 pt-0">
											<div className="flex items-center justify-between gap-2">
												<span className="text-lg font-semibold">${course.price}</span>
												<span className="text-sm text-muted-foreground">{course.reviews} reviews</span>
											</div>
											<Button asChild className="w-full" variant="secondary">
												<Link href={`/courses/${course.slug}`}>View Details</Link>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						) : (
							<div className="rounded-3xl border border-border bg-card p-8 text-center">
								<h3 className="text-xl font-semibold">No courses found</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Try broadening your search or resetting the filters.
								</p>
							</div>
						)}
					</div>

					{pageCount > 1 && (
						<div className="mt-10 flex flex-wrap items-center justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="min-w-28"
								disabled={page === 1}
								onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							>
								Previous
							</Button>
							{Array.from({ length: pageCount }).map((_, index) => (
								<Button
									key={index}
									size="sm"
									variant={page === index + 1 ? "default" : "outline"}
									onClick={() => setPage(index + 1)}
								>
									{index + 1}
								</Button>
							))}
							<Button
								variant="outline"
								size="sm"
								className="min-w-28"
								disabled={page === pageCount}
								onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
							>
								Next
							</Button>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
