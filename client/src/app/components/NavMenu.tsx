"use client";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session.user.name}
        <button onClick={() => signOut()}>Sign out</button>
        <div>
          <div>JWT: {session?.accessToken}</div>
          <div>Refresh: {session?.refreshToken}</div>
          <div>User: {JSON.stringify(session?.user)}</div>
        </div>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>;
    </>
  );
}

export default function NavMenu() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
