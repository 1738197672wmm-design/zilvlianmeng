import { useState, useEffect } from 'react'
import { Users, Heart, MessageSquare, Plus } from 'lucide-react'
import { DataCard } from '@/components/DataCard'
import { useDataStore, FeedActivity } from '@/stores/dataStore'
import { formatRelative } from '@/utils/format'

export function Feed() {
  const { feed, fetchFeed, loading } = useDataStore()
  const [showInvite, setShowInvite] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  useEffect(() => { fetchFeed() }, [fetchFeed])

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
    setGeneratedCode(code)
    setInviteCode(code)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      body: '更新了身体数据',
      workout: '完成了训练',
      cardio: '做了有氧运动',
      diet: '记录了饮食',
      goal: '设定了新目标',
    }
    return labels[type] || '更新了动态'
  }

  return (
    <div className="animate-fade-in pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">好友动态</h1>
        <button
          onClick={() => setShowInvite(true)}
          className="px-4 py-2 bg-bg-card border border-border hover:border-border-light rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <Users className="w-4 h-4" />
          邀请好友
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : feed.length === 0 ? (
        <DataCard>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">还没有动态</p>
            <p className="text-text-muted text-xs mt-1">邀请朋友一起打卡，热闹起来！</p>
          </div>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {feed.map(activity => (
            <DataCard key={activity.id} className="!p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-sm font-bold text-accent-primary flex-shrink-0">
                  {activity.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{activity.username}</span>
                    <span className="text-xs text-text-muted">{getTypeLabel(activity.type)}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{formatRelative(activity.createdAt)}</span>
                  </div>

                  {/* Activity details */}
                  <div className="mt-2 p-3 bg-bg-input rounded-lg text-sm text-text-secondary">
                    {activity.type === 'body' && activity.data?.weight && (
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-lg font-bold text-text-primary">{activity.data.weight}</div>
                          <div className="text-xs text-text-muted">kg</div>
                        </div>
                        {activity.data.bodyFatPercent && (
                          <div>
                            <div className="text-lg font-bold text-text-primary">{activity.data.bodyFatPercent}%</div>
                            <div className="text-xs text-text-muted">体脂</div>
                          </div>
                        )}
                      </div>
                    )}
                    {activity.type === 'workout' && (
                      <div>
                        <div className="font-medium text-text-primary">{activity.data?.exerciseName}</div>
                        {activity.data?.sets && <div className="text-xs text-text-muted mt-0.5">{activity.data.sets}组 × {activity.data.reps}次</div>}
                      </div>
                    )}
                    {activity.type === 'cardio' && (
                      <div>
                        <div className="font-medium text-text-primary">{activity.data?.type}</div>
                        {activity.data?.durationMinutes && <div className="text-xs text-text-muted mt-0.5">{activity.data.durationMinutes} 分钟</div>}
                      </div>
                    )}
                    {activity.type === 'diet' && (
                      <div>
                        <div className="font-medium text-text-primary">{activity.data?.foodName}</div>
                        {activity.data?.calories && <div className="text-xs text-text-muted mt-0.5">{activity.data.calories} kcal</div>}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-danger transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      {activity.likes || 0}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-primary transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      评论
                    </button>
                  </div>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="邀请好友">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">生成邀请码分享给朋友，他们凭码注册加入。</p>

          <div className="p-4 bg-bg-input rounded-lg text-center">
            {generatedCode ? (
              <div>
                <div className="text-2xl font-bold text-gradient tracking-widest mb-2">{generatedCode}</div>
                <p className="text-xs text-text-muted">将此邀请码分享给朋友</p>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="mt-3 px-4 py-1.5 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors"
                >
                  复制邀请码
                </button>
              </div>
            ) : (
              <button onClick={handleGenerateCode} className="px-4 py-2 bg-accent-primary hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors">
                生成新邀请码
              </button>
            )}
          </div>

          {generatedCode && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">手动输入邀请码</label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary uppercase tracking-widest text-center focus:outline-none focus:border-accent-primary/50"
                placeholder="输入邀请码"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
