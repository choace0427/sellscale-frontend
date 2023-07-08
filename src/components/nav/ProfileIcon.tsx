import { userDataState } from "@atoms/userAtoms";
import CreditsCard from "@common/credits/CreditsCard";
import {
  Avatar,
  Text,
  Flex,
  Title,
  Center,
  Popover,
  Container,
  useMantineTheme,
  UnstyledButton,
  Group,
  createStyles,
  Badge,
  rem,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { openContextModal } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons";
import { nameToInitials, valueToColor } from "@utils/general";
import { useRecoilValue } from "recoil";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colors.dark[0],
    borderRadius: theme.radius.sm,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: "dark" }).background!,
        0.1
      ),
    },
  },
}));

export default function ProfileIcon() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const userData = useRecoilValue(userDataState);

  return (
    <Center
      className="cursor-pointer"
      onClick={() => {
        openContextModal({
          modal: "account",
          title: <></>,
          innerProps: {},
        });
      }}
    >
      <Avatar
        src={userData?.img_url}
        alt={`${userData?.sdr_name}'s Profile Picture`}
        color={valueToColor(theme, userData?.sdr_name)}
        radius="xl"
      >
        {nameToInitials(userData?.sdr_name)}
      </Avatar>
    </Center>
  );
}

function ChannelBadge(props: { channel: string; isConnected: boolean }) {
  return (
    <Badge
      size="xs"
      variant="outline"
      color={props.isConnected ? "blue" : "red"}
      leftSection={
        <ActionIcon
          size="xs"
          color={props.isConnected ? "blue" : "red"}
          radius="xl"
          variant="transparent"
        >
          {props.isConnected ? (
            <IconCheck size={rem(10)} />
          ) : (
            <IconX size={rem(10)} />
          )}
        </ActionIcon>
      }
    >
      {props.channel}
    </Badge>
  );
}

export function ProfileCard() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const userData = useRecoilValue(userDataState);

  return (
    <Popover width={300} position="top" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              src={userData?.img_url}
              alt={`${name}'s Profile Picture`}
              color={valueToColor(theme, userData?.sdr_name)}
              radius="xl"
            >
              {nameToInitials(userData?.sdr_name)}
            </Avatar>

            <Stack spacing={5}>
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500} className="truncate">
                  {userData?.sdr_name}
                </Text>

                <Text color="dimmed" size="xs" className="truncate">
                  {userData?.sdr_email}
                </Text>
              </div>
              <Group>
                {userData?.weekly_li_outbound_target && (
                  <ChannelBadge
                    channel="LinkedIn"
                    isConnected={userData?.li_voyager_connected}
                  />
                )}
                {userData?.weekly_email_outbound_target && (
                  <ChannelBadge
                    channel="Email"
                    isConnected={userData?.nylas_connected}
                  />
                )}
              </Group>
            </Stack>
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown ml="md">
        <CreditsCard />
      </Popover.Dropdown>
    </Popover>
  );
}
