import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Indicator,
  Input,
  Loader,
  LoadingOverlay,
  Popover,
  Rating,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSearch,
  IconAdjustmentsFilled,
  IconInfoCircle,
  IconClock,
  IconStar,
  IconBellOff,
} from "@tabler/icons-react";
import _ from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { adminDataState, userTokenState } from "@atoms/userAtoms";
import {
  fetchingProspectIdState,
  mainTabState,
  nurturingModeState,
  openedProspectIdState,
  openedProspectLoadingState,
  tempHiddenProspectsState,
} from "@atoms/inboxAtoms";
import { ProspectShallow } from "src";
import { forwardRef, useEffect, useState } from "react";
import { HEADER_HEIGHT } from "./InboxProspectConvo";
import {
  labelizeConvoSubstatus,
  prospectStatuses,
  nurturingProspectStatuses,
  getStatusDetails,
} from "./utils";
import InboxProspectListFilter, {
  InboxProspectListFilterState,
  defaultInboxProspectListFilterState,
} from "./InboxProspectListFilter";
import {
  convertDateToCasualTime,
  convertDateToLocalTime,
  convertDateToMMMDD,
  proxyURL,
  removeExtraCharacters,
  removeHTML,
  valueToColor,
  nameToInitials,
} from "@utils/general";
import loaderWithText from "@common/library/loaderWithText";
import { icpFitToIcon } from "@common/pipeline/ICPFitAndReason";
import { INBOX_PAGE_HEIGHT } from "@pages/InboxPage";
import {
  currentInboxCountState,
  currentProjectState,
} from "@atoms/personaAtoms";
import { ProjectSelect } from "@common/library/ProjectSelect";
import { IconBrandLinkedin, IconChevronUp, IconMail } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";

interface StatusSelectItemProps extends React.ComponentPropsWithoutRef<"div"> {
  count: number;
  label: string;
}
const StatusSelectItem = forwardRef<HTMLDivElement, StatusSelectItemProps>(
  ({ count, label, ...others }: StatusSelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group spacing={0} position="apart" noWrap>
        <Text size="xs" sx={{ whiteSpace: "nowrap" }}>
          {label}
        </Text>
        {count >= 0 && (
          <Text size="xs" fw={600}>
            {count}
          </Text>
        )}
      </Group>
    </div>
  )
);

