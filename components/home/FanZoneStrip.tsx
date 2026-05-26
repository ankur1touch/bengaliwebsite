'use client';

import { useTranslations } from 'next-intl';
import fanPosts from '@/data/fan-posts.json';

interface FanPost {
  id: string;
  username: string;
  flag: string;
  hashtag: string;
  text: string;
  likes: number;
  timeAgo: string;
}

export default function FanZoneStrip() {
  const t = useTranslations('fanzone');
  const posts = fanPosts as FanPost[];

  return (
    <section className="bg-brand-navy rounded-2xl p-5 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-semibold mb-1">{t('live')}</p>
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider">{t('title')}</h2>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">{t('subtitle')}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {posts.map((post) => (
          <div
            key={post.id}
            className="shrink-0 w-72 sm:w-80 snap-start rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{post.flag}</span>
              <div>
                <p className="text-sm font-semibold text-white">@{post.username}</p>
                <p className="text-[10px] text-yellow-400">#{post.hashtag}</p>
              </div>
              <span className="ml-auto text-[10px] text-gray-500">{post.timeAgo}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{post.text}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>❤ {post.likes.toLocaleString()}</span>
              <span className="cursor-default">{t('reply')}</span>
              <span className="cursor-default">{t('share')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
