import Link from "next/link";
import { Card, Col, Row, Statistic } from "antd";
import {
  RiRestaurantLine,
  RiShoppingCartLine,
  RiMoneyDollarCircleLine,
  RiArrowRightLine,
} from "@remixicon/react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { colorTheme } from "@/themes/colors";

// TODO: ganti dengan data asli setelah tabel `orders`/`order_items` beneran dipakai
const DUMMY_STATS = {
  totalMenus: 178,
  todaySales: 0,
  todayRevenue: 0,
};

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      description="Ringkasan toko kamu hari ini"
      breadcrumbItems={[{ title: "Dashboard" }]}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Menu"
              value={DUMMY_STATS.totalMenus}
              prefix={
                <RiRestaurantLine size={20} color={colorTheme.primaryBlue} />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Penjualan Hari Ini"
              value={DUMMY_STATS.todaySales}
              suffix="transaksi"
              prefix={
                <RiShoppingCartLine size={20} color={colorTheme.primaryGreen} />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Omzet Hari Ini"
              value={DUMMY_STATS.todayRevenue}
              prefix={
                <RiMoneyDollarCircleLine
                  size={20}
                  color={colorTheme.primaryGreen}
                />
              }
              formatter={(value) =>
                `Rp ${Number(value).toLocaleString("id-ID")}`
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title="Akses Cepat" className="mt-4" classNames={{ body: "!p-0" }}>
        <ul>
          <li className="border-b border-[#DEDEDE] last:border-0">
            <Link
              href="/dashboard/menu"
              className="flex items-center justify-between px-4 py-3 hover:bg-[#F9F9F9] transition-colors"
            >
              <div className="flex items-center gap-3">
                <RiRestaurantLine size={18} color={colorTheme.primaryBlack} />
                <span className="text-[#1B1B1B] font-medium">Kelola Menu</span>
              </div>
              <RiArrowRightLine size={16} color={colorTheme.primaryGray} />
            </Link>
          </li>
        </ul>
      </Card>
    </PageWrapper>
  );
}
