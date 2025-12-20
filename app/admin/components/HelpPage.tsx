import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Help & Support</h2>
        <p className="text-neutral-400">Get assistance with using the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-black text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium">Edit Content</p>
                <p className="text-neutral-400 text-sm">Go to Content section to update your website text</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-black text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium">Update Pricing</p>
                <p className="text-neutral-400 text-sm">Manage your pricing plans and video examples</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-black text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium">Save Changes</p>
                <p className="text-neutral-400 text-sm">Always save your changes before leaving</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-white font-medium">Email Support</p>
              <p className="text-neutral-400 text-sm">admin@YourExitPlans.com</p>
            </div>
            <div>
              <p className="text-white font-medium">Response Time</p>
              <p className="text-neutral-400 text-sm">Usually within 24 hours</p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                alert("Support request sent! Our team will contact you shortly.")
              }}
            >
              Send Support Request
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a1a1a] border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-white font-medium mb-2">How do I update the homepage content?</p>
            <p className="text-neutral-400 text-sm">
              Navigate to Content → Hero tab, make your changes, and click Save Changes.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Can I preview changes before saving?</p>
            <p className="text-neutral-400 text-sm">
              Yes, click the Preview button to open your website in a new tab.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-2">How do I add new videos to pricing plans?</p>
            <p className="text-neutral-400 text-sm">
              Go to Pricing section, select a plan, and add YouTube video IDs in the Video Examples field.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Is my data saved securely?</p>
            <p className="text-neutral-400 text-sm">
              All data is stored locally in your browser. For production use, we recommend implementing server-side
              storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
