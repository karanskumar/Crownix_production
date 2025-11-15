import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function PrivacyPolicyPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxwcml2YWN5JTIwc2VjdXJpdHl8ZW58MXx8fHwxNzYzMTY1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Privacy Policy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90">
              Your privacy is important to us
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your privacy is important to us. It is Crownix's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across our website, Crownix.com.au, and other sites we own and operate.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This policy is effective as of 11/11/25 and was last updated on 11/11/25.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Information we collect includes both information you knowingly and actively provide us when using or participating in any of our services and promotions, and any information automatically sent by your devices in the course of accessing our products and services.
                </p>

                <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Log Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, other details about your visit, and technical details that occur in conjunction with any errors you may encounter.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Please be aware that while this information may not be personally identifying by itself, it may be possible to combine it with other data to personally identify individual persons.
                </p>

                <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may ask for personal information which may include one or more of the following:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Social media profiles</li>
                  <li>Date of birth</li>
                  <li>Phone/mobile number</li>
                  <li>Home/mailing address</li>
                </ul>
              </div>

              {/* Legitimate Reasons */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Legitimate Reasons for Processing Your Personal Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We only collect and use your personal information when we have a legitimate reason for doing so. In which instance, we only collect personal information that is reasonably necessary to provide our services to you.
                </p>
              </div>

              {/* Collection and Use */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Collection and Use of Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect personal information from you when you do any of the following on our website:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-6 space-y-2">
                  <li>Enter any of our competitions, contests, sweepstakes, and surveys</li>
                  <li>Sign up to receive updates from us via email or social media channels</li>
                  <li>Use a mobile device or web browser to access our content</li>
                  <li>Contact us via email, social media, or on any similar technologies</li>
                  <li>When you mention us on social media</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>to enable you to customise or personalise your experience of our website</li>
                  <li>to contact and communicate with you</li>
                  <li>for analytics, market research, and business development, including to operate and improve our website, associated applications, and associated social media platforms</li>
                  <li>for advertising and marketing, including to send you promotional information about our products and services and information about third parties that we consider may be of interest to you</li>
                  <li>to consider your employment application</li>
                  <li>to enable you to access and use our website, associated applications, and associated social media platforms</li>
                  <li>for internal record keeping and administrative purposes</li>
                  <li>to run competitions, sweepstakes, and/or offer additional benefits to you</li>
                  <li>to comply with our legal obligations and resolve any disputes that we may have</li>
                  <li>for security and fraud prevention, and to ensure that our sites and apps are safe, secure, and used in line with our terms of use</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  Please be aware that we may combine information we collect about you with general information or research data we receive from other trusted sources.
                </p>
              </div>

              {/* Security */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Security of Your Personal Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use, or modification.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure, and no one can guarantee absolute data security. We will comply with laws applicable to us in respect of any data breach.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for selecting any password and its overall security strength, ensuring the security of your own information within the bounds of our services.
                </p>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">How Long We Keep Your Personal Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy. If your personal information is no longer required, we will delete it or make it anonymous by removing all details that identify you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  However, if necessary, we may retain your personal information for our compliance with a legal, accounting, or reporting obligation or for archiving purposes in the public interest, scientific, or historical research purposes or statistical purposes.
                </p>
              </div>

              {/* Disclosure to Third Parties */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Disclosure of Personal Information to Third Parties</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may disclose personal information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>a parent, subsidiary, or affiliate of our company</li>
                  <li>third party service providers for the purpose of enabling them to provide their services, for example, IT service providers, data storage, hosting and server providers, advertisers, or analytics platforms</li>
                  <li>our employees, contractors, and/or related entities</li>
                  <li>our existing or potential agents or business partners</li>
                  <li>sponsors or promoters of any competition, sweepstakes, or promotion we run</li>
                  <li>courts, tribunals, regulatory authorities, and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise, or defend our legal rights</li>
                  <li>third parties, including agents or sub-contractors, who assist us in providing information, products, services, or direct marketing to you third parties to collect and process data</li>
                </ul>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">International Transfers of Personal Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The personal information we collect is stored and/or processed where we or our partners, affiliates, and third-party providers maintain facilities. Please be aware that the locations to which we store, process, or transfer your personal information may not have the same data protection laws as the country in which you initially provided the information. If we transfer your personal information to third parties in other countries: (i) we will perform those transfers in accordance with the requirements of applicable law; and (ii) we will protect the transferred personal information in accordance with this privacy policy.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Your Rights and Controlling Your Personal Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You always retain the right to withhold personal information from us, with the understanding that your experience of our website may be affected. We will not discriminate against you for exercising any of your rights over your personal information. If you do provide us with personal information you understand that we will collect, hold, use and disclose it in accordance with this privacy policy. You retain the right to request details of any personal information we hold about you.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person's consent to provide the personal information to us.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time. We will provide you with the ability to unsubscribe from our email-database or opt out of communications. Please be aware we may need to request specific information from you to help us confirm your identity.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this privacy policy. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading, or out of date.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint.
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Use of Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified.
                </p>
              </div>

              {/* Limits of Policy */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Limits of Our Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At our discretion, we may change our privacy policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this privacy policy, we will post the changes here at the same link by which you are accessing this privacy policy.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If required by law, we will get your permission or give you the opportunity to opt in to or opt out of, as applicable, any new uses of your personal information.
                </p>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For any questions or concerns regarding your privacy, you may contact us using the following details:
                </p>
                <p className="text-foreground font-semibold">Crownix</p>
                <p className="text-muted-foreground">info@crownix.com.au</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
