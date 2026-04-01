"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getMyEvents, type EventItem } from "@/lib/auth";

export default function ViewAllEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
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

    loadPage();
  }, [router]);

  if (loading) {
    return <div className="p-10">Loading your events...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My events</h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage all the events you created.
            </p>
          </div>

          <button
            onClick={() => router.push("/create-an-event")}
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Create another event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-medium text-slate-900">No events yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your first created event will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {event.status}
                  </span>
                </div>

                {event.description ? (
                  <p className="mt-3 text-sm text-slate-600">{event.description}</p>
                ) : null}

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Date:</span> {new Date(event.start_datetime).toLocaleString()}</p>
                  <p><span className="font-medium text-slate-800">Type:</span> {event.location_type}</p>
                  <p><span className="font-medium text-slate-800">Location:</span> {event.location_details || "Not specified"}</p>
                  <p><span className="font-medium text-slate-800">Capacity:</span> {event.capacity ?? "Unlimited"}</p>
                  <p><span className="font-medium text-slate-800">Paid:</span> {event.is_paid ? "Yes" : "No"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}