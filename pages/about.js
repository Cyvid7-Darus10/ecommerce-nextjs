import Layout from "../components/Layout";
import Image from "next/image";
import { TransitionScroll } from "react-transition-scroll";
import "react-transition-scroll/dist/index.css";

export default function Home() {
  return (
    <>
      <Layout title='About' bgImage={"/images/aboutus-min.jpg"}>
        <div className='px-0 mx-0'>
          <p className='text-[#f44336] italic text-center py-2'>
            Home → About Us
          </p>
          <p className='text-3xl text-center font-semibold py-2'>About Us</p>

          <div className='mt-20 lg:px-[30vw] px-5 text-left mb-16'>
            <p className='text-3xl font-semibold py-2 mt-10'>
              Cabsfour Security Systems Services
            </p>
            <p>
              Cabsfour Security Systems Services is a Filipino owned company
              formed by dedicated entrepreneurs more than Four years work
              experience in electronic security system integration. We are
              engaged in integrating various Electronic Security products such
              as CCTV, Hidden Camera, POS System, Biometrics, Fire Alarm System
              Network Cabling, Computer Repair.
            </p>
            <p className='text-3xl font-semibold py-2 mt-10'>Mission</p>
            <p>
              Cabsfour Security Systems Services aims to deliver industry
              leading systems design resources, cutting edge technological
              alternatives, and unsurpassed customer support tools to assure
              dependable, long term Security Solutions for our client bases
              infrastructural, asset, and human security concerns.
            </p>
            <p className='text-3xl font-semibold py-2 mt-10'>Vision</p>
            <p>
              Our Dedication to offer world class Customer service such as
              system design, Integrations and commissioning, comprehensive
              training programs, and quick technical support.
            </p>
            <div className='flex justify-center items-center mt-10'>
              <Image
                src='/images/about_us/aboutus-bg-1.png'
                alt='About Us'
                width={600}
                height={600}
              />
            </div>
          </div>
          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              transform: "translateX(100px)",
              filter: "blur(2px)",
            }}
          >
            <div className='py-10 custom-div-design text-center text-white flex flex-col justify-center items-center'>
              <p className='text-4xl lg:text-6xl font-semibold'>Our Goals</p>
              <p className='lg:text-xl px-10 py-6'>
                Our goal is to bring the security system technology utilized{" "}
                <br /> by establishments with high level of security
                equipment&#39;s to <br /> common Filipino Home Business and top
                corporations at
                <br /> the lowest possible prices.
              </p>
            </div>
          </TransitionScroll>

          <div className='mt-20 lg:px-[30vw] px-5 text-left mb-16'>
            <p className='mt-10'>
              Our product lines are carefully selected to guarantee a reliable,
              user friendly and cost effective system Safetyzone&#39;s team is
              composed of highly skilled technician&#39;s and researches with in
              depth knowledge on installation, configuration and troubleshooting
              of various electronic security products.
            </p>
            <p className='mt-10'>
              Our passion is to provide our clients with effective and
              innovative system suited for their security needs We believe that
              our after sales service and support will strengthen our clients
              and make their security investments commendable.
            </p>
            <p className='mt-10'>
              Our Company is not Promoting any brands or Product, We Provide
              Security Solution to our Client needs.
            </p>
            <div className='flex justify-center items-center mt-10'>
              <Image
                src='/images/about_us/aboutus.png'
                alt='About Us'
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
