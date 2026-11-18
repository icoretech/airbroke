import { answerParts, FAQ, REPO_URL } from "@/lib/site";
import { Ticket } from "./Ticket";

export default function Faq() {
  return (
    <Ticket
      id="faq"
      stock="lilac"
      label="Questions"
      route="README.md"
      labelledBy="faq-title"
    >
      <div className="faq">
        <div className="faq-head">
          <h2 className="h2" id="faq-title">
            Questions, answered.
          </h2>
          <p className="lede">
            Something missing? The <a href={REPO_URL}>README</a> covers every
            setting, and issues are open on GitHub.
          </p>
        </div>
        <div className="faq-list">
          {FAQ.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>
                {item.q}
                <span className="chev" aria-hidden="true" />
              </summary>
              <p>
                {answerParts(item.a).map((part) =>
                  "href" in part ? (
                    <a key={part.href} href={part.href}>
                      {part.text}
                    </a>
                  ) : (
                    part.text
                  ),
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Ticket>
  );
}
