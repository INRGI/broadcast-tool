import React, { useState } from "react";
import { DomainTabPriorities } from "../../../types/broadcast-tool";
import { FaPlus, FaTrash } from "react-icons/fa";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  AddButton,
  DomainChip,
  DomainInputRow,
  DomainName,
  EmptyState,
  InfoText,
  PriorityHeader,
  PrioritySection,
  PriorityTitle,
  PriorityWrapper,
  QuantityControls,
  QuantityInput,
  QuantityLabel,
  RemoveButton,
  RemoveChipButton,
  SectionHeader,
  SelectedDomainsHeader,
  SelectedDomainsList,
  SelectedDomainsWrapper,
} from "./DomainPrioritiesEditorModal.styled";
import AdminModal from "../../Common/AdminModal";

interface Props {
  sheetName: string;
  domainPriorities: DomainTabPriorities[];
  availableDomains: string[];
  onChange: (priorities: DomainTabPriorities[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DomainPrioritiesEditorModal: React.FC<Props> = ({
  sheetName,
  domainPriorities,
  availableDomains,
  onChange,
  isOpen,
  onClose,
}) => {
  const [newDomain, setNewDomain] = useState("");

  const currentPriority = domainPriorities.find((p) => p.tabName === sheetName);

  const updatePriority = (updatedPriority: DomainTabPriorities) => {
    const updated = domainPriorities.filter((p) => p.tabName !== sheetName);
    updated.push(updatedPriority);
    onChange(updated);
  };

  const handleQuantityChange = (quantity: number) => {
    const priority: DomainTabPriorities = currentPriority || {
      tabName: sheetName,
      randomDomainQuantity: 0,
      selectedDomains: [],
    };

    updatePriority({
      ...priority,
      randomDomainQuantity: Math.max(0, quantity),
    });
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;

    const priority: DomainTabPriorities = currentPriority || {
      tabName: sheetName,
      randomDomainQuantity: 0,
      selectedDomains: [],
    };

    if (priority.selectedDomains.includes(newDomain.trim())) {
      return;
    }

    updatePriority({
      ...priority,
      selectedDomains: [...priority.selectedDomains, newDomain.trim()],
    });

    setNewDomain("");
  };

  const handleRemoveDomain = (domain: string) => {
    if (!currentPriority) return;

    updatePriority({
      ...currentPriority,
      selectedDomains: currentPriority.selectedDomains.filter(
        (d) => d !== domain
      ),
    });
  };

  const handleRemoveAll = () => {
    const filtered = domainPriorities.filter((p) => p.tabName !== sheetName);
    onChange(filtered);
  };

  const getAvailableDomainsForSelect = () => {
    const selectedDomains = currentPriority?.selectedDomains || [];
    return availableDomains.filter(
      (domain) => !selectedDomains.includes(domain)
    );
  };

  const randomQuantity = currentPriority?.randomDomainQuantity || 0;
  const selectedDomains = currentPriority?.selectedDomains || [];

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
    <PriorityWrapper>
      <PriorityHeader>
        <PriorityTitle>Priority Settings for {sheetName}</PriorityTitle>
        {currentPriority && (
          <RemoveButton onClick={handleRemoveAll}>Reset</RemoveButton>
        )}
      </PriorityHeader>

      <PrioritySection>
        <SectionHeader>Random Domain Quantity</SectionHeader>
        <QuantityControls>
          <QuantityInput
            type="number"
            min="0"
            max="50"
            value={randomQuantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
          />
          <QuantityLabel>
            domains will be randomly selected for top priority
          </QuantityLabel>
        </QuantityControls>

        {randomQuantity > 0 && (
          <InfoText>
            {selectedDomains.length > 0
              ? `${selectedDomains.length} guaranteed + ${Math.max(
                  0,
                  randomQuantity - selectedDomains.length
                )} random domains`
              : `${randomQuantity} random domains will be selected`}
          </InfoText>
        )}
      </PrioritySection>

      <PrioritySection>
        <SectionHeader>Guaranteed Priority Domains</SectionHeader>
        <DomainInputRow>
          <Dropdown
            options={getAvailableDomainsForSelect()}
            selected={newDomain}
            onSelect={(option) => {
              setNewDomain(option);
            }}
            placeholder="Select domain to add..."
          />
          <AddButton
            onClick={handleAddDomain}
            disabled={
              !newDomain.trim() || selectedDomains.includes(newDomain.trim())
            }
          >
            <FaPlus /> Add
          </AddButton>
        </DomainInputRow>

        {selectedDomains.length > 0 && (
          <SelectedDomainsWrapper>
            <SelectedDomainsHeader>
              Selected Domains ({selectedDomains.length})
            </SelectedDomainsHeader>
            <SelectedDomainsList>
              {selectedDomains.map((domain) => (
                <DomainChip key={domain}>
                  <DomainName>{domain}</DomainName>
                  <RemoveChipButton onClick={() => handleRemoveDomain(domain)}>
                    <FaTrash />
                  </RemoveChipButton>
                </DomainChip>
              ))}
            </SelectedDomainsList>
          </SelectedDomainsWrapper>
        )}

        {selectedDomains.length === 0 && randomQuantity === 0 && (
          <EmptyState>
            No priority settings configured. Domains will be sorted by revenue
            rating only.
          </EmptyState>
        )}
      </PrioritySection>
    </PriorityWrapper>
    </AdminModal>
  );
};

export default DomainPrioritiesEditorModal;
