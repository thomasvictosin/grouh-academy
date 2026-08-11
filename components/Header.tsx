import Container from "./Container";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";
import Nav from "./Nav";

const Header = () => {
  return (
      <header className="flex w-full items-center gap-8 py-2 px-5 sm:gap-24 sm:py-3 sm:px-10 lg:gap-32 lg:px-20">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src={logo}
            alt="Grouh Academy logo"
            width={98}
            height={98}
          />
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-5 sm:gap-30">
          <Nav />

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-full bg-[#5FBB46] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5FBB46]/30 transition hover:bg-[#4aaa3e]"
            >
              Apply Now
              <span aria-hidden="true" className="ml-2 text-base">
                →
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-white px-5 py-2.5 text-sm font-medium text-[#0f172a] transition hover:bg-slate-100"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
  );
};

export default Header;
