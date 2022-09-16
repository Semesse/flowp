import React from 'react'

const PLAYGROUND_BASE_URL = 'https://stackblitz.com/edit/flowp-playground?file=README.md,'

export const PlaygroundBadge: React.FC<{ path: string }> = ({ path }) => {
  const playgroundUrl = PLAYGROUND_BASE_URL + encodeURIComponent(path)
  return (
    <a
      href={playgroundUrl}
      target="_blank"
      style={{
        backgroundColor: 'var(--flowp-primary)',
        borderRadius: '2px',
        color: '#fff',
        padding: '4px',
      }}
    >
      Playground
    </a>
  )
}
