import FilesService from '@/app/service/files';
import IPPService from '@/app/service/ipp';

import HomeClient from './page.client';
import Header from '@/app/components/Header';

export const dynamic = 'force-dynamic';

// export const dynamicParams = false;

// export async function generateStaticParams() {
//   return [];
// }

export default async function Home() {
  const list = await FilesService.list();
  const printerInfo = await IPPService.getInfo();;
  return (
    <>
      <Header data={printerInfo} />
      <HomeClient data={list} />
    </>
  );
}
