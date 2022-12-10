import Layout from "../components/Layout";
import Iframe from "react-iframe";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";

export default function Home() {
  return (
    <>
      <Layout title='Services' bgImage={"/images/services-bg-min.png"}>
        <div className='container h-min-screen lg:px-0 px-4'>
          <p className='text-[#f44336] italic text-center py-2'>
            Home → Contact Us
          </p>
          <p className='text-3xl text-center font-semibold py-2'>Contact Us</p>

          <div className='my-28'>
            <Iframe
              url='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30886.816827175106!2d120.38117196676478!3d14.607499625517264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396111cd39c6349%3A0x25f85653c7efcd!2sCabsfour%20Security%20System%20Services!5e0!3m2!1sen!2sph!4v1657886217587!5m2!1sen!2sph'
              width='100%'
              height='450'
              id='myId'
              className='myClassname'
              display='initial'
              position='relative'
              allowFullScreen
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-12'>
            <div className='px-4 lg:px-0'>
              <div className='flex flex-row items-center py-4'>
                <HomeIcon className='text-3xl text-[#f44336]' />
                <div className='pt-4 text-left ml-5'>
                  <p className='text-2xl'>#067 Overland Subd</p>
                  <p>Bagac, 2107 Bataan, PH</p>
                </div>
              </div>
              <div className='flex flex-row items-center py-4'>
                <PhoneIcon className='text-3xl text-[#f44336]' />
                <div className='pt-4 text-left ml-5'>
                  <p className='text-2xl'>+63 9754918698</p>
                  <p>Monday to Friday, 8:00AM to 5:00PM</p>
                </div>
              </div>
              <div className='flex flex-row items-center py-4'>
                <MailIcon className='text-3xl text-[#f44336]' />
                <div className='pt-4 text-left ml-5'>
                  <p className='text-2xl'>cabantacet@gmail.com</p>
                  <p>Email us your query</p>
                </div>
              </div>
            </div>

            <div className='mt-5 lg:mt-0 px-4 lg:px-0'>
              <input
                type='text'
                placeholder='Enter your Name'
                className='w-full py-3 px-5 mb-5 border-2'
              />
              <input
                type='email'
                placeholder='Enter your Email Adress'
                className='w-full py-3 px-5 mb-5 border-2'
              />
              <input
                type='text'
                placeholder='Enter your Subject'
                className='w-full py-3 px-5 mb-5 border-2'
              />
              <textarea
                placeholder='Message'
                className='w-full py-3 px-5 mb-5 border-2'
                rows={7}
              />
              <button className='hover:bg-[#f44336] hover:text-white py-3 px-5 bg-white border-solid border-2 border-[#f44336] transition-all duration-500'>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
