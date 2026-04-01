"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentUser, getMyEvents, type EventItem } from "@/lib/auth";

type CalendarCell = {
  day: number | null;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadCalendar() {
      const token = localStorage.getItem("linkvite_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        await getCurrentUser(token);
        const data = await getMyEvents(token);
        setEvents(data.items);
      } catch {
        localStorage.removeItem("linkvite_token");
        localStorage.removeItem("linkvite_user");
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, [router]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const calendarCells = useMemo(() => {
    const cells: CalendarCell[] = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push({ day: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ day: null });
    }

    return cells;
  }, [startWeekday, daysInMonth]);

  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function getEventsForDay(day: number) {
    return events.filter((event) => {
      const eventDate = new Date(event.start_datetime);

      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  }

  function isToday(day: number) {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  if (loading) {
    return (
      <div className="p-10 text-sm text-slate-500">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 px-6 pb-10 pt-2">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Calendar
                </h1>
                <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Track your scheduled events across the month.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <button
                onClick={goToPreviousMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                {monthLabel}
              </div>

              <button
                onClick={goToNextMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {WEEK_DAYS.map((dayName) => (
              <div
                key={dayName}
                className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarCells.map((cell, index) => {
              const dayEvents = cell.day ? getEventsForDay(cell.day) : [];

              return (
                <div
                  key={index}
                  className={`min-h-[165px] border-slate-100 p-3 transition ${
                    cell.day ? "bg-white hover:bg-slate-50/60" : "bg-slate-50/50"
                  } ${
                    index % 7 !== 6 ? "border-r" : ""
                  } ${
                    index < calendarCells.length - 7 ? "border-b" : ""
                  }`}
                >
                  {cell.day ? (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                            isToday(cell.day)
                              ? "bg-sky-500 text-white shadow-sm ring-4 ring-sky-100"
                              : "text-slate-700"
                          }`}
                        >
                          {cell.day}
                        </span>

                        {dayEvents.length > 0 ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                            {dayEvents.length}
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            title={event.title}
                            className="group rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 transition hover:border-sky-200 hover:bg-white"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-sky-500" />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-800">
                                  {event.title}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500">
                                  {new Date(event.start_datetime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {dayEvents.length > 3 ? (
                          <div className="pt-1 text-[11px] font-medium text-slate-500">
                            +{dayEvents.length - 3} more
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}