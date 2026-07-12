import React from 'react';

export default function Spinner({ size = 20 }) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      style={{ width: size, height: size }}
    />
  );
}
