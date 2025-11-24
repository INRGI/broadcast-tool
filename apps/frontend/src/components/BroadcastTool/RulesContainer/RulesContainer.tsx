import React, { useRef, useState, useEffect } from "react";
import { BroadcastRulesEntity } from "../../../types/broadcast-tool/broadcast-rules-entity.interface";
import { FiMinus, FiPlus } from "react-icons/fi";
import UsageRulesTab from "../UsageRulesTab";
import {
  ButtonsHeaderContainer,
  Container,
  ListScrollContainer,
  Section,
  SectionContentWrapper,
  SectionHeader,
  SectionInner,
} from "./RulesContainer.styled";
import { GetProductStatusesResponse } from "../../../api/monday";
import ProductRulesTab from "../ProductRulesTab";
import CopyAssignmentStrategyRulesTab from "../CopyAssignmentStrategyRulesTab";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import { VscDebugStart, VscGraph } from "react-icons/vsc";
import { Button } from "../Menu/Menu.styled";
import { LiaSaveSolid } from "react-icons/lia";
import { updateBroadcastRules } from "../../../api/broadcast-rules.api";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import Dropdown from "../../Common/Dropdown/Dropdown";
import ConfirmationModal from "../ConfirmationModal";
import LaunchBroadcastModal from "../LaunchBroadcastModal";
import {
  GetBroadcastsSendsResponseDto,
  MakeBroadcastResponseDto,
} from "../../../api/broadcast";
import BroadcastTableModal from "../BroadcastTableModal";
import BroadcastSendsModal from "../BroadcastSendsModal";
import { CiRedo } from "react-icons/ci";
import RedoBroadcastModal from "../RedoBroadcastModal";
import AnalyticsLaunchModal from "../AnalyticsLaunchModal";
import { getBroadcastSendsById } from "../../../api/broadcast.api";
import CatLoader from "../../Common/Loader/CatLoader";
import { Checkbox } from "@mui/material";
import { common } from "@mui/material/colors";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import AdminPreviewRulesModal from "../AdminPreviewRulesModal";
import { RxInfoCircled } from "react-icons/rx";
import { WhiteText } from "../GeneralTab/GeneralTab.styled";

interface RulesContainerProps {
  onEntityUpdate: () => void;
  broadcastEntity: BroadcastRulesEntity;
  productMondayStatuses: GetProductStatusesResponse;
  broadcastsSheets: BroadcastListItemResponse[];
}

