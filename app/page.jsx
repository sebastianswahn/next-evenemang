"use client";
import { SignInButton } from "@clerk/nextjs";

import { useState, useEffect } from "react";
import * as React from "react";
import { UserButton, useAuth } from "@clerk/nextjs";

import ModeToggle from "@/components/mode-toggle";
import { useAuthContext } from "@/components/auth-provider";
import DropdownMenuComponent from "@/components/DropDownComponent";
import EventCarousel from "@/components/EventCarousel";
import { useRouter } from "next/navigation";

// SLUT PÅ IMPORT

export default function CarouselDemo() {
  const { user, userId } = useAuthContext();
  const router = useRouter();
  const [events, setEvents] = useState([]);

  // Ser till att användaren loggar in innan den kommer åt sidan

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  // HÄMTAR EVENTS

  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="flex flex-col text-center w-screen h-screen">
      <div className="flex items-start justify-start mt-4 ml-4 gap-4 pb-8 w-full">
        <UserButton />
        <ModeToggle />
      </div>

      <div className="flex justify-center h-full">
        <EventCarousel events={events} />
      </div>
    </div>
  );
}
