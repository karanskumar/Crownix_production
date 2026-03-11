import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface DifferencePoint {
  number: number;
  title: string;
  tagline: string;
  description: string[];
}

const differencePoints: DifferencePoint[] = [
  {
    number: 1,
    title: 'Architectural Presence & Luxury Impact',
    tagline: 'Built to perform financially \u2014 designed to impress emotionally.',
    description: [
      'Crownix homes are not generic project builds. Every fa\u00e7ade, material selection, and internal finish is curated to create architectural presence and lasting visual impact.',
      'We prioritise:\n\u2022 Street appeal that commands attention\n\u2022 Timeless architectural styling\n\u2022 Premium material palettes\n\u2022 Cohesive interior design schemes\n\u2022 Layouts that feel expansive, not compressed',
      'The result is a home that feels custom \u2014 not catalogue.',
      'Whether owner-occupied or investment, each property delivers a luxury impression that enhances resale positioning, tenant demand, and long-term desirability.',
      'Why this matters: Emotion drives buying decisions. Luxury design protects value and elevates returns.',
    ],
  },
  {
    number: 2,
    title: 'Elite Acquisitions in High-Demand Locations',
    tagline: 'We go where competition is fiercest \u2014 because that\u2019s where long-term value lives.',
    description: [
      'Crownix exclusively secures properties in high-demand, supply-constrained locations. These markets are the most competitive in Australia, requiring significantly more work, deeper relationships, and faster execution to secure stock.',
      'While many developers, builders and agents rely on easy-to-sell stock lists or low-demand estates with long holding periods, Crownix competes head-to-head with thousands of developers, builders, buyer\u2019s agents, and investors nationally \u2014 all targeting the same limited opportunities.',
      'Why this matters: More work for us means better locations, stronger demand, and superior outcomes for our clients.',
    ],
  },
  {
    number: 3,
    title: 'Genuine Off-Market & Pre-Release Access',
    tagline: 'Opportunities before the public \u2014 and often before the market even knows.',
    description: [
      'Through long-standing relationships with developers, land bankers, government bodies and industry partners, Crownix gains access to off-market and pre-release opportunities not advertised to the general public.',
      'Clients benefit from:\n\u2022 Reduced competition\n\u2022 Better lot selection\n\u2022 Early positioning ahead of price increases',
      'Why this matters: You\u2019re buying before demand peaks, not after.',
    ],
  },
  {
    number: 4,
    title: 'Independent Quality Assurance on Every Build',
    tagline: 'Every home independently inspected \u2014 at no cost to the client.',
    description: [
      'Every Crownix build includes independent inspections at key stages via third-party specialists (including handover inspections), ensuring construction quality is verified externally \u2014 not internally.',
      'Why this matters: You get peace of mind, transparency, and protection, not builder-only sign-offs.',
    ],
  },
  {
    number: 5,
    title: 'Absolute Fixed Pricing \u2014 No Builder-Induced Variations',
    tagline: 'What we quote is what you pay. Period.',
    description: [
      'Crownix contracts are structured with special conditions that override standard HIA loopholes commonly used to introduce variations.',
      'Pricing is:\n\u2022 Fully turnkey\n\u2022 Fixed upfront\n\u2022 Protected from post-contract cost creep',
      'Our buying power allows us to deliver wholesale pricing, not retail mark-ups.',
      'Why this matters: No surprises. No margin erosion. No stress.',
    ],
  },
  {
    number: 6,
    title: 'A-Grade Inclusions (Owner-Occupied Standard)',
    tagline: 'Designed for performance, not upsells.',
    description: [
      'Our base specifications match the upgrades our competitors offer, carefully selected through ROI analysis to eliminate unnecessary upgrades and avoid post-contract changes.',
      'Every inclusion is chosen to:\n\u2022 Maximise resale values\n\u2022 Maximise rental appeal\n\u2022 Minimise maintenance\n\u2022 Remove the need for variations',
      'Why this matters: Higher resales, higher capital growth, higher yields, stronger tenant demand, zero builder-induced variations.',
    ],
  },
  {
    number: 7,
    title: 'Market-Leading Timeframes',
    tagline: 'No builder-induced extensions of time. Ever.',
    description: [
      'Crownix enforces strict construction programs and accountability measures. To date, we have delivered projects without any builder-induced Extensions of Time (EOTs).',
      'We are so confident of our delivery, that if we ever go over our agreed time, we pay you.',
      'Why this matters: Faster completion = earlier income + lower holding costs.',
    ],
  },
  {
    number: 8,
    title: 'Defined Customer Service Response Standards',
    tagline: 'Clear communication. Guaranteed response times.',
    description: [
      'Crownix operates with defined response timeframes and escalation protocols, ensuring clients are never left chasing updates or clarity.',
      'Why this matters: You always know where your project stands \u2014 without friction.',
    ],
  },
  {
    number: 9,
    title: 'Direct Access to Decision-Makers',
    tagline: 'Escalate straight to directors when it matters.',
    description: [
      'When an issue requires escalation, clients can connect directly with Crownix directors \u2014 not layered call centres or generic inboxes.',
      'Why this matters: Faster resolutions. Real accountability.',
    ],
  },
  {
    number: 10,
    title: 'Technology-Led, AI-Enabled Processes',
    tagline: 'Smarter systems. Smoother delivery.',
    description: [
      'Crownix uses market-leading technology and AI-enabled workflows to streamline:\n\u2022 Project tracking\n\u2022 Client communication\n\u2022 Documentation\n\u2022 Risk management',
      'Why this matters: Fewer delays, fewer errors, better visibility.',
    ],
  },
  {
    number: 11,
    title: 'Institutional-Level Market Intelligence',
    tagline: 'We see change before it becomes common knowledge.',
    description: [
      'Crownix actively engages with:\n\u2022 Government infrastructure, transport, and planning departments\n\u2022 Commercial land bankers\n\u2022 Tier-1 developers',
      'This allows us to anticipate growth corridors, zoning shifts, and infrastructure investment ahead of the wider market.',
      'Why this matters: Better timing = better returns.',
    ],
  },
  {
    number: 12,
    title: 'Radical Accountability',
    tagline: 'When mistakes happen, we own them \u2014 and fix them.',
    description: [
      'No business is perfect. If Crownix makes an error, we take responsibility and ensure fair, transparent compensation where required.',
      'Why this matters: Trust is built on accountability, not excuses.',
    ],
  },
  {
    number: 13,
    title: 'Tier-1 National Partner Network',
    tagline: 'The right experts, at every stage.',
    description: [
      'Crownix maintains a curated network of tier-1 professionals across:\n\u2022 Finance\n\u2022 Planning\n\u2022 Property management\n\u2022 Legal\n\u2022 Accounting',
      'Why this matters: Clients gain access to proven specialists \u2014 without trial and error.',
    ],
  },
  {
    number: 14,
    title: 'Elite People & Governance Standards',
    tagline: 'Only the best make it into Crownix.',
    description: [
      'Crownix operates some of the strictest HR, compliance, and governance standards in the industry. Every team member is vetted not only for competence, but for alignment with our values, ethics, and delivery standards.',
      'Why this matters: Great outcomes come from great people \u2014 every time.',
    ],
  },
  {
    number: 15,
    title: 'End-to-End Control of the Value Chain',
    tagline: 'From acquisition to handover \u2014 one accountable entity.',
    description: [
      'Unlike fragmented models where developers, land agents, builders, brokers, and project managers operate independently, Crownix controls:\n\u2022 Site acquisition\n\u2022 Feasibility modelling\n\u2022 Land development\n\u2022 Project delivery\n\u2022 Finance coordination\n\u2022 Property management integration',
      'No blame shifting. No misalignment.',
      'Why this matters: Integrated control reduces risk, accelerates timelines, and protects margins.',
    ],
  },
  {
    number: 16,
    title: 'Proven Performance Track Record',
    tagline: 'Every client to date has achieved strong financial uplift through Crownix.',
    description: [
      'Across both owner-occupiers and investors, Crownix has maintained a consistent record of delivering outcomes that have materially outperformed typical retail market transactions.',
      'Our model is built around:\n\u2022 Acquiring below peak market pricing\n\u2022 Securing early-stage positioning\n\u2022 Fixed pricing to protect margin\n\u2022 Location-driven capital growth\n\u2022 Yield-focused product design',
      'The result? A consistent history of clients achieving significant financial gains \u2014 often well above broader market averages.',
      'This is not luck. It is disciplined acquisition, structured delivery, and risk-controlled execution.',
      'Why this matters: Performance is not promised \u2014 it is demonstrated.',
    ],
  },
];

