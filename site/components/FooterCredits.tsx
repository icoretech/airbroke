"use client";

import { useEffect, useState } from "react";

export default function FooterCredits() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  return (
    <>
      {currentYear ? (
        <>
          &copy; 2023{currentYear > 2024 ? `-${currentYear}` : ""} iCoreTech,
          Inc.
        </>
      ) : null}
    </>
  );
}
