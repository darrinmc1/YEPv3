/**
 * PricingPage Component
 *
 * Manages pricing tiers, features, and video examples for each plan.
 * Allows admin to update USD/INR prices, add/remove features, and manage YouTube videos.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertCircle, CheckCircle, Video, Plus, Trash2 } from "lucide-react"
import type { ContentData } from "../types"

interface PricingPageProps {
  content: ContentData
  hasChanges: boolean
  isSaving: boolean
  saveMessage: string
  onPricingChange: (tier: "startup" | "pro" | "premium", field: string, value: string | string[]) => void
  onSave: () => void
}

export function PricingPage({
  content,
  hasChanges,
  isSaving,
  saveMessage,
  onPricingChange,
  onSave,
}: PricingPageProps) {
  const [currentPricingTier, setCurrentPricingTier] = useState<"startup" | "pro" | "premium">("startup")
  const [videoToAdd, setVideoToAdd] = useState("")
  const [featureToAdd, setFeatureToAdd] = useState("")

  const extractYoutubeId = (input: string): string => {
    let videoId = input.trim()

    // Handle youtube.com/watch?v= format
    if (videoId.includes("youtube.com/watch?v=")) {
      videoId = videoId.split("v=")[1]?.split("&")[0] || videoId
    }

    // Handle youtu.be/ format
    if (videoId.includes("youtu.be/")) {
      videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || videoId
    }

    return videoId
  }

  const addFeature = (tier: "startup" | "pro" | "premium") => {
    if (featureToAdd.trim()) {
      onPricingChange(tier, "features", [...content.pricing[tier].features, featureToAdd.trim()])
      setFeatureToAdd("")
    }
  }

  const removeFeature = (tier: "startup" | "pro" | "premium", index: number) => {
    const newFeatures = [...content.pricing[tier].features]
    newFeatures.splice(index, 1)
    onPricingChange(tier, "features", newFeatures)
  }

  const addVideo = (tier: "startup" | "pro" | "premium") => {
    if (videoToAdd.trim()) {
      const videoId = extractYoutubeId(videoToAdd)
      onPricingChange(tier, "videos", [...content.pricing[tier].videos, videoId])
      setVideoToAdd("")
    }
  }

  const removeVideo = (tier: "startup" | "pro" | "premium", index: number) => {
    const newVideos = [...content.pricing[tier].videos]
    newVideos.splice(index, 1)
    onPricingChange(tier, "videos", newVideos)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pricing Management</h2>
          <p className="text-neutral-400">Update pricing tiers and video examples</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Unsaved changes</Badge>
          )}
          <Button
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className="bg-[#3B82F6] text-black hover:bg-[#3B82F6]/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <Alert
          className={`${saveMessage.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-green-500/10 border-green-500/30 text-green-300"}`}
        >
          {saveMessage.includes("Error") ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="startup"
        className="w-full"
        onValueChange={(value) => setCurrentPricingTier(value as "startup" | "pro" | "premium")}
      >
        <TabsList className="grid w-full grid-cols-3 bg-neutral-900/50 border border-neutral-800">
          <TabsTrigger
            value="startup"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Startup
          </TabsTrigger>
          <TabsTrigger
            value="pro"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Pro
          </TabsTrigger>
          <TabsTrigger
            value="premium"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Premium
          </TabsTrigger>
        </TabsList>

        {(["startup", "pro", "premium"] as const).map((tier) => (
          <TabsContent key={tier} value={tier} className="space-y-6">
            <Card className="bg-[#1a1a1a] border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white capitalize">{tier} Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-neutral-200">USD Price</Label>
                    <Input
                      value={content.pricing[tier].price_usd}
                      onChange={(e) => onPricingChange(tier, "price_usd", e.target.value)}
                      className="bg-[#0f0f0f] border-neutral-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-neutral-200">INR Price</Label>
                    <Input
                      value={content.pricing[tier].price_inr}
                      onChange={(e) => onPricingChange(tier, "price_inr", e.target.value)}
                      className="bg-[#0f0f0f] border-neutral-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-200">Features</Label>
                  <div className="space-y-3">
                    {content.pricing[tier].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...content.pricing[tier].features]
                            newFeatures[index] = e.target.value
                            onPricingChange(tier, "features", newFeatures)
                          }}
                          className="bg-[#0f0f0f] border-neutral-700 text-white"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(tier, index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={featureToAdd}
                        onChange={(e) => setFeatureToAdd(e.target.value)}
                        placeholder="Add new feature..."
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                        onKeyPress={(e) => e.key === "Enter" && addFeature(tier)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => addFeature(tier)}
                        className="border-neutral-700 text-neutral-300 bg-transparent"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Management */}
            <Card className="bg-[#1a1a1a] border-neutral-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-400" />
                  <CardTitle className="text-white">Video Examples</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={videoToAdd}
                      onChange={(e) => setVideoToAdd(e.target.value)}
                      placeholder="Add YouTube video ID or URL..."
                      className="bg-[#0f0f0f] border-neutral-700 text-white"
                      onKeyPress={(e) => e.key === "Enter" && addVideo(tier)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addVideo(tier)}
                      className="border-neutral-700 text-neutral-300 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {content.pricing[tier].videos.map((videoId, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            allowFullScreen
                            title={`${tier} plan video ${index + 1}`}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVideo(tier, index)}
                          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full w-6 h-6 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
