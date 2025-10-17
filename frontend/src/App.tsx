import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

const EntrySchema = z.object({
  id: z.number().optional(),
  employeeName: z.string().min(1),
  project: z.string().min(1),
  workDate: z.string(),
  hours: z.number().min(0).max(24),
  notes: z.string().optional().nullable()
});

type Entry = z.infer<typeof EntrySchema>;

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.slice(0, 120)}`);
  }
  return res.json();
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Entry>({ employeeName: '', project: '', workDate: new Date().toISOString().slice(0, 10), hours: 8, notes: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Entry[]>('/api/timesheets')
      .then(setEntries)
      .catch(e => setError(e.message));
  }, []);

  const isValid = useMemo(() => {
    const result = EntrySchema.safeParse(form);
    return result.success;
  }, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId == null) {
        const created = await api<Entry>('/api/timesheets', { method: 'POST', body: JSON.stringify(form) });
        setEntries(prev => [...prev, created]);
      } else {
        const updated = await api<Entry>(`/api/timesheets/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        setEntries(prev => prev.map(e => (e.id === editingId ? updated : e)));
        setEditingId(null);
      }
      setForm({ employeeName: '', project: '', workDate: new Date().toISOString().slice(0, 10), hours: 8, notes: '' });
    } catch (err: any) {
      setError(err.message ?? 'Error');
    }
  }

  async function handleEdit(entry: Entry) {
    setEditingId(entry.id ?? null);
    setForm({
      employeeName: entry.employeeName,
      project: entry.project,
      workDate: entry.workDate,
      hours: entry.hours,
      notes: entry.notes ?? ''
    });
  }

  async function handleDelete(id: number | undefined) {
    if (!id) return;
    setError(null);
    try {
      await api<void>(`/api/timesheets/${id}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(e => e.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err: any) {
      setError(err.message ?? 'Error');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Timesheet</h1>
      {error && <div style={{ color: 'white', background: '#d33', padding: '0.5rem 0.75rem', borderRadius: 6 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', alignItems: 'end', marginBottom: '1rem' }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Employee</span>
          <input value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} required />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Project</span>
          <input value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Date</span>
          <input type="date" value={form.workDate} onChange={e => setForm({ ...form, workDate: e.target.value })} required />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Hours</span>
          <input type="number" min={0} max={24} value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} required />
        </label>
        <label style={{ display: 'grid', gap: 4, gridColumn: 'span 2' }}>
          <span>Notes</span>
          <input value={form.notes ?? ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </label>
        <button type="submit" disabled={!isValid} style={{ gridColumn: 'span 6', padding: '0.5rem 0.75rem' }}>
          {editingId == null ? 'Add Entry' : 'Update Entry'}
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Employee</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Project</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Hours</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Notes</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{entry.employeeName}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{entry.project}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{entry.workDate}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{entry.hours}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{entry.notes}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                <button onClick={() => handleEdit(entry)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(entry.id)} style={{ color: '#b00' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


