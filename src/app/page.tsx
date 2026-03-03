import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center">
          <Image
            className="hidden dark:block"
            src="/logodk.svg"
            alt="Logo (dark)"
            width={200}
            height={200}
            priority
          />
          <Image
            className="block dark:hidden"
            src="/logolt.svg"
            alt="Logo (light)"
            width={200}
            height={200}
            priority
          />
        </div>
      </main>
    </div>
  );
}
