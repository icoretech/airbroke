interface CodeProps {
  code: string;
  replacements: Record<string, string>;
  name: string;
}

const replacePlaceholders = (template: string, replacements: Record<string, string>): string => {
  let result = template;
  for (const key in replacements) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
  }
  return result;
};

export default function CodeTemplate({ code, replacements, name }: CodeProps) {
  const htmlString = replacePlaceholders(code, replacements)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div className="mb-6 divide-y divide-indigo-400/30 overflow-hidden rounded-lg bg-gray-900 text-white shadow">
      <h2 className="min-w-0 px-4 py-5 text-sm font-semibold leading-6 text-white  sm:px-6">{name}</h2>
      <div className="px-4 py-5 sm:p-6">
        <pre className="z-40 whitespace-pre-wrap  text-white" dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
    </div>
  );
}
