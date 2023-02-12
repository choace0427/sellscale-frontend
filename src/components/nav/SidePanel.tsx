import React, { useContext } from "react";
import {
  IconInbox,
  IconHistory,
  IconHome2,
  IconAffiliate,
  IconSpeakerphone,
  IconAssembly,
  IconHome,
} from "@tabler/icons";
import {
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  Accordion,
  Flex,
  MantineTheme,
} from "@mantine/core";
import { UserContext } from "../../contexts/user";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import NavTab from "./NavTab";
import { LOGO_HEIGHT } from "../../constants/data";
import ProfileIcon from "./ProfileIcon";

type PanelLinkProps = {
  icon: React.ReactNode;
  color: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
};

function getHoverColor(theme: MantineTheme) {
  // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
  return (
    (theme.colorScheme === "dark"
      ? theme.colors.dark[6]
      : theme.colors.gray[0]) + "50"
  );
}

function PanelLink({ icon, color, label, onClick, isActive }: PanelLinkProps) {
  return (
    <UnstyledButton
      my={4}
      sx={(theme) => ({
        display: "block",
        width: "180px",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colors.dark[0],

        "&:hover": {
          backgroundColor: getHoverColor(theme),
        },
        backgroundColor: isActive ? getHoverColor(theme) : "inherit",
      })}
      onClick={onClick}
    >
      <Group>
        <ThemeIcon color={color} variant="light" radius="xl">
          {icon}
        </ThemeIcon>
      </Group>
    </UnstyledButton>
  );
}

export function SidePanel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname?.split("/")[1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: `calc(100% - ${LOGO_HEIGHT}px)`,
      }}
    >
      <div>
        <NavTab
          icon={<IconHome size={22} />}
          name="home"
          description="Home"
          onClick={() => navigate(`/home`)}
        />

        <NavTab
          icon={<IconInbox size={22} />}
          name="pipeline"
          description="Pipeline"
          onClick={() => navigate(`/pipeline`)}
        />

        <NavTab
          icon={<IconAffiliate size={22} />}
          name="personas"
          description="Personas"
          onClick={() => navigate(`/personas`)}
        />

        <NavTab
          icon={<IconSpeakerphone size={22} />}
          name="call-to-actions"
          description="Call-to-Actions"
          onClick={() => navigate(`/call-to-actions`)}
        />

        <NavTab
          icon={<IconAssembly size={22} />}
          name="campaigns"
          description="Campaigns"
          onClick={() => navigate(`/campaigns`)}
        />
      </div>
      <div>
        <ProfileIcon name="Benedict Cumberbatch" email="benny10@cumberbtached.gmail.cvom" />
      </div>
    </div>
  );
}