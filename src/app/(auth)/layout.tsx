import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="block max-h-12 overflow-hidden hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
          >
            <Image
              src="/logo.jpg"
              alt="Zhi Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/lms-zhi-logo.png"
          width={800}
          height={800}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
