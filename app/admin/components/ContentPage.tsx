import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Save, Sparkles, AlertCircle, CheckCircle } from "lucide-react"
import { ContentData } from "../types"

interface ContentPageProps {
  content: ContentData
  hasChanges: boolean
  isSaving: boolean
  saveMessage: string
  onContentChange: (section: keyof ContentData, field: string, value: string) => void
  onSave: () => void
  onPreview: () => void
}

export function ContentPage({
  content,
  hasChanges,
  isSaving,
  saveMessage,
  onContentChange,
  onSave,
  onPreview,
}: ContentPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Management</h2>
          <p className="text-neutral-400">Edit your website content and sections</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Unsaved changes</Badge>
          )}
          <Button
            onClick={onPreview}
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
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
          {saveMessage.includes("Error") ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-900/50 border border-neutral-800">
          <TabsTrigger
            value="hero"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Hero
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Features
          </TabsTrigger>
          <TabsTrigger
            value="footer"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Footer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Hero Section</CardTitle>
                  <p className="text-neutral-400 text-sm">The main banner that visitors see first</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-200">Main Title</Label>
                <Textarea
                  value={content.hero.title}
                  onChange={(e) => onContentChange("hero", "title", e.target.value)}
                  className="min-h-[80px] bg-[#0f0f0f] border-neutral-700 text-white"
                  placeholder="Enter your main headline..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-200">Subtitle</Label>
                  <Input
                    value={content.hero.subtitle}
                    onChange={(e) => onContentChange("hero", "subtitle", e.target.value)}
                    className="bg-[#0f0f0f] border-neutral-700 text-white"
                    placeholder="Enter subtitle..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-200">Button Text</Label>
                  <Input
                    value={content.hero.buttonText}
                    onChange={(e) => onContentChange("hero", "buttonText", e.target.value)}
                    className="bg-[#0f0f0f] border-neutral-700 text-white"
                    placeholder="Enter button text..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Features Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-200">Section Title</Label>
                <Input
                  value={content.features.title}
                  onChange={(e) => onContentChange("features", "title", e.target.value)}
                  className="bg-[#0f0f0f] border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-200">Section Subtitle</Label>
                <Input
                  value={content.features.subtitle}
                  onChange={(e) => onContentChange("features", "subtitle", e.target.value)}
                  className="bg-[#0f0f0f] border-neutral-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Footer Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-200">Tagline</Label>
                <Textarea
                  value={content.footer.tagline}
                  onChange={(e) => onContentChange("footer", "tagline", e.target.value)}
                  className="min-h-[60px] bg-[#0f0f0f] border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-200">Copyright Text</Label>
                <Input
                  value={content.footer.copyright}
                  onChange={(e) => onContentChange("footer", "copyright", e.target.value)}
                  className="bg-[#0f0f0f] border-neutral-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
