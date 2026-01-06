import type { ReactNode } from 'react'
import RouterLink from '../RouterLink'

interface SectionProps {
  title: string
  titleAlign?: 'left' | 'center'
  link?: {
    text: string
    href: string
  }
  children: ReactNode
}

export const Section = ({
  title,
  titleAlign = 'left',
  link,
  children
}: SectionProps) => {
  return (
    <section className="w-full my-10">
      <div
        className={`flex items-center mb-5 ${
          titleAlign === 'center' ? 'justify-center' : 'justify-between'
        }`}
      >
        <h2 className="text-2xl font-bold text-dark-gray-2">{title}</h2>

        {link && (
          <RouterLink
            to={link.href}
            className="text-lg text-primary font-medium hover:underline"
          >
            {link.text} &rarr;
          </RouterLink>
        )}
      </div>

      <div className="w-full">{children}</div>
    </section>
  )
}
