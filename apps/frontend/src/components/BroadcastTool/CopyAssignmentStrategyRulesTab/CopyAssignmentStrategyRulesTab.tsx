import { useEffect, useState } from "react";
import { getBroadcastDomainsList } from "../../../api/broadcast.api";
import { CopyAssignmentStrategyRules } from "../../../types/broadcast-tool";
import Loader from "../../Common/Loader";
import {
  AddTypeButton,
  CollapsibleTab,
  Column,
  DomainCopiesLength,
  DomainTabHeader,
  Indicator,
  RemoveButton,
  ResetButton,
  SmallSelect,
  StrategyRow,
  TabHeader,
  Wrapper,
} from "./CopyAssignmentStrategyRulesTab.styled";
import ConfirmationModal from "../ConfirmationModal";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { FaFireAlt, FaMousePointer } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { GrTest } from "react-icons/gr";
import { Box } from "@mui/material";

interface DomainStrategy {
  domain: string;
  copiesTypes: ("click" | "conversion" | "test" | "warmup")[];
}

interface Props {
  spreadsheetId: string;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
  onChange: (items: CopyAssignmentStrategyRules) => void;
}

type SheetData = {
  sheetName: string;
  domains: string[];
};

const indicatorIcons: Record<
  DomainStrategy["copiesTypes"][number],
  JSX.Element
> = {
  click: <FaMousePointer size={12} />,
  conversion: <FaDollarSign size={12} />,
  test: <GrTest size={12} />,
  warmup: <FaFireAlt size={12} />,
};

