import Layout from "../components/Layout";
import Image from "next/image";
import data from "../utils/data";

export default function Home() {
  return (
    <>
      <Layout title='Home'>
        <div className='container'>
          <p className='text-2xl text-center'>
            Our Services & Products We Offer
          </p>
          <p className='text-center' style={{ fontWeight: 250 }}>
            Providing you with the best security
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-12'>
            {data?.services &&
              data.services.map((service) => (
                <div
                  className='flex flex-col items-center py-6'
                  key={service.id}
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
                    <p className='mt-3 text-gray-500 font-medium'>
                      {service.information}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <p className='text-2xl text-center text-[#f44336] italic font-semibold'>
            Our Major Clients
          </p>
          <div className='flex flex-wrap justify-center py-20'>
            {data?.clients &&
              data.clients.map((client) => (
                <div className='p-8' key={client.id}>
                  <Image
                    src={client.image}
                    alt={client.name}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
