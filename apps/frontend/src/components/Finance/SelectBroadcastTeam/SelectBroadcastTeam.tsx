import React, { useState } from "react";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  Container,
  HeaderContainer,
  ServicesBlockHeader,
  SubmitButton,
} from "./SelectBroadcastTeam.styled";
import axios from "axios";
import { toastError } from "../../../helpers/toastify";
import Loader from "../../Common/Loader";
import { GetAllDomainsResponse } from "../../../types/finance/get-all-domains.response";
import { DateRangeSelector } from "../../Common/DateRangeSelector/DateRangeSelector";

interface Props {
  broadcastTeams: string[];
  setBroadcastData: React.Dispatch<React.SetStateAction<GetAllDomainsResponse | undefined>>;
}

const SelectBroadcastTeam: React.FC<Props> = ({ broadcastTeams, setBroadcastData }) => {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const fetchBroadcast = async () => {
    const [startDate, endDate] = dateRange;

    if (!startDate || !endDate) {
      return toastError("Please select a valid date range");
    }

    try {
      setLoading(true);

      const response = await axios.get(`/api/finances/broadcast/${selected}`
      //   , {
      //   params: {
      //     from: startDate.toISOString(),
      //     to: endDate.toISOString(),
      //   },
      // }
    );

      setBroadcastData(response.data);
    } catch (error) {
      toastError("Error fetching broadcast");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) {
      return toastError("Please select a team");
    }

    await fetchBroadcast();
  };

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <ServicesBlockHeader>
          <h2>Broadcast Tool</h2>
        </ServicesBlockHeader>
      </HeaderContainer>

      <Dropdown
        placeholder="Select Team"
        options={broadcastTeams}
        selected={selected}
        onSelect={(value) => setSelected(value)}
      />

      <DateRangeSelector onDateRangeChange={setDateRange} />

      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Container>
  );
};

export default SelectBroadcastTeam;
