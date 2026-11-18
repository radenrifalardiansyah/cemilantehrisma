'use client';

import { useId, useState, type InputHTMLAttributes, type Ref } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  icon?: LucideIcon;
  /** Pesan error kolom; bila terisi, kolom ditandai aria-invalid. */
  error?: string;
  /** Ref ke elemen input (untuk fokus ke kolom pertama yang salah). */
  ref?: Ref<HTMLInputElement>;
}

export default function Field({ label, icon: Icon, error, type = 'text', className, style, ref, ...rest }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={14} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        )}
        <input
          {...rest}
          ref={ref}
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          style={error ? { ...style, borderColor: '#B91C1C' } : style}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} py-3 rounded-xl input-field text-sm ${className ?? ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Sembunyikan password' : 'Lihat password'}
            aria-pressed={show}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-xl"
            style={{ color: 'var(--text-muted)' }}
          >
            {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
      <div aria-live="polite">
        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium mt-1.5" style={{ color: '#B91C1C' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
