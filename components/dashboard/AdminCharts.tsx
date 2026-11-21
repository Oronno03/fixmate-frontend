"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import type { AdminStats } from "@/lib/types";

const GOLD = "#C9A227";
const CHART_COLORS = ["#C9A227", "#D6B84C", "#A88A2A", "#8F7830", "#6F5D28"];

const tooltipStyle = {
  backgroundColor: "#201F1B",
  border: "1px solid #302E29",
  borderRadius: "0.75rem",
  color: "#E8E5DE",
  fontSize: "12px",
};

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div>
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5 h-64 w-full">{children}</div>
    </div>
  );
}

export function AdminCharts({ stats }: { stats: AdminStats }) {
  const bookingData = stats.bookingsByStatus.map((item) => ({
    name: BOOKING_STATUS_LABELS[item._id] ?? item._id,
    count: item.count,
  }));

  const revenueData = stats.revenueByMonth.map((item) => {
    const [year, month] = item._id.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return {
      name: Number.isNaN(date.getTime())
        ? item._id
        : date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      total: Number(item.total) || 0,
    };
  });

  const categoryData = stats.servicesByCategory.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Revenue over time"
        description="Total Stripe payments collected each month."
      >
        {revenueData.length === 0 ? (
          <p className="grid h-full place-items-center text-sm text-muted-foreground">
            No revenue yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#302E29" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#9B978D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9B978D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={GOLD}
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Bookings by status"
        description="Where every repair request currently stands."
      >
        {bookingData.length === 0 ? (
          <p className="grid h-full place-items-center text-sm text-muted-foreground">
            No bookings yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingData}>
              <CartesianGrid stroke="#302E29" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#9B978D"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis
                stroke="#9B978D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {bookingData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Services by category"
        description="How the marketplace is distributed across repair categories."
      >
        {categoryData.length === 0 ? (
          <p className="grid h-full place-items-center text-sm text-muted-foreground">
            No services yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid stroke="#302E29" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                stroke="#9B978D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9B978D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={GOLD} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-heading text-base font-semibold">Platform snapshot</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          A quick read on marketplace health.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: "Total users", value: stats.totalUsers },
            { label: "Technicians", value: stats.totalTechnicians },
            { label: "Customers", value: stats.totalCustomers },
            { label: "Pending services", value: stats.pendingServices },
            { label: "Total bookings", value: stats.totalBookings },
            {
              label: "Revenue",
              value: `$${Number(stats.totalRevenue).toFixed(2)}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-secondary/30 p-3"
            >
              <p className="text-[0.6rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 font-heading text-lg font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
