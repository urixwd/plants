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

export function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block bg-white border-b border-earth-200 px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2 text-primary-800 font-bold text-xl">
          <span>🌱</span>
          <span>Plants</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = item.isActive ? item.isActive(pathname) : pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "text-primary-700 bg-primary-50"
                    : "text-earth-600 hover:text-primary-600 hover:bg-earth-50"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center space-x-2">
          <Link
            href="/plants/new"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <span>+</span>
            <span>Add Plant</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}