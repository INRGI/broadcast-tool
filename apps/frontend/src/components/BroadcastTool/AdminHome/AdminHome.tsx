import React, { useEffect, useState } from "react";
import BroadcastSendsAnalytics from "../BroadcastSendsAnalytics";
import { GetBroadcastsSendsResponseDto } from "../../../api/broadcast";
import { getBroadcastsSends } from "../../../api/broadcast.api";
import { toastError } from "../../../helpers/toastify";
import { getCachedData, setCachedData } from "../../../helpers/getCachedData";
import { EmptyDataContainer } from "./AdminHome.styled";
import { Button } from "../Menu/Menu.styled";
import { VscGraph } from "react-icons/vsc";
import AnalyticsLaunchModal from "../AnalyticsLaunchModal";
import CatLoader from "../../Common/Loader/CatLoader";

const CACHE_KEY = "broadcast_sends";
const TTL_MS = 30 * 60 * 1000;

const AdminHome: React.FC = () => {
  const [broadcastsSends, setBroadcastsSends] =
    useState<GetBroadcastsSendsResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkIfCached = async () => {
    const cached = getCachedData<GetBroadcastsSendsResponseDto>(
      CACHE_KEY,
      TTL_MS
    );
    if (cached) {
      setBroadcastsSends(cached);
      return;
    }
  };

  useEffect(() => {
    checkIfCached();
  }, []);

  const fetchBroadcastsSends = async (fromDate: Date, toDate: Date) => {
    setIsModalOpen(false)
    setIsLoading(true);
    const cached = getCachedData<GetBroadcastsSendsResponseDto>(
      CACHE_KEY,
      TTL_MS
    );
    if (cached) {
      setBroadcastsSends(cached);
      setIsLoading(false);
      return;
    }

    const formatDateToYYYYMMDD = (date: Date) => {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      const response = await getBroadcastsSends({
        fromDate: formatDateToYYYYMMDD(fromDate),
        toDate: formatDateToYYYYMMDD(toDate),
      });
      if (!response) {
        toastError("Failed to fetch broadcasts sends");
        return;
      }
      setBroadcastsSends(response);
      setCachedData(CACHE_KEY, response, TTL_MS);
    } catch (error) {
      toastError("Failed to fetch broadcasts sends");
      setBroadcastsSends(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <CatLoader />
      ) : broadcastsSends?.broadcasts?.length ? (
        <BroadcastSendsAnalytics data={broadcastsSends} />
      ) : (
        <EmptyDataContainer>
          <p style={{ padding: 20, color: "#888" }}>
            No broadcasts data found. Please click the button to fetch data.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <VscGraph />
          </Button>
        </EmptyDataContainer>
      )}
      {isModalOpen && (
        <AnalyticsLaunchModal
          isOpen={isModalOpen}
          onSubmit={(from, to) => fetchBroadcastsSends(from, to)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminHome;
