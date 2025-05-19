import { useState } from "react";
import SelectBroadcastTeam from "../../components/Finance/SelectBroadcastTeam/SelectBroadcastTeam";
import { Container } from "./FinanceHome.styled";
import { GetAllDomainsResponse } from "../../types/finance/get-all-domains.response";
import BroadcastTable from "../../components/Common/BroadcastTable/BroadcastTable";

const FinanceHome: React.FC = () => {
  const [broadcastData, setBroadcastData] = useState<GetAllDomainsResponse>();
  const broadcastTeams = ["Warsaw", "Red", "Green"];

  return (
    <Container>
      {!broadcastData && <SelectBroadcastTeam setBroadcastData={setBroadcastData} broadcastTeams={broadcastTeams} />}
      {broadcastData && (
  <BroadcastTable
    data={broadcastData.sheets}
    onBack={() => setBroadcastData(undefined)}
  />
)}

    </Container>
  );
};

export default FinanceHome;
