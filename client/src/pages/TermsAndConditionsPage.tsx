import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function TermsAndConditionsPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50fGVufDF8fHx8MTc2MzE2NTIwMHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Terms and Conditions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-xl text-white/90">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These terms and conditions (the "Terms and Conditions") govern the use of www.crownix.com.au (the "Site").
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This Site is owned and operated by Crownix Pty Ltd. This Site is a property development and construction services platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using this Site, you indicate that you have read and understand these Terms and Conditions and agree to abide by them at all times.
                </p>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content published and made available on our Site is the property of Crownix Pty Ltd and the Site's creators.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This includes, but is not limited to, images, text, logos, documents, downloadable files and anything that contributes to the composition of our Site.
                </p>
              </div>

              {/* Acceptable Use */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As a user of our Site, you agree to use our Site legally, not to use our Site for illegal purposes, and not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-6 space-y-2">
                  <li>Harass or mistreat other users of our Site;</li>
                  <li>Violate the rights of other users of our Site;</li>
                  <li>Violate the intellectual property rights of the Site owners or any third party to the Site;</li>
                  <li>Hack into the account of another user of the Site;</li>
                  <li>Act in any way that could be considered fraudulent; or</li>
                  <li>Post any material that may be deemed inappropriate or offensive.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If we believe you are using our Site illegally or in a manner that violates these Terms and Conditions, we reserve the right to limit, suspend or terminate your access to our Site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We also reserve the right to take any legal steps necessary to prevent you from accessing our Site.
                </p>
              </div>

              {/* Third Party Goods and Services */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Third Party Goods and Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Site may offer goods and services from third parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We cannot guarantee the quality or accuracy of goods and services made available by third parties on our Site.
                </p>
              </div>

              {/* Links to Other Websites */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Links to Other Websites</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Site contains links to third party websites or services that we do not own or control.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are not responsible for the content, policies, or practices of any third party website or service linked to on our Site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It is your responsibility to read the terms and conditions and privacy policies of these third party websites before using these sites.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Crownix Pty Ltd, and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities, and expenses including legal fees arising from your use of the Site.
                </p>
              </div>

              {/* Indemnity */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Indemnity</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Except where prohibited by law, by using this Site you indemnify and hold harmless Crownix Pty Ltd and our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses, damages, liabilities, and expenses including legal fees arising out of your use of our Site or your violation of these Terms and Conditions.
                </p>
              </div>

              {/* Applicable Law */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Applicable Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions are governed by the laws of the State of New South Wales, Australia.
                </p>
              </div>

              {/* Severability */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Severability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and Conditions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  All other provisions will not be affected by the removal and the rest of these Terms and Conditions will still be considered valid.
                </p>
              </div>

              {/* Changes */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Changes</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and to reflect any changes to the way we operate our Site and the way we expect users to behave on our Site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We will notify users by email of changes to these Terms and Conditions or post a notice on our Site.
                </p>
              </div>

              {/* Contact Details */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Contact Details</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Please contact us if you have any questions or concerns. Our contact details are as follows:
                </p>
                <p className="text-foreground font-semibold mb-2">Crownix Pty Ltd</p>
                <p className="text-muted-foreground mb-2">Email: info@crownix.com.au</p>
                <p className="text-muted-foreground">
                  You can also contact us through the feedback form available on our Site.
                </p>
              </div>

              {/* Effective Date */}
              <div className="mb-12">
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Effective Date: 10th day of November, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
