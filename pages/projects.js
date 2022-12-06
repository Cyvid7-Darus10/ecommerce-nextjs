import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
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
      <Layout title='Projects' bgImage={"/images/projects-bg-min.png"}>
        <div className='container px-0 mx-0'>
          <p className='text-[#f44336] italic text-center py-2'>
            Home → Our Projects
          </p>
          <p className='text-3xl text-center font-semibold py-2'>
            Our Projects
          </p>
          <TransitionScroll
            reAnimate={true}
            hiddenStyle={{
              opacity: 50,
              filter: "blur(2px)",
              transform: "translateY(-20px)",
            }}
          >
            <div className='mt-20'>
              <p className='text-xl font-semibold text-center'>
                MR CHRIS RESIDENCE, ANVAYA COVE, MORONG, BATAAN
              </p>
              <Carousel
                slidesToShow={isPortrait ? 3 : 6}
                animation='zoom'
                autoplay={true}
                autoplayInterval={8000}
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
                {data?.projects &&
                  data.projects.map((project) => (
                    <div key={project.id}>
                      <Image
                        src={project.image}
                        alt='project'
                        width={200}
                        height={200}
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
              filter: "blur(2px)",
              transform: "translateY(20px)",
            }}
          >
            <div className='mt-20'>
              <p className='text-xl font-semibold text-center'>
                CCTV REPAIR / MAINTENANCE at BARANGAY TENEJERO, BALANGA, BATAAN
              </p>
              <Carousel
                slidesToShow={isPortrait ? 3 : 6}
                animation='zoom'
                autoplay={true}
                autoplayInterval={9000}
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
                {data?.projects2 &&
                  data.projects2.map((project) => (
                    <div key={project.id}>
                      <Image
                        src={project.image}
                        alt='project'
                        width={200}
                        height={200}
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
              filter: "blur(2px)",
              transform: "translateY(-20px)",
            }}
          >
            <div className='mt-20'>
              <p className='text-xl font-semibold text-center'>
                MR CHRIS RESIDENCE, ANVAYA COVE, MORONG, BATAAN
              </p>
              <Carousel
                slidesToShow={isPortrait ? 3 : 6}
                animation='zoom'
                autoplay={true}
                autoplayInterval={7000}
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
                {data?.projects3 &&
                  data.projects3.map((project) => (
                    <div key={project.id}>
                      <Image
                        src={project.image}
                        alt='project'
                        width={200}
                        height={200}
                        className='rounded-md shadow-md'
                      />
                    </div>
                  ))}
              </Carousel>
            </div>
          </TransitionScroll>
        </div>
      </Layout>
    </>
  );
}
