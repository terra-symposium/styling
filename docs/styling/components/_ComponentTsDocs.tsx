import { componentTsDocs } from '../../../.terra-docs/cache/component-tsdocs.js';

type ComponentName = keyof typeof componentTsDocs;

/** Displays the build-cached TSDocs and upstream shadcn reference for a UI file. */
export function ComponentTsDocs({ component }: { component: ComponentName }) {
  const docs = componentTsDocs[component];
  if (!docs) return null;

  return (
    <section
      aria-label={`${component} TypeScript API`}
      style={{
        marginBlock: '2rem',
        padding: '1.25rem',
        border: '1px solid rgb(var(--primary-6))',
        borderRadius: '0.75rem',
        background: 'rgb(var(--primary-2))',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>TypeScript API</h2>
        {docs.shadcnUrl ? (
          <a href={docs.shadcnUrl} target="_blank" rel="noreferrer">
            shadcn/ui reference ↗
          </a>
        ) : null}
      </header>
      <p style={{ marginBlock: '0.5rem 1rem', fontSize: '0.875rem', opacity: 0.8 }}>{docs.source}</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {docs.members.map((member) => (
          <article key={member.name}>
            <h3 style={{ marginBlock: '0 0.35rem' }}>{member.name}</h3>
            <pre
              style={{
                margin: 0,
                padding: '0.75rem',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                borderRadius: '0.5rem',
                background: 'rgb(var(--primary-3))',
              }}
            >
              <code>{member.signature}</code>
            </pre>
            {member.summary ? <p>{member.summary}</p> : null}
            {member.tags.length ? (
              <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 0.75rem' }}>
                {member.tags.map((tag, index) => (
                  <div key={`${member.name}-${tag.name}-${index}`} style={{ display: 'contents' }}>
                    <dt style={{ fontWeight: 600 }}>@{tag.name}</dt>
                    <dd style={{ margin: 0 }}>{tag.text || '—'}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
