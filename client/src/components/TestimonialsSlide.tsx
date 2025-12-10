import { Card } from "@/components/ui/card";
import { IconSchool, IconFlag } from "@tabler/icons-react";
import Marquee from "react-fast-marquee";

export interface TestimonialsSlideTestimonial {
  name: string;
  img: string;
  status?: string;
  country: {
    name: string;
    iso: string;
  };
  contributor: string;
  description: string;
  achievement?: string;
}

export interface TestimonialsSlideData {
  title: string;
  description: string;
  background?: string;
}

interface TestimonialsSlideProps {
  data: TestimonialsSlideData;
}

const DEFAULT_TESTIMONIALS: TestimonialsSlideTestimonial[] = [
  {
    name: "Loretta Thompson",
    img: "/attached_assets/ttaLoretta_1764725322100.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "United Way Miami",
    description: "Loretta joined in 2022 and graduated in 2023. She already found a job within the next few months and has fulfilled the whole circle of skills+job that we all want to complete!",
    achievement: "She got a 45% increase in her salary"
  },
  {
    name: "Rich Akers",
    img: "/attached_assets/Akers_1764725327796.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark University",
    description: "Richard is a great developer that just transitioned from a different background and is now working as a web dev in the tech field.",
    achievement: "He got a 30% increase in his salary"
  },
  {
    name: "MaiLinh Tran",
    img: "/attached_assets/MaiLinh_1764725334980.png",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark University",
    description: "An entrepreneur with a passion for technology is now focusing on the dev side of their endeavour.",
    achievement: "She has launched her startup, is capable of hiring new tech talent and coordinates a dev team!"
  },
  {
    name: "Jorge Martín Coimbra",
    img: "/attached_assets/coimbra_1764725341501.png",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Martín joined the first program that we launched together with UTEC and IDB. He got a better paying job, a career that he is passionate about and a new professional life.",
    achievement: "He got a 100% increase in his salary"
  },
  {
    name: "Jean St. Cloud",
    img: "/attached_assets/JeanSt.Cloud_1764725356935.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark",
    description: "Jean is transitioning from other industries (Music) and is finding his way into Tech. He got it with the support of Clark University and is already performing as a developer and a Mentor.",
    achievement: "He got a 100% increase in his salary"
  },
  {
    name: "Alexandra Espinoza",
    img: "/attached_assets/AlexandraEspinoza_1764725386161.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Alexandra came from a total different background is been a huge revelation for her and everyone around her. She is now a successful and talented software developer in Costa Rica.",
    achievement: "She got a 100% increase in her salary"
  },
  {
    name: "Gabriel Salazar",
    img: "/attached_assets/GabrielSalazar_1764725392872.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Gabriel was already a support specialist at Microsoft and after completing the program he was able to achieve a new position within Microsoft where he is now working as a Software Engineer.",
    achievement: "He got a 50% increase in his salary"
  },
  {
    name: "Laura Magallanes",
    img: "/attached_assets/Laura_1764725397398.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Laura is just extraordinary. From a little town in Uruguay with no experience in Coding, she is now a woman head of household, an Instructor and a Program Coordinator.",
    achievement: "She got a 120% increase in her salary"
  },
  {
    name: "Leandro Matonte",
    img: "/attached_assets/Leandro_1764725403142.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Leandro got into the program with the expectation to achieve a better understanding and some coding skills that will help with his decision of being a computer scientist graduate. Now he is a software developer at a tech firm in Uruguay.",
    achievement: "He got a 60% increase in his salary"
  },
  {
    name: "Melanie Galaretto",
    img: "/attached_assets/MelamnieGalaretto_1764725408397.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Melanie is a young professional who is dreaming of achieving a life that now she owns. She is a resourceful and committed software developer working for a software firm in her home country.",
    achievement: "She got a +100% increase in her salary"
  },
  {
    name: "Natia Lombardo",
    img: "/attached_assets/NatiaLombardo_1764725413363.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Natia is a philosopher and a software developer. Currently working as a QA Engineer of a huge and successful International firm."
  },
  {
    name: "Luis Larraburo",
    img: "/attached_assets/LuisLarraburo_1764725418057.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Luis came to the program without any previous experience, He is now a software developer working on a tech firm in Costa Rica.",
    achievement: "He got a 50% increase in his salary"
  }
];

function TestimonialCard({ testimonial }: { testimonial: TestimonialsSlideTestimonial }) {
  return (
    <Card 
      className="w-[300px] h-[490px] -mx-4 md:mx-2 flex-shrink-0 overflow-visible flex flex-col scale-[0.75] md:scale-100 origin-center"
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

export default function TestimonialsSlide({ data }: TestimonialsSlideProps) {
  return (
    <section 
      className={`py-12 md:py-16 ${data.background || "bg-sidebar"}`}
      data-testid="section-testimonials-slide"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
          data-testid="text-testimonials-slide-title"
        >
          {data.title}
        </h2>
        <p 
          className="text-center text-lg text-muted-foreground max-w-3xl mx-auto"
          data-testid="text-testimonials-slide-description"
        >
          {data.description}
        </p>
      </div>
      
      <Marquee 
        gradient={false} 
        speed={40} 
        pauseOnHover={true}
        data-testid="marquee-testimonials-slide"
      >
        {DEFAULT_TESTIMONIALS.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
}
