import React from 'react'

const Colors = () => {

    const tokens = [
    { group: 'Backgrounds', items: [
      { name: '--s-bg',   cls: 'bg-s-bg' },
      { name: '--s-bg-1', cls: 'bg-s-bg-1' },
      { name: '--s-bg-2', cls: 'bg-s-bg-2' },
      { name: '--s-bg-3', cls: 'bg-s-bg-3' },
    ]},
    { group: 'Borders', items: [
      { name: '--s-border',        cls: 'bg-s-border' },
      { name: '--s-border-strong', cls: 'bg-s-border-strong' },
    ]},
    { group: 'Foregrounds', items: [
      { name: '--s-fg',   cls: 'bg-s-fg' },
      { name: '--s-fg-1', cls: 'bg-s-fg-1' },
      { name: '--s-fg-2', cls: 'bg-s-fg-2' },
      { name: '--s-fg-3', cls: 'bg-s-fg-3' },
    ]},
    { group: 'Accent', items: [
      { name: '--s-accent',     cls: 'bg-s-accent' },
      { name: '--s-accent-dim', cls: 'bg-s-accent-dim' },
      { name: '--s-accent-fg',  cls: 'bg-s-accent-fg' },
    ]},
    { group: 'Semantic', items: [
      { name: '--s-pos', cls: 'bg-s-pos' },
      { name: '--s-neg', cls: 'bg-s-neg' },
    ]},
  ]

  return (
    <>
    <div className="p-8 space-y-10" style={{ background: 'var(--s-bg)' 
  }}>
        <h1 className="text-s-fg text-2xl font-mono font-bold">Color
  Tokens</h1>
        {tokens.map(({ group, items }) => (
          <section key={group}>
            <h2 className="text-s-fg-2 text-xs font-mono uppercase 
  tracking-widest mb-4">{group}</h2>
            <div className="flex flex-wrap gap-4">
              {items.map(({ name, cls }) => (
                <div key={name} className="flex flex-col items-center 
  gap-2">
                  <div
                    className={`w-20 h-20 rounded-lg border 
  border-s-border-strong ${cls}`}
                    style={name === '--s-accent-dim' ? { background: 
  'var(--s-bg-3)' } : undefined}
                  >
                    {name === '--s-accent-dim' && (
                      <div className={`w-full h-full rounded-lg ${cls}`} />
                    )}
                  </div>
                  <span className="text-s-fg-2 text-xs font-mono 
  text-center">{name}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

export default Colors