'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

type BackBtnProps = {
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
};

export default function BackBtn({ className, ariaLabel, children }: BackBtnProps) {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel || 'Go back'}
    >
      {children ?? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </span>
      )}
    </button>
  );
}
