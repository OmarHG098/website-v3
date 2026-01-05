import { Testimonials } from '../testimonials/Testimonials';

export default function TestimonialsSectionExample() {
  return (
    <div className="bg-background">
      <Testimonials
        data={{
          type: "testimonials",
          variant: "carousel",
          title: "What Our Students Say",
          subtitle: "Real stories from graduates who transformed their careers",
          rating_summary: {
            average: "4.9",
            count: "2,847"
          },
          items: [
            {
              name: "Sarah Johnson",
              role: "Software Engineer",
              company: "Google",
              rating: 5,
              comment: "This course completely transformed my career. The instructors are incredibly knowledgeable and the curriculum is perfectly structured.",
              outcome: "Hired in 4 months"
            },
            {
              name: "Michael Chen",
              role: "Data Analyst",
              company: "Meta",
              rating: 5,
              comment: "Best investment I ever made. Got a job offer before even finishing the program!",
              outcome: "+55% salary increase"
            },
            {
              name: "Emily Rodriguez",
              role: "ML Engineer",
              company: "Amazon",
              rating: 4,
              comment: "Excellent content and great support from mentors. The projects were challenging but rewarding.",
              outcome: "Career change success"
            }
          ]
        }}
      />
    </div>
  );
}
