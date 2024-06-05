import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useAuthContext } from "./auth-provider";
import Link from "next/link";

const EventCarousel = ({ events }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, userId } = useAuthContext();

  const handleUpdateEvent = async (eventId) => {
    if (isLoaded && isSignedIn && user && userId) {
      try {
        const updatedEvent = await updateUsers("events", eventId, userId);
        console.log("Event updated successfully:", updatedEvent);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    } else {
      console.error("User is not signed in");
    }
  };

  return (
    <Carousel className="h-screen w-4/5 ">
      <CarouselContent>
        {events.map((event, index) => (
          <CarouselItem key={index}>
            <CardTitle className="py-6">
              <span className="text-3xl">{event.name}</span>
            </CardTitle>

            <CardContent className="w-full h-2/5 max-h-[50rem]">
              <img
                src={event.image}
                alt={event.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </CardContent>

            <Card className="mb-4 overflow-scroll w-full flex flex-col">
              <CardDescription className="p-2">
                <span className="text-xl">
                  Den {event.date} kan du {event.description} i {event.location}
                  det finns {event.seats} platser kvar.
                </span>
              </CardDescription>
            </Card>
            <Link href={`/${event.id}`}>
              <Button>Mer info</Button>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default EventCarousel;
