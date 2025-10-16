<template>
  <DefaultLayout>
    <template #default>
      <div class="py-10 px-5 sm:px-6 lg:px-20 xl:px-40 mx-auto max-w-5xl">
        <div class="flex flex-col gap-2.5 prose dark:prose-invert">
          <h1 class="font-bold">Privacy Policy for KarirKit</h1>
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
            This Privacy Policy describes how KarirKit ("we," "us," or "our")
            collects, uses, and shares your information when you use our web
            application and related services (the "Service"). By using the
            Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect several types of information for various purposes to
            provide and improve our Service to you.
          </p>
          <h3>a. Information You Provide to Us</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> When you register for an
              account, we collect your name, email address, and a hashed
              password.
            </li>
            <li>
              <strong>Application Data:</strong> You provide us with data
              related to your job search, including job titles, company names,
              application statuses, job URLs, notes, and other related details.
            </li>
            <li>
              <strong>Uploaded Files:</strong> We collect files you voluntarily
              upload, such as your profile avatar, CVs, and cover letters. These
              files are stored securely with our third-party storage provider.
            </li>
          </ul>
          <h3>b. Information from Third Parties</h3>
          <ul>
            <li>
              <strong>Job Details:</strong> When you use our feature to fetch
              job details from a URL, we scrape publicly available information
              from that URL, such as job title, company name, and job
              description. We do not collect any personal information from these
              third-party sites that is not publicly displayed.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected data for the following purposes:</p>
          <ul>
            <li>To provide, operate, and maintain our Service.</li>
            <li>
              To manage your account and provide you with customer support.
            </li>
            <li>
              To communicate with you, including sending you service-related
              notifications, such as One-Time Passwords (OTPs) for account
              verification or password changes.
            </li>
            <li>To personalize and improve your experience on the Service.</li>
            <li>
              To ensure the security of our Service and prevent fraudulent
              activity.
            </li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>
            We do not sell your personal data. We may share your information
            only in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>With Service Providers:</strong> We use third-party
              service providers to help us operate our Service. Specifically, we
              use <strong>Cloudinary</strong> for storing your uploaded files
              (avatars, CVs, cover letters). These providers have access to your
              information only to perform these tasks on our behalf and are
              obligated not to disclose or use it for any other purpose.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities (e.g., a court or a government
              agency).
            </li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <p>
            The security of your data is important to us. We use
            industry-standard security measures to protect your information.
            Your password is stored in a hashed format using bcrypt. Your
            session is secured using JSON Web Tokens (JWT). Your uploaded files
            are managed by Cloudinary, which provides robust security for data
            storage.
          </p>
          <p>
            However, please remember that no method of transmission over the
            Internet or method of electronic storage is 100% secure. While we
            strive to use commercially acceptable means to protect your Personal
            Data, we cannot guarantee its absolute security.
          </p>

          <h2>5. Your Data Rights and Choices</h2>
          <p>
            You have the right to access, update, or delete the information we
            have on you.
          </p>
          <ul>
            <li>
              <strong>Access and Update:</strong> You can access and update your
              profile information and job application data directly within your
              account settings and dashboard.
            </li>
            <li>
              <strong>Deletion:</strong> You can delete individual job
              applications, CVs, and cover letters through the Service's
              interface. If you wish to delete your entire account, please
              contact us.
            </li>
          </ul>

          <h2>6. Children's Privacy</h2>
          <p>
            Our Service is not intended for use by anyone under the age of 13.
            We do not knowingly collect personally identifiable information from
            children under 13. If you become aware that a child has provided us
            with Personal Data, please contact us.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us.
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
