export const getTitleClass = (size?: string, defaultClass = 'text-2xl font-bold tracking-tight uppercase') => {
  switch (size) {
    case 'xs': return 'text-base font-bold tracking-tight uppercase'
    case 'sm': return 'text-lg font-bold tracking-tight uppercase'
    case 'md': return 'text-xl font-bold tracking-tight uppercase'
    case 'lg': return 'text-2xl font-bold tracking-tight uppercase'
    case 'xl': return 'text-3xl md:text-4xl font-bold tracking-tight uppercase'
    case '2xl': return 'text-4xl md:text-5xl font-extrabold tracking-tight uppercase'
    case '3xl': return 'text-5xl md:text-6xl font-extrabold tracking-tight uppercase'
    case '4xl': return 'text-6xl md:text-7xl font-black tracking-tight uppercase'
    case '5xl': return 'text-7xl md:text-8xl font-black tracking-tighter uppercase'
    case 'display': return 'text-8xl md:text-9xl font-black tracking-tighter uppercase'
    default: return defaultClass
  }
}

export const getSubtitleClass = (size?: string, defaultClass = 'text-lg opacity-85 font-light') => {
  switch (size) {
    case 'xs': return 'text-xs opacity-75 font-normal leading-relaxed'
    case 'sm': return 'text-sm opacity-80 font-normal leading-relaxed'
    case 'md': return 'text-base opacity-85 font-normal leading-relaxed'
    case 'lg': return 'text-lg opacity-85 font-light leading-relaxed'
    case 'xl': return 'text-xl opacity-90 font-light leading-relaxed'
    case '2xl': return 'text-2xl opacity-95 font-light leading-relaxed'
    case '3xl': return 'text-3xl opacity-95 font-light leading-relaxed'
    case '4xl': return 'text-4xl opacity-100 font-normal leading-normal'
    case '5xl': return 'text-5xl opacity-100 font-medium leading-normal'
    case 'display': return 'text-6xl opacity-100 font-semibold leading-none'
    default: return defaultClass
  }
}

export const getTextAlignClass = (align?: 'left' | 'center', defaultClass = 'text-left') => {
  return align === 'center' ? 'text-center' : defaultClass
}

export const getAlignmentContainerClass = (align?: 'left' | 'center') => {
  return align === 'center' ? 'flex flex-col items-center justify-center text-center' : 'flex flex-row items-center gap-3'
}

export const getCardRadiusStyle = (radius?: string, defaultRadius = '12px') => {
  return { borderRadius: radius || defaultRadius }
}
