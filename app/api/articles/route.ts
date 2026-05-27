import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateCmsToken } from '@/lib/cms-auth';
import { createArticleFromPayload, countMongoArticles } from '@/lib/cms-store';
import type { CmsArticlePayload } from '@/lib/cms-payload';
import { getAllArticles } from '@/lib/mdx';

export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function revalidateArticlePaths(slug: string) {
  revalidatePath('/bn/news');
  revalidatePath('/en/news');
  revalidatePath(`/bn/news/${slug}`);
  revalidatePath(`/en/news/${slug}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/rss.xml');
}

export async function POST(req: NextRequest) {
  if (!validateCmsToken(req.headers.get('authorization'))) {
    return unauthorized();
  }

  let payload: CmsArticlePayload;
  try {
    payload = (await req.json()) as CmsArticlePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const language = req.headers.get('x-language')?.trim() || payload.language?.trim() || 'bn';

  try {
    const { article, storage, id } = await createArticleFromPayload(payload, language);
    revalidateArticlePaths(article.slug);

    return NextResponse.json(
      {
        id,
        slug: article.slug,
        status: 'ok',
        success: true,
        storage,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish article';
    const status = message.includes('required') ? 400 : 500;
    return NextResponse.json({ error: message, success: false }, { status });
  }
}

export async function GET(req: NextRequest) {
  const authRequired = Boolean(process.env.CMS_API_TOKEN && process.env.CMS_API_TOKEN !== 'CHANGE_ME_TOKEN');
  if (authRequired && !validateCmsToken(req.headers.get('authorization'))) {
    return unauthorized();
  }

  const [mongoCount, mdxCount] = await Promise.all([
    countMongoArticles(),
    Promise.resolve(getAllArticles().length),
  ]);

  return NextResponse.json({
    status: 'ok',
    storage: process.env.MONGODB_URI ? 'mongodb+mdx' : 'mdx',
    counts: {
      mdx: mdxCount,
      mongo: mongoCount,
      total: mdxCount + mongoCount,
    },
  });
}
