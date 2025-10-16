<template>
  <DefaultLayout>
    <template #default>
      <div
        id="toTop"
        class="py-10 px-5 sm:px-6 lg:px-20 xl:px-40 mx-auto max-w-5xl"
      >
        <div class="flex flex-col gap-2.5 prose dark:prose-invert">
          <h1 class="font-bold">Terms of Service for KarirKit</h1>
          <p>
            <strong>Last Updated:</strong>
            {{
              new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </p>

          <p>
            Welcome to KarirKit! These Terms of Service ("Terms") govern your
            use of the KarirKit web application and any related services
            (collectively, the "Service") provided by us.
          </p>

          <p>
            By accessing or using our Service, you agree to be bound by these
            Terms. If you disagree with any part of the terms, then you may not
            access the Service.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            KarirKit is a web application designed to help job seekers manage
            and track their job applications in one place. Key features include
            adding, editing, and deleting applications, tracking application
            statuses via a Kanban-style board, creating custom groups, and
            automatically fetching job details from public job posting URLs.
          </p>

          <h2>2. User Accounts</h2>
          <ul>
            <li>
              <strong>Account Creation:</strong> To use the Service, you must
              register for an account. You agree to provide accurate, current,
              and complete information during the registration process.
            </li>
            <li>
              <strong>Account Responsibility:</strong> You are responsible for
              safeguarding your password and for any activities or actions under
              your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </li>
            <li>
              <strong>Account Termination:</strong> We reserve the right to
              suspend or terminate your account at any time, without prior
              notice, if you breach these Terms.
            </li>
          </ul>

          <h2>3. User Content and Conduct</h2>
          <ul>
            <li>
              <strong>Your Content:</strong> You are solely responsible for all
              the information, data, and documents (e.g., job application
              details, CVs, cover letters) that you upload, post, or otherwise
              transmit via the Service ("User Content"). You retain all
              ownership rights to your User Content.
            </li>
            <li>
              <strong>Acceptable Use:</strong> You agree not to use the Service
              for any unlawful purpose or to engage in any conduct that is
              harmful, fraudulent, or infringes on the rights of others.
            </li>
            <li>
              <strong>Scraping Feature:</strong> The feature that fetches job
              details from URLs is provided for your convenience. You agree to
              use this feature responsibly and in accordance with the terms of
              service of the source websites (e.g., LinkedIn, JobStreet). Data
              obtained through this feature is for your personal, non-commercial
              use only.
            </li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content),
            features, and functionality are and will remain the exclusive
            property of KarirKit and its licensors. The Service is protected by
            copyright, trademark, and other laws. Our trademarks may not be used
            in connection with any product or service without our prior written
            consent.
          </p>
          <p>
            The source code for KarirKit is licensed under the GNU General
            Public License v3.0 (GPLv3). These Terms of Service apply to your
            use of the hosted Service, while the GPLv3 license applies to your
            use, modification, and distribution of the source code itself.
          </p>

          <h2>5. Third-Party Links and Services</h2>
          <p>
            Our Service may contain links to third-party websites or services
            that are not owned or controlled by KarirKit. We have no control
            over, and assume no responsibility for, the content, privacy
            policies, or practices of any third-party websites or services.
          </p>

          <h2>6. Termination</h2>
          <p>
            You may terminate your account at any time by ceasing to use the
            Service. We may also terminate or suspend your access to the Service
            immediately, without prior notice or liability, for any reason,
            including if you breach these Terms.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We
            make no warranties, express or implied, that the Service will be
            uninterrupted, secure, error-free, or that the data you provide will
            be secure or not otherwise lost or damaged. The accuracy of data
            fetched from third-party sites is not guaranteed.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall KarirKit, its directors, employees, or affiliates,
            be liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from your
            access to or use of or inability to access or use the Service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of Indonesia, without regard to its conflict of law provisions.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole
            discretion.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
            <a href="mailto:hello@iqbalramadan.my.id"
              >hello@iqbalramadan.my.id</a
            >
          </p>
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
</script>
<style>
.prose {
  color: #333;
}
.dark .prose {
  color: #ccc;
}
.prose h1,
.prose h2,
.prose h3 {
  color: #111;
}
.dark .prose h1,
.dark .prose h2,
.dark .prose h3 {
  color: #fff;
}
.prose a {
  color: #007bff;
}
.dark .prose a {
  color: #3b82f6;
}
.prose strong {
  color: #111;
}
.dark .prose strong {
  color: #fff;
}
</style>
