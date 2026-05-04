import { planService } from "@/services/plan.service";
import { userService } from "@/services/user.service";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import HomePricingSectionClient from "./home-pricing-section-client";


export default async function HomePricingSection() {
  const queryClient = new QueryClient();
  const { data } = await userService.getSession();
  const isAuthenticated = Boolean(data?.user);

  await queryClient.prefetchQuery({
    queryKey: ["plans"],
    queryFn: () => planService.getPlans(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePricingSectionClient isAuthenticated={isAuthenticated} />
    </HydrationBoundary>
  );
}