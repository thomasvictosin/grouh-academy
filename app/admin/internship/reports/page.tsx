'use client'

        import { BarChart3, Download, TrendingUp } from 'lucide-react'
        import AdminShell from '@/components/AdminShell'

        const cards = [
          { value: '1,248', label: 'Total learners', icon: BarChart3, tone: 'text-[#5FBB46]' },
          { value: '82%', label: 'Completion rate', icon: TrendingUp, tone: 'text-blue-500' },
          { value: '$37,500', label: 'Revenue generated', icon: Download, tone: 'text-[#1C1D52]' },
        ]

        export default function InternshipReportsPage() {
          const handleExportCsv = () => {
            const rows = [
              ['Metric', 'Value'],
              ['Total learners', '1248'],
              ['Completion rate', '82%'],
              ['Revenue generated', '$37500'],
            ]
            const csv = rows
              .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
              .join('\n')
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'internship-reports.csv'
            link.click()
            URL.revokeObjectURL(url)
          }

          return (
            <AdminShell workspace="internship">
              <div className="mx-auto max-w-[1400px] space-y-5">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Reports</h1>
                    <p className="mt-2 text-xs text-slate-500">Review performance, revenue, and progress metrics for the internship workspace.</p>
                  </div>
                  <button type="button" onClick={handleExportCsv} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </button>
                </header>

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                  {cards.map(({ value, label, icon: Icon, tone }) => (
                    <div key={label} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-md bg-[#dceeff] ${tone}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
                      <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>

                <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                  <h2 className="text-sm font-bold text-[#1C1D52]">Highlights</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {[
                      ['Top track', 'Software Development', '76% of active learners'],
                      ['Average mentor rating', '4.8 / 5', 'Across 18 mentors'],
                      ['Completion momentum', '+12%', 'Compared with last month'],
                    ].map(([label, value, detail]) => (
                      <div key={label} className="rounded-xl bg-[#f8fbff] p-4">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
                        <p className="mt-2 text-lg font-bold text-[#1C1D52]">{value}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </AdminShell>
          )
        }
