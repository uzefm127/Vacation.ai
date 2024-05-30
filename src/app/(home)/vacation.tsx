"use client";

import axios from "axios";
import Destination from "@/components/destination";
import VacationDetails from "@/components/vacation-details";
import { Form } from "@/components/ui/form";
import React, { ReactNode, useCallback, useRef } from "react";
import { VacationSchema } from "@/types";
import { vacationSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { inriaSerif } from "@/lib/font";
import BgVector from "@/components/ui/icons/bg-vector";
import VacationResponse from "@/components/vacation-response";
import { useCompletion } from "ai/react";

const Vacation = () => {
  const contentType = useStore((state) => state.contentType);

  const vacationForm = useForm<z.infer<typeof vacationSchema>>({
    resolver: zodResolver(vacationSchema),
    mode: "onSubmit",
    defaultValues: {
      destination: "",
      reason: "",
    },
  });

  const { completion, handleSubmit, isLoading } = useCompletion({
    api: "/api/ai/ask",
    body: {
      destination: vacationForm.getValues("destination"),
      startDate: vacationForm.getValues("startDate"),
      endDate: vacationForm.getValues("endDate"),
      reason: vacationForm.getValues("reason"),
    },
  });

  const headingRef = useRef<ReactNode>(<></>);
  const vacationRef = useRef<ReactNode>(<></>);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log("form submitted");
      console.log(
        vacationForm.getValues("startDate"),
        vacationForm.getValues("endDate"),
        vacationForm.getValues("reason")
      );

      if (
        !vacationForm.getValues("startDate") ||
        !vacationForm.getValues("endDate") ||
        !vacationForm.getValues("reason")
      ) {
        return;
      }

      handleSubmit(e);
    },
    [handleSubmit, vacationForm]
  );

  if (contentType === "destination") {
    headingRef.current = (
      <h1 className={cn(inriaSerif.className, `text-6xl mb-2`)}>
        Let’s plan your vacation
      </h1>
    );
    vacationRef.current = <Destination vacationForm={vacationForm} />;
  } else if (contentType === "vacationDetail") {
    headingRef.current = (
      <h1 className={cn(inriaSerif.className, `text-5xl mt-10`)}>
        Tell us more about your vacation
      </h1>
    );
    vacationRef.current = <VacationDetails vacationForm={vacationForm} />;
  } else {
    headingRef.current = (
      <h1 className={cn(inriaSerif.className, `text-5xl mt-10`)}>
        Here’s your itinerary
      </h1>
    );
    vacationRef.current = (
      <VacationResponse response={completion} isLoading={isLoading} />
    );
  }

  return (
    <main className="h-screen relative overflow-hidden w-full flex items-center justify-center">
      <div className="absolute">
        <div className="h-full top-0 absolute w-full">
          <div
            style={{ background: "url(/light-noise.png)" }}
            className="h-1/2 w-full bg-cover absolute top-0 opacity-30 bg-center bg-no-repeat"
          ></div>
          <div
            style={{ background: "url(/noiseTexture.png)" }}
            className="h-1/2 w-full bg-cover absolute opacity-20 top-1/2 bg-center bg-no-repeat"
          ></div>
        </div>
        <BgVector className="rotate-[-27.77]" />
      </div>
      <section className="flex absolute z-[1] flex-col items-center justify-center">
        {headingRef.current && headingRef.current}
        <Form {...vacationForm}>
          <form onSubmit={onSubmit} className="my-10">
            {vacationRef.current}
          </form>
        </Form>
      </section>
    </main>
  );
};

export default Vacation;
