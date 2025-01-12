'use client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  { day: 'Monday', interactions: 2400, satisfaction: 75 },
  { day: 'Tuesday', interactions: 1398, satisfaction: 82 },
  { day: 'Wednesday', interactions: 9800, satisfaction: 65 },
  { day: 'Thursday', interactions: 3908, satisfaction: 78 },
  { day: 'Friday', interactions: 4800, satisfaction: 89 },
  { day: 'Saturday', interactions: 3800, satisfaction: 85 },
  { day: 'Sunday', interactions: 4300, satisfaction: 90 },
]

const linedata = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Dashboard</CardTitle>
            <CardDescription>
              Weekly Interaction and User Satisfaction Overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis orientation="left" stroke="#8884d8" yAxisId="left" />
                <YAxis orientation="right" stroke="#82ca9d" yAxisId="right" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="interactions"
                  fill="#8884d8"
                  name="Interactions"
                  yAxisId="left"
                />
                <Bar
                  dataKey="satisfaction"
                  fill="#82ca9d"
                  name="Satisfaction (%)"
                  yAxisId="right"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <p>Last updated at {new Date().toLocaleTimeString()}</p>
          </CardFooter>
        </Card>
      </div>
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Sales Data Overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <LineChart
                data={linedata}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  activeDot={{ r: 8 }}
                  dataKey="pv"
                  stroke="#8884d8"
                  type="monotone"
                />
                <Line dataKey="uv" stroke="#82ca9d" type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <p>Updated at {new Date().toLocaleTimeString()}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
