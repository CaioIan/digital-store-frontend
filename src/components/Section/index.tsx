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

const Section = ({
  title,
  titleAlign = 'left',
  link,
  children
}: SectionProps) => {
  return (
    <section className="w-full my-10">
      {titleAlign === 'center' ? (
        <>
          <div className="flex justify-center mb-3">
            <h2 className="text-2xl font-bold text-dark-gray-2">{title}</h2>
          </div>
          {link && (
            <div className="flex justify-center mb-5">
              <RouterLink
                to={link.href}
                className="text-lg text-primary font-medium hover:underline"
              >
                {link.text} <span aria-hidden="true">&rarr;</span>
              </RouterLink>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-dark-gray-2">{title}</h2>
          {link && (
            <RouterLink
              to={link.href}
              className="text-lg text-primary font-medium hover:underline"
            >
              {link.text} <span aria-hidden="true">&rarr;</span>
            </RouterLink>
          )}
        </div>
      )}

      <div className="w-full">{children}</div>
    </section>
  )
}

export default Section
