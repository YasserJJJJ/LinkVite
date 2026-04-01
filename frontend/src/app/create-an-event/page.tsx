"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, getCurrentUser, type AuthUser } from "@/lib/auth";

export default function CreateEventPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [locationType, setLocationType] = useState<"online" | "physical">("physical");
  const [locationDetails, setLocationDetails] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem("linkvite_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
        setOrganizerName(`${currentUser.first_name} ${currentUser.last_name}`);
        setOrganizerEmail(currentUser.email);
      } catch {
        localStorage.removeItem("linkvite_token");
        localStorage.removeItem("linkvite_user");
        router.push("/signin");
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyUser();
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("linkvite_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true);

      await createEvent(token, {
        title: title.trim(),
        description: description.trim() || null,
        cover_image: null,
        start_datetime: new Date(startDatetime).toISOString(),
        location_type: locationType,
        location_details: locationDetails.trim() || null,
        capacity: capacity ? Number(capacity) : null,
        is_paid: isPaid,
        organizer_name: organizerName.trim(),
        organizer_email: organizerEmail.trim().toLowerCase(),
        status,
      });

      router.push("/view-all-events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <div className="p-10">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create a new event</h1>
        <p className="mt-2 text-sm text-slate-500">
          Set up your event and publish it when you’re ready.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Spring Networking Night"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Describe your event"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Start date & time</label>
            <input
              type="datetime-local"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as "online" | "physical")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="physical">Physical</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {locationType === "online" ? "Meeting link / platform" : "Location details"}
              </label>
              <input
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder={locationType === "online" ? "Zoom, Google Meet..." : "Montreal, Room 201"}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Capacity</label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is_paid"
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <label htmlFor="is_paid" className="text-sm text-slate-700">
              This is a paid event
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Organizer name</label>
              <input
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Organizer email</label>
              <input
                type="email"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !user}
            className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating event..." : "Create event"}
          </button>
        </form>
      </div>
    </div>
  );
}