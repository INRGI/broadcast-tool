import {
  GetProductStatusesResponse,
} from "../../../api/monday";
import { ProductRules } from "../../../types/broadcast-tool";
import ArrayInput from "../../Common/ArrayInput";
import FloatingLabelNumberInput from "../../Common/FloatingLabelInput/FloatingLabelNumberInput";
import MultiSelectDropdown from "../../Common/MultiSelectDropdown";
import StringArrayEditor from "../StringArrayEditor";
import {
  InputContainer,
  InputGroup,
  LeftContainer,
  RightContainer,
  RuleContainer,
} from "../DomainRulesTab/DomainRulesTab.styled";
import ProductAllowedDaysEditor from "../ProductAllowedDaysEditor";

interface ProductRulesTabProps {
  productRules: ProductRules;
  onChange: (updated: ProductRules) => void;
  productMondayStatuses: GetProductStatusesResponse;
}

const ProductRulesTab: React.FC<ProductRulesTabProps> = ({
  productRules,
  onChange,
  productMondayStatuses,
}) => {
  return (
    <RuleContainer style={{ flexDirection: "row" }}>
      <LeftContainer>
        <InputGroup>
          <StringArrayEditor
            items={productRules.blacklistedCopies}
            onChange={(newList) =>
              onChange({
                ...productRules,
                blacklistedCopies: newList,
              })
            }
            title="Blacklisted Copies"
            keyLabel="Copy Name"
            keyPlaceholder="Enter copy name"
          />
        </InputGroup>

        <InputGroup>
          <InputContainer>
            <MultiSelectDropdown
              options={productMondayStatuses.productStatuses}
              selected={productRules.allowedMondayStatuses}
              onChange={(newValues) =>
                onChange({
                  ...productRules,
                  allowedMondayStatuses: newValues,
                })
              }
              placeholder="Allowed Monday Statuses"
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.productsSendingLimitPerDay.map((item) => ({
              key: item.productName,
              value: item.limit.toString(),
            }))}
            keyLabel="Product Name"
            valueLabel="Limit"
            title="Products Sending Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                productsSendingLimitPerDay: newItems.map((item) => ({
                  productName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.copySendingLimitPerDay.map((item) => ({
              key: item.copyName,
              value: item.limit.toString(),
            }))}
            keyLabel="Copy Name"
            valueLabel="Limit"
            title="Copies Sending Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                copySendingLimitPerDay: newItems.map((item) => ({
                  copyName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <ArrayInput
            items={productRules.copyMinLimitPerDay.map((item) => ({
              key: item.copyName,
              value: item.limit.toString(),
            }))}
            keyLabel="Copy Name"
            valueLabel="Limit"
            title="Copies Min Limit Per Day"
            onChange={(newItems) =>
              onChange({
                ...productRules,
                copyMinLimitPerDay: newItems.map((item) => ({
                  copyName: item.key,
                  limit: Number(item.value),
                })),
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <InputContainer>
            <FloatingLabelNumberInput
              placeholder="Similar Sector Domain Limit"
              value={productRules.similarSectorDomainLimit}
              onChange={(e) =>
                onChange({
                  ...productRules,
                  similarSectorDomainLimit: Number(e.target.value),
                })
              }
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
        <InputContainer>
          <MultiSelectDropdown
            options={productMondayStatuses.sectors}
            selected={productRules.blacklistedSectors}
            onChange={(newValues) =>
              onChange({
                ...productRules,
                blacklistedSectors: newValues,
              })
            }
            placeholder="Blacklisted Sectors"
          />
        </InputContainer>
      </InputGroup>
      </LeftContainer>

      <RightContainer>
        <InputGroup>
          <ProductAllowedDaysEditor
            items={productRules.productAllowedSendingDays}
            onChange={(updated) =>
              onChange({
                ...productRules,
                productAllowedSendingDays: updated,
              })
            }
          />
        </InputGroup>
      </RightContainer>
    </RuleContainer>
  );
};

export default ProductRulesTab;
