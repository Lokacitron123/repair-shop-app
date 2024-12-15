import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  return (
    <div className='px-2 w-fulll'>
      <div className='mx-auto py-4 flex flex-col justify-center items-center gap-4'>
        <h2 className='text-2xl'>404 - Page Not Found</h2>
        <p>Could not find requested resource</p>
        <Image
          className='rounded-lg'
          src='/images/not-found.png'
          width={300}
          height={300}
          alt='Page Not Found Illustration'
          priority={true}
          title='404 - Page Not Found'
        />
      </div>
    </div>
  );
}
