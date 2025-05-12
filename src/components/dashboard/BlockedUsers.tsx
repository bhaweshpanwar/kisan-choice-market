
import { UserX, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const BlockedUsers = () => {
  const blockedUsers = [
    { 
      id: 1, 
      name: "Rahul Mishra", 
      reason: "Inappropriate behavior / अनुचित व्यवहार", 
      date: "15 Apr 2025" 
    },
    { 
      id: 2, 
      name: "Vijay Singh", 
      reason: "Payment issues / भुगतान में समस्या", 
      date: "02 Apr 2025" 
    },
  ];

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-2">
        <UserX className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Blocked Users / अवरुद्ध उपयोगकर्ता</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Blocked buyers / अवरुद्ध खरीदार</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {blockedUsers.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground">No blocked users / कोई अवरुद्ध उपयोगकर्ता नहीं</p>
          ) : (
            <div className="divide-y">
              {blockedUsers.map((user) => (
                <div key={user.id} className="p-4 flex justify-between items-center">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-destructive/10 text-destructive">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.reason}</p>
                      <p className="text-xs text-muted-foreground">Blocked on: {user.date}</p>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="gap-1">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Unblock / अनब्लॉक
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
