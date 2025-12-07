'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Users, Trees, Check, Pencil, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const MapTilerMap = dynamic(() => import('@/components/MapTilerMap'), { ssr: false })

const StatCard = memo(({ title, value, icon: Icon, gradient }) => (
  <Card className={`rounded-2xl shadow-sm bg-gradient-to-br ${gradient} text-white`}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-sm font-medium">
        <Icon className="w-4 h-4" /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent><p className="text-3xl font-bold">{value}</p></CardContent>
  </Card>
))
StatCard.displayName = 'StatCard'

const StatusBadge = memo(({ status }) => {
  const colors = {
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  }
  return <span className={`px-3 py-1 rounded-xl text-sm font-medium ${colors[status] || colors.pending}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>
})
StatusBadge.displayName = 'StatusBadge'

export default function AdminDashboard() {
  const { user, profile, signOut, loading: authLoading, supabase } = useAuth()
  const router = useRouter()
  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, totalTrees: 0, pendingTrees: 0, verifiedTrees: 0 })
  const [editing, setEditing] = useState(null)
  const [status, setStatus] = useState('pending')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    try {
      // Fetch all trees (without join - foreign key not set up)
      const { data: treesData, error: treesError } = await supabase
        .from('trees')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (treesError) {
        console.error('Trees fetch error:', treesError)
      }

      // Fetch profiles separately to get user info
      let treesWithProfiles = treesData || []
      if (treesData && treesData.length > 0) {
        const userIds = [...new Set(treesData.map(t => t.user_id).filter(Boolean))]
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)
          
          const profilesMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]))
          treesWithProfiles = treesData.map(t => ({
            ...t,
            profiles: profilesMap[t.user_id] || null
          }))
        }
      }
      
      // Fetch user count
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.error('Count error:', countError)
      }

      console.log('Fetched trees:', treesWithProfiles)
      setTrees(treesWithProfiles)
      setStats({
        totalUsers: count || 0,
        totalTrees: treesData?.length || 0,
        pendingTrees: treesData?.filter(t => t.status === 'pending').length || 0,
        verifiedTrees: treesData?.filter(t => t.status === 'verified').length || 0
      })
    } catch (e) { 
      console.error('Fetch error:', e) 
    }
    setLoading(false)
  }, [supabase])

  // Fetch data when component mounts (removed admin check for now)
  useEffect(() => { 
    if (user) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const saveStatus = async (id) => {
    setSaving(true)
    try {
      const update = {
        status,
        verified_by: status === 'verified' ? user.id : null,
        verified_at: status === 'verified' ? new Date().toISOString() : null,
        rejection_reason: status === 'rejected' ? reason : null
      }
      await supabase.from('trees').update(update).eq('id', id)
      setTrees(prev => prev.map(t => t.id === id ? { ...t, ...update } : t))
      const oldStatus = trees.find(t => t.id === id)?.status
      setStats(s => ({
        ...s,
        pendingTrees: s.pendingTrees + (status === 'pending' ? 1 : 0) - (oldStatus === 'pending' ? 1 : 0),
        verifiedTrees: s.verifiedTrees + (status === 'verified' ? 1 : 0) - (oldStatus === 'verified' ? 1 : 0)
      }))
      setEditing(null)
      setReason('')
    } catch (e) { alert('Failed to update') }
    setSaving(false)
  }

  const logout = async () => { await signOut(); router.push('/auth') }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900"><div className="animate-spin h-10 w-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>
  }

  // Allow access for testing - remove or add proper admin check later
  const isAdmin = profile?.role === 'admin'
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 gap-4">
        <h1 className="text-2xl font-bold text-red-600">Please Login</h1>
        <p className="text-gray-500">You need to be logged in to access this page.</p>
        <Button onClick={() => router.push('/auth')}>Login</Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome, {profile?.full_name || user?.email || 'Admin'}</p>
          <p className="text-xs text-gray-400">Role: {profile?.role || 'not loaded'} {isAdmin ? '✅' : '⚠️'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>User Dashboard</Button>
          <Button variant="destructive" size="sm" onClick={logout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <strong>Note:</strong> You are viewing this page but your role is &quot;{profile?.role || 'unknown'}&quot;. 
          To get admin access, update your profile role in Supabase to &quot;admin&quot;.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} gradient="from-[#2193b0] to-[#6dd5ed]" />
        <StatCard title="Total Trees" value={stats.totalTrees} icon={Trees} gradient="from-[#2E7D32] to-[#AED581]" />
        <StatCard title="Pending" value={stats.pendingTrees} icon={RefreshCw} gradient="from-[#fc4a1a] to-[#f7b733]" />
        <StatCard title="Verified" value={stats.verifiedTrees} icon={Check} gradient="from-[#11998e] to-[#38ef7d]" />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Tree Records ({trees.length})</CardTitle></CardHeader>
        <CardContent>
          {trees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No trees found in database</p>
              <p className="text-sm text-gray-400">Add some trees from the User Dashboard first</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tree</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trees.map(tree => (
                  <TableRow key={tree.id}>
                    <TableCell>
                      <p className="font-medium">{tree.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{tree.profiles?.email}</p>
                    </TableCell>
                    <TableCell>{tree.tree_name}</TableCell>
                    <TableCell>
                      {tree.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tree.photo_url} alt="" className="w-12 h-12 object-cover rounded cursor-pointer hover:scale-110 transition" onClick={() => window.open(tree.photo_url, '_blank')} />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"><Trees className="w-6 h-6 text-gray-400" /></div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{tree.address || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{tree.latitude?.toFixed(4)}, {tree.longitude?.toFixed(4)}</p>
                    </TableCell>
                    <TableCell>{new Date(tree.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Popover open={editing === tree.id} onOpenChange={o => { if (o) { setEditing(tree.id); setStatus(tree.status); setReason(tree.rejection_reason || '') } else setEditing(null) }}>
                          <PopoverTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><Pencil className="w-4 h-4 text-gray-600" /></button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <h4 className="font-medium mb-2">Update Status</h4>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            {status === 'rejected' && <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason..." className="mt-2" rows={2} />}
                            <Button onClick={() => saveStatus(tree.id)} className="w-full mt-3 bg-green-600 hover:bg-green-700" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                          </PopoverContent>
                        </Popover>
                        <StatusBadge status={tree.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <CardHeader><CardTitle>All Tree Locations</CardTitle></CardHeader>
        <CardContent className="h-[400px] p-0">
          <MapTilerMap center={[24.8607, 67.0011]} zoom={12} trees={trees} />
        </CardContent>
      </Card>
    </div>
  )
}
