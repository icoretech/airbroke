// The Airbroke mark and wordmark as one horizontal lockup. Paths come from the
// app's public/logo-full.svg: the violet robot head keeps its brand colour and
// the lettering takes the current text colour.

export const HEAD =
  "M341 464V446C341 405 362 380 400 371L610 335C649 328 678 357 680 398L683 456H690C705 456 714 466 714 481V514C714 530 704 540 689 540H684V545C684 591 658 617 618 617L411 620C367 621 342 595 342 552V548H335C320 548 310 537 310 522V491C310 475 320 464 335 464Z M489 497A45 45 0 1 1 399 497A45 45 0 1 1 489 497Z M557 450L584 477L611 450Q614 447 617 450L627 460Q630 463 627 466L600 493L627 520Q630 523 627 526L617 536Q614 539 611 536L584 509L557 536Q554 539 551 536L541 526Q538 523 541 520L568 493L541 466Q538 463 541 460L551 450Q554 447 557 450Z";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="300 325 424 305"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#7563EB" fillRule="evenodd" d={HEAD} />
    </svg>
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 690 120"
      role="img"
      aria-label="Airbroke"
      focusable="false"
    >
      <path
        fill="#7563EB"
        fillRule="evenodd"
        transform="translate(-130.2 -140.7) scale(0.42)"
        d={HEAD}
      />
      <g fill="currentColor" transform="translate(196 4)">
        <path
          fillRule="evenodd"
          d="M31 23C40 23 47 27 51 33V27Q51 24 54 24H63Q66 24 66 27V86Q66 89 63 89H54Q51 89 51 86V81C46 87 39 90 30 90C12 90 0 76 0 56.5C0 37 13 23 31 23Z M33 37C22 37 16 45 16 56.5C16 68 22 76 33 76C44 76 51 68 51 56.5C51 45 44 37 33 37Z"
        />
        <circle cx="85.5" cy="8.5" r="8.5" />
        <path d="M80.5 24H90.5Q93.5 24 93.5 27V86Q93.5 89 90.5 89H80.5Q77.5 89 77.5 86V27Q77.5 24 80.5 24Z" />
        <path
          transform="translate(106 0)"
          d="M0 27Q0 24 3 24H12Q15 24 15 27V34C20 26 28 22 38 23Q41 23 41 26V36Q41 39 38 39H34C22 39 16 46 16 59V86Q16 89 13 89H3Q0 89 0 86Z"
        />
        <path
          transform="translate(155 0)"
          fillRule="evenodd"
          d="M0 3Q0 0 3 0H13Q16 0 16 3V32C21 26 28 23 37 23C56 23 68 37 68 56.5C68 76 55 90 37 90C28 90 21 87 16 80V86Q16 89 13 89H3Q0 89 0 86Z M34 37C23 37 16 45 16 56.5C16 68 23 76 34 76C45 76 52 68 52 56.5C52 45 45 37 34 37Z"
        />
        <path
          transform="translate(234 0)"
          d="M0 27Q0 24 3 24H12Q15 24 15 27V34C20 26 28 22 38 23Q41 23 41 26V36Q41 39 38 39H34C22 39 16 46 16 59V86Q16 89 13 89H3Q0 89 0 86Z"
        />
        <path
          transform="translate(280 0)"
          fillRule="evenodd"
          d="M34 23C54 23 68 37 68 56.5C68 76 54 90 34 90C14 90 0 76 0 56.5C0 37 14 23 34 23Z M34 37C23 37 16 45 16 56.5C16 68 23 76 34 76C45 76 52 68 52 56.5C52 45 45 37 34 37Z"
        />
        <path
          transform="translate(359 0)"
          d="M0 3Q0 0 3 0H13Q16 0 16 3V50L39 26Q41 24 44 24H58Q61 24 59 27L34 53L61 85Q64 89 59 89H45Q43 89 41 87L23 65L16 72V86Q16 89 13 89H3Q0 89 0 86Z"
        />
        <path
          transform="translate(425 0)"
          fillRule="evenodd"
          d="M34 23C54 23 66 37 66 56V60Q66 63 63 63H16C18 72 24 77 35 77C42 77 48 75 53 71Q55 70 57 72L63 78Q65 80 62 82C55 88 45 90 34 90C13 90 0 77 0 56.5C0 37 14 23 34 23Z M16 51H50C49 42 43 36 34 36C24 36 18 42 16 51Z"
        />
      </g>
    </svg>
  );
}
