import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3 } from "lucide-react"
import { AnalyticsMetric } from "../types"

interface AnalyticsPageProps {
  analyticsData: AnalyticsMetric[]
}

export function AnalyticsPage({ analyticsData }: AnalyticsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-neutral-400">Monitor your website performance and user engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <Card key={index} className="bg-[#1a1a1a] border-neutral-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-neutral-400 text-sm">{item.metric}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${item.trend === "up" ? "text-green-400" : "text-red-400"}`}
                  >
                    {item.change}
                  </span>
                  <TrendingUp
                    className={`h-4 w-4 ${item.trend === "up" ? "text-green-400" : "text-red-400 rotate-180"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analytics chart would be displayed here</p>
              <p className="text-sm">Integration with Google Analytics or similar service</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { page: "Homepage", views: "5,432", change: "+12.3%" },
              { page: "About Us", views: "2,871", change: "+8.7%" },
              { page: "Pricing", views: "2,103", change: "+15.2%" },
              { page: "3D Product Rendering", views: "1,654", change: "+9.5%" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f]">
                <div>
                  <p className="text-white font-medium">{item.page}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-300">{item.views} views</span>
                  <span className="text-green-400 font-semibold">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
