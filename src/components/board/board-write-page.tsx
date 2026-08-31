'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import PostEditor from '@/components/editor/post-editor';
import {useT} from '@/i18n/locale-context';
import {markBoardAsRead} from '@/lib/read-board-storage';
import {createBoard} from '@/services/board-service';
import useMemberStore from '@/store/use-member-store';
import {KaisaButton, KaisaField, KaisaInput} from '@/ui-kit';

export default function BoardWritePage() {
  const router = useRouter();
  const t = useT();
  const member = useMemberStore((s) => s.member);
  const hydrated = useMemberStore((s) => s.hydrated);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hydrated && !member) {
      router.push('/login?returnUrl=/board/write/');
    }
  }, [hydrated, member, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await createBoard({
        title: title.trim(),
        content: content.trim(),
        categoryId: 1,
      });
      markBoardAsRead(res.boardNo);
      alert('게시글이 등록되었습니다.');
      router.push(`/board/detail/?boardNo=${res.boardNo}`);
    } catch (err: any) {
      setError(err.message || '게시글 등록에 실패했습니다.');
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return null;
  }

  if (!member) {
    return (
      <main className="blog-main">
        <div className="site-shell">
          <div className="site-shell__inner board-form-card" style={{textAlign: 'center', padding: '80px 0'}}>
            <p style={{fontSize: '18px', marginBottom: '24px'}}>로그인이 필요한 서비스입니다.</p>
            <Link href="/login?returnUrl=/board/write/">
              <KaisaButton variant="primary">{t('Login')}</KaisaButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-main">
      <div className="site-shell">
        <div className="site-shell__inner board-form-card">
          <section className="blog-hero" style={{marginBottom: '32px'}}>
            <p className="blog-hero__eyebrow">{t('Board')}</p>
            <h1 className="blog-hero__title" style={{fontSize: '32px'}}>
              {t('Write')}
            </h1>
          </section>

          <form onSubmit={handleSubmit} className="kaisa-kit">
            <KaisaField label={t('Title')} htmlFor="board-title" required>
              <KaisaInput
                id="board-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
                maxLength={200}
              />
            </KaisaField>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text)'}}>
                {t('Content')} <span style={{color: 'var(--kaisa-danger, #b42318)'}}>*</span>
              </label>
              <PostEditor
                value={content}
                onChange={setContent}
                placeholder="마크다운(Markdown)으로 자유롭게 작성해 보세요..."
              />
            </div>

            {error && <p className="form-error" style={{marginTop: '12px'}}>{error}</p>}

            <div className="board-form__actions">
              <Link href="/board/">
                <KaisaButton type="button" variant="ghost" disabled={submitting}>
                  {t('Cancel')}
                </KaisaButton>
              </Link>
              <KaisaButton type="submit" variant="primary" disabled={submitting}>
                {submitting ? '등록 중...' : t('Save')}
              </KaisaButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
