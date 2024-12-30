import { HomeIcon, File, UsersRound, LogOut } from "lucide-react";
import Link from "next/link";

import { NavButton } from "./NavButton";
import { ModeToggle } from "./ModeToggle";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { NavButtonMenu } from "@/components/NavButtonMenu";

export function Header() {
  return (
    <header className='animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20'>
      <nav className='flex h-8 items-center justify-between w-full'>
        <div className='flex items-center gap-2'>
          <NavButton href='/home' label='Home' icon={HomeIcon} />
          <Link
            href={"/home"}
            className='flex justify-between items-center gap-2 ml-0'
            title='Home'
          >
            <h1 className='hidden sm:block text-xl font-bold m-0 mt-1'>
              Computer Repair Shop
            </h1>
          </Link>
        </div>

        <div className='flex items-center'>
          <NavButtonMenu
            icon={File}
            label='Tickets Menu'
            choices={[
              { title: "Search Tickets", href: "/tickets" },
              { title: "New Ticket", href: "/tickets/form" },
            ]}
          />
          <NavButtonMenu
            icon={UsersRound}
            label='Customers Menu'
            choices={[
              { title: "Search Customers", href: "/customers" },
              { title: "New Customer", href: "/customers/form" },
            ]}
          />
          <div className='ml-5'>
            <ModeToggle />
            <Button
              variant={"ghost"}
              size={"icon"}
              title='Logout'
              aria-label='Logout'
              className='rounded-full'
              asChild
            >
              <LogoutLink>
                <LogOut />
              </LogoutLink>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
