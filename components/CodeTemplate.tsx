interface CodeProps {
  code: string;
  replacements: Record<string, string>;
}

const replacePlaceholders = (template: string, replacements: Record<string, string>): string => {
  let result = template;
  for (const key in replacements) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
  }
  return result;
};

export default function CodeTemplate({ code, replacements }: CodeProps) {
  const htmlString = replacePlaceholders(code, replacements)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(/\s/g, '&nbsp;');

  return (
    <pre className="whitespace-pre-wrap rounded bg-gray-200 p-4" dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
}
