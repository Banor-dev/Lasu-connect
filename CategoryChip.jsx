import React from "react";

export const CATEGORIES = [
  { value: "graphic-design", label: "Graphic design" },
  { value: "web-development", label: "Web development" },
  { value: "photography-video", label: "Photography & video" },
  { value: "tutoring", label: "Tutoring & lessons" },
  { value: "writing-editing", label: "Writing & editing" },
  { value: "fashion-tailoring", label: "Fashion & tailoring" },
  { value: "food-catering", label: "Food & catering" },
  { value: "logistics-errands", label: "Logistics & errands" },
  { value: "repairs-maintenance", label: "Repairs & maintenance" },
  { value: "beauty-grooming", label: "Beauty & grooming" },
  { value: "event-services", label: "Event services" },
  { value: "other", label: "Other" },
];

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export default function CategoryChip({ value }) {
  return <span className="pill">{categoryLabel(value)}</span>;
}