export function ProspectConvoCard(props: {
  id: number;
  name: string;
  client_sdr_name: string;
  client_sdr_img_url: string;
  title: string;
  img_url: string;
  latest_msg: string;
  latest_msg_time: string;
  latest_msg_from_sdr: boolean;
  new_msg_count: number;
  icp_fit: number;
  opened: boolean;
  snoozed_until?: string;
  default_channel?: "LINKEDIN" | "EMAIL";
}) {
  const fetchingProspectId = useRecoilValue(fetchingProspectIdState);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { close, open }] = useDisclosure(false);
  const adminData = useRecoilValue(adminDataState);
  return (
    <>
      <Flex
        p={10}
        w="100%"
        wrap="nowrap"
        sx={(theme) => ({
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: props.opened ? "#f7f7f7" : "white",
          borderRight: props.opened
            ? `3px solid ${theme.colors.blue[theme.fn.primaryShade()]}`
            : `3px solid ${theme.white}`,
        })}
      >
        <div style={{ flex: 0 }}>
          {/* <Indicator position="top-start" offset={5} inline label={icpFitToIcon(props.icp_fit)} size={0} m={5}> */}
          <Avatar
            size="md"
            radius="xl"
            m={5}
            src={proxyURL(props.img_url)}
            color={valueToColor(theme, props.name)}
          >
            {nameToInitials(props.name)}
          </Avatar>
          {/* </Indicator> */}
        </div>
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Stack spacing={0}>
            <Group position="apart" sx={{ flexWrap: "nowrap" }}>
              <Title size={13} fw={500}>
                {props.name}{" "}
                <span
                  style={{
                    color: "gray",
                    fontSize: "10px",
                    fontWeight: "300",
                    fontStyle: "italic",
                  }}
                >
                  (
                  {props.title?.length && props.title?.length > 15
                    ? props.title.substring(0, 15)
                    : props.title}
                  {props.title?.length && props.title?.length > 15 && "..."})
                </span>
              </Title>
              <Tooltip
                label={convertDateToLocalTime(new Date(props.latest_msg_time))}
                openDelay={500}
              >
                <Text c="dimmed" size={10}>
                  {convertDateToCasualTime(new Date(props.latest_msg_time))}
                </Text>
              </Tooltip>
            </Group>
            <Group position="apart" sx={{ flexWrap: "nowrap" }}>
              <Popover
                width={300}
                withArrow
                shadow="md"
                withinPortal
                offset={{ mainAxis: 10 }}
                opened={opened}
                position="right"
              >
                <Popover.Target>
                  <Text
                    size={12}
                    onMouseEnter={open}
                    onMouseLeave={close}
                    truncate
                    fw={500}
                    italic
                    color="gray"
                    sx={{ cursor: "pointer" }}
                  >
                    "{_.truncate(props.latest_msg, { length: 40 })}"
                  </Text>
                </Popover.Target>
                <Popover.Dropdown>
                  <Card withBorder padding="4px">
                    <Text size="xs" color="gray" fw="bold">
                      LAST MESSAGE
                    </Text>
                    <Text size="sm" mt="xs">
                      "{props.latest_msg}"
                    </Text>
                    <Text size="sm">- {props.name}</Text>
                    <Text size="xs" color="gray" mt="md" align="right">
                      {moment(props.latest_msg_time).format("LLLL")}
                    </Text>
                  </Card>
                </Popover.Dropdown>
              </Popover>
              {fetchingProspectId === props.id && (
                <Tooltip label="Sending message..." position="top">
                  <Loader size="xs" variant="dots" />
                </Tooltip>
              )}
              {/* {!props.opened && !props.latest_msg_from_sdr && props.new_msg_count > 0 && <Badge variant='filled'>{props.new_msg_count}</Badge>} */}
            </Group>
            {adminData?.role === "ADMIN" && (
              <Flex align="center" gap="xs" mt="6px">
                <Avatar
                  size="18px"
                  radius="xl"
                  src={proxyURL(props.client_sdr_img_url)}
                  color={valueToColor(theme, props.client_sdr_name)}
                >
                  {nameToInitials(props.client_sdr_name)}
                </Avatar>
                <Text
                  size={10}
                  c="dimmed"
                  fs="italic"
                  fw={!props.opened ? 700 : 300}
                >
                  {props.client_sdr_name}
                </Text>
              </Flex>
            )}
          </Stack>
          {props.default_channel && (
            <Box sx={{ position: "absolute", top: 15, right: 0 }}>
              {props.default_channel === "LINKEDIN" ? (
                <ActionIcon
                  variant="transparent"
                  color="blue"
                  radius="xl"
                  size="sm"
                  aria-label="LinkedIn"
                >
                  <IconBrandLinkedin size="1.0rem" />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="transparent"
                  color="yellow"
                  radius="xl"
                  size="sm"
                  aria-label="Email"
                >
                  <IconMail size="1.0rem" />
                </ActionIcon>
              )}
              <Rating defaultValue={2} count={1} />
            </Box>
          )}
          {props.snoozed_until && new Date(props.snoozed_until) > new Date() && (
            <Tooltip
              label={`Snoozed until ${convertDateToLocalTime(
                new Date(props.snoozed_until)
              )}`}
              withArrow
              withinPortal
            >
              <Flex
                align={"center"}
                gap={"0.25rem"}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 15,
                }}
              >
                <Text fz="0.75rem" fw={500} color="gray">
                  {convertDateToMMMDD(new Date(props.snoozed_until))}
                </Text>

                <IconClock size="0.875rem" color="gray" />
              </Flex>
            </Tooltip>
          )}
        </div>
      </Flex>
      <Divider />
    </>
  );
}

