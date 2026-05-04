import Image from "next/image";
import Link from "next/link";
import { BookOpen, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { courses } from "@/lib/course-data";

export default function HomeCoursesShowcaseSection() {
  return (
    <section className="border-t bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Featured courses</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Learn with curated pathways</h2>
          <p className="mt-3 text-muted-foreground">
            Preview our most popular and highest-rated courses, then jump straight into a detailed learning path.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.slice(0, 4).map((course) => (
            <Card key={course.id} className="h-full rounded-3xl border shadow-sm transition-all hover:shadow-md">
              <div className="relative h-44 overflow-hidden rounded-t-3xl bg-slate-950/5">
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
                  <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    <span>{course.category}</span>
                    <span>{course.level}</span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>{course.rating} ★</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
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
      </div>
    </section>
  );
}
