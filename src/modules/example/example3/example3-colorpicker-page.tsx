'use client';

import {useState} from 'react';
import {UiColorpicker, UiField} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

const BRAND_PRESETS = ['#ff4d00', '#1a1a18', '#2563eb', '#16a34a', '#e5484d', '#9333ea'];

export default function Example3ColorpickerPage() {
  const [primaryColor, setPrimaryColor] = useState('#ff4d00');
  const [themeColor, setThemeColor] = useState<string | null>('#2563eb');

  return (
    <Example3ShowcaseShell
      title="Colorpicker"
      description="hex input · SV plane · hue slider · presets · state"
    >
      <Example3ShowcaseSection title="Basic" description="스와치 · hex 입력 · 팔레트">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Default">
            <UiField label="브랜드 컬러" htmlFor="ex3-color-default" hint="클릭해 팔레트 열기">
              <UiColorpicker
                id="ex3-color-default"
                value={primaryColor}
                onChange={(color) => color && setPrimaryColor(color)}
                clearable
              />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Custom presets">
            <UiField label="테마 컬러" htmlFor="ex3-color-presets">
              <UiColorpicker
                id="ex3-color-presets"
                value={themeColor}
                onChange={setThemeColor}
                presets={BRAND_PRESETS}
                clearable
              />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Small">
            <UiColorpicker uiSize="sm" defaultValue="#16a34a" />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <UiColorpicker uiSize="md" defaultValue="#2563eb" />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <UiColorpicker uiSize="lg" defaultValue="#9333ea" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Input mode" description="manual · palette only · no presets">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Manual hex">
            <UiField label="HEX 입력" hint="#ff4d00 형식">
              <UiColorpicker defaultValue="#ff4d00" allowManualInput clearable />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Palette only">
            <UiColorpicker
              allowManualInput={false}
              defaultValue="#e5484d"
              placeholder="팔레트에서 선택"
            />
          </Example3StateCard>
          <Example3StateCard label="No presets">
            <UiColorpicker showPresets={false} defaultValue="#1a1a18" />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled · readOnly · invalid">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Disabled">
            <UiField label="고정 컬러" disabled>
              <UiColorpicker disabled defaultValue="#6b6964" />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <UiField label="확정 컬러" hint="조회만 가능">
              <UiColorpicker readOnly value="#ff4d00" />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <UiField label="컬러 코드" error="올바른 HEX 값이 아닙니다">
              <UiColorpicker invalid defaultValue="#ff4d00" />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
