import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Users, Calendar, DollarSign, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { name: "Usuarios activos", value: "1,240", icon: Users },
    { name: "Eventos publicados", value: "85", icon: Calendar },
    { name: "Ingresos mensuales", value: "$12,430", icon: DollarSign },
    { name: "Visitas al sitio", value: "34,500", icon: BarChart3 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Bienvenido al panel de administración de TicTech.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 flex items-center space-x-4 shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Example section */}
      <Card className="p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Últimos eventos creados</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Concierto Rock</span>
            <span className="text-gray-500">12/08/2025</span>
          </li>
          <li className="flex justify-between">
            <span>Festival Jazz</span>
            <span className="text-gray-500">22/08/2025</span>
          </li>
          <li className="flex justify-between">
            <span>Obra de Teatro</span>
            <span className="text-gray-500">01/09/2025</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
