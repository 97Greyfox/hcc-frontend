"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/ui/app-sidebar";
import useAuthStore from "@/store/store";

export default function Home() {
  const isUserLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

useEffect(() => {
  if (!hasHydrated) return;

  if (!isUserLoggedIn) {
    router.push("/login");
  }
}, [isUserLoggedIn, hasHydrated]);
  return (
    <div className="flex flex-row w-full">
      <section className="w-1/6">
        <SidebarProvider>
          <AppSideBar />
        </SidebarProvider>
      </section>
      <section className="w-5/6 h-dvh pr-10 pl-10 pt-5 pb-5 home-sec">
        <div className="w-full h-full p-5 flex flex-col justify-center align-middle main-inner-home">
          <h1 className="text-center text-2xl font-bold main-heading">
            Dashboard Coming Soon!
          </h1>
        </div>
      </section>
    </div>
  );
}
