import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, Upload, Trash2, AlertTriangle, FileText, Lock } from "lucide-react";
import { exportUserData, importUserData, clearAllUserData } from "@/lib/local-storage";

export function PrivacyControls() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [importData, setImportData] = useState("");
  const [exportedData, setExportedData] = useState("");
  const { toast } = useToast();

  const handleExportData = () => {
    try {
      const data = exportUserData();
      setExportedData(data);
      setShowExportDialog(true);
      
      // Also trigger download
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `moodieverse-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your wellness data has been downloaded as a backup file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = () => {
    try {
      const success = importUserData(importData);
      if (success) {
        toast({
          title: "Data imported successfully",
          description: "Your wellness data has been restored. Refresh the page to see your data.",
        });
        setShowImportDialog(false);
        setImportData("");
        // Refresh the page to reload data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          title: "Import failed",
          description: "Invalid data format. Please check your backup file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Unable to import data. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    try {
      clearAllUserData();
      toast({
        title: "Data cleared successfully",
        description: "All your wellness data has been removed. Refresh to start fresh.",
      });
      setShowClearDialog(false);
      // Refresh the page to show clean state
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Clear failed",
        description: "Unable to clear data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-1 flex items-center">
              <Shield className="text-slate-600 mr-2" size={20} />
              Privacy & Data Control
            </h3>
            <p className="text-gray-600 text-sm">
              Your data stays private and under your complete control
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center">
                <Lock className="text-white" size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>All data is stored locally on your device</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Data */}
          <Button 
            onClick={handleExportData}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center text-center hover:bg-green-50 border-green-200"
          >
            <Download className="text-green-600 mb-2" size={20} />
            <div className="text-sm font-medium text-gray-800">Export Data</div>
            <div className="text-xs text-gray-600">Backup your journey</div>
          </Button>

          {/* Import Data */}
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center text-center hover:bg-blue-50 border-blue-200"
              >
                <Upload className="text-blue-600 mb-2" size={20} />
                <div className="text-sm font-medium text-gray-800">Import Data</div>
                <div className="text-xs text-gray-600">Restore from backup</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Upload className="mr-2" size={20} />
                  Import Wellness Data
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Paste your exported MoodieVerse data below to restore your wellness journey.
                </p>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your backup data here..."
                  className="min-h-[200px] font-mono text-xs"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleImportData}
                    disabled={!importData.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Import Data
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowImportDialog(false);
                      setImportData("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Clear Data */}
          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center text-center hover:bg-red-50 border-red-200"
              >
                <Trash2 className="text-red-600 mb-2" size={20} />
                <div className="text-sm font-medium text-gray-800">Clear Data</div>
                <div className="text-xs text-gray-600">Start fresh</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2" size={20} />
                  Clear All Data
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-2">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-sm text-red-700">
                    This will permanently delete all your mood entries, garden progress, 
                    streak data, and personal settings from this device.
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Consider exporting your data first if you want to keep a backup.
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleClearData}
                    variant="destructive"
                    className="flex-1"
                  >
                    Yes, Clear Everything
                  </Button>
                  <Button 
                    onClick={() => setShowClearDialog(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="mr-2" size={20} />
                Your Exported Data
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your wellness data has been exported and downloaded. You can also copy the data below for manual backup:
              </p>
              <Textarea
                value={exportedData}
                readOnly
                className="min-h-[300px] font-mono text-xs bg-gray-50"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Store this backup in a safe place. You can import it later to restore your wellness journey on any device.
                </p>
              </div>
              <Button 
                onClick={() => setShowExportDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>🔒 <strong>Privacy Promise:</strong> All your data stays on your device</p>
            <p>🚫 <strong>No Tracking:</strong> We don't collect or share your personal information</p>
            <p>💾 <strong>Your Control:</strong> Export, import, or delete your data anytime</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}