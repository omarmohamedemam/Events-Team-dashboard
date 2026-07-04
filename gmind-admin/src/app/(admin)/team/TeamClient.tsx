"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  fullName: string;
  gmindId?: string | null;
  phone?: string | null;
  email?: string | null;
  status: string;
  teamType: string;
  mainRole: string;
  arSupport: boolean;
  vrSupport: boolean;
  languages: string[];
  _count?: { attendances: number; warningNotes: number };
};

export default function TeamClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/team?search=${encodeURIComponent(search)}`);
    setMembers(res.ok ? await res.json() : []);
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.ok ? res.json() : [])
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function create(form: FormData) {
    const body = Object.fromEntries(form);
    body.arSupport = form.get("arSupport") === "on" ? "true" : "";
    body.vrSupport = form.get("vrSupport") === "on" ? "true" : "";
    body.languages = String(form.get("languages") || "").split(",").map((x) => x.trim()).filter(Boolean).join(",");
    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, languages: String(body.languages).split(",").filter(Boolean) }) });
    if (!res.ok) return false;
    await load();
    return true;
  }

  return (
    <div className="grid-cols-2-1">
      <section className="card">
        <div className="filters-bar">
          <input type="search" placeholder="Search name, ID, phone, email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>GMind ID</th><th>Phone</th><th>Status</th><th>Role</th><th>AR/VR</th><th>Events</th><th>Warnings</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8}>Loading...</td></tr> : members.length ? members.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.fullName}</strong><br /><span className="text-muted text-xs">{m.email || "-"}</span></td>
                  <td>{m.gmindId || "-"}</td>
                  <td>{m.phone || "-"}</td>
                  <td><span className="badge badge-green">{m.status}</span></td>
                  <td>{m.mainRole}</td>
                  <td>{m.arSupport ? "AR " : ""}{m.vrSupport ? "VR" : ""}</td>
                  <td>{m._count?.attendances || 0}</td>
                  <td>{m._count?.warningNotes || 0}</td>
                </tr>
              )) : <tr><td colSpan={8}>No team members found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Add member</h2><p>Existing GMind IDs are preserved.</p></div></div>
        <form className="card-body form-grid form-grid-1" onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget; if (await create(new FormData(form))) form.reset(); }}>
          <div className="field"><label>Full name</label><input name="fullName" required /></div>
          <div className="field"><label>GMind ID</label><input name="gmindId" /></div>
          <div className="field"><label>Phone</label><input name="phone" /></div>
          <div className="field"><label>Email</label><input type="email" name="email" /></div>
          <div className="field"><label>Team type</label><select name="teamType"><option value="internal">Internal</option><option value="newcomer">Newcomer</option><option value="external">External</option><option value="coordinator">Coordinator</option></select></div>
          <div className="field"><label>Main role</label><select name="mainRole"><option value="facilitator">Facilitator</option><option value="animator">Animator</option><option value="coordinator">Coordinator</option><option value="trainee">Trainee</option></select></div>
          <label className="checkbox-field"><input type="checkbox" name="arSupport" /> AR support</label>
          <label className="checkbox-field"><input type="checkbox" name="vrSupport" /> VR support</label>
          <div className="field"><label>Languages</label><input name="languages" placeholder="AR, EN" /></div>
          <button className="btn btn-green">Save member</button>
        </form>
      </section>
    </div>
  );
}
