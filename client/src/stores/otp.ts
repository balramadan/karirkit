import { defineStore } from "pinia";
import { ref } from "vue";

export const useOtpStore = defineStore("otp", () => {
  const email = ref<string | null>(null);
  const reason = ref<string | null>(null);
  const countdown = ref<number>(0);

  /**
   * The function `forVerify` sets the values of email, OTP, and reason fields based on the provided
   * parameters.
   * @param {string} emailValue - The `emailValue` parameter is a string that represents the email
   * value that will be assigned to the `email` variable in the `forVerify` function.
   * @param {string} otpValue - One Time Password (OTP) value that is typically sent to the user's
   * email or phone for verification purposes.
   * @param {string} reasonValue - The `reasonValue` parameter in the `forVerify` function is used to
   * set the value of the `reason` field to the provided `reasonValue` string. This parameter allows
   * you to specify the reason for the verification process, which can be helpful for tracking and
   * logging purposes.
   */
  function forVerify(emailValue: string, reasonValue: string) {
    email.value = emailValue;
    reason.value = reasonValue;
  }

  return {
    email,
    reason,
    countdown,
    forVerify,
  };
});
