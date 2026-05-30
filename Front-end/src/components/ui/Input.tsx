import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  error?: string;
}

export function Input({ icon: Icon, label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block text-sm text-gray-200">
      {label ? <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-gray-500">{label}</span> : null}
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> : null}
        <input
          {...props}
          className={`w-full rounded-2xl border border-[#252d3d] bg-[#0d1117] py-3 pl-${Icon ? '10' : '4'} pr-4 text-sm text-gray-200 outline-none transition focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 ${className}`}
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </label>
  );
}
