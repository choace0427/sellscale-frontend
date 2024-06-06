import { userDataState, userTokenState } from "@atoms/userAtoms";
import { API_URL } from "@constants/data";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBrandLinkedin,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconExternalLink,
  IconFilter,
  IconLetterT,
  IconPlus,
  IconSearch,
} from "@tabler/icons";
import { IconNumber12Small } from "@tabler/icons-react";
import {
  getIcpFitScoreMap,
  icpFitToColor,
  icpFitToLabel,
} from "@common/pipeline/ICPFitAndReason";
import axios from "axios";
import { DataGrid } from "mantine-data-grid";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function GlobalContactsPage() {
  const userData = useRecoilValue(userDataState);
  const userToken = useRecoilValue(userTokenState);
  const theme = useMantineTheme();
  const [acPageSize, setAcPageSize] = useState("20");
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [contactsData, setContactsData] = useState([]);

  useEffect(() => {
    const fetchAccountBasedData = async () => {
      const response = await axios.post(
        `${API_URL}/prospect/get_prospects`,
        {
          client_id: userData.id,
          offset: pageIndex * Number(acPageSize),
          query: "",
          channel: "",
          status: "",
          limit: 20,
          ordering: "",
          bumped: "",
          show_purgatory: "ALL",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setContactsData(response.data.prospects);
    };
    fetchAccountBasedData();
  }, []);

  console.log("====", contactsData);

  return (
    <Flex direction={"column"} p={"lg"}>
      <Flex align={"center"} justify={"space-between"}>
        <Title order={3}>Global Contacts</Title>
        <Flex align={"center"} gap={"sm"}>
          <TextInput
            w={200}
            placeholder="Search"
            rightSection={<IconSearch size={"0.9rem"} color="gray" />}
          />
          <Button
            variant="outline"
            color="blue"
            leftIcon={<IconFilter size={"0.9rem"} />}
          >
            Filters
          </Button>
          <Button leftIcon={<IconPlus size={"0.9rem"} />}>Add</Button>
        </Flex>
      </Flex>
      <Box>
        <DataGrid
          data={contactsData}
          highlightOnHover
          withPagination
          withColumnBorders
          withBorder
          loading={loading}
          mt={"md"}
          sx={{
            cursor: "pointer",
            "& .mantine-10xyzsm>tbody>tr>td": {
              padding: "0px",
            },
            "& tr": {
              background: "white",
            },
          }}
          columns={[
            {
              accessorKey: "full_name",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Full Name</Text>
                </Flex>
              ),
              minSize: 280,
              cell: (cell) => {
                let { full_name, individual_data } = cell.row.original as any;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Avatar src={individual_data?.img_url} radius={"xl"} />
                      <Text>{full_name}</Text>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "title",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Title</Text>
                </Flex>
              ),
              minSize: 350,
              cell: (cell) => {
                let { title } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Text>{title}</Text>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "company",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Company</Text>
                </Flex>
              ),
              minSize: 250,
              cell: (cell) => {
                let { company } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Text>{company}</Text>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "linkedin",
              header: () => (
                <Flex align={"center"} gap={"3px"} w={"fit-content"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Linkedin</Text>
                </Flex>
              ),
              cell: (cell) => {
                let { linkedin_url } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Badge
                        variant="filled"
                        rightSection={
                          <IconExternalLink
                            size={"0.9rem"}
                            className="hover:cursor-point"
                          />
                        }
                      >
                        Visit
                      </Badge>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "email",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Email</Text>
                </Flex>
              ),
              minSize: 250,
              cell: (cell) => {
                let { email } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Text color="#228be6" underline>
                        {email}
                      </Text>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "campaign",
              minSize: 250,
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Campaign</Text>
                </Flex>
              ),
              cell: (cell) => {
                let { archetype_name } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Badge>{archetype_name}</Badge>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "segment",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Segment</Text>
                </Flex>
              ),
              minSize: 100,
              cell: (cell) => {
                let { email } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Badge>FIX ME</Badge>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "status",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">Status</Text>
                </Flex>
              ),
              minSize: 150,
              cell: (cell) => {
                let { status } = cell.row.original;

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Badge>{status}</Badge>
                    </Flex>
                  </Flex>
                );
              },
            },
            {
              accessorKey: "icp_score",
              header: () => (
                <Flex align={"center"} gap={"3px"}>
                  <IconLetterT color="gray" size={"0.9rem"} />
                  <Text color="gray">ICP Score</Text>
                </Flex>
              ),
              minSize: 150,
              cell: (cell) => {
                let { icp_fit_score } = cell.row.original;

                let icpColor = icpFitToColor(parseInt(icp_fit_score));

                return (
                  <Flex
                    gap={"xs"}
                    w={"100%"}
                    h={"100%"}
                    p={"sm"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Flex gap={"xs"} align={"center"}>
                      <Badge color={icpColor} size="md">
                        {icp_fit_score == "4"
                          ? "VERY HIGH"
                          : icp_fit_score == "3"
                          ? "HIGH"
                          : icp_fit_score == "2"
                          ? "MEDIUM"
                          : icp_fit_score == "1"
                          ? "LOW"
                          : icp_fit_score == "0"
                          ? "VERY LOW"
                          : "gray"}
                      </Badge>
                    </Flex>
                  </Flex>
                );
              },
            },
          ]}
          options={{
            enableFilters: true,
          }}
          components={{
            pagination: ({ table }) => (
              <Flex
                justify={"space-between"}
                align={"center"}
                px={"sm"}
                py={"1.25rem"}
                sx={(theme) => ({
                  border: `1px solid ${theme.colors.gray[4]}`,
                  borderTopWidth: 0,
                })}
              >
                <Select
                  style={{ width: "150px" }}
                  data={[{ label: "Show 20 rows", value: "20" }]}
                  value={acPageSize}
                  onChange={(v) => {
                    setAcPageSize(v ?? "20");
                  }}
                />
                <Flex align={"center"} gap={"sm"}>
                  <Flex align={"center"}>
                    <Select
                      maw={100}
                      value={`${pageIndex}`}
                      data={new Array(
                        Math.ceil(totalCount / Number(acPageSize))
                      )
                        .fill(0)
                        .map((i, idx) => ({
                          label: String(idx),
                          value: String(idx),
                        }))}
                      onChange={(v) => {
                        setPageIndex(Number(v));
                      }}
                    />
                    <Flex
                      sx={(theme) => ({
                        borderTop: `1px solid ${theme.colors.gray[4]}`,
                        borderRight: `1px solid ${theme.colors.gray[4]}`,
                        borderBottom: `1px solid ${theme.colors.gray[4]}`,
                        marginLeft: "-2px",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0.25rem",
                      })}
                      h={36}
                    >
                      <Text color="gray.5" fw={500} fz={14}>
                        of {Math.ceil(totalCount / Number(acPageSize))} pages
                      </Text>
                    </Flex>
                    <ActionIcon
                      variant="default"
                      color="gray.4"
                      h={36}
                      disabled={
                        Math.ceil(totalCount / Number(acPageSize)) === 0
                      }
                      onClick={() => {
                        setPageIndex((prev) => prev - 1);
                      }}
                    >
                      <IconChevronLeft stroke={theme.colors.gray[4]} />
                    </ActionIcon>
                    <ActionIcon
                      variant="default"
                      color="gray.4"
                      h={36}
                      disabled={
                        table.getState().pagination.pageIndex ===
                        table.getPageCount() - 1
                      }
                      onClick={() => {
                        setPageIndex((prev) => prev + 1);
                      }}
                    >
                      <IconChevronRight stroke={theme.colors.gray[4]} />
                    </ActionIcon>
                  </Flex>
                </Flex>
              </Flex>
            ),
          }}
          w={"100%"}
          pageSizes={[acPageSize]}
          styles={(theme) => ({
            thead: {
              height: "44px",
              backgroundColor: theme.colors.gray[0],
              "::after": {
                backgroundColor: "transparent",
              },
            },

            wrapper: {
              gap: 0,
            },
            scrollArea: {
              paddingBottom: 0,
              gap: 0,
            },

            dataCellContent: {
              width: "100%",
            },
          })}
        />
      </Box>
    </Flex>
  );
}
