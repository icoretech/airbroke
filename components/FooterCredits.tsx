"use client";

export default function FooterCredits() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      &copy; 2023{currentYear > 2024 ? `-${currentYear}` : ""} iCoreTech, Inc.
    </>
  );
}
