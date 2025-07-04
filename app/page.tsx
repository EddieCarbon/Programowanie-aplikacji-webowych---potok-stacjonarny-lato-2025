import { auth } from "@/auth";
import Link from "next/link";

async function Home() {
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <>
      {isAuthenticated ? (
        <div>
          <p>Cześć</p>
          <p>{session.user?.name}</p>
        </div>
      ) : (
        <div>
          <p>Zaloguj się</p>
          <Link href="/login">Przejdź do logowania</Link>
        </div>
      )}
    </>
  );
}

export default Home;