const RulesContainer: React.FC<RulesContainerProps> = ({
  broadcastEntity,
  productMondayStatuses,
  broadcastsSheets,
  onEntityUpdate,
}) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [broadcastRules, setBroadcastRules] = useState(broadcastEntity);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isRedoModalOpen, setIsRedoModalOpen] = useState(false);
  const [isBroadcastSendsModalOpen, setIsBroadcastSendsModalOpen] =
    useState(false);

  const [broadcastResult, setBroadcastResult] =
    useState<MakeBroadcastResponseDto | null>(null);
  const [isAnalyticsLaunchModalOpen, setIsAnalyticsLaunchModalOpen] =
    useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [broadcastsSends, setBroadcastsSends] =
    useState<GetBroadcastsSendsResponseDto | null>(null);

  useEffect(() => {
    setBroadcastRules(broadcastEntity);
  }, [broadcastEntity]);

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleChange = <K extends keyof BroadcastRulesEntity>(
    key: K,
    value: BroadcastRulesEntity[K]
  ) => {
    setBroadcastRules((prevBroadcastRules) => ({
      ...prevBroadcastRules,
      [key]: value,
    }));
  };

  const handleUpdateEntity = async () => {
    try {
      setIsLoading(true);
      await updateBroadcastRules(broadcastRules);
      toastSuccess("Broadcast rule updated successfully");
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to update broadcast rule");
      setIsLoading(false);
    } finally {
      onEntityUpdate();
    }
  };

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGetBroadcastSendsById = async (fromDate: Date, toDate: Date) => {
    try {
      setIsAnalyticsLaunchModalOpen(false);
      setIsLoading(true);
      const response = await getBroadcastSendsById({
        broadcastRuleId: broadcastEntity._id,
        fromDate: formatDateToYYYYMMDD(fromDate),
        toDate: formatDateToYYYYMMDD(toDate),
      });
      if (!response) throw new Error("Failed to get broadcast sends");
      setBroadcastsSends(response);
      setIsBroadcastSendsModalOpen(true);
      toastSuccess("Broadcast sends fetched successfully");
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to get broadcast sends");
      setIsLoading(false);
    }
  };

  const renderSection = (
    label: string,
    key: keyof BroadcastRulesEntity,
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
    <Container>
      <ButtonsHeaderContainer>
        <Button
          onClick={() => {
            window.open("https://wiki.epcnetwork.dev/uk/BroadCats", "_blank");
          }}
        >
          <RxInfoCircled />
        </Button>

        <Button onClick={() => setIsAnalyticsLaunchModalOpen(true)}>
          <VscGraph />
        </Button>

        <Button onClick={() => setIsAdminModalOpen(true)}>
          <MdOutlineAdminPanelSettings />
        </Button>

        <Button onClick={() => setIsUpdateModalOpen(true)}>
          <LiaSaveSolid />
        </Button>

        <Button onClick={() => setIsRedoModalOpen(true)}>
          <CiRedo />
        </Button>

        <Button onClick={() => setIsLaunchModalOpen(true)}>
          <VscDebugStart />
        </Button>
      </ButtonsHeaderContainer>
      {isLoading && <CatLoader />}
      {!isLoading && (
        <ListScrollContainer>
          {renderSection(
            "General Rules",
            "name",
            <RuleContainer>
              <InputGroup>
                <InputContainer>
                  <FloatingLabelInput
                    placeholder="Broadcast Name"
                    value={broadcastRules.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <Dropdown
                  options={broadcastsSheets.map((item) => item.sheetName)}
                  selected={
                    broadcastsSheets.find(
                      (b) => b.fileId === broadcastRules.broadcastSpreadsheetId
                    )?.sheetName || ""
                  }
                  onSelect={(option) => {
                    const selected = broadcastsSheets.find(
                      (item) => item.sheetName === option
                    );
                    if (selected) {
                      handleChange("broadcastSpreadsheetId", selected.fileId);
                    }
                  }}
                  placeholder="Select Broadcast Sheet"
                />
              </InputGroup>

              <InputGroup>
                <Checkbox
                  checked={broadcastRules.useOnlyTeamAnalytics}
                  onChange={(e) =>
                    handleChange("useOnlyTeamAnalytics", e.target.checked)
                  }
                  sx={{
                    color: common.white,
                    "&.Mui-checked": {
                      color: common.white,
                    },
                  }}
                />
               <WhiteText>Use only team analytics</WhiteText>
              </InputGroup>
            </RuleContainer>
          )}

          {renderSection(
            "Usage Rules",
            "usageRules",
            <UsageRulesTab
              spreadsheetId={broadcastRules.broadcastSpreadsheetId}
              usageRules={broadcastRules.usageRules}
              onChange={(updated) => handleChange("usageRules", updated)}
              partners={productMondayStatuses.partners}
            />
          )}
          {renderSection(
            "Product Rules",
            "productRules",
            <ProductRulesTab
              partners={productMondayStatuses.partners}
              productRules={broadcastRules.productRules}
              onChange={(updated) => handleChange("productRules", updated)}
              productMondayStatuses={productMondayStatuses}
            />
          )}
          {renderSection(
            "Copy Assignment Strategy Rules",
            "copyAssignmentStrategyRules",
            <CopyAssignmentStrategyRulesTab
              spreadsheetId={broadcastRules.broadcastSpreadsheetId}
              copyAssignmentStrategyRules={
                broadcastRules.copyAssignmentStrategyRules
              }
              onChange={(updated) =>
                handleChange("copyAssignmentStrategyRules", updated)
              }
            />
          )}
        </ListScrollContainer>
      )}

      {isUpdateModalOpen && (
        <ConfirmationModal
          title="Update Broadcast Rules"
          message="Are you sure you want to update the broadcast rules?"
          confirmButtonText="Update"
          cancelButtonText="Cancel"
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
          }}
          onConfirm={handleUpdateEntity}
        />
      )}
      {isLaunchModalOpen && (
        <LaunchBroadcastModal
          isOpen={isLaunchModalOpen}
          broadcastEntity={broadcastRules}
          onClose={() => {
            setIsLaunchModalOpen(false);
          }}
          onSuccess={(result) => {
            setIsLaunchModalOpen(false);
            setBroadcastResult(result);
          }}
        />
      )}
      {isRedoModalOpen && (
        <RedoBroadcastModal
          isOpen={isRedoModalOpen}
          broadcastEntity={broadcastRules}
          onClose={() => {
            setIsRedoModalOpen(false);
          }}
          onSuccess={(result) => {
            setIsRedoModalOpen(false);
            setBroadcastResult(result);
          }}
        />
      )}
      {isBroadcastSendsModalOpen && (
        <BroadcastSendsModal
          isOpen={isBroadcastSendsModalOpen}
          onClose={() => {
            setIsBroadcastSendsModalOpen(false);
          }}
          broadcastsSends={broadcastsSends}
        />
      )}
      {broadcastResult && (
        <BroadcastTableModal
          isOpen={!!broadcastResult}
          onClose={() => setBroadcastResult(null)}
          broadcast={broadcastResult}
          spreadSheetId={broadcastRules.broadcastSpreadsheetId}
        />
      )}
      {isAnalyticsLaunchModalOpen && (
        <AnalyticsLaunchModal
          isOpen={isAnalyticsLaunchModalOpen}
          onSubmit={(from, to) => {
            handleGetBroadcastSendsById(from, to);
          }}
          onClose={() => setIsAnalyticsLaunchModalOpen(false)}
        />
      )}
      {isAdminModalOpen && (
        <AdminPreviewRulesModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default RulesContainer;