export function CrownixDifferencePage() {
  const [selectedPoint, setSelectedPoint] = useState<DifferencePoint | null>(null);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Premium construction"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              The Crownix Difference
            </h1>
            <p className="text-xl text-white/90">
              This is not a promise. It's a system.
            </p>
          </div>
        </div>
      </section>
      {/* Introduction */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6" data-testid="text-subtitle">
              The Crownix 16
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Sixteen defined standards that govern how we acquire, structure, build, and deliver.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Together, they form a disciplined operating framework designed to outperform the average market experience — consistently.
            </p>
          </div>
        </div>
      </section>
      {/* 16 Points Grid */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differencePoints.map((point) => (
              <div
                key={point.number}
                className="bg-card rounded-md border border-card-border p-6 flex flex-col items-center text-center"
                data-testid={`card-difference-${point.number}`}
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">
                    {String(point.number).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-card-foreground font-semibold text-base mb-3 min-h-[3rem] flex items-center">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-2 flex-1">
                  {point.tagline}
                </p>
                <button
                  onClick={() => setSelectedPoint(point)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent/80 transition-colors text-[#2d1d15] bg-[transparent]"
                  data-testid={`button-learn-more-${point.number}`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Experience the Difference</h2>
            <p className="text-white/90 text-lg mb-8">
              Ready to see how The Crownix 16 can work for you?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-md hover:bg-accent/90 transition-colors font-medium"
                data-testid="link-contact-cta"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-white rounded-md hover:bg-white/10 transition-colors font-medium"
                data-testid="link-services-cta"
              >
                <span>Our Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      {selectedPoint && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPoint(null)}
          data-testid="modal-overlay"
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-card rounded-md border border-card-border shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-testid={`modal-content-${selectedPoint.number}`}
          >
            <div className="sticky top-0 bg-primary p-6 rounded-t-md flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-accent">
                    {String(selectedPoint.number).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg">
                  {selectedPoint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-white/70 hover:text-white transition-colors flex-shrink-0 mt-1"
                data-testid="button-close-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-accent font-medium italic mb-4">
                {selectedPoint.tagline}
              </p>
              <div className="space-y-4">
                {selectedPoint.description.map((paragraph, idx) => (
                  <div key={idx}>
                    {paragraph.includes('\n') ? (
                      <div className="space-y-1">
                        {paragraph.split('\n').map((line, lineIdx) => (
                          <p
                            key={lineIdx}
                            className={`text-card-foreground/80 leading-relaxed ${
                              line.startsWith('\u2022') ? 'pl-4' : ''
                            } ${
                              line.startsWith('Why this matters:') ? 'font-semibold text-card-foreground mt-3' : ''
                            }`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p
                        className={`text-card-foreground/80 leading-relaxed ${
                          paragraph.startsWith('Why this matters:') ? 'font-semibold text-card-foreground' : ''
                        }`}
                      >
                        {paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
