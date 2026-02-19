/**
 * SettingsPage Component
 *
 * Manages admin account settings and system preferences:
 * - Admin email and password
 * - Email notifications toggle
 * - Auto-save preferences
 * - Dashboard reset functionality
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertCircle, CheckCircle } from "lucide-react"
import type { ContentData } from "../types"

interface SettingsPageProps {
  content: ContentData
  hasChanges: boolean
  isSaving: boolean
  saveMessage: string
  onContentChange: (section: keyof ContentData, field: string, value: any) => void
  onSave: () => void
  onReset: () => void
}

export function SettingsPage({
  content,
  hasChanges,
  isSaving,
  saveMessage,
  onContentChange,
  onSave,
  onReset,
}: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-neutral-400">Manage your admin account and system preferences</p>
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

      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-neutral-200">Admin Email</Label>
            <Input
              type="email"
              value={content.settings.adminEmail}
              onChange={(e) => onContentChange("settings", "adminEmail", e.target.value)}
              className="bg-[#0f0f0f] border-neutral-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-200">Admin Password</Label>
            <Input
              type="password"
              value={content.settings.adminPassword}
              onChange={(e) => onContentChange("settings", "adminPassword", e.target.value)}
              className="bg-[#0f0f0f] border-neutral-700 text-white"
            />
          </div>
          <Alert className="bg-orange-500/10 border-orange-500/30 text-orange-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changing these credentials will require you to log in again with the new details.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-neutral-400 text-sm">Receive updates about content changes</p>
            </div>
            <Button variant="outline" className="border-neutral-700 text-neutral-300 bg-transparent">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-save</p>
              <p className="text-neutral-400 text-sm">Automatically save changes every 5 minutes</p>
            </div>
            <Button variant="outline" className="border-neutral-700 text-neutral-300 bg-transparent">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Reset Dashboard</p>
              <p className="text-neutral-400 text-sm">Clear all saved data and restore defaults</p>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirm("Are you sure you want to reset all dashboard data? This cannot be undone.")) {
                  onReset()
                }
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className="bg-[#3B82F6] text-black hover:bg-[#3B82F6]/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
