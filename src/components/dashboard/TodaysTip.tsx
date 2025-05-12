
import { Sun, CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TodaysTip = () => {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-2">
        <CloudSun className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Today's Tip / आज की सलाह</h2>
      </div>
      
      <Card className="bg-gradient-to-br from-secondary to-secondary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full">
              <Sun className="h-8 w-8 text-yellow-500" />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Monsoon Preparation</h3>
              <p className="text-sm text-muted-foreground mb-1">मानसून की तैयारी</p>
              <p className="text-sm">
                Prepare your fields for the upcoming monsoon season. Clear drainage channels and consider 
                crop planning accordingly.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                आने वाले मानसून के मौसम के लिए अपने खेतों को तैयार करें। जल निकासी चैनलों को साफ करें और 
                तदनुसार फसल की योजना बनाएं।
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Weather</span>
                  <span className="font-medium">32°C / Sunny</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>आज का मौसम</span>
                  <span>32°C / धूप</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
