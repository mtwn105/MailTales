"use client";

import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { User } from "@/models/User";
// import { User } from "@/models/User";
export const Navbar = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userDetails = Cookies.get("mailtales_user_details");

    if (userDetails) {
      const user = JSON.parse(userDetails);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("mailtales_user_token");
    Cookies.remove("mailtales_user_email");
    Cookies.remove("mailtales_user_details");
    router.push("/sign-up");
    setUser(null);
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            <p className="font-bold text-inherit">MailTales</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          {user ? (
            <div className="flex justify-center items-center">
              {user?.picture ? (
                <Avatar
                  showFallback
                  className="mr-2"
                  color="primary"
                  name={user?.name}
                  src={user?.picture}
                />
              ) : (
                <Avatar className="mr-2" color="primary" name={user?.name} />
              )}
              <Button color="danger" variant="ghost" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          ) : null}
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent> */}

      {/* <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
    </NextUINavbar>
  );
};
