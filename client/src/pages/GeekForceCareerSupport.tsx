import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { IconFlag, IconSchool } from "@tabler/icons-react";
import Marquee from "react-fast-marquee";
import { TwoColumn, TwoColumnSectionType } from "@/components/TwoColumn";
import NumberedSteps, { type NumberedStepsData } from "@/components/NumberedSteps";
import StatsSection, { type StatsSectionData } from "@/components/StatsSection";
import { WhosHiringSection } from "@/components/career-programs/WhosHiringSection";
import { HeroTwoColumn } from "@/components/hero/HeroTwoColumn";
import type { WhosHiringSection as WhosHiringSectionType, HeroTwoColumn as HeroTwoColumnType } from "@shared/schema";
import careerSupportImage from "@assets/Group-6663_1764711021914.png";
import communityImage from "@assets/community_1764717588840.png";

import imgLoretta from "@assets/ttaLoretta_1764725322100.jpeg";
import imgAkers from "@assets/Akers_1764725327796.jpeg";
import imgMaiLinh from "@assets/MaiLinh_1764725334980.png";
import imgCoimbra from "@assets/coimbra_1764725341501.png";
import imgJean from "@assets/JeanSt.Cloud_1764725356935.jpeg";
import imgAlexandra from "@assets/AlexandraEspinoza_1764725386161.jpeg";
import imgGabriel from "@assets/GabrielSalazar_1764725392872.jpeg";
import imgLaura from "@assets/Laura_1764725397398.jpeg";
import imgLeandro from "@assets/Leandro_1764725403142.jpeg";
import imgMelanie from "@assets/MelamnieGalaretto_1764725408397.jpeg";
import imgNatia from "@assets/NatiaLombardo_1764725413363.jpeg";
import imgLuis from "@assets/LuisLarraburo_1764725418057.jpeg";

import logoMicrosoft from "@assets/microsoft_1764719829995.png";
import logoGoogleDev from "@assets/google-developers_1764719904190.png";
import logoBoatsGroup from "@assets/boats_1764719939123.jpg";
import logoMeta from "@assets/meta-logo_1764719959855.png";
import logoEbay from "@assets/ebay_1764719967118.png";
import logoNatGeo from "@assets/natgeo_1764719975443.png";
import logoEvernote from "@assets/evernote_1764719981901.png";
import logoTelefonica from "@assets/telefonica_1764719987250.png";
import logoTwilio from "@assets/twilio_1764719992371.png";
import logoUber from "@assets/uber_1764719999685.png";
import logoNeo9 from "@assets/Neo9_1764720006347.png";
import logoJooble from "@assets/jooble_1764720010702.png";
import logoKpmg from "@assets/kpmg-logo1_1764720019827.png";
import logoUltimate from "@assets/ultimate_1764720025067.png";
import logoTcg from "@assets/tcg_1764720028893.png";
import logoRazz from "@assets/razz_1764720036807.png";
import logoOverseas from "@assets/overseas_1764720045331.png";
import logoDs9 from "@assets/ds9_1764720051158.png";
import logoCoinet from "@assets/coinet_1764720056569.jpg";
import logoStrata from "@assets/strata_1764720063140.png";
import logoMdc from "@assets/mdc_ce_1764720089793.png";
import logoBeaconCouncil from "@assets/beacon_council_1764720100166.jpg";
import logoBlackstone from "@assets/blackstone_1764720124773.png";
import logoCemex from "@assets/cemex_1764720131666.png";
import vectorStroke from "@assets/vector-stroke-light_1764729540525.png";

// ============================================
// DATA
// ============================================

const heroData: HeroTwoColumnType = {
  type: "hero",
  variant: "twoColumn",
  welcome_text: "Welcome to",
  brand_mark: {
    prefix: "Geek",
    highlight: "FORCE",
    suffix: ":",
    color: "chart-5",
  },
  title: "Career Development",
  subtitle: "for the AI Era",
  description: "Get unlimited 1:1 career support designed for your unique profile and goals—for life. From resume and portfolio building to interviews and AI-driven hiring platforms, we'll give you the personalized mentorship you need to land your first job and keep thriving in today's tech.",
  video_id: "-2ZvlgDnltc",
  video_title: "GeekForce Career Support",
  video_ratio: "9:12",
};

