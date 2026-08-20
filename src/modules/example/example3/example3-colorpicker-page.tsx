'use client';

import {useState} from 'react';
import {Ex3Colorpicker, Ex3Field} from './kit';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

const BRAND_PRESETS = ['#1a1a18', '#ff4d00', '#0f766e', '#b42318', '#6b6964', '#f7f7f5'];

export default function Example3ColorpickerPage() {
  const [primaryColor, setPrimaryColor] = useState('#1a1a18');
  const [themeColor, setThemeColor] = useState<string | null>('#ff4d00');

  return (
    <Example3ShowcaseShell
      title="Colorpicker"
      description="hex input, SV plane, hue slider, presets, state"
    >
      <Example3ShowcaseSection title="Basic" description="swatch, hex input, palette">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Default">
            <Ex3Field label="Brand color" htmlFor="ex3-color-default" hint="Open the palette">
              <Ex3Colorpicker
                id="ex3-color-default"
                value={primaryColor}
                onChange={(color) => color && setPrimaryColor(color)}
                clearable
              />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Custom presets">
            <Ex3Field label="Theme color" htmlFor="ex3-color-presets">
              <Ex3Colorpicker
                id="ex3-color-presets"
                value={themeColor}
                onChange={setThemeColor}
                presets={BRAND_PRESETS}
                clearable
              />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size" description="sm / md / lg">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Small">
            <Ex3Colorpicker uiSize="sm" defaultValue="#ff4d00" />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <Ex3Colorpicker uiSize="md" defaultValue="#0f766e" />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <Ex3Colorpicker uiSize="lg" defaultValue="#b42318" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Input mode" description="manual / palette only / no presets">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Manual hex">
            <Ex3Field label="HEX" hint="#1a1a18 format">
              <Ex3Colorpicker defaultValue="#1a1a18" allowManualInput clearable />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Palette only">
            <Ex3Colorpicker
              allowManualInput={false}
              defaultValue="#ff4d00"
              placeholder="Pick from palette"
            />
          </Example3StateCard>
          <Example3StateCard label="No presets">
            <Ex3Colorpicker showPresets={false} defaultValue="#1a1a18" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled / readOnly / invalid">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Disabled">
            <Ex3Field label="Locked color" disabled>
              <Ex3Colorpicker disabled defaultValue="#6b6964" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <Ex3Field label="Confirmed color" hint="View only">
              <Ex3Colorpicker readOnly value="#1a1a18" />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <Ex3Field label="Color code" error="HEX value is invalid">
              <Ex3Colorpicker invalid defaultValue="#1a1a18" />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
