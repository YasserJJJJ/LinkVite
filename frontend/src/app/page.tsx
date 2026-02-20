import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
    <nav className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-tight">
          LinkVite
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">Pricing</Button>
            </HoverCardTrigger>
            <HoverCardTrigger asChild>
              <Button variant="link">About</Button>
            </HoverCardTrigger>
            <HoverCardTrigger asChild>
              <Button variant="link">Feature</Button>
            </HoverCardTrigger>
          </HoverCard>
        </div>

        <div className="flex items-center gap-6">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href="/signin">
              <Button variant="link"><p className="text-sm font-medium text-gray-700 hover:text-gray-900">Login</p></Button>
              </Link>
            </HoverCardTrigger>
          </HoverCard>

          <Link href="/signup">
            <Button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition">
              Try it for free
            </Button>
          </Link>

        </div>

      </div>
    </nav>
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-6">
      <Image 
        src={"/assets/LinkVite.png"} 
        alt={"image"}
        width="760"
        height="760"
        />
        <h2 className="text-2xl text-gray-500 text-center">
          Your Ultimate Event Management Solution
        </h2>
    </div>
    </div>


    
  );
}
