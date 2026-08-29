'use client';

import {useState} from 'react';
import {KaisaColorpicker, KaisaField} from './kit';
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
        <div className="kaisa-state-grid kaisa-state-grid--pickers">
          <Example3StateCard label="Default">
            <KaisaField label="Brand color" htmlFor="kaisa-color-default" hint="Open the palette">
              <KaisaColorpicker
                id="kaisa-color-default"
                value={primaryColor}
                onChange={(color) => color && setPrimaryColor(color)}
                clearable
              />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Custom presets">
            <KaisaField label="Theme color" htmlFor="kaisa-color-presets">
              <KaisaColorpicker
                id="kaisa-color-presets"
                value={themeColor}
                onChange={setThemeColor}
                presets={BRAND_PRESETS}
                clearable
              />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size" description="sm / md / lg">
        <div className="kaisa-state-grid kaisa-state-grid--pickers">
          <Example3StateCard label="Small">
            <KaisaColorpicker uiSize="sm" defaultValue="#ff4d00" />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <KaisaColorpicker uiSize="md" defaultValue="#0f766e" />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <KaisaColorpicker uiSize="lg" defaultValue="#b42318" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Input mode" description="manual / palette only / no presets">
        <div className="kaisa-state-grid kaisa-state-grid--pickers">
          <Example3StateCard label="Manual hex">
            <KaisaField label="HEX" hint="#1a1a18 format">
              <KaisaColorpicker defaultValue="#1a1a18" allowManualInput clearable />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Palette only">
            <KaisaColorpicker
              allowManualInput={false}
              defaultValue="#ff4d00"
              placeholder="Pick from palette"
            />
          </Example3StateCard>
          <Example3StateCard label="No presets">
            <KaisaColorpicker showPresets={false} defaultValue="#1a1a18" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled / readOnly / invalid">
        <div className="kaisa-state-grid kaisa-state-grid--pickers">
          <Example3StateCard label="Disabled">
            <KaisaField label="Locked color" disabled>
              <KaisaColorpicker disabled defaultValue="#6b6964" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <KaisaField label="Confirmed color" hint="View only">
              <KaisaColorpicker readOnly value="#1a1a18" />
            </KaisaField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <KaisaField label="Color code" error="HEX value is invalid">
              <KaisaColorpicker invalid defaultValue="#1a1a18" />
            </KaisaField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
