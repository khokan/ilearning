import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBySlug, courses } from "@/lib/course-data";

interface CourseDetailProps {
  params: { slug: string };
}

export default function CourseDetailPage({ params }: CourseDetailProps) {
  const course = getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = courses.filter((item) => course.relatedSlugs.includes(item.slug));

  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/80 bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] overflow-hidden border border-border bg-card shadow-sm">
                <div className="relative h-[420px] w-full bg-slate-950/5">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 p-4 md:grid-cols-3">
                  {course.gallery.map((image, index) => (
                    <div key={index} className="relative h-24 overflow-hidden rounded-3xl bg-slate-950/5">
                      <Image src={image} alt={`${course.title} preview ${index + 1}`} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{course.category}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                <h1 className="text-4xl font-bold">{course.title}</h1>
                <p className="text-lg leading-8 text-muted-foreground">{course.overview}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-3xl border shadow-sm">
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{course.description}</p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {course.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border shadow-sm">
                  <CardHeader>
                    <CardTitle>Key specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    {course.specifications.map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between gap-3 rounded-3xl border border-border/70 bg-muted/40 p-4">
                        <span>{spec.label}</span>
                        <strong className="text-foreground">{spec.value}</strong>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Student reviews</h2>
                    <p className="text-sm text-muted-foreground">See what learners say about this course.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-2 text-sm text-foreground">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {course.rating} / 5
                  </div>
                </div>
                <div className="space-y-4">
                  {course.reviewsList.map((review) => (
                    <Card key={review.id} className="rounded-3xl border shadow-sm">
                      <CardContent className="space-y-3 px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <Card className="rounded-3xl border shadow-sm">
                <CardContent className="space-y-5 px-6 py-7">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-primary">Course details</p>
                    <h2 className="mt-3 text-2xl font-semibold">Enroll now</h2>
                  </div>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between gap-3">
                      <span>Instructor</span>
                      <strong className="text-foreground">{course.instructor}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Updated</span>
                      <strong className="text-foreground">{course.updatedAt}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Location</span>
                      <strong className="text-foreground">{course.location}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Price</span>
                      <strong className="text-foreground">${course.price}</strong>
                    </div>
                  </div>
                  <Button className="w-full">Start this course</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle>Related courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedCourses.map((item) => (
                    <div key={item.id} className="space-y-2 rounded-3xl border border-border/70 bg-muted/40 p-4">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.category} · {item.level}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/courses/${item.slug}`}>View details</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
