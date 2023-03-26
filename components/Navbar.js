/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/disneylogo.png';

const Navbar = ({ account }) => {
  return (
    <div className='navbar'>
      <Link href='/'>
        <Image src={logo} alt='disney logo' width={90} height={50} />
      </Link>
      <div className='account-info'>
        <p>Welcome {account.username}</p>
        <img className='avatar' src={account.avatar.url} />
      </div>
    </div>
  );
};

export default Navbar;
