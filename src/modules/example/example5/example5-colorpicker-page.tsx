'use client';

import {useState} from 'react';
import {Ex5Colorpicker, Ex5Field} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

const BRAND_PRESETS = ['#1a1a18', '#ff4d00', '#0f766e', '#b42318', '#6b6964', '#f7f7f5'];

export default function Example5ColorpickerPage() {
  const [primaryColor, setPrimaryColor] = useState('#1a1a18');
  const [themeColor, setThemeColor] = useState<string | null>('#ff4d00');

  return (
    <Example5ShowcaseShell
      title="Colorpicker"
      description="hex input, SV plane, hue slider, presets, state"
    >
      <Example5ShowcaseSection title="Basic" description="swatch, hex input, palette">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Default">
            <Ex5Field label="Brand color" htmlFor="ex5-color-default" hint="Open the palette">
              <Ex5Colorpicker
                id="ex5-color-default"
                value={primaryColor}
                onChange={(color) => color && setPrimaryColor(color)}
                clearable
              />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Custom presets">
            <Ex5Field label="Theme color" htmlFor="ex5-color-presets">
              <Ex5Colorpicker
                id="ex5-color-presets"
                value={themeColor}
                onChange={setThemeColor}
                presets={BRAND_PRESETS}
                clearable
              />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Size" description="sm / md / lg">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Small">
            <Ex5Colorpicker uiSize="sm" defaultValue="#ff4d00" />
          </Example5StateCard>
          <Example5StateCard label="Medium">
            <Ex5Colorpicker uiSize="md" defaultValue="#0f766e" />
          </Example5StateCard>
          <Example5StateCard label="Large">
            <Ex5Colorpicker uiSize="lg" defaultValue="#b42318" />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Input mode" description="manual / palette only / no presets">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Manual hex">
            <Ex5Field label="HEX" hint="#1a1a18 format">
              <Ex5Colorpicker defaultValue="#1a1a18" allowManualInput clearable />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Palette only">
            <Ex5Colorpicker
              allowManualInput={false}
              defaultValue="#ff4d00"
              placeholder="Pick from palette"
            />
          </Example5StateCard>
          <Example5StateCard label="No presets">
            <Ex5Colorpicker showPresets={false} defaultValue="#1a1a18" />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State" description="disabled / readOnly / invalid">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Disabled">
            <Ex5Field label="Locked color" disabled>
              <Ex5Colorpicker disabled defaultValue="#6b6964" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Read only">
            <Ex5Field label="Confirmed color" hint="View only">
              <Ex5Colorpicker readOnly value="#1a1a18" />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Invalid">
            <Ex5Field label="Color code" error="HEX value is invalid">
              <Ex5Colorpicker invalid defaultValue="#1a1a18" />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
