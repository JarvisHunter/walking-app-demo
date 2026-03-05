import { useMutation } from "@tanstack/react-query";
import { api, type EmailInput, type EmailResponse } from "@shared/routes";

export function useSubmitEarlyAccess() {
  return useMutation<EmailResponse, Error, EmailInput>({
    mutationFn: async (data: EmailInput) => {
      // Pre-validate before sending
      const validated = api.earlyAccess.create.input.parse(data);
      
      const res = await fetch(api.earlyAccess.create.path, {
        method: api.earlyAccess.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          // Provide friendly fallback message
          throw new Error(errorData.message || "Please check your email and try again.");
        }
        throw new Error("Oops! Something went wrong joining the waitlist.");
      }
      
      return api.earlyAccess.create.responses[201].parse(await res.json());
    },
  });
}
