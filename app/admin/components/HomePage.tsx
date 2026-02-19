import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react"
import { ActivityItem } from "../types"

interface HomePageProps {
  activityItems: ActivityItem[]
  activityPage: number
  onNavigateActivity: (direction: "prev" | "next") => void
  onNavigateTo: (page: string) => void
  onPreview: () => void
  totalUsers: number | null
  contentCount: number
}

export function HomePage({
  activityItems,
  activityPage,
  onNavigateActivity,
  onNavigateTo,
  onPreview,
  totalUsers,
  contentCount,
}: HomePageProps) {
  const currentActivityItems = activityItems.slice(activityPage * 4, (activityPage + 1) * 4)

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Content Management Active</h3>
              <p className="text-purple-100">Your website content is live and ready for updates.</p>
            </div>
          </div>
          <Button onClick={onPreview} className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6">
            Preview Site
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-neutral-400 text-sm">Total Content Sections</p>
                <p className="text-2xl font-bold text-white">{contentCount}</p>
              </div>
              <Button
                onClick={() => onNavigateTo("content")}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
              >
                Manage content <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-neutral-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{totalUsers !== null ? totalUsers : "-"}</p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Updates</CardTitle>
            <p className="text-neutral-400 text-sm">Content changes from the last 24 hours</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={() => onNavigateActivity("prev")}
              disabled={activityPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={() => onNavigateActivity("next")}
              disabled={(activityPage + 1) * 4 >= activityItems.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentActivityItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-neutral-400 text-sm">
                    {item.status} • {item.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">{item.change}</span>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div >
  )
}
