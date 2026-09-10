import FeaturedCourses from "@/components/FeaturedCourses";
import Whyus from "@/components/Whyus";
import Container from "../components/Container";
import React from "react";
import InternshipSection from "@/components/InternshipSection";
import LearningProcess from "@/components/LearningProcess";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { BookOpen, CheckCircle2, Star } from "lucide-react";

const page = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <section className="relative min-h-screen pt-24 pb-8 md:pt-32 md:pb-14">
        <div className="pointer-events-none absolute inset-0 -z-10 h-full">
      {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="CAN_YOU_CONVERT_THESE_IMAGE_TO.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000C33_0%,rgba(0,12,51,0.9)_25%,rgba(0,12,51,0.6)_50%,rgba(0,12,51,0.25)_75%,rgba(0,12,51,0)_100%)]" />
        </div>
        <Container className="relative z-10">
          <div className="grid gap-10 xl:grid-cols-[1.5fr_0.5fr] xl:items-center">
            <div className="max-w-2xl bg-[#ffffff]/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-slate-950/30">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 shadow-lg shadow-slate-950/20">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5FBB46]" />
                5,000+ students already learning
              </span>

              <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Master the <span className="text-[#5FBB46]">Skills</span> of Tomorrow, Today.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                Your gateway to elite learning and real-world internships. Learn from industry experts, build in-demand skills, and launch a future you're proud of.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#courses"
                  className="inline-flex items-center justify-center rounded-full bg-[#5FBB46] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5FBB46]/30 transition hover:bg-[#4aaa3e]"
                >
                  Explore Courses
                </a>
                <a
                  href="#internship"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Apply for Internship
                </a>
              </div>
            </div>

            <div className="grid gap-5">
              <div
                className="rounded-[2rem] border border-white/10 bg-[#ffffff]/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl opacity-0 animate-slide-in-up"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">98% Success Rate</h3>
                    <p className="text-xs text-slate-400">In internship placements</p>
                  </div>
                </div>
              </div>
              <div
                className="rounded-[2rem] border border-white/10 bg-[#ffffff]/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl opacity-0 animate-slide-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Expert Mentors</h3>
                    <p className="text-xs text-slate-400">From top tech giants</p>
                  </div>
                </div>
              </div>
              <div
                className="rounded-[2rem] border border-white/10 bg-[#ffffff]/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl opacity-0 animate-slide-in-up"
                style={{ animationDelay: "0.45s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F0BE43]/10 text-[#F0BE43] text-xl font-semibold">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">30+ Courses</h3>
                    <p className="text-xs text-slate-400">Updated for the future</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*<div className="mt-12 rounded-4xl border border-white/10 bg-white shadow-2xl shadow-slate-950/20  max-w-xl align-center backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <img src="Avatar.png" alt="students" width={150} height={150} />
              </div>
            </div>
          </div>*/}
        </Container>
      </section>
      <Whyus />
      <FeaturedCourses />
      <InternshipSection />
      <LearningProcess />
      <Testimonials />
      <FAQ />
    </main>

    
  );
};

export default page;
