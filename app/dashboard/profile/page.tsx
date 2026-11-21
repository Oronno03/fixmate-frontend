"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Update profile"
        description="Change your name, contact details, bio, and profile photo. Your email and role stay read-only."
      />
      <ProfileForm />
    </div>
  );
}
