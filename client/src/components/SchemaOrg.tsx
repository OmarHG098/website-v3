import { useEffect } from 'react';

interface SchemaOrgProps {
  type: 'organization' | 'website' | 'educational';
  data?: Record<string, any>;
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
  useEffect(() => {
    const schemas: Record<string, any> = {
      organization: {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "The AI Reskilling Platform",
        "description": "AI-powered learning platform for tech skills and career transformation",
        "url": "https://ai-reskilling-platform.replit.app",
        "logo": "https://ai-reskilling-platform.replit.app/favicon.png",
        "sameAs": [],
        "areaServed": "Worldwide",
        "educationalCredentialAwarded": "Certificate",
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Certificate"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.5,
          "ratingCount": 2500,
          "bestRating": 5,
          "worstRating": 1
        }
      },
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "The AI Reskilling Platform",
        "url": "https://ai-reskilling-platform.replit.app",
        "description": "Transform your career with AI-powered learning. Master coding, data science, and tech skills.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://ai-reskilling-platform.replit.app/career-programs?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      educational: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "Course",
            "position": 1,
            "name": "Full Stack Development",
            "description": "Master frontend and backend development with modern frameworks"
          },
          {
            "@type": "Course",
            "position": 2,
            "name": "Data Science & AI",
            "description": "Learn data analysis, machine learning, and AI fundamentals"
          },
          {
            "@type": "Course",
            "position": 3,
            "name": "Cloud Computing",
            "description": "Deploy and scale applications on cloud platforms"
          }
        ]
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(schemas[type]);
    document.head.appendChild(schemaScript);

    return () => {
      document.head.removeChild(schemaScript);
    };
  }, [type, data]);

  return null;
}
