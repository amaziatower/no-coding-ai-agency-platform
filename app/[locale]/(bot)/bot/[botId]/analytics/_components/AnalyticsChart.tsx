// app/[locale]/(bot)/bot/[botId]/analytics/_components/AnalyticsChart.tsx
'use client'
import {
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

interface AnalyticsChartProps {
  data: Array<any>
  translations: {
    title: string
    description: string
    questionsAsked: string
    lastUpdated: string
  }
}

export default function AnalyticsChart({
  data,
  translations,
}: AnalyticsChartProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>{translations.title}</CardTitle>
            <CardDescription>{translations.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_questions"
                  fill="#8884d8"
                  name={translations.questionsAsked}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <p>
              {translations.lastUpdated} {new Date().toLocaleTimeString()}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
