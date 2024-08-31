"use client";

import { sanitizeHTML } from "@/lib/utils";

function EmailOriginal({ email }: { email: any }) {
  return (
    <div>
      <div
        className="flex flex-col gap-2 mt-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(email.body) }}
      />
    </div>
  );
}

export default EmailOriginal;
