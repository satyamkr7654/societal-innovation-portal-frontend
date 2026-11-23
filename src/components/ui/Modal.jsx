import React, { useLayoutEffect, useRef } from 'react';

/** Native dialog: the browser keeps focus inside and returns it afterwards. */
export default function Modal({ label, onClose, className = '', children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`p-0 bg-transparent backdrop:bg-slate-950/70 ${className}`}
    >
      {children}
    </dialog>
  );
}
