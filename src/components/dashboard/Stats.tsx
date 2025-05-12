
import { BarChart, Banknote, Package, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Stats = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Insights / इनसाइट्स</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total earnings" 
          titleHindi="कुल कमाई"
          value="₹12,500"
          icon={Banknote}
          trend="+12% from last month"
          trendHindi="पिछले महीने से +12%"
          trendUp
        />
        
        <StatCard 
          title="Products listed" 
          titleHindi="सूचीबद्ध उत्पाद"
          value="24"
          icon={Package}
          trend="+3 new this week"
          trendHindi="इस सप्ताह +3 नए"
          trendUp
        />
        
        <StatCard 
          title="Orders received" 
          titleHindi="प्राप्त आदेश"
          value="8"
          icon={ShoppingCart}
          trend="2 pending delivery"
          trendHindi="2 वितरण के लिए लंबित"
        />
        
        <StatCard 
          title="Most viewed product" 
          titleHindi="सबसे ज्यादा देखा गया उत्पाद"
          value="Basmati Rice"
          valueHindi="बासमती चावल"
          icon={Eye}
          trend="1,240 views"
          trendHindi="1,240 व्यूज़"
          trendUp
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  titleHindi: string;
  value: string;
  valueHindi?: string;
  icon: React.ElementType;
  trend: string;
  trendHindi: string;
  trendUp?: boolean;
}

const StatCard = ({ 
  title, 
  titleHindi, 
  value, 
  valueHindi, 
  icon: Icon, 
  trend, 
  trendHindi, 
  trendUp 
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex flex-col">
          <span>{title}</span>
          <span className="text-muted-foreground text-xs">{titleHindi}</span>
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {valueHindi && (
          <div className="text-sm text-muted-foreground">{valueHindi}</div>
        )}
        <p className={`text-xs mt-1 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-muted-foreground'}`}>
          {trend}
          <span className="text-muted-foreground">{trendHindi}</span>
        </p>
      </CardContent>
    </Card>
  );
};
