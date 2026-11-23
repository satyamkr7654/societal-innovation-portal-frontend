import React, { useId } from 'react';

const style =
  'w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800';

/** Labelled input, or textarea when `rows` is given. `onChange` receives the text. */
export default function Field({ label, value, onChange, rows, ...props }) {
  const id = useId();
  const Tag = rows ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5 flex-1">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <Tag
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={style}
        {...props}
      />
    </div>
  );
}