export default function ProspectList(props: {
  prospects: ProspectShallow[];
  isFetching: boolean;
  all?: boolean;
}) {
  const theme = useMantineTheme();
  const userToken = useRecoilValue(userTokenState);
  const [openedProspectId, setOpenedProspectId] = useRecoilState(
    openedProspectIdState
  );
  const [showPurgatorySection, setShowPurgatorySection] = useState(true);
  const [currentProject, setCurrentProject] = useRecoilState(
    currentProjectState
  );
  const [currentInboxCount, setCurrentInboxCount] = useRecoilState(
    currentInboxCountState
  );
  const [openedProspectLoading, setOpenedProspectLoading] = useRecoilState(
    openedProspectLoadingState
  );
  const tempHiddenProspects = useRecoilValue(tempHiddenProspectsState);

  const nurturingMode = useRecoilValue(nurturingModeState);

  const filterSelectOptions = (nurturingMode
    ? nurturingProspectStatuses
    : prospectStatuses
  ).map((status) => ({
    ...status,
    count: -1,
  }));
  filterSelectOptions.unshift({ label: "All Convos", value: "ALL", count: -1 });

  const [segmentedSection, setSegmentedSection] = useState("RECOMMENDED");
  const [filterSelectValue, setFilterSelectValue] = useState(
    filterSelectOptions[0].value
  );
  const [searchFilter, setSearchFilter] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [
    filtersState,
    setFiltersState,
  ] = useState<InboxProspectListFilterState>({
    recentlyContacted: "ALL",
    respondedLast: "ALL",
    channel: "SELLSCALE",
  });

  const [mainTab, setMainTab] = useRecoilState(mainTabState);
  const [sectionTab, setSectionTab] = useState<string | null>("active");

  useEffect(() => {
    setCurrentProject(null);
  }, []);

  // Sort out uninitiated prospects and temp fill in unknown data
  let prospects =
    props.prospects
      ?.filter((p) => {
        // Only show prospects that are of a status we can filter/sort by
        return filterSelectOptions.find(
          (option) => option.value === p.linkedin_status
        );
      })
      .map((p) => {
        const li_soonest =
          new Date(p.li_last_message_timestamp).getTime() >
          new Date(p.email_last_message_timestamp || -1).getTime();
        const is_last_message_from_sdr = li_soonest
          ? p.li_is_last_message_from_sdr
          : p.email_is_last_message_from_sdr;
        const last_message_from_sdr = li_soonest
          ? p.li_last_message_from_sdr
          : removeHTML(p.email_last_message_from_sdr);
        const last_message_from_prospect = li_soonest
          ? p.li_last_message_from_prospect
          : removeHTML(p.email_last_message_from_prospect);
        const last_message_timestamp = li_soonest
          ? p.li_last_message_timestamp
          : p.email_last_message_timestamp;
        const unread_messages = li_soonest
          ? p.li_unread_messages
          : p.email_unread_messages;

        // Hack to temp hide prospect when we send a message
        let is_purgatory = p.hidden_until
          ? new Date(p.hidden_until).getTime() > new Date().getTime()
          : false;
        if (tempHiddenProspects.includes(p.id)) {
          is_purgatory = true;
        }

        return {
          id: p.id,
          name: _.truncate(p.full_name, {
            length: 48,
            separator: " ",
          }),
          img_url: p.img_url,
          icp_fit: p.icp_fit_score,
          latest_msg:
            is_last_message_from_sdr || nurturingMode
              ? `You: ${last_message_from_sdr || "..."}`
              : `${p.first_name}: ${
                  last_message_from_prospect || "No message found"
                }`,
          latest_msg_time: convertDateToCasualTime(
            new Date(last_message_timestamp || -1)
          ),
          raw_latest_msg: last_message_from_sdr || last_message_from_prospect,
          latest_msg_datetime: new Date(last_message_timestamp || -1),
          latest_msg_from_sdr: is_last_message_from_sdr || nurturingMode,
          title: _.truncate(p.title, {
            length: 48,
            separator: " ",
          }),
          new_msg_count: unread_messages,
          persona_id: p.archetype_id,
          linkedin_status: p.linkedin_status,
          overall_status: p.overall_status,
          email_status: p.email_status,
          in_purgatory: is_purgatory,
          purgatory_until: p.hidden_until,
          client_sdr_name: p.client_sdr_name,
          client_sdr_img_url: p.client_sdr_img_url,
        };
      })
      .sort(
        (a, b) =>
          _.findIndex(
            filterSelectOptions,
            (o) => o.value === a.linkedin_status
          ) -
            _.findIndex(
              filterSelectOptions,
              (o) => o.value === b.linkedin_status
            ) ||
          (!b.latest_msg_from_sdr && b.new_msg_count ? 1 : 0) -
            (!a.latest_msg_from_sdr && a.new_msg_count ? 1 : 0) ||
          b.icp_fit - a.icp_fit ||
          removeExtraCharacters(a.name).localeCompare(
            removeExtraCharacters(b.name)
          )
      ) ?? [];

  // Filter by search
  // if (searchFilter.trim()) {
  //   prospects = prospects.filter((p) => {
  //     return (
  //       p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
  //       p.title.toLowerCase().includes(searchFilter.toLowerCase())
  //     );
  //   });
  // }
  // Filter by status
  if (filterSelectValue !== "ALL") {
    prospects = prospects.filter((p) => {
      return p.linkedin_status === filterSelectValue;
    });
  }
  // Advanced filters
  if (filtersState) {
    if (filtersState.recentlyContacted === "HIDE") {
      prospects = prospects.filter((p) => !p.in_purgatory);
    } else if (filtersState.recentlyContacted === "SHOW") {
      prospects = prospects.filter((p) => p.in_purgatory);
    }

    if (filtersState.channel === "LINKEDIN") {
      prospects = prospects.filter((p) => p.linkedin_status);
    } else if (filtersState.channel === "EMAIL") {
      prospects = prospects.filter((p) => p.email_status);
    }

    if (currentProject?.id) {
      prospects = prospects.filter(
        (p) => p.persona_id + "" === currentProject?.id + ""
      );
    }

    if (filtersState.respondedLast === "THEM") {
      prospects = prospects.filter((p) => !p.latest_msg_from_sdr);
    } else if (filtersState.respondedLast === "YOU") {
      prospects = prospects.filter((p) => p.latest_msg_from_sdr);
    }
  }
  // Recommended Filter
  if (segmentedSection === "RECOMMENDED") {
    if (!nurturingMode) {
      //prospects = prospects.filter((p) => p.overall_status === 'ACTIVE_CONVO');
    }
    // prospects = prospects.filter((p) => !p.latest_msg_from_sdr || isWithinLastXDays(p.latest_msg_datetime, 3)); // todo(Aakash) - uncomment this to show only prospects that have been responded to in the last 3 days
    // prospects = prospects.filter((p) => !p.in_purgatory);
  }

  // sort by if in purgatory
  prospects = prospects.sort(
    (a, b) => (a.in_purgatory ? 1 : 0) - (b.in_purgatory ? 1 : 0)
  );

  // useEffect(() => {
  //   if (prospects.length > 0 && (!openedProspectId || openedProspectId < 0)) {
  //     setOpenedProspectId(prospects[0].id);
  //   }
  // }, [props.prospects]);

  useEffect(() => {
    if (segmentedSection === "RECOMMENDED") {
      setFilterSelectValue("ALL");
    }
  }, [segmentedSection]);

  const activeProspects = prospects
    .filter((p) => !p.in_purgatory)
    .filter((p) => p.overall_status !== "DEMO");
  const snoozedProspects = prospects.filter((p) => p.in_purgatory);
  const demoProspects = prospects.filter((p) => p.overall_status === "DEMO");

  localStorage.setItem("inbox-count", `${activeProspects.length}`);

  let displayProspects = activeProspects;
  if (sectionTab === "snoozed") {
    displayProspects = snoozedProspects;
  } else if (sectionTab === "demos") {
    displayProspects = demoProspects;
  }

  useEffect(() => {
    if (displayProspects.length > 0) {
      if (
        !openedProspectId ||
        openedProspectId < 0 ||
        !displayProspects.find((p) => p.id === openedProspectId)
      ) {
        setOpenedProspectId(displayProspects[0].id);
      }
    }
  }, [sectionTab, displayProspects]);

  setCurrentInboxCount(displayProspects.length);
  const navigate = useNavigate();
  return (
    <div>
      <LoadingOverlay
        loader={loaderWithText("")}
        visible={props.isFetching && props.prospects.length === 0}
      />
      <Stack
        spacing={0}
        h={"100%"}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[1],
          position: "relative",
        })}
      >
        <ProjectSelect allOnNone />

        <Tabs
          value={mainTab}
          onTabChange={(value) => {
            setMainTab(value as string);
            setSectionTab(value as string);
          }}
          styles={(theme) => ({
            tab: {
              ...theme.fn.focusStyles(),
              fontWeight: 600,
              color: theme.colors.gray[5],
              "&[data-active]": {
                color: theme.colors.blue[theme.fn.primaryShade()],
              },
              paddingTop: rem(16),
              paddingBottom: rem(16),
            },
          })}
        >
          <Tabs.List grow>
            <Tabs.Tab
              value="inbox"
              rightSection={
                <Badge
                  sx={{ pointerEvents: "none" }}
                  variant="filled"
                  size="xs"
                  color={mainTab === "inbox" ? "blue" : "gray"}
                >
                  {activeProspects.length}
                </Badge>
              }
            >
              Inbox
            </Tabs.Tab>
            <Tabs.Tab
              value="snoozed"
              rightSection={
                <Badge
                  sx={{ pointerEvents: "none" }}
                  variant="filled"
                  size="xs"
                  color={mainTab === "inbox" ? "blue" : "gray"}
                >
                  {snoozedProspects.length}
                </Badge>
              }
            >
              Snoozed
            </Tabs.Tab>
            <Tabs.Tab
              value="demos"
              rightSection={
                <Badge
                  w={16}
                  h={16}
                  sx={{ pointerEvents: "none" }}
                  variant="filled"
                  size="xs"
                  p={0}
                >
                  {demoProspects.length}
                </Badge>
              }
            >
              Demos
            </Tabs.Tab>
            {/* <Tabs.Tab
              value="queued"
            >
              Queued
            </Tabs.Tab> */}
          </Tabs.List>
        </Tabs>

        {mainTab !== "queued" && (
          <>
            <Group pt={20} pb={10} px={20} m={0} noWrap>
              <Input
                sx={{ flex: 1 }}
                styles={{
                  input: {
                    backgroundColor: theme.colors.gray[2],
                    border: `1px solid ${theme.colors.gray[2]}`,
                    "&:focus-within": {
                      borderColor: theme.colors.gray[4],
                    },
                    "&::placeholder": {
                      color: theme.colors.gray[6],
                      fontWeight: 500,
                    },
                  },
                }}
                icon={<IconSearch size="1.0rem" />}
                value={searchFilter}
                onChange={(event) => setSearchFilter(event.currentTarget.value)}
                radius={theme.radius.md}
                placeholder="Search..."
              />
              <ActionIcon
                variant="transparent"
                color={
                  _.isEqual(
                    filtersState,
                    defaultInboxProspectListFilterState
                  ) || !filtersState
                    ? "gray.6"
                    : "blue.6"
                }
                onClick={() => setFilterModalOpen(true)}
              >
                <IconAdjustmentsFilled size="1.125rem" />
              </ActionIcon>
            </Group>

            <ScrollArea
              h={`calc(${INBOX_PAGE_HEIGHT} - ${HEADER_HEIGHT}px)`}
              sx={{ overflowX: "hidden" }}
            >
              {[false].map((in_purgatory_section, i) => {
                return (
                  <div key={i}>
                    {in_purgatory_section && (
                      <Container pt="24px" pb="24px">
                        <Divider
                          ta="center"
                          fz={7}
                          fw={500}
                          color="gray"
                          labelPosition="center"
                          label={
                            prospects.filter((p) => p.in_purgatory).length +
                            " Prospect" +
                            (prospects.filter((p) => p.in_purgatory).length > 1
                              ? "s"
                              : "") +
                            " Snoozed"
                          }
                        />
                        <Text
                          color="blue"
                          align="center"
                          fw={600}
                          fz={12}
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowPurgatorySection(!showPurgatorySection)
                          }
                        >
                          {showPurgatorySection ? "View" : "Hide"} Prospect
                          {prospects.filter((p) => p.in_purgatory).length > 1
                            ? "s"
                            : ""}
                        </Text>
                      </Container>
                    )}
                    {displayProspects.map((prospect, i: number) => (
                      <div key={i}>
                        {filterSelectValue === "ALL" &&
                          (!displayProspects[i - 1] ||
                            prospect.linkedin_status !==
                              displayProspects[i - 1].linkedin_status) && (
                            <Box bg="blue.1" py={"sm"} px={"md"} color="blue">
                              <Flex w="100%">
                                <Text color="blue" ta="center" fz={14} fw={700}>
                                  {labelizeConvoSubstatus(
                                    prospect.linkedin_status
                                  )}
                                </Text>
                                <Badge color="blue" size="xs" ml="xs" mt="2px">
                                  {
                                    prospects.filter(
                                      (p) =>
                                        p.linkedin_status ===
                                          prospect.linkedin_status &&
                                        // if snoozed, check hidden until other wise not
                                        (sectionTab == "snoozed"
                                          ? p.in_purgatory
                                          : !p.in_purgatory)
                                    ).length
                                  }
                                </Badge>
                              </Flex>
                            </Box>
                          )}
                        <Box
                          sx={{
                            position: "relative",
                            display: prospect.name
                              .toLowerCase()
                              .includes(searchFilter.toLowerCase())
                              ? "visible"
                              : "none",
                          }}
                        >
                          <Container
                            p={0}
                            m={0}
                            onClick={() => {
                              if (!openedProspectLoading) {
                                setOpenedProspectLoading(true);
                                setOpenedProspectId(prospect.id);
                                // navigate(`/prospects/${prospect.id}`)
                              }
                            }}
                          >
                            <ProspectConvoCard
                              id={prospect.id}
                              name={prospect.name}
                              title={prospect.title}
                              img_url={prospect.img_url}
                              latest_msg={prospect.latest_msg}
                              latest_msg_time={prospect.latest_msg_time}
                              icp_fit={prospect.icp_fit}
                              new_msg_count={prospect.new_msg_count || 0}
                              latest_msg_from_sdr={prospect.latest_msg_from_sdr}
                              opened={prospect.id === openedProspectId}
                              client_sdr_name={prospect.client_sdr_name || ""}
                              client_sdr_img_url={
                                prospect.client_sdr_img_url || ""
                              }
                            />
                          </Container>
                          {prospect.in_purgatory && (
                            <Tooltip
                              label={`Snoozed until ${convertDateToLocalTime(
                                new Date(prospect.purgatory_until)
                              )}`}
                              withArrow
                              withinPortal
                            >
                              <Flex
                                align={"center"}
                                gap={"0.25rem"}
                                sx={{
                                  position: "absolute",
                                  right: 10,
                                  top: 30,
                                }}
                              >
                                <Text fz="0.75rem" fw={500} color="gray">
                                  {convertDateToMMMDD(
                                    new Date(prospect.purgatory_until)
                                  )}
                                </Text>

                                <IconClock size="0.875rem" color="gray" />
                              </Flex>
                            </Tooltip>
                          )}
                        </Box>
                      </div>
                    ))}
                  </div>
                );
              })}
              {displayProspects.length === 0 && (
                <Text mt={20} fz="sm" ta="center" c="dimmed" fs="italic">
                  No conversations found.
                </Text>
              )}
              <Box h="50px"></Box>
            </ScrollArea>
            {/* <Text
          sx={{
            position: "absolute",
            top: 80,
            right: 5,
            zIndex: 100,
          }}
          fs="italic"
          fz={8}
          c="dimmed"
        >
          {prospects.length} convos
        </Text> */}
          </>
        )}
      </Stack>

      <InboxProspectListFilter
        open={filterModalOpen}
        setOpen={setFilterModalOpen}
        filters={filtersState}
        setFilters={setFiltersState}
        all={props.all}
      />
    </div>
  );
}
