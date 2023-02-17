import {
  createStyles,
  Card,
  Badge,
  Text,
  Box,
  SimpleGrid,
  UnstyledButton,
  Collapse,
  Button,
  Group,
  Flex,
  SegmentedControl,
  Center,
} from "@mantine/core";
import { useState } from "react";
import {
  IconHeartHandshake,
  IconMail,
  IconNotification,
  IconChartBubble,
  IconCalendar,
  IconX,
  IconCalendarEvent,
  IconConfetti,
  IconFaceIdError,
  IconTrash,
  IconBrandLinkedin,
} from "@tabler/icons";

const mockdata = [
  {
    title: "Accepted Invite",
    icon: IconHeartHandshake,
    color: "yellow",
    status: "ACCEPTED",
  },
  {
    title: "Sent Outreach",
    icon: IconMail,
    color: "orange",
    status: "SENT_OUTREACH",
  },
  {
    title: "Bumped",
    icon: IconNotification,
    color: "orange",
    status: "RESPONDED",
  },
  {
    title: "Active Convo",
    icon: IconChartBubble,
    color: "orange",
    status: "ACTIVE_CONVO",
  },
  {
    title: "Scheduling",
    icon: IconCalendar,
    color: "pink",
    status: "SCHEDULING",
  },
  {
    title: "Demo Set",
    icon: IconCalendarEvent,
    color: "pink",
    status: "DEMO_SET",
  },
  {
    title: "Demo Complete",
    icon: IconConfetti,
    color: "green",
    status: "DEMO_WON",
  },
  {
    title: "Not Interested",
    icon: IconX,
    color: "red",
    status: "NOT_INTERESTED",
  },
  {
    title: "Demo Loss",
    icon: IconFaceIdError,
    color: "red",
    status: "DEMO_LOSS",
  },
  {
    title: "Not Qualified",
    icon: IconTrash,
    color: "red",
    status: "NOT_QUALIFIED",
  },
];
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    height: 90,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white,
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: `${theme.shadows.md} !important`,
      transform: "scale(1.05)",
    },
  },
}));

type ProspectDetailsChangeStatusProps = {
  currentStatus: string;
  prospectId: number;
};

export default function ProspectDetailsChangeStatus(
  props: ProspectDetailsChangeStatusProps
) {
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(false);
  const [statusService, setStatusService] = useState<'EMAIL' | 'LINKEDIN'>('LINKEDIN');

  const statusSelectEnabled = false;

  const items = mockdata.map((item) => (
    <UnstyledButton key={item.title} className={classes.item}>
      <item.icon color={theme.colors[item.color][6]} size={32} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card shadow="sm" p="lg" radius="md" mt="md" withBorder>
      <Group position="apart" mb="xs">
        <Text weight={700} size="lg">
          Status
        </Text>
        <Badge color="pink" variant="light">
          {props.currentStatus.replaceAll("_", " ")}
        </Badge>
      </Group>
      <Flex gap="xs">
        <Button
          color="blue"
          variant={opened ? 'filled' : 'outline'}
          onClick={() => {
            setOpened((o: boolean) => !o);
          }}
        >
          Update Status
        </Button>
        <SegmentedControl
          color='blue'
          defaultValue={statusService}
          onChange={(value) => {setStatusService(value as 'EMAIL' | 'LINKEDIN')}}
          data={[
            { value: 'LINKEDIN', label: (
              <Center>
                <IconBrandLinkedin size={16} />
                <Box ml={10}>LinkedIn</Box>
              </Center>
            ) },
            { value: 'EMAIL', label: (
              <Center>
                <IconMail size={16} />
                <Box ml={10}>Email</Box>
              </Center>
            ) },
          ]}
        />
      </Flex>
      <Collapse in={opened} mt="md">
        <Card withBorder radius="md" className={classes.card}>
          <Group position="apart">
            <Text className={classes.title}>{`Change ${statusService === 'LINKEDIN' ? 'LinkedIn' : 'Email' } status to:`}</Text>
          </Group>
          <SimpleGrid cols={3} mt="md">
            {items}
          </SimpleGrid>
        </Card>
      </Collapse>
    </Card>
  );
}
