import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      firstName: "Admin",
      lastName: "Admin",
      userName: "admin",
      email: "admin@test.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      firstName: "John",
      lastName: "Doe",
      userName: "john",
      email: "john@test.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      id: 1,
      name: "HIKVISION (PACKAGE) 4CH POE NVR (DS-7104NI-E1), 4 DOME CAMERAS",
      slug: "hikvision-package-4ch-poe-nvr-ds-7104ni-e1-4-dome-cameras-1",
      category: "Cameras",
      image: "/images/product/product1.png",
      price: "18250",
      brand: "Hikvision",
      rating: 4.5,
      numReviews: 10,
      countInStock: 6,
      description:
        "4pcs 2MP DS-2CD1121-I (2.8mm) HD1080P IR dome camera 1pc DS-7104NI-E1/4P 4ch PoE NVR 1Pc 1TB Western Digital purple drives 4pcs 18meters ethernet cables 1pc 1meter ethernet cable 1pc HDMI cable",
    },
    {
      id: 2,
      name: "HIKVISION (PACKAGE) 4CH POE NVR (DS-7104NI-E1), 4 BULLET CAMERAS",
      slug: "hikvision-package-4ch-poe-nvr-ds-7104ni-e1-4-bullet-cameras-2",
      category: "Cameras",
      image: "/images/product/product2.png",
      price: "17500",
      brand: "Hikvision",
      rating: 4.5,
      numReviews: 10,
      countInStock: 6,
      description:
        "2pcs 2MP DS-2CD1021-I (2.8mm) HD1080P IR bullet camera 2pcs 2MP DS-2CD1121-I (2.8mm) HD1080P IR dome camera 1pc DS-7104NI-E1/4P 4ch PoE NVR 1Pc 1TB Western Digital purple drives 4pcs 18meters ethernet",
    },
    {
      id: 3,
      name: "DAHUA 4CH 2MP HDCVI 1080P COMBO KIT (1X XVR1B04, 2X2MP BULLET, 2X2MP TURRET",
      slug: "dahua-4ch-2mp-hdcvi-1080p-combo-kit-1x-xvr1b04-2x2mp-bullet-2x2mp-turret-3",
      category: "Cameras",
      image: "/images/product/product3.png",
      price: "5500",
      brand: "Dahua",
      rating: 4.5,
      numReviews: 10,
      countInStock: 6,
      description:
        "Digital Video Recorder VR1B04-2MP-2D2B Dahua Cooper 2MP 4CH Kit (XVR1B04, 2*HAC-B1A21N-0360B/2*HAC-T1A21N-0360B) 2 Bullet and 2 Dome/Turret Camera DVR Performance Overview : H.265+/H.265 dual-stream video compression Supports HDCVI/AHD/TVI/CVBS/IP.",
    },
  ],

  services: [
    {
      id: 1,
      name: "CCTV",
      alt: "CCTV",
      information:
        "With the increasing demand on CCTV surveillance system, Safetyzone offers wide range of surveillance cameras and recorders that will fit your security requirements and budget.",
      image: "/images/service/services1.png",
      hoverImage: "/images/service/services_bg1.png",
    },
    {
      id: 2,
      name: "Fire Alarm System",
      alt: "Fire Alarm System",
      information:
        "Fire alarm is designed to detect the unwanted presence of fire by monitoring environmental changes associated It can be automatically actuated, manually actuated or both automatic.",
      image: "/images/service/services2.png",
      hoverImage: "/images/service/services_bg2.png",
    },
    {
      id: 3,
      name: "Point of Sale System",
      alt: "Point of Sale System",
      information:
        "point-of-sale that uses biometric authentication based on physical characteristics to identify the user and authorize the deduction of funds from a bank account.",
      image: "/images/service/services3.png",
      hoverImage: "/images/service/services_bg3.png",
    },
    {
      id: 4,
      name: "Network Cabling",
      alt: "Network Cabling",
      information:
        " Structured cabling is an infrastructure that’s made up of smaller, standardized elements. You can install structured cabling systems in a building or across a campus.",
      image: "/images/service/services4.png",
      hoverImage: "/images/service/services_bg4.png",
    },
    {
      id: 5,
      name: "Biometrics",
      alt: "Biometrics",
      information:
        "A measurable physical characteristic or personal behavioral trait used to recognize the identity, or verify the claimed identity, of an applicant. Facial images, fingerprints, and iris scan.",
      image: "/images/service/services5.png",
      hoverImage: "/images/service/services_bg5.png",
    },
    {
      id: 6,
      name: "Computer Repair",
      alt: "Computer Repair",
      information:
        "Computer repair is a broad field encompassing many tools, techniques and procedures used to repair computer hardware, software or network/Internet problems.",
      image: "/images/service/services6.png",
      hoverImage: "/images/service/services_bg6.png",
    },
    {
      id: 7,
      name: "Access Control",
      alt: "Access Control",
      information:
        "Its purpose is to limit access to people who are authorized to enter an organization. It uses door readers that detect the unique identification numbers provided by credentials.",
      image: "/images/service/services7.png",
      hoverImage: "/images/service/services_bg7.png",
    },
    {
      id: 8,
      name: "Public Address System",
      alt: "Public Address System",
      information:
        "made up of an input source like a microphone, amplifiers, speakers and a controller.It allows to communicate from central panel to multiple or single areas.",
      image: "/images/service/services8.png",
      hoverImage: "/images/service/services_bg8.png",
    },
  ],

  clients: [
    {
      id: 1,
      name: "Althea",
      image: "/images/logo/Bakeshop _ Goodies-logo.png",
    },
    {
      id: 2,
      name: "Circle Plus Pharmacy",
      image: "/images/logo/Circle_Plus_Pharmacy-logo.png",
    },
    {
      id: 3,
      name: "LTO",
      image: "/images/logo/lto-logo.png",
    },
    {
      id: 4,
      name: "Triwave Corporation",
      image: "/images/logo/triwavecorp-logo.png",
    },
    {
      id: 5,
      name: "Kimchi Minimart",
      image: "/images/logo/kimchi_minimart-logo.png",
    },
    {
      id: 6,
      name: "Peak Sun Trucking",
      image: "/images/logo/Peaksun Trucking-logo.png",
    },
    {
      id: 7,
      name: "Ecosystem Technologies International Warehouse",
      image:
        "/images/logo/Ecosystem Technologies International Warehouse-logo.png",
    },
  ],

  mainProjects: [
    {
      id: 1,
      image: "/images/project_section/project (1).jpg",
    },
    {
      id: 2,
      image: "/images/project_section/project (2).jpg",
    },
    {
      id: 3,
      image: "/images/project_section/project (3).jpg",
    },
    {
      id: 4,
      image: "/images/project_section/project (4).jpg",
    },
    {
      id: 5,
      image: "/images/project_section/project (5).jpg",
    },
    {
      id: 6,
      image: "/images/project_section/project (6).jpg",
    },
  ],

  projects: [
    {
      id: 1,
      image: "/images/project/projects_row1.jpg",
    },
    {
      id: 2,
      image: "/images/project/projects_row2.jpg",
    },
    {
      id: 3,
      image: "/images/project/projects_row3.jpg",
    },
    {
      id: 4,
      image: "/images/project/projects_row4.jpg",
    },
    {
      id: 5,
      image: "/images/project/projects_row5.jpg",
    },
    {
      id: 6,
      image: "/images/project/projects_row6.jpg",
    },
    {
      id: 7,
      image: "/images/project/projects_row7.jpg",
    },
    {
      id: 8,
      image: "/images/project/projects_row8.jpg",
    },
    {
      id: 9,
      image: "/images/project/projects_row9.jpg",
    },
    {
      id: 10,
      image: "/images/project/projects_row10.jpg",
    },
  ],

  projects2: [
    {
      id: 1,
      image: "/images/project/projects2_row1.jpg",
    },
    {
      id: 2,
      image: "/images/project/projects2_row2.jpg",
    },
    {
      id: 3,
      image: "/images/project/projects2_row3.jpg",
    },
    {
      id: 4,
      image: "/images/project/projects2_row4.jpg",
    },
    {
      id: 5,
      image: "/images/project/projects2_row5.jpg",
    },
    {
      id: 6,
      image: "/images/project/projects2_row6.jpg",
    },
    {
      id: 7,
      image: "/images/project/projects2_row7.jpg",
    },
    {
      id: 8,
      image: "/images/project/projects2_row8.jpg",
    },
    {
      id: 9,
      image: "/images/project/projects2_row9.jpg",
    },
    {
      id: 10,
      image: "/images/project/projects2_row10.jpg",
    },
  ],

  projects3: [
    {
      id: 1,
      image: "/images/project/projects3_row1.jpg",
    },
    {
      id: 2,
      image: "/images/project/projects3_row2.jpg",
    },
    {
      id: 3,
      image: "/images/project/projects3_row3.jpg",
    },
    {
      id: 4,
      image: "/images/project/projects3_row4.jpg",
    },
    {
      id: 5,
      image: "/images/project/projects3_row5.jpg",
    },
    {
      id: 6,
      image: "/images/project/projects3_row6.jpg",
    },
    {
      id: 7,
      image: "/images/project/projects3_row7.jpg",
    },
  ],
};

export default data;
