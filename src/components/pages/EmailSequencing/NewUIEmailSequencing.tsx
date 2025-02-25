import { SCREEN_SIZES } from "@constants/data";
import {
  Flex,
  Box,
  ScrollArea,
  Group,
  NumberInput,
  Button,
  Loader,
  Text,
  Drawer,
  Divider,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import EmailSequenceStepModal from "@modals/EmailSequenceStepModal";
import { IconPlus } from "@tabler/icons";
import { createEmailSequenceStep } from "@utils/requests/emailSequencing";
import { fetchCampaignContacts, fetchCampaignSequences} from "@utils/requests/campaignOverview";
import React, {
  FC,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import DetailEmailSequencing from "./DetailEmailSequencing";
import EmailSequenceStepCard from "./EmailSequenceStepCard";
import { EmailSequenceStep, MsgResponse, SubjectLineTemplate } from "src";
import EmailTemplateLibraryModal from "@modals/EmailTemplateLibraryModal";
import { currentProjectState } from "@atoms/personaAtoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { campaignContactsState, emailSequenceState } from "@atoms/userAtoms";

type EmailSequenceStepBuckets = {
  PROSPECTED: {
    total: number;
    templates: EmailSequenceStep[];
  };
  ACCEPTED: {
    total: number;
    templates: EmailSequenceStep[];
  };
  BUMPED: Record<
    string,
    {
      total: number;
      templates: EmailSequenceStep[];
    }
  >;
  ACTIVE_CONVO: {
    total: number;
    templates: EmailSequenceStep[];
  };
};

const Sidebar: React.FC<{
  userToken: string;
  archetypeID: number;
  templateBuckets: EmailSequenceStepBuckets;
  setTemplates: (templates: EmailSequenceStep[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refetch: () => Promise<void>;

  addNewSequenceStepOpened: boolean;
  loading: boolean;
  dataChannels?: MsgResponse | undefined;
  closeSequenceStep: () => void;
  openSequenceStep: () => void;
}> = ({
  userToken,
  archetypeID,
  templateBuckets,
  setTemplates,
  activeTab,
  setActiveTab,
  refetch,

  addNewSequenceStepOpened,
  loading,
  dataChannels,
  closeSequenceStep,
  openSequenceStep,
}) => {
  const [trashCanInBumps, setTrashCanInBumps] = useState(false);
  const [addStepStatus, setAddStepStatus] = useState<"ACCEPTED" | "BUMPED">(
    "BUMPED"
  );
  const [addStepBumpCount, setAddStepBumpCount] = useState<number | null>(1);

  const currentProject = useRecoilValue(currentProjectState);

  const [campaignContacts, setCampaignContacts] = useRecoilState(campaignContactsState);
  const [emailSequenceData, setEmailSequenceData] = useRecoilState(emailSequenceState);

  const calculateTrashAndStep = () => {
    // Go through the template buckets from ACCEPTED -> BUMPED and find the last one that has a default template

    // ACCEPTED
    let sawDefault = false;
    for (const template of templateBuckets?.ACCEPTED.templates) {
      if (template.step.active) {
        sawDefault = true;
        break;
      }
    }
    if (!sawDefault) {
      // If we didn't see a default template, then we can add a step here
      setAddStepStatus("ACCEPTED");
      setAddStepBumpCount(null);
      setTrashCanInBumps(false);
      return;
    }

    // BUMPED
    for (const bumpCount of Object.keys(templateBuckets?.BUMPED)) {
      const sequenceBucket = templateBuckets?.BUMPED[bumpCount];
      if (!sequenceBucket?.templates) {
        continue;
      }
      let sawDefault = false;
      for (const template of sequenceBucket.templates) {
        if (template.step.active) {
          sawDefault = true;
        }
      }
      if (!sawDefault) {
        // If we didn't see a default template, then we can add a step here
        setAddStepStatus("BUMPED");
        setAddStepBumpCount(parseInt(bumpCount));
        return;
      }
    }

    setAddStepStatus("BUMPED");
    setAddStepBumpCount(Object.keys(templateBuckets?.BUMPED).length + 1);
    setTrashCanInBumps(true);
  };

  useEffect(() => {
    calculateTrashAndStep();
  }, [templateBuckets]);

  //set the recoil states of campaign contacts and email sequences, these are used for the magic subject line
  useEffect(() => {
    fetchCampaignContacts(userToken, currentProject?.id || -1, 0, 30, '', false).then((data) => {
      setCampaignContacts(Array.from(new Set(data.sample_contacts)));
    });
    fetchCampaignSequences(userToken, currentProject?.id || -1).then((data) => {
      setEmailSequenceData(data?.email_sequence)
  })},[]);

  return (
    <Flex direction="column" mt="md" w="100%">
      <EmailSequenceStepCard
        title="First Email"
        content="Cold outreach sent to the prospect"
        active={activeTab == "PROSPECTED"}
        templateTitle="Initial Email"
        onClick={() => {
          setTemplates(templateBuckets?.PROSPECTED.templates);
          setActiveTab("PROSPECTED");
        }}
        sequenceBucket={templateBuckets?.PROSPECTED}
        includeFooter
        refetch={refetch}
      />

      {/* <Divider
        label="After opening email"
        labelPosition="center"
        mt="xl"
        mb="xl"
      /> */}

      {!loading ? (
        <Flex direction="column" gap={"0.5rem"} maw="100%" mt="xl">
          {/* Accepted */}
          <EmailSequenceStepCard
            active={activeTab == "ACCEPTED"}
            sequenceBucket={templateBuckets?.ACCEPTED}
            title={"Second Email"}
            templateTitle={"Prospects who have not received any followup."}
            dataChannels={dataChannels}
            onClick={() => {
              setTemplates(templateBuckets?.ACCEPTED.templates);
              setActiveTab("ACCEPTED");
            }}
            includeFooter
            deletable={!trashCanInBumps}
            afterDelete={() => {
              setTemplates(templateBuckets?.PROSPECTED.templates);
              setActiveTab("PROSPECTED");
            }}
            refetch={refetch}
          />

          {/* Bumped (map) */}
          {Object.keys(templateBuckets?.BUMPED).map((bumpCount, index) => {
            const bumpCountInt = parseInt(bumpCount);
            const sequenceBucket = templateBuckets?.BUMPED[bumpCountInt];

            // If there are no default templates for this bump count, don't show it
            if (!sequenceBucket?.templates) {
              return;
            }
            let hasActive = false;
            for (const template of sequenceBucket.templates) {
              if (template.step.active) {
                hasActive = true;
              }
            }
            if (!hasActive) {
              return;
            }

            const bumpToFollowupMap: Record<string, string> = {
              "1": "Third",
              "2": "Fourth",
              "3": "Fifth",
              "4": "Sixth",
              "5": "Seventh",
              "6": "Eighth",
              "7": "Ninth",
              "8": "Tenth",
            };
            const followupString = bumpToFollowupMap[bumpCount];
            if (followupString == undefined) {
              return;
            }

            if (bumpCount === "0" || !sequenceBucket) {
              return;
            }

            // Get all future steps, check if they have default, if they don't, show trash can
            let hasDefaultInFuture = false;
            for (let i = bumpCountInt + 1; i <= 10; i++) {
              const futureSequenceBucket = templateBuckets?.BUMPED[i];
              if (!futureSequenceBucket?.templates) {
                continue;
              }
              for (const template of futureSequenceBucket?.templates) {
                if (template.step.active) {
                  hasDefaultInFuture = true;
                  break;
                }
              }
            }
            const showTrashCan = !hasDefaultInFuture;

            // console.log('showTrashCan', index, numberSteps, showTrashCan)

            return (
              <Flex mt="md" w="100%">
                <EmailSequenceStepCard
                  onClick={() => {
                    setActiveTab("BUMPED-" + bumpCount);
                    setTemplates(sequenceBucket.templates);
                  }}
                  active={activeTab === "BUMPED-" + bumpCount}
                  sequenceBucket={sequenceBucket}
                  title={`${followupString} Email`}
                  templateTitle={`Prospects who have not responded to ${bumpCount} followups.`}
                  dataChannels={dataChannels}
                  bumpedCount={bumpCountInt}
                  includeFooter
                  deletable={showTrashCan}
                  afterDelete={() => {
                    // Get the previous step
                    const bumpCountInt = parseInt(bumpCount);
                    if (bumpCountInt === 1) {
                      setTemplates(templateBuckets?.ACCEPTED.templates);
                      setActiveTab("ACCEPTED");
                      return;
                    }
                    setTemplates(
                      templateBuckets?.BUMPED[bumpCountInt - 1].templates
                    );
                    setActiveTab("BUMPED-" + (bumpCountInt - 1));
                  }}
                  refetch={refetch}
                />
              </Flex>
            );
          })}

          {/* Add another to sequence */}
          <Flex justify="center">
            <Tooltip
              label={
                currentProject?.smartlead_campaign_id
                  ? "Synced campaigns cannot add steps"
                  : "Add another step to the sequence"
              }
              withinPortal
              withArrow
            >
              <Flex w="100%">
                <Button
                  radius="md"
                  mt="md"
                  size="lg"
                  w="100%"
                  onClick={() => {
                    calculateTrashAndStep();
                    console.log(addStepStatus, addStepBumpCount);
                    openSequenceStep();
                  }}
                  disabled={
                    Object.keys(templateBuckets?.BUMPED).length > 10 ||
                    (currentProject?.smartlead_campaign_id ? true : false)
                  }
                  leftIcon={<IconPlus />}
                >
                  Add Step
                </Button>
              </Flex>
            </Tooltip>
            <EmailSequenceStepModal
              modalOpened={addNewSequenceStepOpened}
              openModal={openSequenceStep}
              closeModal={closeSequenceStep}
              type={"CREATE"}
              backFunction={refetch}
              status={addStepStatus}
              showStatus={false}
              archetypeID={archetypeID}
              bumpedCount={addStepBumpCount}
              isDefault={true}
              onFinish={async (
                title,
                sequence,
                isDefault,
                status,
                substatus
              ) => {
                const result = await createEmailSequenceStep(
                  userToken,
                  archetypeID,
                  addStepStatus,
                  title,
                  sequence,
                  addStepBumpCount,
                  true,
                  substatus
                );
                return result.status === "success";
              }}
            />
            {Object.keys(templateBuckets?.BUMPED).length > 10 && (
              <Text color="red" mt="md" mb="md">
                You have reached the maximum number of sequence steps.
              </Text>
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex justify="center">
          <Loader />
        </Flex>
      )}
    </Flex>
  );
};

const NewUIEmailSequencing: FC<{
  userToken: string;
  archetypeID: number | null;
  templateBuckets: EmailSequenceStepBuckets;
  subjectLines: SubjectLineTemplate[];
  refetch: () => Promise<void>;

  loading: boolean;
  addNewSequenceStepOpened: boolean;
  dataChannels?: MsgResponse | undefined;
  closeSequenceStep: () => void;
  openSequenceStep: () => void;
}> = ({
  userToken,
  archetypeID,
  templateBuckets,
  subjectLines,
  refetch,

  loading,
  addNewSequenceStepOpened,
  dataChannels,
  openSequenceStep,
  closeSequenceStep,
}) => {
  const [opened, { open, close, toggle }] = useDisclosure(false);

  const lgScreenOrLess = useMediaQuery(
    `(max-width: ${SCREEN_SIZES.LG})`,
    false,
    {
      getInitialValueInEffect: true,
    }
  );

  const [selectedTemplates, setSelectedTemplates] = React.useState<
    EmailSequenceStep[]
  >(templateBuckets?.PROSPECTED.templates);
  const [activeTab, setActiveTab] = React.useState("PROSPECTED");

  const PAGE_HEIGHT = `calc(100vh - 200px)`;
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToTop = () => viewport.current!.scrollTo({ top: 0 });

  React.useEffect(() => {
    // Reupdate the selected templates
    if (activeTab === "PROSPECTED") {
      setSelectedTemplates(templateBuckets?.PROSPECTED.templates);
    } else if (activeTab === "ACCEPTED") {
      setSelectedTemplates(templateBuckets?.ACCEPTED.templates);
    } else if (activeTab.includes("BUMPED-")) {
      const bumpCount = activeTab.split("-")[1];
      const bumpCountInt = parseInt(bumpCount);
      const sequenceBucket = templateBuckets?.BUMPED[bumpCountInt];
      if (sequenceBucket) {
        setSelectedTemplates(sequenceBucket.templates);
      }
    }
  }, [templateBuckets, archetypeID]);

  return (
    <Flex gap="1rem">
      {lgScreenOrLess ? (
        <Drawer
          opened={opened}
          onClose={close}
          withCloseButton={false}
          w={"35vw"}
          h={"100vh"}
          overlayProps={{ blur: 4 }}
        >
          <Sidebar
            userToken={userToken}
            archetypeID={archetypeID as number}
            setTemplates={(templates: EmailSequenceStep[]) =>
              setSelectedTemplates(templates)
            }
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            refetch={async () => {
              await refetch();
            }}
            addNewSequenceStepOpened={addNewSequenceStepOpened}
            closeSequenceStep={closeSequenceStep}
            dataChannels={dataChannels}
            loading={loading}
            openSequenceStep={openSequenceStep}
            templateBuckets={templateBuckets}
          />
        </Drawer>
      ) : (
        <Box w={"30%"}>
          <ScrollArea viewportRef={viewport} h={PAGE_HEIGHT}>
            <Sidebar
              userToken={userToken}
              archetypeID={archetypeID as number}
              setTemplates={(templates: EmailSequenceStep[]) =>
                setSelectedTemplates(templates)
              }
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              refetch={async () => {
                await refetch();
              }}
              addNewSequenceStepOpened={addNewSequenceStepOpened}
              closeSequenceStep={closeSequenceStep}
              dataChannels={dataChannels}
              loading={loading}
              openSequenceStep={openSequenceStep}
              templateBuckets={templateBuckets}
            />
          </ScrollArea>
        </Box>
      )}

      <Box w={lgScreenOrLess ? "100%" : "70%"}>
        <ScrollArea viewportRef={viewport} h={PAGE_HEIGHT}>
          <DetailEmailSequencing
            toggleDrawer={toggle}
            currentTab={activeTab}
            templates={selectedTemplates}
            subjectLines={subjectLines}
            refetch={async () => {
              await refetch();
            }}
            scrollToTop={scrollToTop}
          />
        </ScrollArea>
      </Box>
    </Flex>
  );
};

export default NewUIEmailSequencing;
