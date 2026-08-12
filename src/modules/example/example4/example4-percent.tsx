'use client';

import {useCallback, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {TREE_COPY} from './tree-data';

function clampPct(value: number) {
  return Math.min(100, Math.max(1, Math.round(value)));
}

function pctFromClientX(clientX: number, track: HTMLElement) {
  const rect = track.getBoundingClientRect();
  return clampPct(((clientX - rect.left) / Math.max(rect.width, 1)) * 100);
}

function useTrackDrag(onMove: (pct: number) => void) {
  const trackRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(event.pointerId);
    onMove(pctFromClientX(event.clientX, track));
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    onMove(pctFromClientX(event.clientX, event.currentTarget));
  };

  return {trackRef, onPointerDown, onPointerMove};
}

function SingleMeter({
  label,
  value,
  onChange,
  variant = 'plain',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  variant?: 'plain' | 'fill' | 'ticks';
}) {
  const {trackRef, onPointerDown, onPointerMove} = useTrackDrag(onChange);

  return (
    <div className={`ex4-meter-ctl ex4-meter-ctl--${variant}`}>
      <div className="ex4-meter-ctl__head">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        ref={trackRef}
        className="ex4-meter-ctl__track"
        role="slider"
        aria-valuemin={1}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') onChange(clampPct(value - 1));
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') onChange(clampPct(value + 1));
        }}
      >
        <span className="ex4-meter-ctl__fill" style={{width: `${value}%`}} />
        {variant === 'ticks' ? (
          <span className="ex4-meter-ctl__ticks" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : null}
        <span className="ex4-meter-ctl__thumb" style={{left: `${value}%`}} />
      </div>
    </div>
  );
}

function RangeMeter({
  label,
  min,
  max,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  onChange: (next: {min: number; max: number}) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const active = useRef<'min' | 'max' | null>(null);

  const apply = useCallback(
    (pct: number, which: 'min' | 'max') => {
      if (which === 'min') onChange({min: Math.min(pct, max - 1), max});
      else onChange({min, max: Math.max(pct, min + 1)});
    },
    [max, min, onChange],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>, which?: 'min' | 'max') => {
    const track = trackRef.current;
    if (!track) return;
    const pct = pctFromClientX(event.clientX, track);
    const next = which ?? (Math.abs(pct - min) <= Math.abs(pct - max) ? 'min' : 'max');
    active.current = next;
    track.setPointerCapture(event.pointerId);
    apply(pct, next);
  };

  return (
    <div className="ex4-meter-ctl ex4-meter-ctl--range">
      <div className="ex4-meter-ctl__head">
        <span>{label}</span>
        <strong>
          {min}% – {max}%
        </strong>
      </div>
      <div
        ref={trackRef}
        className="ex4-meter-ctl__track"
        onPointerDown={(event) => onPointerDown(event)}
        onPointerMove={(event) => {
          if (!active.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
          apply(pctFromClientX(event.clientX, event.currentTarget), active.current);
        }}
        onPointerUp={() => {
          active.current = null;
        }}
      >
        <span className="ex4-meter-ctl__fill" style={{left: `${min}%`, width: `${max - min}%`}} />
        <button
          type="button"
          className="ex4-meter-ctl__thumb"
          style={{left: `${min}%`}}
          aria-label={`${label} min`}
          onPointerDown={(event) => {
            event.stopPropagation();
            onPointerDown(event, 'min');
          }}
        />
        <button
          type="button"
          className="ex4-meter-ctl__thumb"
          style={{left: `${max}%`}}
          aria-label={`${label} max`}
          onPointerDown={(event) => {
            event.stopPropagation();
            onPointerDown(event, 'max');
          }}
        />
      </div>
    </div>
  );
}

export default function Example4PercentMeters() {
  const copy = TREE_COPY.meters;
  const [dock, setDock] = useState(72);
  const [rack, setRack] = useState(58);
  const [out, setOut] = useState(34);
  const [band, setBand] = useState({min: 20, max: 80});

  return (
    <section className="ex4-panel">
      <div className="ex4-panel__head">
        <div>
          <h2>{copy.title}</h2>
          <p>{copy.hint}</p>
        </div>
      </div>
      <div className="ex4-meter-grid">
        <SingleMeter label={copy.dock} value={dock} onChange={setDock} />
        <SingleMeter label={copy.rack} value={rack} onChange={setRack} variant="fill" />
        <SingleMeter label={copy.out} value={out} onChange={setOut} variant="ticks" />
        <RangeMeter label={copy.band} min={band.min} max={band.max} onChange={setBand} />
      </div>
    </section>
  );
}
