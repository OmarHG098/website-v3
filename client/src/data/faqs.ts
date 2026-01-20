export type RelatedFeature =
  | "online-platform"
  | "mentors-and-teachers"
  | "price"
  | "career-support"
  | "content-and-syllabus"
  | "job-guarantee"
  | "full-stack"
  | "cybersecurity"
  | "data-science"
  | "applied-ai"
  | "ai-engineering"
  | "outcomes"
  | "scholarships"
  | "rigobot"
  | "learnpack"
  | "certification";

export const AVAILABLE_RELATED_FEATURES: RelatedFeature[] = [
  "online-platform",
  "mentors-and-teachers",
  "price",
  "career-support",
  "content-and-syllabus",
  "job-guarantee",
  "full-stack",
  "cybersecurity",
  "data-science",
  "applied-ai",
  "ai-engineering",
  "outcomes",
  "scholarships",
  "rigobot",
  "learnpack",
  "certification",
];

export const MAX_RELATED_FEATURES = 3;

export interface FaqItem {
  question: string;
  answer: string;
  locations?: string[];
  related_features?: RelatedFeature[];
  last_updated?: string;
  priority?: number;
}

interface CentralizedFaqs {
  faqs: FaqItem[];
}

const faqsEn: CentralizedFaqs = {
  faqs: [
    {
      question: "Why 4Geeks Academy?",
      answer: "We offer several advantages that make us stand out from other coding bootcamps:\n- Unlimited mentorship: For life.\n- Coding-centric approach: We focus exclusively on coding.\n- Lifetime career support: We're here to help you throughout your career.\nYou can compare us to other bootcamps by visiting our Geeks Vs Others page.",
      locations: ["all"],
      related_features: ["mentors-and-teachers", "career-support"],
      priority: 3
    },
    {
      question: "Is 4Geeks a certified institution?",
      answer: "Absolutely! 4Geeks Academy is a licensed institution by the Commission for Independent Education of the Florida Department of Education. This ensures that our programs meet rigorous educational standards and provide you with a valuable credential upon completion.",
      locations: ["all"],
      related_features: ["certification"],
      priority: 2
    },
    {
      question: "Who is that face in the logo?",
      answer: "Meet Rigoberto! He is the heart and spirit of everyone working at 4Geeks Academy.",
      locations: ["all"],
      related_features: ["rigobot"],
      priority: 1
    },
    {
      question: "Is the certificate recognized by employers?",
      answer: "Yes! Our certificate is recognized by employers worldwide. We're licensed by the Florida Department of Education and have been featured by Forbes, Newsweek, and Course Report as one of the top coding bootcamps.",
      locations: ["all"],
      related_features: ["certification", "outcomes"],
      priority: 3
    },
    {
      question: "What is your admission process?",
      answer: "Our admission process begins with an email from one of our student counselors once you initiate the application. We'll assist you through each step. Upon receiving our email, simply reply to schedule a call at your convenience. Following the call, you'll be invited to an online or in-person interview.\nAdditionally, you're welcome to visit our campus to meet the team and explore our facilities. This is an opportunity to share your motivations for pursuing a career in development.",
      locations: ["all"],
      related_features: [],
      priority: 2
    },
    {
      question: "How many hours do I need to have available?",
      answer: "In order to excel in your chosen field, whether it's software development, data science, or cybersecurity, dedication is crucial across all our programs. For instance, in our Part-Time program, classes are scheduled for 3 hours a day, 3 times a week, requiring approximately 20-24 hours of study per week.\nAlternatively, our Full-Time program entails 8-hour classes each day, with an additional recommended study time of around 48 hours per week. Regardless of the specific program you choose, commitment to study and practice is essential for success.",
      locations: ["all"],
      related_features: ["content-and-syllabus"],
      priority: 2
    },
    {
      question: "What are the class schedules?",
      answer: "The schedules vary depending on the location.\nPart-time:\n1. Spain: Monday, Wednesday, and Friday from 6:30 PM to 9:30 PM or Tuesday and Thursday from 6:30 PM to 9:30 PM and Saturdays from 10:00 AM to 1:00 PM.\n2. Chile and the United States: Monday, Wednesday, and Friday from 6:30 PM to 9:30 PM or Tuesday and Thursday from 6:30 PM to 9:30 PM and Saturday from 9:00 AM to 12:00 PM.\n3. LATAM: Monday, Wednesday and Friday from 4:00 PM to 6:00 PM.\nFull-time: Monday to Friday from 9:00 AM to 6:00 PM.",
      locations: ["all"],
      related_features: ["content-and-syllabus"],
      priority: 2
    },
    {
      question: "GeekForce or GeekPal, which one to choose?",
      answer: "GeekForce and GeekPal are both valuable mentorship programs offered by 4Geeks Academy, and choosing between them depends on your current needs.\nGeekPal is ideal if you're looking for technical coaching, such as code debugging, problem-solving, and interview preparation. It's perfect for honing your technical skills and getting hands-on guidance.\nGeekForce, on the other hand, is focused on career coaching, including soft skills development, career advice, and resume building. This is a great choice if you're looking to enhance your employability and professional development.\nRemember, both services are unlimited and for life, so you can always switch or use both as your needs evolve throughout your career.",
      locations: ["all"],
      related_features: ["mentors-and-teachers", "career-support"],
      priority: 3
    },
    {
      question: "Why \"Part-time?\" and how does it work?",
      answer: "We believe that the future of education is \"part-time.\" Our approach is a blended education that leverages two proven formats: part-time training and flipped classroom. This methodology combines the following four pillars:\nFlipped Classroom: The theory is taught through videos, animation, images, and infographics. Class time is used to discuss, create and build projects, and to be mentored in solving practical exercises.\nPersonalized Mentoring: Each student has the opportunity to have private conversations with a lead mentor on a regular basis.\nMentor-Student Ratio 1:7 (on average): A close and personalized environment allows our academy to adapt to the particular pace of each student.\nTalent Tree: The curriculum charts 44 skills in which students earn points for each skill learned in a playful way.",
      locations: ["all"],
      related_features: ["content-and-syllabus", "mentors-and-teachers"],
      priority: 2
    },
    {
      question: "Why \"Full-time?\" and how does it work?",
      answer: "Our Full-Time program is perfect for those looking to rapidly advance their careers. This intensive program covers the most wanted and highest paid technologies, focusing on Python and JavaScript, the top programming languages of 2024. You'll start coding in web development languages, learn algorithm scripting, build apps with front-end libraries, and use APIs to consume data.\nThe program culminates in the presentation of your final project, preparing you for further web development experiences. Along the way, you'll reshape your mind to embrace new logical, developmental, and researching skills.\nDuration: 10 weeks\nClasses: 4 classes weekly\nRequisites: No previous coding skills or advanced math required\nLanguage: Choose between English and Spanish for the syllabus and content; live classes are taught in the language of your campus.",
      locations: ["all"],
      related_features: ["content-and-syllabus", "full-stack"],
      priority: 2
    },
    {
      question: "What is the difference between a Full-Stack program and other programs that are more junior such as Website Developer?",
      answer: "In the case of Website Developer, the curriculum includes: HTML, CSS, PHP, JavaScript, WordPress, API and more.\nNow, the Full Stack Software Development program is designed in four stages: Prework + Learn to code + Create websites + Create web applications.\nIt lasts 16 weeks and includes more than 300 hours of learning.\nThe technology stack here are: JavaScript, React, Python, Flask, API, AJAX, JWT, HTML, CSS, and more.\nWe will guide you and help you find a job after the course through our Placement Program.\nYou will have lifetime access to our learning platform Breatheco.de\nYou will be able to create and build websites, but you will get the skills and tools to tackle more challenging projects like: data analytics, machine learning and augmented reality, to name a few.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "Do I get a job after completing the program?",
      answer: "At 4Geeks Academy, we are dedicated to preparing you for the job market and supporting you in your job search after completing the program. While we cannot guarantee a job, we provide unlimited and lifelong technical and career support, including assistance with resume building, interview preparation, and access to our network of associated employers.\nAdditionally, according to our statistics, 84% of graduates in the US who complete the stages and requirements secure employment with an average salary over $50k per year. To understand more about our job support and the steps we take to help you succeed, visit our Job Guarantee page and learn about our comprehensive Geekforce Career Support program.",
      locations: ["all"],
      related_features: ["career-support", "job-guarantee", "outcomes"],
      priority: 3
    },
    {
      question: "How does the 4Geeks Academy Job Guarantee work?",
      answer: "Our Job Guarantee ensures that if you meet all program requirements and still don't get a qualifying tech job within 9 months of graduation, you are eligible for a full refund of your tuition. It's our way of backing the real-world outcomes our bootcamp delivers. Conditions apply.",
      locations: ["all"],
      related_features: ["job-guarantee", "outcomes"],
      priority: 3
    },
    {
      question: "Does the Job Guarantee refund the full tuition if I don't get hired?",
      answer: "Yes. If you qualify for the Job Guarantee and don't receive a qualifying job offer within the job search window, you'll receive a full tuition refund.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 3
    },
    {
      question: "How long do I have to look for a job before the refund is issued?",
      answer: "You'll have up to 9 months after graduating to secure qualifying employment. If you meet all requirements and are still not hired within that time, you can apply for a full refund.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "What kinds of jobs count toward the Job Guarantee?",
      answer: "Full-time or contract positions in tech (such as software development, QA, or related roles) qualify. Remote jobs and freelance positions may be eligible depending on terms.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "Is there a minimum salary for jobs that count?",
      answer: "There is no set salary threshold, but the job must be aligned with the skills taught in the program and be a legitimate entry-level tech role.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "What do I need to do to qualify for the Job Guarantee?",
      answer: "You must: Complete 100% of coursework and projects, attend sessions consistently, follow the steps our career services team advises, actively apply to jobs and document your search, and hold valid U.S. work authorization.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "Do I need to have work authorization to qualify?",
      answer: "Yes, you must have valid U.S. work authorization to be eligible for the Job Guarantee.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "Is attendance important for the Job Guarantee?",
      answer: "Yes, maintaining good attendance throughout the bootcamp is mandatory for eligibility.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 1
    },
    {
      question: "What coursework or projects must I complete?",
      answer: "You'll need to finish your final project in a satisfactory manner, plus all assigned coding projects, exercises, and coursework provided during the bootcamp.",
      locations: ["all"],
      related_features: ["job-guarantee", "content-and-syllabus"],
      priority: 1
    },
    {
      question: "What does it mean to follow the career team's guidance?",
      answer: "It includes completing your resume and portfolio according to our guidelines, participating in mock interviews, and applying to a minimum number of jobs weekly — all with the support of our career services team.",
      locations: ["all"],
      related_features: ["job-guarantee", "career-support"],
      priority: 1
    },
    {
      question: "Can I finance the additional $2,000 Job Guarantee fee with my tuition?",
      answer: "Yes, in many cases the Job Guarantee fee can be bundled into your overall tuition financing plan.",
      locations: ["all"],
      related_features: ["job-guarantee", "price"],
      priority: 1
    },
    {
      question: "Is the Job Guarantee available for all courses?",
      answer: "No — it is currently only available for select bootcamps, including the Full Stack Development program. Please check your program's eligibility.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "What's the average time it takes for 4Geeks grads to get hired?",
      answer: "Most 4Geeks Academy graduates find a job within 90 to 180 days of completing the bootcamp, depending on their location, dedication, and prior experience.",
      locations: ["all"],
      related_features: ["job-guarantee", "outcomes"],
      priority: 2
    },
    {
      question: "If I'm offered a contract job, does it count toward the guarantee?",
      answer: "Yes, contract jobs can qualify if they are relevant to the bootcamp training and meet our minimum standards for legitimacy and compensation.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 1
    },
    {
      question: "What prerequisites do I need for Full Stack Development?",
      answer: "No prior coding experience is required. Our program starts with the fundamentals and builds up to advanced full-stack development. We teach you everything from HTML basics to building complete web applications.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "How long does the Full Stack program take?",
      answer: "The Full Stack program is designed to be completed in 16 weeks. However, as a self-paced program, you can accelerate or take more time based on your schedule and learning pace.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What kind of projects will I build in Full Stack?",
      answer: "You'll build production-ready applications including REST APIs, authentication systems, React frontends, and a full capstone project. All projects use real-world technologies and patterns used by top companies.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "Do I need expensive equipment?",
      answer: "No! All exercises and projects run in the cloud. We provide access to cloud-based development environments, so you can learn with just a laptop and internet connection.",
      locations: ["all"],
      related_features: ["online-platform", "learnpack"],
      priority: 2
    },
    {
      question: "Do I need prior cybersecurity experience?",
      answer: "No prior experience is required. Our bootcamp starts with the fundamentals and teaches you everything from scratch. We focus on building a strong foundation before moving to advanced concepts like penetration testing and incident response.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What cybersecurity tools will I learn to use?",
      answer: "You'll gain hands-on experience with industry-standard tools including Nessus, Nmap, Wireshark, Metasploit, and more. These are the same tools used by security professionals at top companies worldwide.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "Will this prepare me for certifications?",
      answer: "Yes! Our program puts you on the fast track for certifications like EJPT and CEH. Our pen-testing practices are specifically aligned with EJPT certification labs to give you the hands-on experience you need.",
      locations: ["all"],
      related_features: ["cybersecurity", "certification"],
      priority: 2
    },
    {
      question: "How long is the cybersecurity program?",
      answer: "The program is 16 weeks with 3 live online classes per week. Class sizes are kept small (max 15 people) to ensure personalized attention and hands-on guidance.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "Do I need prior experience with data or coding?",
      answer: "No prior experience is required. Our bootcamp starts with Python fundamentals and teaches you everything from scratch. We focus on building a strong foundation before moving to advanced machine learning concepts.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What tools and technologies will I learn in Data Science?",
      answer: "You'll master Python, Jupyter Notebooks, Pandas, NumPy, Matplotlib, Seaborn, SQL, Scikit-learn, TensorFlow, Keras, and Flask. These are the industry-standard tools used by data scientists and ML engineers worldwide.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "How do I stay motivated learning on my own?",
      answer: "You're never truly alone! Our AI tools provide instant feedback, you have access to mentorship sessions, and our active community of learners is always available for support and collaboration. Many students find this combination keeps them more engaged than traditional classes.",
      locations: ["all"],
      related_features: ["data-science", "mentors-and-teachers", "rigobot"],
      priority: 2
    },
    {
      question: "How long does it take to complete the Data Science program?",
      answer: "The self-paced program can be completed in as little as 16 weeks with dedicated study. However, you have lifetime access to all materials and can learn at your own pace—whether that's 30 minutes a day or intensive weekend sessions.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What prerequisites do I need for AI Engineering?",
      answer: "Basic programming knowledge is recommended but not required. Our program starts with foundational concepts and builds up to advanced AI engineering. If you're new to coding, we have preparatory materials to help you get started.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "How long does the AI Engineering program take?",
      answer: "The AI Engineering program is designed to be completed in 20 weeks. However, as a self-paced program, you can accelerate or take more time based on your schedule and learning pace.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What kind of projects will I build in AI Engineering?",
      answer: "You'll build production-ready AI applications including RAG systems, multi-agent orchestrators, real-time AI applications, and a full capstone project. All projects use real-world technologies and patterns used by top companies.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "Do I need expensive hardware for AI development?",
      answer: "No! All exercises and projects run in the cloud. We provide access to cloud-based development environments and AI APIs, so you can learn with just a laptop and internet connection.",
      locations: ["all"],
      related_features: ["ai-engineering", "online-platform"],
      priority: 2
    },
    {
      question: "Do I need any technical background?",
      answer: "No previous experience is required. This course is designed for professionals from all backgrounds who want to leverage AI in their work. We start with the fundamentals and build from there.",
      locations: ["all"],
      related_features: ["applied-ai", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "What tools will I learn to use?",
      answer: "You'll get hands-on experience with generative models like ChatGPT, Gemini, and Claude, as well as modern image and video tools like Midjourney and DALL-E. You'll also learn no-code automation tools like Zapier.",
      locations: ["all"],
      related_features: ["applied-ai", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "How are the live classes structured?",
      answer: "Classes are held twice a week online with a maximum of 12 students per cohort. This ensures personalized attention and the ability to get your questions answered in real-time.",
      locations: ["all"],
      related_features: ["applied-ai", "mentors-and-teachers"],
      priority: 2
    },
    {
      question: "What kind of support is available?",
      answer: "You'll have access to unlimited 1:1 mentorship sessions, our AI tutor Rigobot for instant feedback, and a supportive community of fellow professionals learning alongside you.",
      locations: ["all"],
      related_features: ["applied-ai", "mentors-and-teachers", "rigobot"],
      priority: 2
    }
  ]
};

const faqsEs: CentralizedFaqs = {
  faqs: [
    {
      question: "¿Por qué 4Geeks Academy?",
      answer: "¿Qué nos diferencia de otros bootcamps de programación? Ofrecemos varias ventajas que nos destacan:\n- Mentorías ilimitadas (de por vida)\n- Enfoque centrado exclusivamente en la codificación\n- Apoyo profesional de por vida\nEn 4Geeks Academy, integramos herramientas de inteligencia artificial desarrolladas por nosotros en nuestro enfoque educativo, haciendo que aprender a programar sea divertido y relevante para la vida cotidiana.",
      locations: ["all"],
      related_features: ["mentors-and-teachers", "career-support", "rigobot"],
      priority: 3
    },
    {
      question: "¿Es 4Geeks una institución certificada?",
      answer: "¡Absolutamente! 4Geeks Academy es una institución licenciada por la Comisión de Educación Independiente del Departamento de Educación de Florida. Esto asegura que nuestros programas cumplen con rigurosos estándares educativos y te proporcionan una credencial valiosa al completar.",
      locations: ["all"],
      related_features: ["certification"],
      priority: 2
    },
    {
      question: "¿Qué diferencia cada uno de nuestros campus?",
      answer: "El panorama laboral y tecnológico varía significativamente en cada país, y por eso en 4Geeks Academy contamos con equipos locales en cada una de nuestras sedes. Estos equipos desarrollan alianzas con empresas locales y adaptan la formación a las necesidades específicas del mercado laboral de cada región. Te aconsejamos estudiar en la sede del país donde deseas desarrollarte profesionalmente.",
      locations: ["all"],
      related_features: ["career-support"],
      priority: 2
    },
    {
      question: "¿Quién es esa cara en el logo?",
      answer: "¡Conoce a Rigoberto! Él es el corazón y el espíritu de todos los que trabajamos en 4Geeks Academy.",
      locations: ["all"],
      related_features: ["rigobot"],
      priority: 1
    },
    {
      question: "¿El certificado es reconocido por empleadores?",
      answer: "¡Sí! Nuestro certificado es reconocido por empleadores en todo el mundo. Estamos licenciados por el Departamento de Educación de Florida y hemos sido destacados por Forbes, Newsweek y Course Report como uno de los mejores bootcamps de programación.",
      locations: ["all"],
      related_features: ["certification", "outcomes"],
      priority: 3
    },
    {
      question: "¿Cómo me inscribo?",
      answer: "Para inscribirte en 4Geeks Academy, sigue estos sencillos pasos:\n1. Accede al formulario de solicitud en nuestra página.\n2. Completa el formulario con tus datos personales y selecciona el programa de tu interés.\n3. Envía el formulario para formalizar tu solicitud.\nDespués de enviar el formulario, recibirás información detallada sobre el programa seleccionado. Además, nuestro equipo de especialistas en carrera está disponible para responder cualquier pregunta que tengas.",
      locations: ["all"],
      related_features: [],
      priority: 3
    },
    {
      question: "¿Cuál es el proceso de admisión?",
      answer: "Nuestro proceso de admisión es sencillo y está diseñado para apoyarte en cada paso:\n1. Solicitud Inicial: Una vez que inicias la solicitud, recibirás un correo electrónico de uno de nuestros asesores estudiantiles.\n2. Programación de la Llamada: Responde al correo electrónico para programar una llamada a tu conveniencia.\n3. Entrevista: Durante la llamada, serás invitado a una entrevista en línea o presencial.\n4. Visita al Campus: Te invitamos a visitar nuestro campus para conocer al equipo y explorar nuestras instalaciones.",
      locations: ["all"],
      related_features: [],
      priority: 2
    },
    {
      question: "¿Necesito tener mi propia laptop/portátil/notebook?",
      answer: "Sí, tener tu propia laptop es esencial para nuestras clases. Aunque no exigimos un sistema operativo específico para la mayoría de los programas, se recomienda tener una laptop con Windows, macOS o Linux instalado.\nSin embargo, para el programa de ciberseguridad, es altamente recomendable contar con una laptop con sistema operativo Windows o Linux debido a la naturaleza de los materiales del curso y las herramientas utilizadas.\nLas clases y ejercicios de todos los programas se acceden a través de la nube.",
      locations: ["all"],
      related_features: ["online-platform"],
      priority: 2
    },
    {
      question: "¿4Geeks Academy ofrece apoyo profesional?",
      answer: "¡Sí! En 4Geeks Academy ofrecemos apoyo profesional para ayudarte a alcanzar tus objetivos laborales. Nuestro plan de apoyo profesional ilimitado forma parte de nuestro programa Geekforce. Tendrás acceso ilimitado a sesiones profesionales individuales y grupales, donde te equiparemos con todas las herramientas necesarias para conseguir un trabajo.\nEsto incluye optimizar tu currículum vitae, perfiles de LinkedIn y GitHub, conectarte con eventos y nuestra red de contratación, y prepararte para entrevistas técnicas y conductuales.",
      locations: ["all"],
      related_features: ["career-support", "mentors-and-teachers"],
      priority: 3
    },
    {
      question: "¿Puedo pagar después de conseguir un trabajo?",
      answer: "En 4Geeks Academy, ofrecemos opciones de pago como planes de matrícula diferida, que te permiten pagar después de conseguir empleo.\nEstos modelos están diseñados para apoyar tu trayectoria de aprendizaje, permitiéndote centrarte en la educación antes de empezar a pagar una vez que estés empleado. Sin embargo, los términos y condiciones varían según el programa y la ubicación que elijas.",
      locations: ["all"],
      related_features: ["price", "scholarships"],
      priority: 2
    },
    {
      question: "¿Cuántas horas necesito tener disponibles?",
      answer: "Para sobresalir en el campo que elijas, ya sea desarrollo de software, ciencia de datos o ciberseguridad, la dedicación es crucial en todos nuestros programas. Por ejemplo, en nuestro programa Part-Time, las clases están programadas por 3 horas al día, 3 veces a la semana, requiriendo aproximadamente 20-24 horas de estudio por semana.\nAlternativamente, nuestro programa Full-Time implica clases de 8 horas cada día, con un tiempo de estudio adicional recomendado de alrededor de 48 horas por semana.",
      locations: ["all"],
      related_features: ["content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Cuáles son los horarios de clase?",
      answer: "Los horarios varían dependiendo de la ubicación.\nPart-time:\n1. España: Lunes, Miércoles y Viernes de 6:30 PM a 9:30 PM o Martes y Jueves de 6:30 PM a 9:30 PM y Sábados de 10:00 AM a 1:00 PM.\n2. Chile y Estados Unidos: Lunes, Miércoles y Viernes de 6:30 PM a 9:30 PM o Martes y Jueves de 6:30 PM a 9:30 PM y Sábado de 9:00 AM a 12:00 PM.\n3. LATAM: Lunes, Miércoles y Viernes de 4:00 PM a 6:00 PM.\nFull-time: Lunes a Viernes de 9:00 AM a 6:00 PM.",
      locations: ["all"],
      related_features: ["content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿GeekForce o GeekPal, cuál elegir?",
      answer: "GeekForce y GeekPal son programas de mentoría valiosos ofrecidos por 4Geeks Academy, y elegir entre ellos depende de tus necesidades actuales.\nGeekPal es ideal si buscas coaching técnico, como depuración de código, resolución de problemas y preparación para entrevistas. Es perfecto para perfeccionar tus habilidades técnicas.\nGeekForce, por otro lado, se enfoca en coaching de carrera, incluyendo desarrollo de habilidades blandas, consejos de carrera y construcción de currículum.\nRecuerda, ambos servicios son ilimitados y de por vida.",
      locations: ["all"],
      related_features: ["mentors-and-teachers", "career-support"],
      priority: 3
    },
    {
      question: "¿Por qué \"Part-time?\" y cómo funciona?",
      answer: "Creemos que el futuro de la educación es \"part-time\". Nuestro enfoque es una educación combinada que aprovecha dos formatos probados: capacitación part-time y aula invertida. Esta metodología combina los siguientes cuatro pilares:\nAula Invertida: La teoría se enseña a través de videos, animación, imágenes e infografías. El tiempo de clase se usa para discutir, crear y construir proyectos.\nMentoría Personalizada: Cada estudiante tiene la oportunidad de tener conversaciones privadas con un mentor principal regularmente.\nRatio Mentor-Estudiante 1:7 (en promedio): Un ambiente cercano y personalizado.\nÁrbol de Talentos: El currículo traza 44 habilidades en las que los estudiantes ganan puntos de manera lúdica.",
      locations: ["all"],
      related_features: ["content-and-syllabus", "mentors-and-teachers"],
      priority: 2
    },
    {
      question: "¿Por qué \"Full-time?\" y cómo funciona?",
      answer: "Nuestro programa Full-Time es perfecto para aquellos que buscan avanzar rápidamente en sus carreras. Este programa intensivo cubre las tecnologías más buscadas y mejor pagadas, enfocándose en Python y JavaScript.\nDuración: 10 semanas\nClases: 4 clases semanales\nRequisitos: No se requieren habilidades de programación previas ni matemáticas avanzadas\nIdioma: Elige entre inglés y español para el plan de estudios y contenido.",
      locations: ["all"],
      related_features: ["content-and-syllabus", "full-stack"],
      priority: 2
    },
    {
      question: "¿Cuál es la diferencia entre un programa Full-Stack y otros programas más junior como Desarrollador Web?",
      answer: "En el caso de Desarrollador Web, el currículo incluye: HTML, CSS, PHP, JavaScript, WordPress, API y más.\nAhora, el programa de Desarrollo de Software Full Stack está diseñado en cuatro etapas: Prework + Aprende a programar + Crea sitios web + Crea aplicaciones web.\nDura 16 semanas e incluye más de 300 horas de aprendizaje.\nEl stack tecnológico incluye: JavaScript, React, Python, Flask, API, AJAX, JWT, HTML, CSS, y más.\nTe guiaremos y ayudaremos a encontrar trabajo después del curso a través de nuestro Programa de Colocación.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Necesito experiencia previa en programación para inscribirme en el programa?",
      answer: "No, no necesitas experiencia previa en programación para inscribirte en nuestro programa. Solo necesitas tener ganas de aprender. Si sabes cómo abrir un navegador y revisar tu Facebook, ¡entonces estás listo para empezar!\nLa programación es una habilidad que todos pueden aprender con dedicación y práctica. En 4Geeks Academy, te ayudaremos a descubrir y desarrollar tu talento para la programación con el apoyo de nuestra herramienta de inteligencia artificial y mentorías ilimitadas en cada etapa del proceso.",
      locations: ["all"],
      related_features: ["content-and-syllabus"],
      priority: 3
    },
    {
      question: "¿Por qué Javascript?",
      answer: "JavaScript es esencial para la web, es el único lenguaje que todos los navegadores web entienden y es el lenguaje de programación más utilizado en el mundo. Todos los sitios web lo necesitan, y es el más demandado por las empresas, superando diez veces al siguiente lenguaje más popular.",
      locations: ["all"],
      related_features: ["content-and-syllabus", "full-stack"],
      priority: 1
    },
    {
      question: "¿Por qué Python?",
      answer: "Python es el lenguaje de más rápido crecimiento en los países más ricos. Se usa ampliamente en prácticamente todas las industrias y tiene bibliotecas de alta calidad para todos los campos que crecen para ser el futuro: Web, IA, Robótica, Big Data, etc. Según profesores del MIT, es el lenguaje de programación esencial para aprender.\nTiene que ser Python. Encontrarás más oportunidades laborales, aprenderás a programar y te ayudará con otros lenguajes y frameworks. ¡Incluso Google aprobó Python y lo ha incorporado en todas partes!",
      locations: ["all"],
      related_features: ["content-and-syllabus", "data-science", "applied-ai"],
      priority: 1
    },
    {
      question: "¿Me gradúo como Senior Developer?",
      answer: "No. Por favor, no corras antes de aprender a caminar. La programación es como la vida: si eres bueno en eso, aprenderás más rápido, pero no al instante.\nHacer nuestro programa Full Stack significa que tu vida tendrá una nueva habilidad, pero también desarrollará una nueva forma de pensar. Te gradúas como Desarrollador Junior, pero como un Desarrollador Junior REALMENTE BUENO.",
      locations: ["all"],
      related_features: ["outcomes"],
      priority: 1
    },
    {
      question: "¿Consigo trabajo después de completar el programa?",
      answer: "En 4Geeks Academy, estamos dedicados a prepararte para el mercado laboral y apoyarte en tu búsqueda de empleo después de completar el programa. Aunque no podemos garantizar un trabajo, proporcionamos apoyo técnico y de carrera ilimitado y de por vida, incluyendo asistencia con la construcción de currículum, preparación para entrevistas y acceso a nuestra red de empleadores asociados.\nSegún nuestras estadísticas, el 84% de los graduados en EE.UU. que completan las etapas y requisitos consiguen empleo con un salario promedio superior a $50k por año.",
      locations: ["all"],
      related_features: ["career-support", "job-guarantee", "outcomes"],
      priority: 3
    },
    {
      question: "¿Cómo es el panorama laboral y qué oportunidades existen para los desarrolladores?",
      answer: "El futuro para los desarrolladores de software es muy prometedor, con un crecimiento proyectado del empleo de un 25% entre 2022 y 2032, según el Bureau of Labor Statistics. Este aumento se atribuye a la continua digitalización de las industrias.",
      locations: ["all"],
      related_features: ["outcomes", "career-support"],
      priority: 2
    },
    {
      question: "¿Cómo es el mercado para las empresas que buscan desarrolladores?",
      answer: "El mercado para las empresas que buscan desarrolladores está en constante crecimiento. Según el IDC, se proyecta que entre 2020 y 2025 se necesitarán 10.5 millones de profesionales en tecnología a nivel mundial. Actualmente, en Estados Unidos hay más de 1.4 millones de puestos de trabajo de programación abiertos, y se espera que este número aumente. En Latinoamérica, se estima que se necesitarán alrededor de 1.2 millones de profesionales para cubrir la demanda en el sector tecnológico.",
      locations: ["all"],
      related_features: ["outcomes", "career-support"],
      priority: 2
    },
    {
      question: "¿Cómo funciona la Garantía de Empleo de 4Geeks Academy?",
      answer: "Nuestra Garantía de Empleo asegura que si cumples todos los requisitos del programa y aún no consigues un trabajo tech calificado en 9 meses después de graduarte, eres elegible para un reembolso completo de tu matrícula. Aplican condiciones.",
      locations: ["all"],
      related_features: ["job-guarantee", "outcomes"],
      priority: 3
    },
    {
      question: "¿La Garantía de Empleo reembolsa la matrícula completa si no me contratan?",
      answer: "Sí. Si calificas para la Garantía de Empleo y no recibes una oferta de trabajo calificada dentro del período de búsqueda, recibirás un reembolso completo.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 3
    },
    {
      question: "¿Cuánto tiempo tengo para buscar trabajo antes de recibir el reembolso?",
      answer: "Tendrás hasta 9 meses después de graduarte para conseguir empleo calificado. Si cumples todos los requisitos y aún no te contratan, puedes solicitar un reembolso completo.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿Qué tipos de trabajos cuentan para la Garantía de Empleo?",
      answer: "Posiciones de tiempo completo o contrato en tech (como desarrollo de software, QA o roles relacionados) califican. Trabajos remotos y freelance pueden ser elegibles según los términos.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿Hay un salario mínimo para los trabajos que cuentan?",
      answer: "No hay un umbral de salario establecido, pero el trabajo debe estar alineado con las habilidades enseñadas en el programa y ser un rol tech legítimo de nivel inicial.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿Qué necesito hacer para calificar para la Garantía de Empleo?",
      answer: "Debes: Completar 100% del trabajo del curso y proyectos, asistir a sesiones consistentemente, seguir los pasos que nuestro equipo de carrera aconseja, aplicar activamente a trabajos y documentar tu búsqueda, y tener autorización de trabajo válida en EE.UU.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿Necesito tener autorización de trabajo para calificar?",
      answer: "Sí, debes tener autorización de trabajo válida en EE.UU. para ser elegible para la Garantía de Empleo.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿La asistencia es importante para la Garantía de Empleo?",
      answer: "Sí, mantener buena asistencia durante todo el bootcamp es obligatorio para la elegibilidad.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 1
    },
    {
      question: "¿Qué trabajo del curso o proyectos debo completar?",
      answer: "Necesitarás terminar tu proyecto final de manera satisfactoria, más todos los proyectos de coding asignados, ejercicios y trabajo del curso durante el bootcamp.",
      locations: ["all"],
      related_features: ["job-guarantee", "content-and-syllabus"],
      priority: 1
    },
    {
      question: "¿Qué significa seguir la guía del equipo de carrera?",
      answer: "Incluye completar tu CV y portafolio según nuestras guías, participar en entrevistas simuladas y aplicar a un número mínimo de trabajos semanalmente — todo con apoyo de nuestro equipo de servicios de carrera.",
      locations: ["all"],
      related_features: ["job-guarantee", "career-support"],
      priority: 1
    },
    {
      question: "¿Puedo financiar la tarifa adicional de $2,000 de Garantía de Empleo con mi matrícula?",
      answer: "Sí, en muchos casos la tarifa de Garantía de Empleo puede incluirse en tu plan de financiamiento de matrícula.",
      locations: ["all"],
      related_features: ["job-guarantee", "price"],
      priority: 1
    },
    {
      question: "¿La Garantía de Empleo está disponible para todos los cursos?",
      answer: "No — actualmente solo está disponible para bootcamps selectos, incluyendo el programa de Desarrollo Full Stack. Por favor verifica la elegibilidad de tu programa.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 2
    },
    {
      question: "¿Cuál es el tiempo promedio que toma a los graduados de 4Geeks conseguir empleo?",
      answer: "La mayoría de graduados de 4Geeks Academy encuentran trabajo dentro de 90 a 180 días de completar el bootcamp, dependiendo de su ubicación, dedicación y experiencia previa.",
      locations: ["all"],
      related_features: ["job-guarantee", "outcomes"],
      priority: 2
    },
    {
      question: "Si me ofrecen un trabajo por contrato, ¿cuenta para la garantía?",
      answer: "Sí, trabajos por contrato pueden calificar si son relevantes al entrenamiento del bootcamp y cumplen nuestros estándares mínimos de legitimidad y compensación.",
      locations: ["all"],
      related_features: ["job-guarantee"],
      priority: 1
    },
    {
      question: "¿Qué requisitos previos necesito para Desarrollo Full Stack?",
      answer: "No se requiere experiencia previa en programación. Nuestro programa comienza con los fundamentos y avanza hasta desarrollo full-stack avanzado. Te enseñamos todo desde lo básico de HTML hasta construir aplicaciones web completas.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Cuánto tiempo dura el programa Full Stack?",
      answer: "El programa Full Stack está diseñado para completarse en 16 semanas. Sin embargo, como programa a tu ritmo, puedes acelerar o tomar más tiempo según tu horario y ritmo de aprendizaje.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué tipo de proyectos construiré en Full Stack?",
      answer: "Construirás aplicaciones listas para producción incluyendo APIs REST, sistemas de autenticación, frontends en React y un proyecto final completo. Todos los proyectos usan tecnologías y patrones del mundo real utilizados por las principales empresas.",
      locations: ["all"],
      related_features: ["full-stack", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Necesito equipo costoso?",
      answer: "¡No! Todos los ejercicios y proyectos se ejecutan en la nube. Proporcionamos acceso a entornos de desarrollo en la nube, así que puedes aprender solo con una laptop y conexión a internet.",
      locations: ["all"],
      related_features: ["online-platform", "learnpack"],
      priority: 2
    },
    {
      question: "¿Necesito experiencia previa en ciberseguridad?",
      answer: "No se requiere experiencia previa. Nuestro bootcamp comienza con los fundamentos y te enseña todo desde cero. Nos enfocamos en construir una base sólida antes de pasar a conceptos avanzados como pruebas de penetración y respuesta a incidentes.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué herramientas de ciberseguridad aprenderé a usar?",
      answer: "Obtendrás experiencia práctica con herramientas estándar de la industria incluyendo Nessus, Nmap, Wireshark, Metasploit y más. Estas son las mismas herramientas usadas por profesionales de seguridad en las mejores empresas del mundo.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Esto me preparará para certificaciones?",
      answer: "¡Sí! Nuestro programa te pone en la vía rápida para certificaciones como EJPT y CEH. Nuestras prácticas de pentesting están específicamente alineadas con los laboratorios de certificación EJPT para darte la experiencia práctica que necesitas.",
      locations: ["all"],
      related_features: ["cybersecurity", "certification"],
      priority: 2
    },
    {
      question: "¿Cuánto dura el programa de ciberseguridad?",
      answer: "El programa es de 16 semanas con 3 clases en línea en vivo por semana. Los tamaños de clase se mantienen pequeños (máximo 15 personas) para asegurar atención personalizada y orientación práctica.",
      locations: ["all"],
      related_features: ["cybersecurity", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Necesito experiencia previa con datos o programación?",
      answer: "No se requiere experiencia previa. Nuestro bootcamp comienza con fundamentos de Python y te enseña todo desde cero. Nos enfocamos en construir una base sólida antes de pasar a conceptos avanzados de machine learning.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué herramientas y tecnologías aprenderé en Ciencia de Datos?",
      answer: "Dominarás Python, Jupyter Notebooks, Pandas, NumPy, Matplotlib, Seaborn, SQL, Scikit-learn, TensorFlow, Keras y Flask. Estas son las herramientas estándar de la industria usadas por científicos de datos e ingenieros de ML en todo el mundo.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Cómo me mantengo motivado aprendiendo por mi cuenta?",
      answer: "¡Nunca estás realmente solo! Nuestras herramientas de IA proporcionan retroalimentación instantánea, tienes acceso a sesiones de mentoría, y nuestra comunidad activa de estudiantes siempre está disponible para apoyo y colaboración. Muchos estudiantes encuentran que esta combinación los mantiene más comprometidos que las clases tradicionales.",
      locations: ["all"],
      related_features: ["data-science", "mentors-and-teachers", "rigobot"],
      priority: 2
    },
    {
      question: "¿Cuánto tiempo toma completar el programa de Ciencia de Datos?",
      answer: "El programa a tu ritmo puede completarse en tan solo 16 semanas con estudio dedicado. Sin embargo, tienes acceso de por vida a todos los materiales y puedes aprender a tu propio ritmo, ya sean 30 minutos al día o sesiones intensivas de fin de semana.",
      locations: ["all"],
      related_features: ["data-science", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué requisitos previos necesito para Ingeniería de IA?",
      answer: "Se recomienda conocimiento básico de programación pero no es obligatorio. Nuestro programa comienza con conceptos fundamentales y avanza hasta ingeniería de IA avanzada. Si eres nuevo en programación, tenemos materiales preparatorios para ayudarte a comenzar.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Cuánto tiempo dura el programa de Ingeniería de IA?",
      answer: "El programa de Ingeniería de IA está diseñado para completarse en 20 semanas. Sin embargo, como programa a tu ritmo, puedes acelerar o tomar más tiempo según tu horario y ritmo de aprendizaje.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué tipo de proyectos construiré en Ingeniería de IA?",
      answer: "Construirás aplicaciones de IA listas para producción incluyendo sistemas RAG, orquestadores multi-agente, aplicaciones de IA en tiempo real y un proyecto final completo. Todos los proyectos usan tecnologías y patrones del mundo real utilizados por las principales empresas.",
      locations: ["all"],
      related_features: ["ai-engineering", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Necesito hardware costoso para desarrollo de IA?",
      answer: "¡No! Todos los ejercicios y proyectos se ejecutan en la nube. Proporcionamos acceso a entornos de desarrollo en la nube y APIs de IA, así que puedes aprender solo con una laptop y conexión a internet.",
      locations: ["all"],
      related_features: ["ai-engineering", "online-platform"],
      priority: 2
    },
    {
      question: "¿Necesito algún trasfondo técnico?",
      answer: "No se requiere experiencia previa. Este curso está diseñado para profesionales de todos los trasfondos que quieren aprovechar la IA en su trabajo. Comenzamos con los fundamentos y construimos desde ahí.",
      locations: ["all"],
      related_features: ["applied-ai", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Qué herramientas aprenderé a usar?",
      answer: "Obtendrás experiencia práctica con modelos generativos como ChatGPT, Gemini y Claude, así como herramientas modernas de imagen y video como Midjourney y DALL-E. También aprenderás herramientas de automatización sin código como Zapier.",
      locations: ["all"],
      related_features: ["applied-ai", "content-and-syllabus"],
      priority: 2
    },
    {
      question: "¿Cómo están estructuradas las clases en vivo?",
      answer: "Las clases se realizan dos veces por semana en línea con un máximo de 12 estudiantes por cohorte. Esto asegura atención personalizada y la capacidad de obtener respuestas a tus preguntas en tiempo real.",
      locations: ["all"],
      related_features: ["applied-ai", "mentors-and-teachers"],
      priority: 2
    },
    {
      question: "¿Qué tipo de apoyo está disponible?",
      answer: "Tendrás acceso a sesiones de mentoría 1:1 ilimitadas, nuestro tutor de IA Rigobot para retroalimentación instantánea, y una comunidad de apoyo de compañeros profesionales aprendiendo junto a ti.",
      locations: ["all"],
      related_features: ["applied-ai", "mentors-and-teachers", "rigobot"],
      priority: 2
    }
  ]
};

export const centralizedFaqs = {
  en: faqsEn,
  es: faqsEs
};

export interface SimpleFaq {
  question: string;
  answer: string;
}

export interface FilterFaqsOptions {
  relatedFeatures?: string[];
  location?: string;
  minPriority?: number;
  limit?: number;
}

export function filterFaqsByRelatedFeatures(
  faqs: FaqItem[],
  options: FilterFaqsOptions = {}
): SimpleFaq[] {
  const { relatedFeatures, location, minPriority, limit } = options;
  let filtered = faqs;

  if (location) {
    filtered = filtered.filter((faq) => {
      const locations = faq.locations || ["all"];
      return locations.includes("all") || locations.includes(location);
    });
  }

  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.filter((faq) => {
      const faqFeatures = faq.related_features || [];
      return relatedFeatures.some((feature) => faqFeatures.includes(feature as RelatedFeature));
    });
  }

  if (minPriority !== undefined) {
    filtered = filtered.filter((faq) => (faq.priority ?? 0) >= minPriority);
  }

  // Sort by: 1) number of matching related_features (descending), 2) priority (descending)
  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aFeatures = a.related_features || [];
      const bFeatures = b.related_features || [];
      const aMatchCount = relatedFeatures.filter((f) => aFeatures.includes(f as RelatedFeature)).length;
      const bMatchCount = relatedFeatures.filter((f) => bFeatures.includes(f as RelatedFeature)).length;
      
      // First sort by match count (more matches = higher priority)
      if (bMatchCount !== aMatchCount) {
        return bMatchCount - aMatchCount;
      }
      // Then by priority
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
  } else {
    filtered = filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  if (limit !== undefined && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return filtered.map(({ question, answer }) => ({ question, answer }));
}