const unlimitedSupportTwoColumnData: TwoColumnSectionType = {
  type: "two_column",
  background: "bg-primary/5",
  proportions: [7, 5],
  reverse_on_mobile: true,
  alignment: "center",
  gap: "10",
  right: {
    image: careerSupportImage,
    image_alt: "Career support team members collaborating",
  },
  left: {
    heading: "Unlimited Career Support – Always Ahead of Job Market Trends",
    description: "Geekforce is built into every 4Geeks program to make sure you don't just learn tech, but launch a successful career. Through unlimited 1:1 mentorship and group coaching, you'll gain insights, resources, and strategies designed to keep you ahead in the AI-powered job market.",
    justify: "center",
    text_align: "left",
    font_size: "base",
    bullet_icon: "Check",
    bullets: [
      { text: "Receive tailored guidance aligned with your goals, context, and challenges." },
      { text: "Meet mentors online or in-person whenever you need support—unlimited, for life." },
      { text: "Access proven tools and strategies to make smarter career moves and stay relevant as the tech industry evolves." }
    ],
  },
};

const hyperpersonalizedTwoColumnData: TwoColumnSectionType = {
  type: "two_column",
  proportions: [5, 7],
  background: "bg-primary/5",
  alignment: "center",
  reverse_on_mobile: true,
  padding_right: "6",
  left: {
    image: communityImage,
    image_alt: "4Geeks Academy community members collaborating on a project",
    image_width: "440px",
    justify: "start",
  },
  right: {
    heading: "Accelerate Your Results with Hyperpersonalized Career Support",
    description: "Combine unlimited 1:1 human mentorship with AI-powered tools to launch your career faster and smarter:",
    bullets: [
      { text: "Rigobot, our custom AI, gives instant feedback on your resume, portfolio, and projects." },
      { text: "Practice technical interviews and behavioral questions with AI-guided exercises." },
      { text: "Get expert coaching from our mentors who tailor advice to your unique profile and goals." }
    ],
    font_size: "base",
  },
};

const statsData: StatsSectionData = {
  title: "Does the Job Guarantee deliver results you can count on?",
  description: "Yes, and we've got the numbers to back it up. These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board. We don't just teach you how to code, we help you build a career you're proud of.",
};

interface Testimonial {
  name: string;
  img: string;
  status: string;
  country: {
    iso: string;
    name: string;
  };
  contributor: string;
  description: string;
  achievement?: string;
}

