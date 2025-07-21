import { useEffect, useState } from "react";
import RulesContainer from "../RulesContainer";
import {
  BroadcastRuleCard,
  BroadcastRulesContainer,
  Button,
  Container,
  DeleteButton,
  HeaderContainer,
  RootContainer,
  ServicesBlockHeader,
} from "./Menu.styled";
import { BroadcastRulesEntity } from "../../../types/broadcast-tool/broadcast-rules-entity.interface";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import SearchInput from "../../Common/SearchInput/SearchInput";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import {
  deleteBroadcastRules,
  getPaginatedBroadcastRules,
} from "../../../api/broadcast-rules.api";
import CreateBroadcastModal from "../CreateBroadcastModal";
import Loader from "../../Common/Loader";
import { GetProductStatusesResponse } from "../../../api/monday";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import { getProductStatuses } from "../../../api/monday.api";
import { getBroadcastsList } from "../../../api/broadcast.api";
import ConfirmationModal from "../ConfirmationModal";
import { getCachedData, setCachedData } from "../../../helpers/getCachedData";

const Menu: React.FC = () => {
  const [broadcastEntities, setBroadcastEntities] = useState<
    BroadcastRulesEntity[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeEntity, setActiveEntity] = useState<BroadcastRulesEntity | null>(
    null
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("preset_sidebar_collapsed") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entityToDeleteId, setEntityToDeleteId] = useState<string | null>(null);

  const [productMondayStatuses, setProductMondayStatuses] =
    useState<GetProductStatusesResponse>({
      productStatuses: [],
      domainSendings: [],
      partners: [],
      sectors: [],
    });
  const [broadcastsSheets, setBroadcastsSheets] = useState<
    BroadcastListItemResponse[]
  >([]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("preset_sidebar_collapsed", String(newState));
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([
      fetchProductStatuses(),
      fetchBroadcastsSheets(),
      fetchBroadcastRules(),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchBroadcastRules = async () => {
    try {
      const response = await getPaginatedBroadcastRules();
      setBroadcastEntities(response.items);
    } catch (error) {
      toastError("Failed to fetch broadcast rules");
      setBroadcastEntities([]);
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

  const fetchBroadcastsSheets = async () => {
    try {
      const response = await getBroadcastsList();
      if (!response) throw new Error("Failed to fetch broadcasts sheets");
      setBroadcastsSheets(response.sheets);
    } catch (error) {
      toastError("Failed to fetch broadcasts sheets");
      setBroadcastsSheets([]);
    }
  };

  useEffect(() => {
    if (!broadcastEntities || !broadcastEntities.length) {
      return;
    }

    const stillExists = broadcastEntities.find(
      (e) => e._id === activeEntity?._id
    );
    if (!stillExists) {
      setActiveEntity(broadcastEntities[0]);
    } else {
      setActiveEntity(stillExists);
    }
  }, [broadcastEntities]);

  useEffect(() => {
    const savedSearch = localStorage.getItem("broadcast_search_text");
    const savedEntityId = localStorage.getItem("broadcast_active_entity_id");
  
    if (savedSearch) setSearchText(savedSearch);
    if (savedEntityId && broadcastEntities.length) {
      const found = broadcastEntities.find((e) => e._id === savedEntityId);
      if (found) setActiveEntity(found);
    }
  }, [broadcastEntities]);
  
  useEffect(() => {
    localStorage.setItem("broadcast_search_text", searchText);
  }, [searchText]);
  

  useEffect(() => {
    if (activeEntity?._id) {
      localStorage.setItem("broadcast_active_entity_id", activeEntity._id);
    }
  }, [activeEntity]);  

  const handleDeleteEntity = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBroadcastRules(id);
      toastSuccess("Broadcast rule deleted successfully");
      fetchBroadcastRules();
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to delete broadcast rule");
      setIsLoading(false);
    }
  };

  const onEntityUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await getPaginatedBroadcastRules();
      setBroadcastEntities(response.items);

      const updated = response.items.find((e) => e._id === activeEntity?._id);
      if (updated) {
        setActiveEntity({ ...updated });
      }
    } catch (error) {
      toastError("Failed to fetch broadcast rules");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPresets =
    broadcastEntities && broadcastEntities.length > 0
      ? broadcastEntities.filter((entity) =>
          entity.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <RootContainer>
      <Container className={isCollapsed ? "collapsed" : ""}>
        <HeaderContainer>
          <ServicesBlockHeader>
            <h2>Broadcasts</h2>
          </ServicesBlockHeader>
          <Button
            onClick={toggleSidebar}
            title="Toggle sidebar"
            style={{ marginLeft: "auto" }}
          >
            {isCollapsed ? (
              <BsArrowRightShort size={20} />
            ) : (
              <BsArrowLeftShort size={20} />
            )}
          </Button>

          <Button onClick={() => setCreateModalOpen(true)}>
            <FaPlus />
          </Button>
        </HeaderContainer>

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search broadcast by name"
        />

        <BroadcastRulesContainer>
          {filteredPresets.length ? (
            filteredPresets.map((entity) => (
              <BroadcastRuleCard
                id={entity._id}
                key={entity.name}
                isActive={entity.name === activeEntity?.name}
                onClick={(event) => setActiveEntity(entity)}
              >
                <h2>{entity.name}</h2>
                {!isCollapsed && (
                  <div className="preset-actions">
                    <DeleteButton
                      onClick={() => {
                        setEntityToDeleteId(entity._id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <MdDeleteForever />
                    </DeleteButton>
                  </div>
                )}
              </BroadcastRuleCard>
            ))
          ) : (
            <BroadcastRuleCard isActive={false}>
              Broadcasts Rules not found. Create one
            </BroadcastRuleCard>
          )}
        </BroadcastRulesContainer>

        {createModalOpen && (
          <CreateBroadcastModal
            isOpen={createModalOpen}
            onClose={() => {
              setCreateModalOpen(false);
              fetchBroadcastRules();
            }}
            productMondayStatuses={productMondayStatuses}
            broadcastsSheets={broadcastsSheets}
          />
        )}
        {deleteModalOpen && entityToDeleteId && (
          <ConfirmationModal
            title="Delete broadcast rule"
            message="Are you sure you want to delete this broadcast rule?"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={() => {
              handleDeleteEntity(entityToDeleteId);
              setDeleteModalOpen(false);
            }}
          />
        )}
      </Container>

      {activeEntity && (
        <RulesContainer
          key={activeEntity._id}
          onEntityUpdate={onEntityUpdate}
          broadcastEntity={activeEntity}
          productMondayStatuses={productMondayStatuses}
          broadcastsSheets={broadcastsSheets}
        />
      )}
    </RootContainer>
  );
};

export default Menu;