const CopyAssignmentStrategiesEditor: React.FC<Props> = ({
  spreadsheetId,
  copyAssignmentStrategyRules,
  onChange,
}) => {
  const [strategiesBySheet, setStrategiesBySheet] = useState<
    Record<string, DomainStrategy[]>
  >({});
  const [openSheets, setOpenSheets] = useState<Record<string, boolean>>({});
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isTabConfirmationOpen, setTabConfirmationOpen] = useState(false);
  const [sheetForResetTypes, setSheetForResetTypes] = useState<string>();

  const [bulkType, setBulkType] =
    useState<DomainStrategy["copiesTypes"][number]>("click");

  useEffect(() => {
    if (!spreadsheetId) return;

    const fetchDomains = async () => {
      setIsLoading(true);
      const cacheKey = `broadcast_domains_${spreadsheetId}`;
      const cacheRaw = localStorage.getItem(cacheKey);

      let data;
      const now = Date.now();

      if (cacheRaw) {
        try {
          const cached = JSON.parse(cacheRaw);
          if (now - cached.timestamp < 30 * 60 * 1000) {
            data = cached.data;
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      if (!data) {
        try {
          data = await getBroadcastDomainsList(spreadsheetId);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              timestamp: now,
              data,
            })
          );
        } catch (error) {
          toastError("Failed to fetch domains");
          setIsLoading(false);
          return;
        }
      }

      const grouped = mergeDomainStrategies(
        data.sheets,
        copyAssignmentStrategyRules.domainStrategies
      );

      setStrategiesBySheet(grouped);
      const updated = Object.values(grouped).flat();
      onChange({ domainStrategies: updated });
      setIsLoading(false);
    };

    fetchDomains();
  }, [spreadsheetId]);

  function mergeDomainStrategies(
    sheets: SheetData[],
    existing: DomainStrategy[]
  ): Record<string, DomainStrategy[]> {
    const existingMap = new Map<string, DomainStrategy>();
    existing.forEach((strategy) => {
      existingMap.set(strategy.domain, strategy);
    });

    const grouped: Record<string, DomainStrategy[]> = {};

    for (const sheet of sheets) {
      grouped[sheet.sheetName] = sheet.domains.map((domain) => {
        const found = existingMap.get(domain);
        return {
          domain,
          copiesTypes: found?.copiesTypes || [],
        };
      });
    }

    return grouped;
  }

  const toggleSheet = (sheetName: string) => {
    setOpenSheets((prev) => ({
      ...prev,
      [sheetName]: !prev[sheetName],
    }));
  };

  const toggleDomain = (domain: string) => {
    setOpenDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  const updateDomain = (
    sheet: string,
    domainIndex: number,
    newData: DomainStrategy
  ) => {
    const updated = { ...strategiesBySheet };
    updated[sheet][domainIndex] = newData;
    setStrategiesBySheet(updated);

    const allUpdated = Object.values(updated).flat();
    onChange({ domainStrategies: allUpdated });
  };

  const handleReset = (sheet: string, index: number) => {
    updateDomain(sheet, index, {
      ...strategiesBySheet[sheet][index],
      copiesTypes: [],
    });
  };

  const handleAddType = (sheet: string, index: number) => {
    const current = strategiesBySheet[sheet][index];
    updateDomain(sheet, index, {
      ...current,
      copiesTypes: [...current.copiesTypes, "click"],
    });
  };

  const handleAddTypeForAll = (type: DomainStrategy["copiesTypes"][number]) => {
    const updated: Record<string, DomainStrategy[]> = {};

    for (const [sheetName, domains] of Object.entries(strategiesBySheet)) {
      updated[sheetName] = domains.map((domain) => ({
        ...domain,
        copiesTypes: [...domain.copiesTypes, type],
      }));
    }

    setStrategiesBySheet(updated);
    const allUpdated = Object.values(updated).flat();
    onChange({ domainStrategies: allUpdated });
    toastSuccess("Added successfully");
  };

  const handleChangeType = (
    sheet: string,
    domainIndex: number,
    typeIndex: number,
    value: string
  ) => {
    const domain = strategiesBySheet[sheet][domainIndex];
    const updatedTypes = [...domain.copiesTypes];
    updatedTypes[typeIndex] = value as DomainStrategy["copiesTypes"][number];

    updateDomain(sheet, domainIndex, {
      ...domain,
      copiesTypes: updatedTypes,
    });
  };

  const addType = (
    sheet: string,
    domainIndex: number,
    type: DomainStrategy["copiesTypes"][number]
  ) => {
    const domain = strategiesBySheet[sheet][domainIndex];
    updateDomain(sheet, domainIndex, {
      ...domain,
      copiesTypes: [...domain.copiesTypes, type],
    });
  };

  const handleRemoveAllTypes = () => {
    const updated: Record<string, DomainStrategy[]> = {};

    for (const [sheetName, domains] of Object.entries(strategiesBySheet)) {
      updated[sheetName] = domains.map((domain) => ({
        ...domain,
        copiesTypes: [],
      }));
    }

    setStrategiesBySheet(updated);
    const allUpdated = Object.values(updated).flat();
    onChange({ domainStrategies: allUpdated });
  };

  const handleRemoveAllForSheet = (sheet: string) => {
    const updated = { ...strategiesBySheet };
    updated[sheet] = updated[sheet].map((domain) => ({
      ...domain,
      copiesTypes: [],
    }));

    setStrategiesBySheet(updated);
    const allUpdated = Object.values(updated).flat();
    onChange({ domainStrategies: allUpdated });
    setSheetForResetTypes("");
  };

  const handleRemoveType = (
    sheet: string,
    domainIndex: number,
    typeIndex: number
  ) => {
    const domain = strategiesBySheet[sheet][domainIndex];
    const updatedTypes = domain.copiesTypes.filter((_, i) => i !== typeIndex);

    updateDomain(sheet, domainIndex, {
      ...domain,
      copiesTypes: updatedTypes,
    });
  };

  const removeType = (
    sheet: string,
    domainIndex: number,
    type: DomainStrategy["copiesTypes"][number]
  ) => {
    const domain = strategiesBySheet[sheet][domainIndex];
    const index = domain.copiesTypes.indexOf(type);
    if (index !== -1) {
      const updatedTypes = [...domain.copiesTypes];
      updatedTypes.splice(index, 1);
      updateDomain(sheet, domainIndex, {
        ...domain,
        copiesTypes: updatedTypes,
      });
    }
  };

  const getTypeCounts = (
    types: DomainStrategy["copiesTypes"]
  ): Record<string, number> => {
    return types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <Wrapper>
      {isLoading && <Loader />}
      {!isLoading && (
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <SmallSelect
            value={bulkType}
            onChange={(e) =>
              setBulkType(
                e.target.value as DomainStrategy["copiesTypes"][number]
              )
            }
            style={{ maxWidth: 180 }}
          >
            {["click", "conversion", "test", "warmup"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SmallSelect>
          <AddTypeButton onClick={() => handleAddTypeForAll(bulkType)}>
            + Add {bulkType} to All
          </AddTypeButton>
          <ResetButton onClick={handleRemoveAllTypes}>Reset All</ResetButton>
        </div>
      )}

      {!isLoading &&
        Object.entries(strategiesBySheet).map(([sheetName, strategies]) => (
          <CollapsibleTab key={sheetName}>
            <TabHeader
              active={!!openSheets[sheetName]}
              onClick={() => toggleSheet(sheetName)}
            >
              {sheetName}{" "}
              <ResetButton
                onClick={() => {
                  setSheetForResetTypes(sheetName);
                  setTabConfirmationOpen(true);
                }}
              >
                Reset {sheetName}
              </ResetButton>
            </TabHeader>

            {openSheets[sheetName] &&
              strategies.map((strategy, index) => {
                const typeCounts = getTypeCounts(strategy.copiesTypes);
                return (
                  <CollapsibleTab key={strategy.domain}>
                    <DomainTabHeader
                      active={!!openDomains[strategy.domain]}
                      onClick={() => toggleDomain(strategy.domain)}
                    >
                      {strategy.domain}
                      <Box
                        sx={{ display: "flex", gap: "8px", marginLeft: "auto" }}
                      >
                        {(
                          Object.keys(indicatorIcons).filter(
                            (type) => type !== "warmup"
                          ) as DomainStrategy["copiesTypes"][number][]
                        ).map((type) => (
                          <Indicator
                            key={type}
                            empty={strategy.copiesTypes.length === 0}
                            title={`Click to add / right click to remove "${type}"`}
                            onClick={(e) => {
                              e.stopPropagation();
                              addType(sheetName, index, type);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeType(sheetName, index, type);
                            }}
                          >
                            {indicatorIcons[type]} {typeCounts[type] || 0}
                          </Indicator>
                        ))}
                        {(strategy.copiesTypes.length === 0 ||
                          strategy.copiesTypes.includes("warmup")) && (
                          <Indicator
                            empty={strategy.copiesTypes.length === 0}
                            title={`Click to add "warmup"`}
                            onClick={(e) => {
                              e.stopPropagation();
                              addType(sheetName, index, "warmup");
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeType(sheetName, index, "warmup");
                            }}
                          >
                            {indicatorIcons["warmup"]}{" "}
                            {typeCounts["warmup"] || 0}
                          </Indicator>
                        )}
                      </Box>
                    </DomainTabHeader>

                    {openDomains[strategy.domain] && (
                      <StrategyRow>
                        <Column>
                          {strategy.copiesTypes.map((type, typeIdx) => (
                            <div
                              key={typeIdx}
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 6,
                              }}
                            >
                              <SmallSelect
                                value={type}
                                onChange={(e) =>
                                  handleChangeType(
                                    sheetName,
                                    index,
                                    typeIdx,
                                    e.target.value
                                  )
                                }
                              >
                                {["click", "conversion", "test", "warmup"].map(
                                  (t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  )
                                )}
                              </SmallSelect>
                              <RemoveButton
                                onClick={() =>
                                  handleRemoveType(sheetName, index, typeIdx)
                                }
                              >
                                ✕
                              </RemoveButton>
                            </div>
                          ))}
                          <AddTypeButton
                            onClick={() => handleAddType(sheetName, index)}
                          >
                            + Add type
                          </AddTypeButton>
                        </Column>
                        <Column style={{ maxWidth: 150 }}>
                          <ResetButton
                            onClick={() => handleReset(sheetName, index)}
                          >
                            Reset strategy
                          </ResetButton>
                        </Column>
                      </StrategyRow>
                    )}
                  </CollapsibleTab>
                );
              })}
          </CollapsibleTab>
        ))}
      {isConfirmationOpen && (
        <ConfirmationModal
          title="Remove all copy types"
          message="Are you sure you want to remove all copy types?"
          confirmButtonText="Remove All"
          cancelButtonText="Cancel"
          isOpen={isConfirmationOpen}
          onClose={() => {
            setConfirmationOpen(false);
          }}
          onConfirm={handleRemoveAllTypes}
        />
      )}
      {isTabConfirmationOpen && sheetForResetTypes && (
        <ConfirmationModal
          title={`Remove all copy types for ${sheetForResetTypes}`}
          message={`Are you sure you want to remove all copy types for ${sheetForResetTypes}?`}
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
          isOpen={isTabConfirmationOpen}
          onClose={() => {
            setTabConfirmationOpen(false);
          }}
          onConfirm={() => handleRemoveAllForSheet(sheetForResetTypes)}
        />
      )}
    </Wrapper>
  );
};

export default CopyAssignmentStrategiesEditor;