const testimonialsData: {
  title: string;
  description: string;
  testimonials: Testimonial[];
} = {
  title: "Real Careers Start Here — Just Ask Our Students",
  description: "Our grads are in high demand, with over 84% hired within six months of finishing the program. Student reviews and career results speak for themselves: You'll leave with the technical skills, confidence, and career strategy to break into one of tech's most rewarding fields—and keep growing.",
  testimonials: [
    {
      name: "Loretta Thompson",
      img: imgLoretta,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "United Way Miami",
      description: "Loretta joined in 2022 and graduated in 2023. She already found a job within the next few months and has fulfilled the whole circle of skills+job that we all want to complete!",
      achievement: "She got a 45% increase in her salary"
    },
    {
      name: "Rich Akers",
      img: imgAkers,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark University",
      description: "Richard is a great developer that just transitioned from a different background and is now working as a web dev in the tech field.",
      achievement: "He got a 30% increase in his salary"
    },
    {
      name: "MaiLinh Tran",
      img: imgMaiLinh,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark University",
      description: "An entrepreneur with a passion for technology is now focusing on the dev side of their endeavour.",
      achievement: "She has launched her startup, is capable of hiring new tech talent and coordinates a dev team!"
    },
    {
      name: "Jorge Martín Coimbra",
      img: imgCoimbra,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Martín joined the first program that we launched together with UTEC and IDB. He got a better paying job, a career that he is passionate about and a new professional life.",
      achievement: "He got a 100% increase in his salary"
    },
    {
      name: "Jean St. Cloud",
      img: imgJean,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark",
      description: "Jean is transitioning from other industries (Music) and is finding his way into Tech. He got it with the support of Clark University and is already performing as a developer and a Mentor.",
      achievement: "He got a 100% increase in his salary"
    },
    {
      name: "Alexandra Espinoza",
      img: imgAlexandra,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Alexandra came from a total different background is been a huge revelation for her and everyone around her. She is now a successful and talented software developer in Costa Rica.",
      achievement: "She got a 100% increase in her salary"
    },
    {
      name: "Gabriel Salazar",
      img: imgGabriel,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Gabriel was already a support specialist at Microsoft and after completing the program he was able to achieve a new position within Microsoft where he is now working as a Software Engineer.",
      achievement: "He got a 50% increase in his salary"
    },
    {
      name: "Laura Magallanes",
      img: imgLaura,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Laura is just extraordinary. From a little town in Uruguay with no experience in Coding, she is now a woman head of household, an Instructor and a Program Coordinator.",
      achievement: "She got a 120% increase in her salary"
    },
    {
      name: "Leandro Matonte",
      img: imgLeandro,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Leandro got into the program with the expectation to achieve a better understanding and some coding skills that will help with his decision of being a computer scientist graduate. Now he is a software developer at a tech firm in Uruguay.",
      achievement: "He got a 60% increase in his salary"
    },
    {
      name: "Melanie Galaretto",
      img: imgMelanie,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Melanie is a young professional who is dreaming of achieving a life that now she owns. She is a resourceful and committed software developer working for a software firm in her home country.",
      achievement: "She got a +100% increase in her salary"
    },
    {
      name: "Natia Lombardo",
      img: imgNatia,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Natia is a philosopher and a software developer. Currently working as a QA Engineer of a huge and successful International firm."
    },
    {
      name: "Luis Larraburo",
      img: imgLuis,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Luis came to the program without any previous experience, He is now a software developer working on a tech firm in Costa Rica.",
      achievement: "He got a 50% increase in his salary"
    }
  ]
};

const whosHiringData: WhosHiringSectionType = {
  type: "whos_hiring",
  title: "Who's Hiring Our Graduates?",
  subtitle: "Our alumni work at top companies around the world",
  description: "From startups to Fortune 500 companies, 4Geeks graduates are making an impact across industries. Our career support and strong employer network help you land roles at leading tech companies, agencies, and enterprises globally.",
  logos: [
    { src: logoMicrosoft, alt: "Microsoft" },
    { src: logoGoogleDev, alt: "Google Developers" },
    { src: logoBoatsGroup, alt: "Boats Group" },
    { src: logoMeta, alt: "Meta" },
    { src: logoEbay, alt: "eBay" },
    { src: logoNatGeo, alt: "National Geographic" },
    { src: logoEvernote, alt: "Evernote" },
    { src: logoTelefonica, alt: "Telefonica" },
    { src: logoTwilio, alt: "Twilio" },
    { src: logoUber, alt: "Uber" },
    { src: logoNeo9, alt: "Neo9" },
    { src: logoJooble, alt: "Jooble" },
    { src: logoKpmg, alt: "KPMG" },
    { src: logoUltimate, alt: "Ultimate Software" },
    { src: logoTcg, alt: "The Creative Group" },
    { src: logoRazz, alt: "Razz" },
    { src: logoOverseas, alt: "Overseas Leisure Group" },
    { src: logoDs9, alt: "DS9 Design" },
    { src: logoCoinet, alt: "Coinet" },
    { src: logoStrata, alt: "Strata.ai" },
    { src: logoMdc, alt: "Miami Dade College" },
    { src: logoBeaconCouncil, alt: "Miami-Dade Beacon Council" },
    { src: logoBlackstone, alt: "Blackstone" },
    { src: logoCemex, alt: "Cemex" },
  ],
};

