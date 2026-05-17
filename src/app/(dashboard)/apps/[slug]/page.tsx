import { MicroAppRunner } from '@/components/microapps/MicroAppRunner';

export default async function MicroAppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MicroAppRunner appSlug={slug} />;
}
