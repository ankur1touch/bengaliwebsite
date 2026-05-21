import { MDXRemote } from 'next-mdx-remote/rsc';

export default function ArticleBody({ content }: { content: string }) {
  return (
    <article className="prose prose-green max-w-none text-gray-800 leading-relaxed">
      <MDXRemote source={content} />
    </article>
  );
}
