import Layout from "../components/Layout";
import Image from "next/image";
import data from "../utils/data";

export default function Home() {
  return (
    <>
      <Layout title='Services' bgImage={"/images/services-bg-min.png"}>
        <div className='container px-0 mx-0'>
          <p className='text-[#f44336] italic text-center py-2'>
            Home → Our Services
          </p>
          <p className='text-3xl text-center font-semibold py-2'>
            Our Services We Offer
          </p>
          <p className='text-center py-2' style={{ fontWeight: 250 }}>
            Providing you with the best security
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-12 px-5'>
            {data?.services &&
              data.services.map((service) => (
                <div
                  className='flex flex-col items-center py-10 px-5 service-item'
                  key={service.id}
                  style={{ "--hover-image": `url(${service.hoverImage})` }}
                >
                  <Image
                    src={service.image}
                    alt='CCTV'
                    className=''
                    width={100}
                    height={100}
                  />
                  <div className='pt-4 text-center'>
                    <h1 className='text-2xl font-bold'>{service.name}</h1>
                    <p className='mt-3 px-5'>{service.information}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
