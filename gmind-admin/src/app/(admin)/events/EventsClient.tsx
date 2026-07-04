"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  eventName: string;
  clientName?: string | null;
  eventType: string;
  eventDate: string;
  location?: string | null;
  status: string;
  _count?: { assignments: number; attendances: number; evaluations: number; salaryRecords: number };
};

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch(`/api/events?search=${encodeURIComponent(search)}`);
    setEvents(await res.json());
  }

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  async function create(form: FormData) {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    await load();
  }

  return (
    <div className="grid-cols-2-1">
      <section className="card">
        <div className="filters-bar">
          <input type="search" placeholder="Search event, client, location" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Date</th><th>Client</th><th>Type</th><th>Status</th><th>Team</th><th>Attendance</th><th>Scores</th><th>Salaries</th></tr></thead>
            <tbody>{events.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.eventName}</strong><br /><span className="text-muted text-xs">{e.location || "-"}</span></td>
                <td>{new Date(e.eventDate).toLocaleDateString("en-GB")}</td>
                <td>{e.clientName || "-"}</td>
                <td>{e.eventType}</td>
                <td><span className="badge badge-purple">{e.status}</span></td>
                <td>{e._count?.assignments || 0}</td>
                <td>{e._count?.attendances || 0}</td>
                <td>{e._count?.evaluations || 0}</td>
                <td>{e._count?.salaryRecords || 0}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Create event</h2><p>Then assign team from the workflow pages.</p></div></div>
        <form className="card-body form-grid form-grid-1" onSubmit={async (e) => { e.preventDefault(); await create(new FormData(e.currentTarget)); e.currentTarget.reset(); }}>
          <div className="field"><label>Event name</label><input name="eventName" required /></div>
          <div className="field"><label>Client</label><input name="clientName" /></div>
          <div className="field"><label>Date</label><input type="date" name="eventDate" required /></div>
          <div className="field"><label>Location</label><input name="location" /></div>
          <div className="field"><label>Event type</label><select name="eventType"><option value="school">School</option><option value="nursery">Nursery</option><option value="public_event">Public event</option><option value="competition">Competition</option><option value="training">Training</option><option value="online">Online</option><option value="custom">Custom</option></select></div>
          <div className="field"><label>Required team</label><input type="number" name="requiredTeamCount" min="0" /></div>
          <button className="btn btn-green">Save event</button>
        </form>
      </section>
    </div>
  );
}
