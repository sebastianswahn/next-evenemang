"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { useAuthContext } from "@/components/auth-provider";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function DetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [data, setData] = useState();
  const { user, userId } = useAuthContext();
  const [fullbooked, setFullbooked] = useState();
  const [availableSeats, setAvailableSeats] = useState(0);
  const [isUserBooked, setIsUserBooked] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/events/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          let seatsAvailable = data.seats - data.attendees.length;
          setAvailableSeats(seatsAvailable);
          if (seatsAvailable === 0) {
            setFullbooked(true);
          }
          if (seatsAvailable > 0) {
            setFullbooked(false);
          }
          if (data.attendees.includes(userId)) {
            setIsUserBooked(true);
          } else {
            setIsUserBooked(false);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id, userId]);

  function handleUpdateEvent() {
    console.log("handleUpdateEvent called"); // Log when the function is called
    console.log("userId:", userId); // Log the value of userId
    console.log("id:", id); // Log the value of id

    if (!userId || !id) {
      console.log("userId or id is not defined"); // Log if userId or id is not defined
      return;
    }

    fetch(`http://localhost:3001/api/events/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (isUserBooked) {
          setMessage("You have successfully unbooked the event.");
        } else {
          setMessage("You have successfully booked the event.");
        }
        setTimeout(() => {
          router.push("/");
        }, 3000);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setMessage("An error occurred. Please try again.");
      });
  }

  return (
    <div className="flex flex-col text-center w-screen h-screen">
      <div className="flex items-start justify-start mt-4 ml-4 gap-4 pb-8 w-full">
        <UserButton />
        <ModeToggle />
      </div>

      <div className="flex justify-center h-full">
        {data ? (
          <div>
            <h1 className="pb-8 text-3xl">{data.name}</h1>
            <div className="flex justify-center">
              <img className="rounded-md" src={data.image} alt={data.name} />
            </div>
            <p className="mt-4 mx-12">
              Den {data.date} kan du {data.description} Det finns{" "}
              {availableSeats} platser kvar.
            </p>
            <div className="items-center text-center">
              {fullbooked ? (
                <Button className="mx-4 mt-6" disabled>
                  Fullbooked
                </Button>
              ) : (
                <Button
                  className="mx-4 mt-6"
                  onClick={() => handleUpdateEvent()}
                >
                  {isUserBooked ? "Unbook" : "Book here"}
                </Button>
              )}
              <p className="mt-4">{message}</p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
