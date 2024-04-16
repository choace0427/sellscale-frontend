import { userTokenState } from "@atoms/userAtoms";
import { API_URL } from "@constants/data";
import {
  Button,
  Box,
  Badge,
  Card,
  Flex,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

interface PipelineOverviewData {
  activity_1_day: number;
  activity_3_mon: number;
  leads_created_last_1_month: number;
  leads_created_last_3_month: number;
  opportunities_created: number;
  pipeline_generated: number;
}

type PropsType = {
  onUtilizationClicked: () => void;
  onContactsClicked: () => void;
  onPipelineClicked: () => void;
  onOpportunitiesClicked: () => void;
};

export default function PipelineOverview(props: PropsType) {
  const [pipelineData, setPipelineData]: [
    PipelineOverviewData,
    React.Dispatch<React.SetStateAction<PipelineOverviewData>>
  ] = useState({
    activity_1_day: 0,
    activity_3_mon: 0,
    leads_created_last_1_month: 0,
    leads_created_last_3_month: 0,
    opportunities_created: 0,
    pipeline_generated: 0,
  });
  const userToken = useRecoilValue(userTokenState);

  const fetchPipelineData = () => {
    fetch(`${API_URL}/analytics/overview_analytics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPipelineData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchPipelineData();
  }, []);

  return (
    <Card withBorder>
      <Title>Overview</Title>
      <Text color="gray" size="sm">
        A snapshot of your pipeline and activity for the quarter.
      </Text>
      <Grid mt="md">
        <Grid.Col span={6}>
          <Card withBorder>
            <Flex>
              <Box w="75%">
                <Title
                  order={6}
                  color="gray"
                  fw="600"
                  sx={{ textTransform: "uppercase" }}
                >
                  Opportunities Created
                </Title>
                <Title order={2}>
                  {pipelineData.opportunities_created} opportunities
                </Title>
                <Text size="xs" color="gray" mt="md">
                  # of prospects with connect opportunities in your CRM
                </Text>
              </Box>
              <Box w="25%">
                <Button
                  w="100%"
                  color="blue"
                  onClick={props.onOpportunitiesClicked}
                >
                  View Opps
                </Button>
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder>
            <Flex>
              <Box w="75%">
                <Title
                  order={6}
                  color="gray"
                  fw="600"
                  sx={{ textTransform: "uppercase" }}
                >
                  Pipeline Generated
                </Title>
                <Title order={2}>
                  ${pipelineData.pipeline_generated.toLocaleString()} generated
                </Title>
                <Text size="xs" color="gray" mt="md">
                  Sum of the $ value of pipeline generated by SellScale
                </Text>
              </Box>
              <Box w="25%">
                <Button
                  w="100%"
                  color="orange"
                  onClick={props.onPipelineClicked}
                >
                  View Pipeline
                </Button>
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder>
            <Flex>
              <Box w="75%">
                <Title
                  order={6}
                  color="gray"
                  fw="600"
                  sx={{ textTransform: "uppercase" }}
                >
                  New Lead This Quarter
                </Title>
                <Title order={2}>
                  {pipelineData.leads_created_last_3_month.toLocaleString()} new
                  leads{" "}
                  <Badge size="sm" variant="outline" color="grape">
                    +{pipelineData.leads_created_last_1_month.toLocaleString()}{" "}
                    in last month
                  </Badge>
                </Title>
                <Text size="xs" color="gray" mt="md">
                  # of new leads prospected by SellScale
                </Text>
              </Box>
              <Box w="25%">
                <Button
                  w="100%"
                  color="grape"
                  onClick={props.onContactsClicked}
                >
                  View contacts
                </Button>
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder>
            <Flex>
              <Box w="75%">
                <Title
                  order={6}
                  color="gray"
                  fw="600"
                  sx={{ textTransform: "uppercase" }}
                >
                  Activities this Quarter
                </Title>
                <Title order={2}>
                  {pipelineData.activity_3_mon.toLocaleString()} activities{" "}
                  <Badge size="sm" variant="outline" color="teal">
                    +{pipelineData.activity_1_day.toLocaleString()} in last
                    month
                  </Badge>
                </Title>
                <Text size="xs" color="gray" mt="md">
                  # of activities logged in SellScale
                </Text>
              </Box>
              <Box w="30%">
                <Button
                  w="100%"
                  color="teal"
                  onClick={props.onUtilizationClicked}
                >
                  View Utilization
                </Button>
              </Box>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
