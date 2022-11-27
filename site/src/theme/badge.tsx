import React from 'react'

export const Badge = ({ children, color }) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '4px',
    }}
  >
    {children}
  </span>
)
