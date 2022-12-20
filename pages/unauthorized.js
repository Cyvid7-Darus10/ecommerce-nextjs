import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title='Unauthorized Page' smallHeader={true}>
      <div className='flex flex-col items-center justify-center w-full h-full p-4'>
        <p className='text-6xl font-bold mb-4'>Unauthorized</p>
        <p className='text-xl'>You are not authorized to view this page.</p>
        {message && <div className='mb-4 text-red-500'>{message}</div>}
      </div>
    </Layout>
  );
}
