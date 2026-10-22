import assets from '../../public/licenses/assets.txt?raw';
import unifont from '../../public/licenses/unifont.txt?raw';
import notoSans from '../../public/licenses/noto-sans.txt?raw';

export const licenseDocuments = [
  {
    slug: 'assets',
    title: 'Assets & licenses',
    description: 'Credits and license notices for Nekogenix website assets.',
    text: assets,
  },
  {
    slug: 'unifont',
    title: 'GNU Unifont',
    description: 'GNU Unifont — SIL Open Font License, Version 1.1.',
    text: unifont,
  },
  {
    slug: 'noto-sans',
    title: 'Noto Sans',
    description: 'Noto Sans — SIL Open Font License, Version 1.1.',
    text: notoSans,
  },
] as const;
