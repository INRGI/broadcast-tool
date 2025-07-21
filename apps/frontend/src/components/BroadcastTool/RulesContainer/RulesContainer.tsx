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
import Loader from "../../Common/Loader";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import Dropdown from "../../Common/Dropdown/Dropdown";
import ConfirmationModal from "../ConfirmationModal";
import LaunchBroadcastModal from "../LaunchBroadcastModal";
import { GetAllDomainsResponse } from "../../../api/broadcast";
import BroadcastTableModal from "../BroadcastTableModal";
import BroadcastSendsModal from "../BroadcastSendsModal";

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
  const [isBroadcastSendsModalOpen, setIsBroadcastSendsModalOpen] =
    useState(false);

  const [broadcastResult, setBroadcastResult] =
    useState<GetAllDomainsResponse | null>(null);

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
        <Button onClick={() => setIsBroadcastSendsModalOpen(true)}>
          <VscGraph />
        </Button>

        <Button onClick={() => setIsUpdateModalOpen(true)}>
          <LiaSaveSolid />
        </Button>

        <Button onClick={() => setIsLaunchModalOpen(true)}>
          <VscDebugStart />
        </Button>
      </ButtonsHeaderContainer>
      {isLoading && <Loader />}
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
            </RuleContainer>
          )}

          {renderSection(
            "Usage Rules",
            "usageRules",
            <UsageRulesTab
              spreadsheetId={broadcastRules.broadcastSpreadsheetId}
              usageRules={broadcastRules.usageRules}
              onChange={(updated) => handleChange("usageRules", updated)}
            />
          )}
          {renderSection(
            "Product Rules",
            "productRules",
            <ProductRulesTab
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
      {isBroadcastSendsModalOpen && (
        <BroadcastSendsModal
          isOpen={isBroadcastSendsModalOpen}
          onClose={() => {
            setIsBroadcastSendsModalOpen(false);
          }}
          broadcastRulesId={broadcastRules._id}
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
    </Container>
  );
};

export default RulesContainer;
