import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import Link from "next/link";
import data from "../utils/data";
import useWindowDimensions from "../utils/useWindowDimensions";
import Carousel from "nuka-carousel";
import { TransitionScroll } from "react-transition-scroll";
import "react-transition-scroll/dist/index.css";

export default function Home() {
  const { height, width } = useWindowDimensions();
  const [isPortrait, setIsPortrait] = useState(height > width);

  useEffect(() => {
    setIsPortrait(height > width);
  }, [height, width]);

  return (
    <>
      <style jsx>
        {`
          .contact-div {
            margin: 100px auto;
            width: 80%;
            background-image: linear-gradient(
                rgba(0, 0, 0, 0.7),
                rgba(0, 0, 0, 0.7)
              ),
              url(images/getaqoute-min.png);
            background-position: center;
            background-size: cover;
            border-radius: 10px;
            text-align: center;
            padding: 100px 0;
          }
        `}
      </style>
      <Layout title='Home' bgImage={"/images/indexbg-min.jpg"}>
        <div className='px-0 mx-0'>
          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              transform: "translateY(-100px)",
              filter: "blur(2px)",
            }}
          >
            <div className='py-10'>
              <p className='text-2xl text-center font-semibold'>
                Our Services & Products We Offer
              </p>
              <p className='text-center' style={{ fontWeight: 250 }}>
                Providing you with the best security
              </p>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-12 px-5'>
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
          </TransitionScroll>
          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              filter: "blur(2px)",
            }}
          >
            <div className='py-10'>
              <p className='text-2xl text-center font-semibold'>Our Projects</p>
              <p className='text-center' style={{ fontWeight: 250 }}>
                Smarter Security, Professionally Installed
              </p>
              <Carousel
                slidesToShow={isPortrait ? 3 : 4}
                animation='zoom'
                autoplay={true}
                autoplayInterval={2000}
                className='py-12'
                cellAlign='center'
                wrapAround={true}
                defaultControlsConfig={{
                  nextButtonText: ">",
                  prevButtonText: "<",
                  pagingDotsStyle: {
                    fill: "#f44336",
                    padding: "10px",
                  },
                }}
              >
                {data?.mainProjects &&
                  data.mainProjects.map((project) => (
                    <div key={project.id}>
                      <Image
                        src={project.image}
                        alt='project'
                        width={400}
                        height={400}
                        className='rounded-md shadow-md'
                      />
                    </div>
                  ))}
              </Carousel>
            </div>
          </TransitionScroll>

          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              transform: "translateX(100px)",
              filter: "blur(2px)",
            }}
          >
            <div className='py-10 custom-div-design text-center text-white flex flex-col justify-center items-center'>
              <p className='text-4xl lg:text-6xl font-semibold mt-3'>
                Inspiring Technology
              </p>
              <p className='lg:text-xl px-10 py-6'>
                We are a hands-on company that provides solutions for our
                clients&#39;
                <br /> problems and anticipates future problems before they
                arise.
              </p>
              <Link href='/contact' className='custom-button'>
                Learn More
              </Link>
            </div>
          </TransitionScroll>

          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              transform: "translateX(-100px)",
              filter: "blur(2px)",
            }}
          >
            <div className='py-10 contact-div text-center text-white flex flex-col justify-center items-center'>
              <p className='text-2xl py-6 font-semibold'>
                For your comments and suggestions inquiry, Please fill out this
                form
              </p>
              <Link href='/about' className='custom-button'>
                Contact Us
              </Link>
            </div>
          </TransitionScroll>

          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              transform: "translateY(-100px)",
              filter: "blur(2px)",
            }}
          >
            <div className='pt-10'>
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
                        width={120}
                        height={120}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </TransitionScroll>
        </div>
      </Layout>
    </>
  );
}
