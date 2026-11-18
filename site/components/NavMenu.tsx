"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, REPO_URL, SETUP_URL } from "@/lib/site";

// The phone menu: a toggle that opens the section links under the bar,
// closes on a link, on Escape and when the window grows past the breakpoint.
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const restore = menu.current?.contains(document.activeElement);
      setOpen(false);
      if (restore) button.current?.focus();
    };
    const wide = window.matchMedia("(min-width: 961px)");
    const onWide = (event: MediaQueryListEvent) =>
      event.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="phone-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="visually-hidden">Menu</span>
        <span className="bars" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      <div ref={menu} className="phone-menu" id="phone-menu" hidden={!open}>
        <nav aria-label="Sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a href={REPO_URL} onClick={close}>
            GitHub
          </a>
          <a className="btn btn-coral" href={SETUP_URL} onClick={close}>
            Set it up
          </a>
        </nav>
      </div>
    </>
  );
}
