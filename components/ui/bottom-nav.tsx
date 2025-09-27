'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: string
  label: string
  isActive?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    href: '/plants',
    icon: '🪴',
    label: 'My Plants',
    isActive: (pathname) => pathname.startsWith('/plants')
  },
  {
    href: '/library',
    icon: '📚',
    label: 'Library',
    isActive: (pathname) => pathname.startsWith('/library')
  }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 px-4 py-2 z-50 md:hidden">
      <div className="flex justify-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.isActive ? item.isActive(pathname) : pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-6 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary-700 bg-primary-50"
                  : "text-earth-600 hover:text-primary-600 hover:bg-earth-50"
              )}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}