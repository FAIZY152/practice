const testimonials = [
  { name: "Joel", role: "Software Engineer" },
  { name: "Antonio", role: "Designer" },
  { name: "Mark", role: "CEO" },
  { name: "Mary", role: "CFO" },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-[#1a1d27] p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h3 className="text-white font-medium">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-300">
              The AI capabilities are impressive. It has significantly improved
              our workflow.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
