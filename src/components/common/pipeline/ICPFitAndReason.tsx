import GeneratedByAI from "@common/library/GeneratedByAI";
import {
  Badge,
  useMantineTheme,
  Popover,
  Divider,
  Text,
  Container,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconCrown,
  IconHandGrab,
  IconLoader,
  IconMoodSmile,
  IconThumbDown,
  IconX,
} from "@tabler/icons";
import { valueToColor } from "@utils/general";

type PropsType = {
  icp_fit_score: number;
  icp_fit_reason: string;
  archetype: string;
};

export default function ICPFitPill(props: PropsType) {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();

  let icpFitScoreMap = new Map<string, string>([
    ["-3", "QUEUED"],
    ["-2", "CALCULATING"],
    ["-1", "ERROR"],
    ["0", "VERY LOW"],
    ["1", "LOW"],
    ["2", "MEDIUM"],
    ["3", "HIGH"],
    ["4", "VERY HIGH"],
  ]);
  let icpFitColorMap = new Map<string, any>([
    ["-3", "grape"],
    ["-2", "grape"],
    ["-1", "gray"],
    ["0", "red"],
    ["1", "orange"],
    ["2", "yellow"],
    ["3", "blue"],
    ["4", "green"],
  ]);
  const mappedFitScore: string =
    icpFitScoreMap.get(props.icp_fit_score + "") || "N/A";
  const mappedFitColor: any =
    icpFitColorMap.get(props.icp_fit_score + "") || "gray";

  return (
    <Popover position="right" withArrow shadow="md" opened={hovered}>
      <Popover.Target>
        <Badge color={mappedFitColor} ref={ref}>
          {mappedFitScore}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown>
        <Container w={400}>
          <Text size="md" weight="800">
            Prospect Analysis
          </Text>
          <Divider mb="xs" mt="xs" />
          {props.archetype && (
            <Text size="sm" weight="700">
              Persona:
            </Text>
          )}
          {props.archetype && (
            <Badge
              p="xs"
              variant="outline"
              radius="sm"
              size="xs"
              color={valueToColor(
                theme,
                props.archetype || "Persona Unassigned"
              )}
            >
              {props.archetype || "Persona Unassigned"}
            </Badge>
          )}

          <Text size="sm" weight="700" mt="md">
            ICP Fit Score:
          </Text>
          <Badge color={mappedFitColor} ref={ref}>
            {mappedFitScore}
          </Badge>

          <Text size="sm" weight="700" mt="md">
            ICP Fit Score Explanation:
          </Text>
          <Text size="sm" italic>
            {props.icp_fit_reason}
          </Text>

          <GeneratedByAI />
        </Container>
      </Popover.Dropdown>
    </Popover>
  );
}
