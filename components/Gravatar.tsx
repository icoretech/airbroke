// components/Gravatar.tsx

import clsx from 'clsx';
import crypto from 'crypto';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

interface GravatarProps {
  email?: string | null | undefined;
  rating?: 'g' | 'pg' | 'r' | 'x';
  size?: 8 | 16 | 24 | 32 | 48 | 64 | 96 | 128 | 256;
  className?: string;
}

export function Gravatar({ email, size = 256, rating = 'x', className }: GravatarProps): React.ReactElement {
  if (!email) {
    return <FaUser size={size} className={clsx(className, 'rounded-full')} />;
  }

  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  const ratingParam = rating ? `?rating=${rating}` : '';
  const sizeParam = `&size=${size}`;
  const defaultImgStyle = '&d=retro';

  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}${ratingParam}${sizeParam}${defaultImgStyle}`;

  return (
    <Image
      src={gravatarUrl}
      alt={`Avatar for ${email}`}
      width={size}
      height={size}
      className={clsx(className, 'rounded-full')}
    />
  );
}
