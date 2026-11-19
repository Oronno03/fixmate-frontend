"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import React from "react";

const HeaderAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return;

  return (
    <div className="flex gap-2">
      {session ? (
        <>
          <h1>Welcome {session.user.name}</h1>
          <button>Sign Out</button>
        </>
      ) : (
        <>
          <button className="text-muted-foreground hover:text-foreground">
            <Link href={"/sign-in"}>Sign In</Link>
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Link href={"/sign-up"}>Sign Up</Link>
          </button>
        </>
      )}
    </div>
  );
};

export default HeaderAuth;
