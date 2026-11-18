import { highlight, type Lang } from "@/lib/highlight";
import CopyButton from "./CopyButton";

// A code card printed on the ticket: a file or context label, the copy
// button, and the highlighted snippet. Long lines scroll inside the card.
export default function Code({
  code,
  lang,
  title,
}: {
  code: string;
  lang: Lang;
  title: string;
}) {
  return (
    <figure className="code">
      <figcaption className="code-bar">
        <span className="code-title">{title}</span>
        <CopyButton text={code} label={`Copy ${title}`} />
      </figcaption>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be reachable by keyboard */}
      <pre tabIndex={0}>
        <code>{highlight(code, lang)}</code>
      </pre>
    </figure>
  );
}
