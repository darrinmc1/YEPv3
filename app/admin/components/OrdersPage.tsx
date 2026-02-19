/**
 * OrdersPage Component
 *
 * Manages order form configuration including:
 * - WhatsApp number for order submissions
 * - 3D modeling add-on pricing (simple, medium, complex)
 * - Render package pricing (basic, standard, premium)
 * - Form flow steps and plan configuration
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertCircle, CheckCircle, Eye, Move } from "lucide-react"
import type { ContentData } from "../types"

interface OrdersPageProps {
  content: ContentData
  hasChanges: boolean
  isSaving: boolean
  saveMessage: string
  onContentChange: (section: keyof ContentData, field: string, value: any) => void
  onSave: () => void
}

export function OrdersPage({
  content,
  hasChanges,
  isSaving,
  saveMessage,
  onContentChange,
  onSave,
}: OrdersPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Form Management</h2>
          <p className="text-neutral-400">Configure the order flow, pricing, and form settings</p>
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

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-900/50 border border-neutral-800">
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="modeling"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            3D Modeling
          </TabsTrigger>
          <TabsTrigger
            value="renders"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Renders
          </TabsTrigger>
          <TabsTrigger
            value="flow"
            className="data-[state=active]:bg-[#3B82F6]/20 data-[state=active]:text-[#3B82F6]"
          >
            Form Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Order Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-200">WhatsApp Number</Label>
                <Input
                  value={content.orderForm.whatsappNumber}
                  onChange={(e) => onContentChange("orderForm", "whatsappNumber", e.target.value)}
                  className="bg-[#0f0f0f] border-neutral-700 text-white"
                  placeholder="+1234567890"
                />
                <p className="text-neutral-400 text-sm">
                  Orders will be sent to this WhatsApp number. Include country code.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeling" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">3D Modeling Add-on Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["simple", "medium", "complex"] as const).map((option) => (
                <div key={option} className="p-4 border border-neutral-700 rounded-lg space-y-4">
                  <h4 className="text-white font-semibold capitalize">{option} Modeling</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200">USD Price</Label>
                      <Input
                        type="number"
                        value={content.orderForm.modelingOptions[option].price_usd}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.modelingOptions }
                          newOptions[option].price_usd = Number.parseInt(e.target.value) || 0
                          onContentChange("orderForm", "modelingOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-200">INR Price</Label>
                      <Input
                        type="number"
                        value={content.orderForm.modelingOptions[option].price_inr}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.modelingOptions }
                          newOptions[option].price_inr = Number.parseInt(e.target.value) || 0
                          onContentChange("orderForm", "modelingOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Description</Label>
                      <Input
                        value={content.orderForm.modelingOptions[option].description}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.modelingOptions }
                          newOptions[option].description = e.target.value
                          onContentChange("orderForm", "modelingOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renders" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Render Package Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["basic", "standard", "premium"] as const).map((option) => (
                <div key={option} className="p-4 border border-neutral-700 rounded-lg space-y-4">
                  <h4 className="text-white font-semibold capitalize">{option} Pack</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200">USD Price</Label>
                      <Input
                        type="number"
                        value={content.orderForm.renderOptions[option].price_usd}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.renderOptions }
                          newOptions[option].price_usd = Number.parseInt(e.target.value) || 0
                          onContentChange("orderForm", "renderOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-200">INR Price</Label>
                      <Input
                        type="number"
                        value={content.orderForm.renderOptions[option].price_inr}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.renderOptions }
                          newOptions[option].price_inr = Number.parseInt(e.target.value) || 0
                          onContentChange("orderForm", "renderOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Quantity</Label>
                      <Input
                        type="number"
                        value={content.orderForm.renderOptions[option].quantity}
                        onChange={(e) => {
                          const newOptions = { ...content.orderForm.renderOptions }
                          newOptions[option].quantity = Number.parseInt(e.target.value) || 0
                          onContentChange("orderForm", "renderOptions", newOptions)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-sm text-neutral-400">
                        {content.orderForm.renderOptions[option].quantity} renders
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Plan Configuration</CardTitle>
              <p className="text-neutral-400 text-sm">Configure which plans include 3D modeling</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-neutral-700 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Startup Plan</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 text-sm">Includes Simple 3D Modeling</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Included</Badge>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2">
                    Skips 3D model questions, goes straight to render upsell
                  </p>
                </div>
                <div className="p-4 border border-neutral-700 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Pro Plan</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 text-sm">Optional 3D Modeling</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Optional</Badge>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2">Asks if user has model, offers modeling add-ons</p>
                </div>
                <div className="p-4 border border-neutral-700 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Premium Plan</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 text-sm">Includes Complex 3D Modeling</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Included</Badge>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2">
                    Skips 3D model questions, goes straight to render upsell
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Order Form Flow</CardTitle>
              <p className="text-neutral-400 text-sm">Configure the steps in your order form</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.orderForm.formSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-neutral-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center text-[#3B82F6] font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...content.orderForm.formSteps]
                          newSteps[index].title = e.target.value
                          onContentChange("orderForm", "formSteps", newSteps)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white font-medium"
                        placeholder="Step title"
                      />
                      <Input
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...content.orderForm.formSteps]
                          newSteps[index].description = e.target.value
                          onContentChange("orderForm", "formSteps", newSteps)
                        }}
                        className="bg-[#0f0f0f] border-neutral-700 text-white text-sm"
                        placeholder="Step description"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSteps = [...content.orderForm.formSteps]
                        newSteps[index].enabled = !newSteps[index].enabled
                        onContentChange("orderForm", "formSteps", newSteps)
                      }}
                      className={`${
                        step.enabled
                          ? "text-green-400 hover:text-green-300"
                          : "text-neutral-500 hover:text-neutral-400"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-300">
                      <Move className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-neutral-400 text-sm">Active steps in order:</p>
                <div className="flex flex-wrap gap-2">
                  {content.orderForm.formSteps
                    .filter((step) => step.enabled)
                    .map((step, index) => (
                      <Badge key={index} className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30">
                        {index + 1}. {step.title}
                      </Badge>
                    ))}
                </div>
                <Button
                  onClick={() => window.open("/checkout?plan=pro", "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Test Order Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
