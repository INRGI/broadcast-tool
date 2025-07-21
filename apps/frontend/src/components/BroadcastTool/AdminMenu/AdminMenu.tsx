import React, { useState } from "react";
import AdminRules from "../AdminRules";
import {
  AdminContainer,
  Container,
  TabButton,
  TabsContainer,
} from "./AdminMenu.styled";
import AdminHome from "../AdminHome";

const AdminMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "rules":
        return <AdminRules />;
      case "home":
        return <AdminHome />;
      default:
        return null;
    }
  };

  return (
    <AdminContainer>
      <TabsContainer>
        <TabButton
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        >
          Home
        </TabButton>
        <TabButton
          active={activeTab === "rules"}
          onClick={() => setActiveTab("rules")}
        >
          Rules
        </TabButton>
      </TabsContainer>
      <Container>{renderContent()}</Container>
    </AdminContainer>
  );
};

export default AdminMenu;
