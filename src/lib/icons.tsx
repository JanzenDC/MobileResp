import { config, type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

config.autoAddCss = false

interface FaIconProps {
  icon: IconDefinition
  size?: number
  className?: string
}

export function FaIcon({ icon, size = 13, className }: FaIconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
