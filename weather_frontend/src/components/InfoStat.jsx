import React from 'react';

/**
 * PUBLIC_INTERFACE
 * InfoStat
 * Small labeled metric display pill.
 */
export function InfoStat({ icon = null, label, value }) {
  return (
    <div className="infostat" role="group" aria-label={label}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className="label">{label}:</span>
      <span className="value">{value}</span>
    </div>
  );
}
