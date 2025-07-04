"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ToggleThemeButton } from "./ToggleThemeBotton";
import Link from "next/link";
import AvatarButton from "./AvatarButton";

function NavButtons() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <>
          <ToggleThemeButton />
          <AvatarButton
            name={session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            signout={signOut}
          />
        </>
      ) : (
        <>
          <Button>
            <Link href={"/register"}>Utwórz konto</Link>
          </Button>
          <Button onClick={() => signIn()}> Zaloguj się </Button>
          <ToggleThemeButton />
        </>
      )}
    </div>
  );
}

export default function NavMenu() {
  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between py-3 px-8 bg-gray-50 dark:bg-zinc-900">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-lg font-semibold">
          ManageMe
        </Link>
        <Link href="/projects" className="text-base hover:underline">
          Projekty
        </Link>
        <Link href="/stories" className="text-base hover:underline">
          Historie
        </Link>
        <Link href="/tasks" className="text-base hover:underline">
          Zadania
        </Link>
      </div>
      <NavButtons />
    </nav>
  );
}
