import { useEffect, useState } from "react";
import { UsageRules } from "../../../types/broadcast-tool";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import CopyTabLimitInput from "../CopyTabLimitInput";
import {
  InputContainer,
  InputGroup,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import { getBroadcastDomainsList } from "../../../api/broadcast.api";
import { toastError } from "../../../helpers/toastify";
import CatLoader from "../../Common/Loader/CatLoader";

interface UsageRulesTabProps {
  usageRules: UsageRules;
  onChange: (updated: UsageRules) => void;
  spreadsheetId: string;
}

const UsageRulesTab: React.FC<UsageRulesTabProps> = ({
  usageRules,
  onChange,
  spreadsheetId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetDomainStatuses, setSheetDomainStatuses] = useState<{sheetName: string, live: number, warmup: number}[]>();

  useEffect(() => {
    if (!spreadsheetId) return;

    const fetchSheets = async () => {
      setIsLoading(true);
      let data: any;

      const cacheKey = `broadcast_domains_${spreadsheetId}`;
      const cacheRaw = localStorage.getItem(cacheKey);
      const now = Date.now();

      if (cacheRaw) {
        try {
          const cached = JSON.parse(cacheRaw);
          if (now - cached.timestamp < 30 * 60 * 1000) {
            if (cached.data?.sheets.length === 0) {
              data = cached.data;
            }
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      if (!data) {
        try {
          const freshData = await getBroadcastDomainsList(spreadsheetId);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: now, data: freshData })
          );
          data = freshData;
        } catch (error) {
          toastError("Failed to fetch sheets");
          setIsLoading(false);
          return;
        }
      }

      const sheets = data.sheets.map(
        (sheet: { sheetName: string; domains: string[] }) => sheet.sheetName
      );

      const sheetDomainStatuses = data.sheets.map(
        (sheet: { sheetName: string; domains: {domainName: string, status: string}[] }) => {
          const live = sheet.domains.filter(domain => domain.status.toLocaleLowerCase() === "live").length;
          const warmup = sheet.domains.filter(domain => domain.status.toLocaleLowerCase() === "warm up").length;
          return {sheetName: sheet.sheetName, live, warmup};
        }
      )
      setSheetNames(sheets);
      setSheetDomainStatuses(sheetDomainStatuses);

      setIsLoading(false);
    };

    fetchSheets();
  }, [spreadsheetId]);

  return (
    <RuleContainer>
      {isLoading && <CatLoader />}
      {!isLoading && (
        <>
          <InputGroup>
            <InputContainer>
              <FloatingLabelNumberInput
                placeholder="Product Min Delay Per Day"
                value={usageRules.productMinDelayPerDays}
                onChange={(e) =>
                  onChange({
                    ...usageRules,
                    productMinDelayPerDays: Number(e.target.value),
                  })
                }
              />
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <InputContainer>
              <FloatingLabelNumberInput
                placeholder="Copy Min Delay Per Day"
                value={Number(usageRules.copyMinDelayPerDays)}
                onChange={(e) =>
                  onChange({
                    ...usageRules,
                    copyMinDelayPerDays: Number(e.target.value),
                  })
                }
              />
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <CopyTabLimitInput
              title="Copy Limits Per Tab"
              statuses={sheetDomainStatuses || []}
              items={usageRules.copyTabLimit}
              availableSheetNames={sheetNames}
              onChange={(items) =>
                onChange({
                  ...usageRules,
                  copyTabLimit: items,
                })
              }
            />
          </InputGroup>
        </>
      )}
    </RuleContainer>
  );
};

export default UsageRulesTab;
