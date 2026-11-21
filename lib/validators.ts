export function validatePassword(password: string) {
  const errors: string[] = [];
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  return errors;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateServiceForm(form: {
  title: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceArea: string;
  image: string;
}) {
  const errors: Record<string, string> = {};
  if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (form.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }
  if (!Number.isFinite(Number(form.basePrice)) || Number(form.basePrice) <= 0) {
    errors.basePrice = "Base price must be a positive number.";
  }
  if (!form.estimatedDuration.trim()) {
    errors.estimatedDuration = "Estimated duration is required.";
  }
  if (form.serviceArea.trim().length < 2) {
    errors.serviceArea = "Service area is required.";
  }
  if (!form.image) {
    errors.image = "Please upload a service image.";
  }
  return errors;
}
