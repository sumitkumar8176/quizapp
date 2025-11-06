
"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase/provider";
import Loading from "@/app/loading";

type AuthGuardProps = {
  children: ReactNode;
};

// This component is not currently used in the on-demand login flow,
// but is kept for potential future use cases where a page needs to be strictly protected.
export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth is loading, don't do anything yet.
    if (isUserLoading) return;
    
    // If user is not logged in, redirect them to the login page.
    if (!user) {
       router.push(`/login?redirect=${pathname}`);
    }
  }, [user, isUserLoading, router, pathname]);
  
  // While checking for user or if user is null (and redirect is in progress), show loading.
  if (isUserLoading || !user) {
    return <Loading />;
  }
  
  // If user is authenticated, render the children.
  return <>{children}</>;
}

    