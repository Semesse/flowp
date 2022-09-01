import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

interface FeatureItem {
  title: string
  // Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Pure Typescript',
    description: <>Written in pure TS and ready to run anywhere</>,
  },
  {
    title: 'Fluent Async Flow',
    description: <>Use advanced promise utilities like a ninja</>,
  },
  {
    title: 'Modern, Fast, Simple',
    description: (
      <>
        Write performant modern app with simple API interface.
        <br />
        Checkout <a href="/docs/tutorial/intro">Docs</a>
      </>
    ),
  },
  {
    title: 'Robust & Reliable',
    description: <>No single line is forgotten, plus race condition tests</>,
  },
]

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx(styles.feature)}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  )
}
