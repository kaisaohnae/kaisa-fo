'use client';

import {useEffect, useState} from 'react';
import {getToolByHref} from '@/data/tools';
import {TOOL_GUIDES, type ToolGuideText} from '@/data/tool-guides';
import {useLocale} from '@/i18n/locale-context';
import type {Locale} from '@/i18n/types';

/** Section labels per language (the guide body comes from data/tool-guides*). */
const LABELS: Record<Locale, {title: string; summary: string; steps: string; tips: string; faq: string; related: string; share: string; shareLink: string}> = {
  ko: {
    title: '사용 안내',
    summary: '사용 방법 · 실무 팁 · 자주 묻는 질문',
    steps: '사용 방법',
    tips: '실무에서 알아 두면 좋은 점',
    faq: '자주 묻는 질문',
    related: '관련 글',
    share: '실무에서 이 도구를 어떻게 쓰고 계신가요? 업무에 맞춘 설정값, 다른 도구와 함께 쓰는 순서, 겪었던 문제와 해결 방법처럼 나만의 노하우가 있다면 아래 댓글로 공유해 주세요. 필요한 기능 요청도 환영합니다. 남겨 주신 내용은 도구 개선과 안내 보완에 반영합니다.',
    shareLink: '댓글 남기기',
  },
  en: {
    title: 'How to use',
    summary: 'Steps · practical tips · FAQ',
    steps: 'Steps',
    tips: 'Practical tips',
    faq: 'FAQ',
    related: 'Related posts (Korean)',
    share: 'How do you use this tool at work? If you have your own know-how — settings that suit your job, the order you combine it with other tools, problems you ran into and how you solved them — please share it in the comments below. Feature requests are welcome too; we use your comments to improve the tool and this guide.',
    shareLink: 'Leave a comment',
  },
  zh: {
    title: '使用说明',
    summary: '使用方法 · 实用技巧 · 常见问题',
    steps: '使用方法',
    tips: '实际工作中的技巧',
    faq: '常见问题',
    related: '相关文章（韩语）',
    share: '您在工作中是怎样使用这个工具的？如果有适合自己业务的设置、与其他工具搭配使用的顺序、遇到过的问题和解决办法等心得，欢迎在下方评论中分享。也欢迎提出功能需求，您的留言会用于改进工具和本说明。',
    shareLink: '发表评论',
  },
  hi: {
    title: 'उपयोग गाइड',
    summary: 'तरीका · काम के टिप्स · सामान्य प्रश्न',
    steps: 'उपयोग का तरीका',
    tips: 'काम में उपयोगी टिप्स',
    faq: 'सामान्य प्रश्न',
    related: 'संबंधित लेख (कोरियाई)',
    share: 'आप काम में इस टूल का उपयोग कैसे करते हैं? अगर आपके पास अपना अनुभव है — आपके काम के लिए सही सेटिंग, दूसरे टूल के साथ इस्तेमाल का क्रम, आई समस्याएँ और उनके समाधान — तो नीचे टिप्पणी में साझा करें। फ़ीचर अनुरोध भी स्वागत है; आपकी टिप्पणियों से टूल और यह गाइड बेहतर होते हैं।',
    shareLink: 'टिप्पणी लिखें',
  },
};

const loaders: Record<Exclude<Locale, 'ko'>, () => Promise<{default: Record<string, ToolGuideText>}>> = {
  en: () => import('@/data/tool-guides/en'),
  zh: () => import('@/data/tool-guides/zh'),
  hi: () => import('@/data/tool-guides/hi'),
};

/**
 * Usage guide + practical tips + FAQ under each tool, as one collapsible accordion.
 * Korean is in the static HTML (visible to crawlers even while collapsed);
 * other languages replace the text after load, like the rest of the site's i18n.
 */
export default function ToolGuide({href}: {href: string}) {
  const locale = useLocale();
  const tool = getToolByHref(href);
  const base = tool ? TOOL_GUIDES[tool.id] : undefined;
  const [translated, setTranslated] = useState<{locale: Locale; text: ToolGuideText} | null>(null);

  useEffect(() => {
    if (!tool || locale === 'ko') return;
    let cancelled = false;
    loaders[locale]()
      .then(mod => {
        const text = mod.default[tool.id];
        if (!cancelled && text) setTranslated({locale, text});
      })
      .catch(() => undefined); // keep Korean if the chunk fails to load
    return () => { cancelled = true; };
  }, [locale, tool]);

  if (!tool || !base) return null;

  const useTranslation = locale !== 'ko' && translated?.locale === locale;
  const guide: ToolGuideText = useTranslation ? translated.text : base;
  const labels = LABELS[useTranslation ? locale : 'ko'];

  return (
    <details className="tool-guide" lang={useTranslation ? locale : 'ko'}>
      <summary className="tool-guide__summary">
        <span className="tool-guide__title">{labels.title}</span>
        <span className="tool-guide__summary-meta">{labels.summary}</span>
      </summary>

      <div className="tool-guide__body">
        <p className="tool-guide__intro">{guide.intro}</p>

        <h3 className="tool-guide__heading">{labels.steps}</h3>
        <ol className="tool-guide__steps">
          {guide.steps.map(step => <li key={step}>{step}</li>)}
        </ol>

        <h3 className="tool-guide__heading">{labels.tips}</h3>
        <ul className="tool-guide__tips">
          {guide.tips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>

        <h3 className="tool-guide__heading">{labels.faq}</h3>
        <dl className="tool-guide__faq">
          {guide.faq.map(item => (
            <div key={item.q} className="tool-guide__faq-item">
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>

        {base.related?.length ? (
          <>
            <h3 className="tool-guide__heading">{labels.related}</h3>
            <ul className="tool-guide__related">
              {base.related.map(post => (
                // Plain <a>: posts use the fo site styles, tools use their own (full page load keeps them apart).
                <li key={post.slug}><a href={`/posts/${post.slug}/`}>{post.title}</a></li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="tool-guide__share">
          {labels.share} <a href="#tool-comments">{labels.shareLink} ↓</a>
        </p>
      </div>
    </details>
  );
}