const careerProcessData: NumberedStepsData = {
  title: "Get Hired with Our 3-Step Career Development Process",
  description: "Once you've mastered the technical skills, our structured process helps you build a lasting career in tech — taking you from learning to landing the job.",
  background: "bg-background",
  bullet_icon_color: "black",
  bullet_char: "•",
  steps: [
    {
      icon: "Stairs",
      title: "Profile Optimization",
      bullets: [
        "Polish LinkedIn, GitHub, and portfolio to attract recruiters and pass AI-based filters.",
        "Build a resume that clears applicant tracking systems (ATS) and highlights your strengths.",
        "Showcase your skills with a recruiter-ready portfolio."
      ]
    },
    {
      icon: "FileText",
      title: "Interview Preparation",
      bullets: [
        "Gain confidence with mock technical and behavioral interviews.",
        "Practice coding and problem-solving with auto-graded exercises.",
        "Develop tailored strategies for upcoming interviews."
      ]
    },
    {
      icon: "Briefcase",
      title: "Strategic Job Search",
      bullets: [
        "Create a personalized job search plan aligned with your goals.",
        "Navigate AI-driven hiring platforms, from resume scanners to automated interviews.",
        "Connect with our extensive network of global hiring partners."
      ]
    }
  ]
};

// ============================================
// SECTION COMPONENTS
// ============================================

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card 
      className="w-[300px] h-[490px] -mx-7 md:mx-2 flex-shrink-0 overflow-visible flex flex-col scale-[0.75] md:scale-100 origin-center"
      data-testid={`card-testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="h-[170px] w-full overflow-hidden flex-shrink-0">
        <img 
          src={testimonial.img} 
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className="font-bold text-foreground text-lg leading-tight">{testimonial.name}</h4>
          {testimonial.status === "Graduated" && (
            <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
              <IconSchool className="w-5 h-5" />
              <span className="text-base">Graduated</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-1">
          <span 
            className={`flag flag-xs flag-country-${testimonial.country.iso.toLowerCase()}`}
            style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}
          />
          <span className="text-base text-foreground">{testimonial.country.name}</span>
        </div>
        
        <p className="text-base text-muted-foreground mb-2">
          Contributor: {testimonial.contributor}
        </p>
        
        <div className="border-t border-border mb-2" />
        
        <p className="text-base text-foreground flex-1 overflow-hidden line-clamp-5 mb-2">
          {testimonial.description}
        </p>
        
        {testimonial.achievement ? (
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-md p-2 flex items-start gap-1.5 mt-auto flex-shrink-0">
            <IconFlag className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              {testimonial.achievement}
            </p>
          </div>
        ) : (
          <div className="h-10 mt-auto flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}

function TestimonialsSection({ data }: { data: typeof testimonialsData }) {
  return (
    <section 
      className="py-12 md:py-16 bg-sidebar"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
          data-testid="text-testimonials-title"
        >
          {data.title}
        </h2>
        <p 
          className="text-center text-lg text-muted-foreground max-w-3xl mx-auto"
          data-testid="text-testimonials-description"
        >
          {data.description}
        </p>
      </div>
      
      <Marquee 
        gradient={false} 
        speed={40} 
        pauseOnHover={true}
        data-testid="marquee-testimonials"
      >
        {data.testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function GeekForceCareerSupport() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroTwoColumn data={heroData} />
        <TwoColumn data={unlimitedSupportTwoColumnData} />
        <NumberedSteps data={careerProcessData} />
        <TwoColumn data={hyperpersonalizedTwoColumnData} />
        <WhosHiringSection data={whosHiringData} />
        <StatsSection data={statsData} />
        <TestimonialsSection data={testimonialsData} />
      </main>
    </div>
  );
}
