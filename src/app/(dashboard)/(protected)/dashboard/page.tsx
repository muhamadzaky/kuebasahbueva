"use client";

import { Card, Col, Row, Statistic } from "antd";
import { RiRestaurantLine, RiShoppingCartLine } from "@remixicon/react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { colorTheme } from "@/themes/colors";
import { useMenuCount } from "@/service/menu.service";
import { usePackageCount } from "@/service/packages.service";

export default function DashboardPage() {
  const { data: menuCount, isLoading: isMenuLoading } = useMenuCount();
  const { data: packageCount, isLoading: isPackageLoading } = usePackageCount();

  return (
    <PageWrapper
      title="Dashboard"
      description="Ringkasan toko kamu hari ini"
      breadcrumbItems={[{ title: "Dashboard" }]}
    >
      <div className="flex flex-col gap-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Total Menu"
                value={menuCount ?? 0}
                loading={isMenuLoading}
                prefix={
                  <RiRestaurantLine size={20} color={colorTheme.primaryBlue} />
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Total Packaging"
                value={packageCount ?? 0}
                loading={isPackageLoading}
                prefix={
                  <RiShoppingCartLine
                    size={20}
                    color={colorTheme.primaryGreen}
                  />
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
    </PageWrapper>
  );
}
