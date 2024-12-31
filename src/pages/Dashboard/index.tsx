// src/pages/Dashboard/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Capital Disponible", value: "$50,000", icon: DollarSign },
    { title: "Préstamos Activos", value: "15", icon: Users },
    { title: "Retorno Mensual", value: "$2,500", icon: TrendingUp },
    { title: "Morosidad", value: "2.5%", icon: BarChart }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}