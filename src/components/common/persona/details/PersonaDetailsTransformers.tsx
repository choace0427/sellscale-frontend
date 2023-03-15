import TransformersChart from "@common/charts/TransformersChart";
import { Box, Center, Container, Flex, SegmentedControl, Title } from "@mantine/core";
import { IconBrandLinkedin, IconMail } from "@tabler/icons";
import { useRef, useState } from "react";
import { Channel } from "src/main";
import ChannelSwitch from "./ChannelSwitch";
import TransformersTable from "./TransformersTable";

export default function PersonaDetailsTransformers() {

  const [channel, setChannel] = useState<Channel>('LINKEDIN');

  return (
    <Box>
      <Flex direction="row-reverse" gap="sm">
      <SegmentedControl
        size="sm"
        value={channel}
        onChange={(value) => setChannel(value as Channel)}
        data={[
          {
            value: "LINKEDIN",
            label: (
              <Center>
                <IconBrandLinkedin size="1rem" />
                <Box ml={10}>LinkedIn</Box>
              </Center>
            ),
          },
          {
            value: "EMAIL",
            label: (
              <Center>
                <IconMail size="1rem" />
                <Box ml={10}>Email</Box>
              </Center>
            ),
          },
        ]}
      />
      <Title order={4} lh={2.25}>
        Channel
      </Title>
    </Flex>

      <Center p={0} h={310}>
        <TransformersChart channel={channel} />
      </Center>
      <TransformersTable channel={channel} />
    </Box>
  );
}