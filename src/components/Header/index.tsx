import { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/logo.svg';

export default function Header(): ReactElement {
  return (
    <div>
      <Link href="/">
        <a>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_flag.svg/1024px-Black_flag.svg.png"
            alt="logo"
          />
        </a>
      </Link>
    </div>
  );
}
