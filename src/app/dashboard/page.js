'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, memo } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { IconArrowLeft, IconPlant, IconUserBolt } from '@tabler/icons-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import MapTilerMap from '@/components/MapTilerMap'
import AddTreeDialog from '@/components/AddTreeForm'
import { Info } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Logo = memo(() => (
  <a href="#" className="flex items-center justify-center gap-2 py-1">
    <Image src="/Logo.png" width={40} height={40} alt="Logo" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-xl dark:text-white">
      Eco Karachi
    </motion.span>
  </a>
))
Logo.displayName = 'Logo'

const LogoIcon = memo(() => (
  <a href="#" className="flex items-center py-1">
    <Image src="/Logo.png" width={40} height={40} alt="Logo" />
  </a>
))
LogoIcon.displayName = 'LogoIcon'

const StatCard = memo(({ label, value, color }) => (
  <div className={`${color} rounded-lg p-4 border`}>
    <p className="text-xs font-medium opacity-80">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
))
StatCard.displayName = 'StatCard'

const Dashboard = memo(({ trees, stats }) => (
  <div className="flex flex-1">
    <div className="flex h-full w-full flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Trees" value={stats.total} color="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" />
        <StatCard label="Verified" value={stats.verified} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" />
        <StatCard label="Pending" value={stats.pending} color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" />
        <StatCard label="Rejected" value={stats.rejected} color="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" />
      </div>
      <div className="flex-1 min-h-0">
        <MapTilerMap center={[24.8607, 67.0011]} zoom={14} trees={trees} />
      </div>
    </div>
  </div>
))
Dashboard.displayName = 'Dashboard'

export default function UserDashboardPage() {
  const { user, profile, signOut, loading: authLoading, supabase } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [trees, setTrees] = useState([])
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 })

  const fetchTrees = useCallback(async () => {
    if (!user || !supabase) return
    const { data } = await supabase.from('trees').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) {
      setTrees(data)
      setStats({
        total: data.length,
        verified: data.filter(t => t.status === 'verified').length,
        pending: data.filter(t => t.status === 'pending').length,
        rejected: data.filter(t => t.status === 'rejected').length
      })
    }
  }, [user, supabase])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTrees() }, [user, supabase])

  const handleLogout = async () => {
    await signOut()
    router.push('/auth')
  }

  const links = [
    { label: 'Add Tree', href: '#', icon: <IconPlant className="h-5 w-5" />, onClick: () => { setDialogOpen(true); setSidebarOpen(false) } },
    { label: 'Profile', href: '/profile', icon: <IconUserBolt className="h-5 w-5" /> },
    { label: 'Info', href: '/info', icon: <Info className="h-5 w-5" /> },
    { label: 'Logout', href: '#', icon: <IconArrowLeft className="h-5 w-5" />, onClick: handleLogout }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
        <div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className={cn('flex w-full flex-col md:flex-row h-screen bg-gray-100 dark:bg-neutral-800')}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-hidden">
            {sidebarOpen ? <Logo /> : <LogoIcon />}
            <div className="flex flex-col items-center justify-center flex-1 gap-4 mt-8">
              {links.map(link => (
                <SidebarLink
                  key={link.label}
                  link={{ ...link, label: <span className="text-lg font-medium">{link.label}</span> }}
                  onClick={link.onClick}
                />
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{stats.total} trees planted</p>
                </div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard trees={trees} stats={stats} />

      <AddTreeDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onTreeAdded={(tree) => {
          setTrees(prev => [tree, ...prev])
          setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }))
        }}
      />
    </div>
  )
}
