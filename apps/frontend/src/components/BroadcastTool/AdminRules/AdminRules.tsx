import React, { useEffect, useRef, useState } from "react";
import {
  ButtonsHeaderContainer,
  ListScrollContainer,
  Section,
  SectionContentWrapper,
  SectionHeader,
  SectionInner,
} from "./AdminRules.styled";
import { AdminBroadcastConfigEntity } from "../../../types/broadcast-tool";
import { FiMinus, FiPlus } from "react-icons/fi";
import Loader from "../../Common/Loader";
import AnalyticSelectionRulesTab from "../AnalyticSelectionRulesTab";
import {
  getAdminBroadcastConfigByNiche,
  updateAdminBroadcastConfig,
} from "../../../api/admin-broadcast-config.api";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { LiaSaveSolid } from "react-icons/lia";
import ConfirmationModal from "../ConfirmationModal";
import { Button } from "../Menu/Menu.styled";
import TestingRulesTab from "../TestingRulesTab";
import DomainRulesTab from "../DomainRulesTab";
import PartnerRulesTab from "../PartnerRulesTab";
import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../../api/monday";
import { getCachedData, setCachedData } from "../../../helpers/getCachedData";
import { getDomainStatuses, getProductStatuses } from "../../../api/monday.api";

const AdminRules: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [adminBroadcastConfig, setAdminBroadcastConfig] =
    useState<AdminBroadcastConfigEntity>();
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [domainMondayStatuses, setDomainMondayStatuses] =
    useState<GetDomainStatusesResponse>({
      uniqueDomainStatuses: [],
      uniqueEsps: [],
      uniqueParentCompanies: [],
    });

  const [productMondayStatuses, setProductMondayStatuses] =
    useState<GetProductStatusesResponse>({
      productStatuses: [],
      domainSendings: [],
      partners: [],
      sectors: [],
    });

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([
      fetchAdminBroadcastConfig(),
      fetchDomainStatuses(),
      fetchProductStatuses(),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchAdminBroadcastConfig = async () => {
    try {
      const response = await getAdminBroadcastConfigByNiche("finance");
      if (!response) {
        toastError("Failed to fetch admin broadcast config");
        return;
      }
      setAdminBroadcastConfig(response);
    } catch (error) {
      toastError("Failed to fetch admin broadcast config");
      setAdminBroadcastConfig(undefined);
    }
  };

  const fetchDomainStatuses = async () => {
    const cached = getCachedData<GetDomainStatusesResponse>(
      "domain-statuses",
      30 * 60 * 1000
    );
    if (cached) {
      setDomainMondayStatuses(cached);
      return;
    }

    try {
      const response = await getDomainStatuses();
      if (!response) throw new Error("Failed to fetch domain statuses");

      setDomainMondayStatuses(response);
      setCachedData("domain-statuses", response, 30 * 60 * 1000);
    } catch (error) {
      toastError("Failed to fetch domain statuses");
      setDomainMondayStatuses({
        uniqueDomainStatuses: [],
        uniqueEsps: [],
        uniqueParentCompanies: [],
      });
    }
  };

  const handleChange = <K extends keyof AdminBroadcastConfigEntity>(
    key: K,
    value: AdminBroadcastConfigEntity[K]
  ) => {
    if (!adminBroadcastConfig) return;

    setAdminBroadcastConfig({
      ...adminBroadcastConfig,
      [key]: value,
    });
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const onEntityUpdate = () => {
    setIsLoading(true);
    Promise.allSettled([fetchAdminBroadcastConfig()]).finally(() => {
      setIsLoading(false);
    });
    setIsUpdateModalOpen(false);
  };

  const handleUpdateEntity = async () => {
    try {
      if (!adminBroadcastConfig) return toastError("Failed to update config");
      setIsLoading(true);
      await updateAdminBroadcastConfig(adminBroadcastConfig);
      toastSuccess("Config updated successfully");
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to update Config");
      setIsLoading(false);
    } finally {
      onEntityUpdate();
    }
  };

  const fetchProductStatuses = async () => {
    const cached = getCachedData<GetProductStatusesResponse>(
      "product-statuses",
      30 * 60 * 1000
    );
    if (cached) {
      setProductMondayStatuses(cached);
      return;
    }

    try {
      const response = await getProductStatuses();
      if (!response) throw new Error("Failed to fetch product statuses");

      setProductMondayStatuses(response);
      setCachedData("product-statuses", response, 15 * 60 * 1000);
    } catch (error) {
      toastError("Failed to fetch product statuses");
      setProductMondayStatuses({
        productStatuses: [],
        domainSendings: [],
        partners: [],
        sectors: [],
      });
    }
  };

  const renderSection = (
    label: string,
    key: keyof AdminBroadcastConfigEntity,
    component: React.ReactNode
  ) => (
    <Section>
      <SectionHeader
        active={openSection === label}
        onClick={() => toggleSection(label)}
      >
        {label}
        {openSection === label ? <FiMinus size={18} /> : <FiPlus size={18} />}
      </SectionHeader>
      <SectionContentWrapper isOpen={openSection === label}>
        <SectionInner ref={(el) => (contentRefs.current[label] = el)}>
          {component}
        </SectionInner>
      </SectionContentWrapper>
    </Section>
  );

  return (
    <>
      <ButtonsHeaderContainer>
        <Button onClick={() => setIsUpdateModalOpen(true)}>
          <LiaSaveSolid />
        </Button>
      </ButtonsHeaderContainer>
      <ListScrollContainer>
        {isLoading && <Loader />}

        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Analytic Selection Rules",
            "analyticSelectionRules",
            <AnalyticSelectionRulesTab
              analyticSelectionRules={
                adminBroadcastConfig.analyticSelectionRules
              }
              onChange={(updated) =>
                handleChange("analyticSelectionRules", updated)
              }
            />
          )}

        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Testing Rules",
            "testingRules",
            <TestingRulesTab
              testingRules={adminBroadcastConfig.testingRules}
              onChange={(updated) => handleChange("testingRules", updated)}
            />
          )}

        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Domain Rules",
            "domainRules",
            <DomainRulesTab
              domainRules={adminBroadcastConfig.domainRules}
              onChange={(updated) => handleChange("domainRules", updated)}
              domainMondayStatuses={domainMondayStatuses}
              productMondayStatuses={productMondayStatuses}
            />
          )}
        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Partner Rules",
            "partnerRules",
            <PartnerRulesTab
              partners={productMondayStatuses.partners}
              partnerRules={adminBroadcastConfig.partnerRules}
              onChange={(updated) => handleChange("partnerRules", updated)}
            />
          )}
      </ListScrollContainer>
      {isUpdateModalOpen && (
        <ConfirmationModal
          title="Update Broadcast Rules"
          message="Are you sure you want to update the config?"
          confirmButtonText="Update"
          cancelButtonText="Cancel"
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
          }}
          onConfirm={handleUpdateEntity}
        />
      )}
    </>
  );
};

export default AdminRules;
