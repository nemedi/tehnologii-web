import { useCallback, useEffect, useMemo, useState } from 'react';
import { create, link, list, listLinks, remove, unlink, update } from './api.js';
import config from './config.js';

const byKey = key => config.resources.find(r => r.key === key);

// ISO -> valoare pentru <input type="datetime-local"> (ora locala).
function toLocalInput(iso) {
	if (!iso) return '';
	const date = new Date(iso);
	const pad = n => String(n).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
		+ `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const inputType = type => type === 'datetime' ? 'datetime-local' : type;

function toPayload(resource, values) {
	const body = {};
	resource.fields.forEach(field => {
		let value = values[field.name];
		if (value === '' || value === undefined) {
			value = null;
		} else if (field.type === 'number') {
			value = Number(value);
		} else if (field.type === 'datetime') {
			value = new Date(value).toISOString();
		}
		body[field.name] = value;
	});
	return body;
}

function toValues(resource, record) {
	const values = {};
	resource.fields.forEach(field => {
		const value = record?.[field.name];
		values[field.name] = field.type === 'datetime'
			? toLocalInput(value)
			: (value ?? '');
	});
	return values;
}

export default function ResourceView({ resourceKey }) {
	const resource = byKey(resourceKey);
	const [records, setRecords] = useState([]);
	const [related, setRelated] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [editing, setEditing] = useState(null); // null | 'new' | record

	// Resursele referite (chei straine si subresurse) sunt necesare pentru listele de alegere.
	const neededKeys = useMemo(() => [...new Set([
		...resource.fields.filter(f => f.ref).map(f => f.ref),
		...(resource.subs ?? []).map(s => s.target)
	])], [resource]);

	const load = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const [main, ...others] = await Promise.all([
				list(resource.path),
				...neededKeys.map(key => list(byKey(key).path))
			]);
			setRecords(main);
			setRelated(Object.fromEntries(neededKeys.map((key, i) => [key, others[i]])));
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}, [resource, neededKeys]);

	useEffect(() => { load(); }, [load]);

	const label = (key, id) => {
		const found = related[key]?.find(r => r.id === id);
		return found ? byKey(key).display(found) : '—';
	};

	function format(field, value) {
		if (value === null || value === undefined || value === '') return '—';
		if (field.ref) return label(field.ref, value);
		if (field.type === 'datetime') return new Date(value).toLocaleString('ro-RO');
		return String(value);
	}

	const visible = records.filter(record =>
		!search || resource.fields.some(f =>
			format(f, record[f.name]).toLowerCase().includes(search.toLowerCase())));

	async function onDelete(record) {
		if (!window.confirm(`Ștergi „${resource.display(record)}”?`)) return;
		try {
			await remove(resource.path, record.id);
			await load();
		} catch (e) {
			setError(e.message);
		}
	}

	const columns = resource.fields.filter(f => !f.hidden);

	return (
		<section>
			<div className="toolbar">
				<h2>{resource.label}</h2>
				<input type="search" placeholder="Caută…" value={search}
					onChange={e => setSearch(e.target.value)} />
				<button onClick={() => setEditing('new')}>Adaugă</button>
			</div>
			{error && <p className="error" role="alert">{error}</p>}
			{loading ? <p className="muted">Se încarcă…</p> : (
				<div className="table-wrap">
					<table>
						<thead>
							<tr>
								{columns.map(f => <th key={f.name}>{f.label}</th>)}
								<th></th>
							</tr>
						</thead>
						<tbody>
							{visible.map(record => (
								<tr key={record.id}>
									{columns.map(f => (
										<td key={f.name}>{format(f, record[f.name])}</td>
									))}
									<td className="actions">
										<button className="secondary" onClick={() => setEditing(record)}>Editează</button>
										<button className="danger" onClick={() => onDelete(record)}>Șterge</button>
									</td>
								</tr>
							))}
							{visible.length === 0 && (
								<tr><td colSpan={columns.length + 1} className="muted">Nicio înregistrare.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			)}
			{editing && (
				<RecordForm resource={resource} record={editing === 'new' ? null : editing}
					related={related}
					onClose={() => setEditing(null)}
					onSaved={() => { setEditing(null); load(); }} />
			)}
		</section>
	);
}

function RecordForm({ resource, record, related, onClose, onSaved }) {
	const [values, setValues] = useState(() => toValues(resource, record));
	const [selected, setSelected] = useState({}); // sub.path -> Set de chei
	const [initial, setInitial] = useState({});
	const [error, setError] = useState('');
	const [busy, setBusy] = useState(false);
	const subs = resource.subs ?? [];

	useEffect(() => {
		if (!record) return;
		let cancelled = false;
		Promise.all(subs.map(s => listLinks(resource.path, record.id, s.path)))
			.then(results => {
				if (cancelled) return;
				const state = Object.fromEntries(subs.map((s, i) =>
					[s.path, new Set(results[i].map(item => item[s.member]))]));
				setInitial(state);
				setSelected(Object.fromEntries(Object.entries(state).map(([k, v]) => [k, new Set(v)])));
			})
			.catch(e => { if (!cancelled) setError(e.message); });
		return () => { cancelled = true; };
	}, [record]); // eslint-disable-line react-hooks/exhaustive-deps

	function toggle(sub, key) {
		setSelected(current => {
			const next = new Set(current[sub.path] ?? []);
			if (next.has(key)) next.delete(key); else next.add(key);
			return { ...current, [sub.path]: next };
		});
	}

	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		setError('');
		try {
			const body = toPayload(resource, values);
			let id = record?.id;
			if (record) {
				await update(resource.path, id, body);
			} else {
				id = await create(resource.path, body);
			}
			for (const sub of subs) {
				const before = initial[sub.path] ?? new Set();
				const after = selected[sub.path] ?? new Set();
				for (const key of after) {
					if (!before.has(key)) await link(resource.path, id, sub.path, key);
				}
				for (const key of before) {
					if (!after.has(key)) await unlink(resource.path, id, sub.path, key);
				}
			}
			onSaved();
		} catch (e) {
			setError(e.message);
			setBusy(false);
		}
	}

	const setValue = (name, value) => setValues({ ...values, [name]: value });

	return (
		<div className="overlay" onClick={onClose}>
			<form onSubmit={submit} onClick={e => e.stopPropagation()}>
				<h3>{record ? 'Editează' : 'Adaugă'} — {resource.singular}</h3>
				{resource.fields.map(field => (
					<label key={field.name}>{field.label}{field.required && ' *'}
						{field.ref || field.options ? (
							<select value={values[field.name]} required={field.required}
								onChange={e => setValue(field.name, e.target.value)}>
								<option value="">— alege —</option>
								{field.ref
									? (related[field.ref] ?? []).map(r => (
										<option key={r.id} value={r.id}>{byKey(field.ref).display(r)}</option>))
									: field.options.map(o => <option key={o} value={o}>{o}</option>)}
							</select>
						) : (
							<input type={inputType(field.type)} value={values[field.name]}
								required={field.required} step={field.step} min={field.min}
								minLength={field.length} maxLength={field.length}
								onChange={e => setValue(field.name, e.target.value)} />
						)}
					</label>
				))}
				{subs.map(sub => (
					<fieldset key={sub.path}>
						<legend>{sub.label}</legend>
						{(related[sub.target] ?? []).length === 0 && <span className="muted">Nimic de ales.</span>}
						{(related[sub.target] ?? []).map(r => (
							<label key={r.id} className="check">
								<input type="checkbox" checked={selected[sub.path]?.has(r.id) ?? false}
									onChange={() => toggle(sub, r.id)} />
								{byKey(sub.target).display(r)}
							</label>
						))}
					</fieldset>
				))}
				{error && <p className="error" role="alert">{error}</p>}
				<div className="buttons">
					<button type="button" className="secondary" onClick={onClose}>Anulează</button>
					<button type="submit" disabled={busy}>{busy ? 'Se salvează…' : 'Salvează'}</button>
				</div>
			</form>
		</div>
	);
}
