import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl text-green-500">Netflix Clone</h1>
      <button className="h-10 w-full bg-white" onClick={() => signOut()}>Sign out</button>
    </>

  )
}
