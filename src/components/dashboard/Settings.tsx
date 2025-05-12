
import { Settings as SettingsIcon, HelpCircle, User, Globe, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Settings = () => {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Settings / सेटिंग्स</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Language / भाषा</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="bilingual">
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english">English Only</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="hindi" id="hindi" />
              <Label htmlFor="hindi">केवल हिंदी</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bilingual" id="bilingual" />
              <Label htmlFor="bilingual">Both / दोनों</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account / खाता</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Profile Info / प्रोफ़ाइल जानकारी
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            Contact Support / सहायता केंद्र
          </Button>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>App Version: 1.0.2</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>© 2025 Kisan App / किसान ऐप</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
