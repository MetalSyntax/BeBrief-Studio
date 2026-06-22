import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options?: SelectOption[]
  groups?: SelectGroup[]
  className?: string
  triggerClassName?: string
  dropdownClassName?: string
  icon?: React.ReactNode
  placeholder?: string
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  groups,
  className = '',
  triggerClassName = '',
  dropdownClassName = '',
  icon,
  placeholder,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allOptions = options 
    ? options 
    : groups 
      ? groups.flatMap(g => g.options) 
      : []

  const selectedOption = allOptions.find(opt => opt.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer select-none focus:outline-none focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed ${triggerClassName}`}
      >
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{selectedOption ? selectedOption.label : placeholder || value}</span>
        </div>
        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 mt-1.5 min-w-[160px] max-h-60 overflow-y-auto bg-[#13131a] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1 ${dropdownClassName}`}>
          {options && options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                opt.value === value 
                  ? 'bg-violet-600 text-white font-semibold' 
                  : 'hover:bg-white/5 text-zinc-200 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}

          {groups && groups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                {group.label}
              </div>
              {group.options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors pl-4 ${
                    opt.value === value 
                      ? 'bg-violet-600 text-white font-semibold' 
                      : 'hover:bg-white/5 text-zinc-200 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              {groupIdx < groups.length - 1 && <div className="h-px bg-white/5 my-1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default CustomSelect
