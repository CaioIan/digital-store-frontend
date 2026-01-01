import { Link } from 'react-router-dom'

interface Information {
  text: string
  link: string
}

interface FooterInformationProps {
  title: string
  informations: Information[]
}

const FooterInformation = ({ title, informations }: FooterInformationProps) => {
  const isExternalLink = (link: string) => {
    return (
      link.startsWith('http')
      || link.startsWith('tel:')
      || link.startsWith('mailto:')
      || link === '#'
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <ul className="flex flex-col gap-3">
        {informations.map((info) => (
          <li key={info.link}>
            {isExternalLink(info.link) ? (
              <a
                href={info.link}
                className="text-white text-base font-normal hover:text-primary transition-colors no-underline"
              >
                {info.text}
              </a>
            ) : (
              <Link
                to={info.link}
                className="text-white text-base font-normal hover:text-primary transition-colors no-underline"
              >
                {info.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterInformation
